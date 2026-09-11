import http from 'node:http';
import dns from 'node:dns/promises';

const HOST = '127.0.0.1';
const PORT = Number(process.env.WEB_INVESTIGATOR_PORT || 8787);
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 6500;
const MAX_HTML_BYTES = 1_500_000;
const MAX_TEXT_LENGTH = 12_000;

const PROTECTED_BRANDS = [
  { name: 'Google', domains: ['google.com'] },
  { name: 'Chính phủ Việt Nam', domains: ['chinhphu.vn', 'dichvucong.gov.vn'] },
  { name: 'Vietcombank', domains: ['vietcombank.com.vn'] },
  { name: 'Facebook', domains: ['facebook.com'] },
  { name: 'Zalo', domains: ['zalo.me'] },
  { name: 'Highlands Coffee', domains: ['highlandscoffee.com.vn'] },
];

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
};

const emptyEvidence = (url, fetchStatus = 'failed') => ({
  fetchStatus,
  title: '',
  description: '',
  text: '',
  forms: 0,
  passwordFields: 0,
  otpSignals: 0,
  paymentSignals: 0,
  gamblingSignals: 0,
  downloadSignals: 0,
  loginSignals: 0,
  brandMentions: [],
  finalUrl: url,
});

const normalizeText = (value = '') =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);

const countTerms = (text, terms) =>
  terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);

const isPrivateIp = (address) => {
  const value = address.toLowerCase();

  if (value === '::1' || value === 'localhost') return true;

  if (value.includes(':')) {
    return (
      value.startsWith('fc') ||
      value.startsWith('fd') ||
      value.startsWith('fe8') ||
      value.startsWith('fe9') ||
      value.startsWith('fea') ||
      value.startsWith('feb') ||
      value.startsWith('::ffff:127.') ||
      value.startsWith('::ffff:10.') ||
      value.startsWith('::ffff:192.168.') ||
      value.startsWith('::ffff:169.254.')
    );
  }

  const parts = value.split('.').map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isFinite(part))
  ) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
};

const assertPublicUrl = async (value) => {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error('INVALID_URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('UNSUPPORTED_PROTOCOL');
  }

  if (parsed.username || parsed.password) {
    throw new Error('USERINFO_BLOCKED');
  }

  if (
    parsed.hostname === 'localhost' ||
    parsed.hostname.endsWith('.localhost') ||
    parsed.hostname.endsWith('.local')
  ) {
    throw new Error('PRIVATE_HOST');
  }

  const addresses = await dns.lookup(parsed.hostname, {
    all: true,
    verbatim: true,
  });

  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateIp(address))
  ) {
    throw new Error('PRIVATE_HOST');
  }

  return parsed;
};

const fetchPage = async (initialUrl) => {
  let currentUrl = initialUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const parsed = await assertPublicUrl(currentUrl);

    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT_MS
    );

    try {
      const response = await fetch(parsed, {
        method: 'GET',
        redirect: 'manual',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          Accept:
            'text/html,application/xhtml+xml,text/plain;q=0.5',
          'User-Agent':
            'VeraFense-QV-WebInvestigator/1.0',
        },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');

        if (!location || hop === MAX_REDIRECTS) {
          throw new Error('REDIRECT_LIMIT');
        }

        currentUrl = new URL(location, parsed).toString();
        continue;
      }

      return {
        response,
        finalUrl: parsed.toString(),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error('REDIRECT_LIMIT');
};

const analyzeHtml = (html, finalUrl) => {
  const title =
    (
      html.match(
        /<title[^>]*>([\s\S]*?)<\/title>/i
      )?.[1] || ''
    )
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);

  const description =
    (
      html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
      )?.[1] || ''
    )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);

  const text = normalizeText(html);

  const searchable =
    `${title} ${description} ${text}`.toLowerCase();

  const forms =
    (html.match(/<form\b/gi) || []).length;

  const passwordFields =
    (
      html.match(
        /<input[^>]+type=["']password["']/gi
      ) || []
    ).length;

  const otpSignals = countTerms(searchable, [
    'otp',
    'mã otp',
    'one time password',
    'verification code',
    'verification',
    'xác thực',
  ]);

  const paymentSignals = countTerms(searchable, [
    'thanh toán',
    'nạp tiền',
    'nap tien',
    'chuyển khoản',
    'chuyen khoan',
    'banking',
    'visa',
    'mastercard',
    'usdt',
    'crypto',
    'ví điện tử',
  ]);

  const gamblingSignals = countTerms(searchable, [
    'casino',
    'cá cược',
    'ca cuoc',
    'cược',
    'betting',
    'slot',
    'baccarat',
    'roulette',
    'poker',
    'game bài',
    'game bai',
    'nhà cái',
    'nha cai',
    'jackpot',
    'đánh bạc',
    'danh bac',
  ]);

  const downloadSignals = countTerms(searchable, [
    'download',
    'tải xuống',
    'tai xuong',
    'tải app',
    'tai app',
    '.apk',
    'install',
    'cài đặt',
  ]);

  const loginSignals = countTerms(searchable, [
    'login',
    'log in',
    'sign in',
    'đăng nhập',
    'dang nhap',
    'verify',
    'xác minh',
    'xac minh',
  ]);

  const brandMentions = PROTECTED_BRANDS
    .filter((brand) => {
      const tokens = brand.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/\s+/);

      return tokens.some(
        (token) =>
          token.length >= 3 &&
          searchable.includes(token)
      );
    })
    .map((brand) => brand.name);

  return {
    fetchStatus: 'available',
    title,
    description,
    text,
    forms,
    passwordFields,
    otpSignals,
    paymentSignals,
    gamblingSignals,
    downloadSignals,
    loginSignals,
    brandMentions,
    finalUrl,
  };
};

const handleInvestigation = async (body) => {
  if (
    !body ||
    typeof body.url !== 'string' ||
    !body.url.trim()
  ) {
    return {
      status: 400,
      data: emptyEvidence('', 'failed'),
    };
  }

  const url = body.url.trim();

  try {
    const {
      response,
      finalUrl,
    } = await fetchPage(url);

    const contentType =
      response.headers.get('content-type') || '';

    if (!response.ok) {
      return {
        status: 200,
        data: emptyEvidence(
          finalUrl,
          'failed'
        ),
      };
    }

    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml+xml') &&
      !contentType.includes('text/plain')
    ) {
      return {
        status: 200,
        data: {
          ...emptyEvidence(
            finalUrl,
            'available'
          ),
          finalUrl,
        },
      };
    }

    const reader =
      response.body?.getReader();

    if (!reader) {
      return {
        status: 200,
        data: emptyEvidence(
          finalUrl,
          'failed'
        ),
      };
    }

    const chunks = [];
    let total = 0;

    while (total < MAX_HTML_BYTES) {
      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      chunks.push(value);
      total += value.byteLength;

      if (total >= MAX_HTML_BYTES) break;
    }

    try {
      await reader.cancel();
    } catch {}

    const buffer =
      Buffer.concat(chunks);

    const html =
      buffer
        .toString('utf8')
        .slice(0, MAX_HTML_BYTES);

    return {
      status: 200,
      data: analyzeHtml(
        html,
        finalUrl
      ),
    };
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : 'FETCH_FAILED';

    const status =
      reason === 'PRIVATE_HOST'
        ? 'blocked'
        : 'failed';

    return {
      status: 200,
      data: emptyEvidence(
        url,
        status
      ),
    };
  }
};

const server = http.createServer(
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      return json(res, 204, {});
    }

    if (
      req.method !== 'POST' ||
      req.url !== '/api/web-investigate'
    ) {
      return json(
        res,
        404,
        { error: 'Not found' }
      );
    }

    let raw = '';

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      raw += chunk;

      if (raw.length > 20_000) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const body =
          JSON.parse(raw || '{}');

        const result =
          await handleInvestigation(body);

        return json(
          res,
          result.status,
          result.data
        );
      } catch {
        return json(
          res,
          400,
          emptyEvidence(
            '',
            'failed'
          )
        );
      }
    });
  }
);

server.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `VeraFense QV Web Investigator listening on http://${HOST}:${PORT}`
    );
  }
);