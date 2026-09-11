import {
  FraudIntelligenceEntry,
  QVAIInput,
  QVAIResult,
  QVAIEvidence,
  ForensicReport,
} from '../types';
import { queryIntelligence } from './intelligenceService';
import { analyzePhone } from './analyzePhone';
import { analyzeBank } from './analyzeBank';
import { analyzeSms } from './analyzeSms';

interface QVAIContext {
  intelligence: Record<string, FraudIntelligenceEntry>;
  bankName?: string;
}

const levelFromScore = (
  score: number,
  hasEvidence: boolean
): QVAIResult['threatLevel'] => {
  if (!hasEvidence) return 'UNKNOWN';

  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'SUSPICIOUS';

  return 'SAFE';
};

const clampScore = (score: number): number =>
  Math.max(0, Math.min(100, Math.round(score)));

interface QVRiskSignal {
  source: string;
  score: number;
  weight: number;
  reliability: number;
  kind:
    | 'intelligence'
    | 'engine'
    | 'behavior'
    | 'structure'
    | 'official'
    | 'baseline';
}

const analyzeUrlStructure = (
    value: string
  ): QVRiskSignal[] => {
    const signals: QVRiskSignal[] = [];

    let parsed: URL;

    try {
      parsed = /^https?:\/\//i.test(value)
        ? new URL(value)
        : new URL(`https://${value}`);
    } catch {
      return signals;
    }

    const hostname = parsed.hostname.toLowerCase();
    const fullUrl = value.toLowerCase();

    const hostnameParts = hostname.split('.');

    // IP thay vì tên miền
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 72,
        weight: 0.8,
        reliability: 0.75,
        kind: 'structure',
      });
    }

    // Punycode / IDN đáng kiểm tra
    if (hostname.includes('xn--')) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 68,
        weight: 0.75,
        reliability: 0.75,
        kind: 'structure',
      });
    }

    // URL có userinfo thường là tín hiệu bất thường
    if (parsed.username || parsed.password) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 78,
        weight: 0.8,
        reliability: 0.8,
        kind: 'structure',
      });
    }
  
    // Port bất thường
    if (
      parsed.port &&
      !['80', '443', '8080'].includes(parsed.port)
    ) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 58,
        weight: 0.55,
        reliability: 0.6,
        kind: 'structure',
      });
    }

    // Subdomain quá sâu
    if (hostnameParts.length >= 5) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 52,
        weight: 0.45,
        reliability: 0.55,
        kind: 'structure',
      });
    }

    // Từ khóa nhạy cảm trong path/query.
    const suspiciousPathTerms = [
      'login',
      'signin',
      'verify',
      'verification',
      'account',
      'security',
      'otp',
      'xac-thuc',
      'xacthuc',
      'nap-tien',
      'naptien',
      'rut-tien',
      'ruttien',
      'download',
      'update',
      'install',
      'apk',
    ];

    const pathSignalCount = suspiciousPathTerms.filter(
      (term) => fullUrl.includes(term)
    ).length;

    if (pathSignalCount >= 2) {
      signals.push({
        source: 'QV URL Structure Analysis',
        score: 65,
        weight: 0.65,
        reliability: 0.7,
        kind: 'structure',
      });
    }

    return signals;
  };


interface ProtectedBrand {
  name: string;
  domains: string[];
}

const PROTECTED_BRANDS: ProtectedBrand[] = [
  { name: 'Google', domains: ['google.com'] },
  { name: 'Chính phủ Việt Nam', domains: ['chinhphu.vn', 'dichvucong.gov.vn'] },
  { name: 'Vietcombank', domains: ['vietcombank.com.vn'] },
  { name: 'Facebook', domains: ['facebook.com'] },
  { name: 'Zalo', domains: ['zalo.me'] },
  { name: 'Highlands Coffee', domains: ['highlandscoffee.com.vn'] },
];

const analyzeBrandImpersonation = (
  value: string,
  isOfficialDomain: boolean
): QVRiskSignal[] => {
  if (isOfficialDomain) return [];

  let parsed: URL;

  try {
    parsed = /^https?:\/\//i.test(value)
      ? new URL(value)
      : new URL(`https://${value}`);
  } catch {
    return [];
  }

  const hostname = parsed.hostname.toLowerCase();
  const labels = hostname.split('.').filter(Boolean);

  const signals: QVRiskSignal[] = [];

  for (const brand of PROTECTED_BRANDS) {
    const brandTokens = brand.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/)
      .filter((token) => token.length >= 3);

    const matchingLabel = labels.find((label) =>
      brandTokens.some(
        (token) =>
          label === token ||
          label.includes(token)
      )
    );

    if (!matchingLabel) continue;

    const isOfficialHost = brand.domains.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(`.${domain}`)
    );

    if (isOfficialHost) continue;

    signals.push({
      source: 'QV Brand Impersonation Analysis',
      score: 88,
      weight: 1,
      reliability: 0.9,
      kind: 'behavior',
    });

    break;
  }

  return signals;
};

const fuseRiskSignals = (signals: QVRiskSignal[]): number => {
  const usable = signals
    .filter(
      (signal) =>
        signal.kind !== 'baseline' &&
        signal.reliability > 0 &&
        Number.isFinite(signal.score)
    )
    .map((signal) => ({
      ...signal,
      score: clampScore(signal.score),
      effectiveWeight: signal.weight * signal.reliability,
    }))
    .filter((signal) => signal.effectiveWeight > 0)
    .sort(
      (a, b) =>
        b.score * b.effectiveWeight -
        a.score * a.effectiveWeight
    );

  if (usable.length === 0) return 0;

  // Tín hiệu mạnh nhất có trọng số lớn nhất.
  const strongest = usable[0];

  let weightedTotal =
    strongest.score * strongest.effectiveWeight;

  let totalWeight = strongest.effectiveWeight;

  // Các tín hiệu độc lập phía sau dùng để củng cố,
  // không được phép một mình kéo điểm lên quá mạnh.
  usable.slice(1, 5).forEach((signal, index) => {
    const corroborationWeight =
      signal.effectiveWeight * (0.45 / (index + 1));

    weightedTotal += signal.score * corroborationWeight;
    totalWeight += corroborationWeight;
  });

  let fused =
    totalWeight > 0
      ? weightedTotal / totalWeight
      : strongest.score;

  // Nhiều nguồn độc lập cùng xác nhận -> tăng confidence/risk nhẹ.
  const independentSources = new Set(
    usable.map((signal) => signal.source)
  ).size;

  if (independentSources >= 2) {
    fused += Math.min(8, (independentSources - 1) * 3);
  }

  // Exact intelligence là bằng chứng rất mạnh.
  const exactIntelligence = usable.find(
    (signal) =>
      signal.kind === 'intelligence' &&
      signal.reliability >= 0.95
  );

  if (exactIntelligence) {
    fused = Math.max(
      fused,
      exactIntelligence.score * 0.9
    );
  }

  return clampScore(fused);
};

const evidenceFromIntelligence = (
  matches: ReturnType<typeof queryIntelligence>
): QVAIEvidence[] => {
  return matches.slice(0, 5).map((match) => ({
    source: 'VERAFENSE Intelligence',
    label: `${match.entry.category} — ${match.reason}`,
    detail:
      `${match.entry.reportsCount} báo cáo, ` +
      `thiệt hại ghi nhận ${match.entry.totalLossReported.toLocaleString('vi-VN')} VNĐ. ` +
      `${match.entry.advice}`,
    status:
      match.entry.threatLevel === 'CRITICAL' ||
      match.entry.threatLevel === 'HIGH'
        ? 'danger'
        : match.entry.threatLevel === 'SUSPICIOUS'
          ? 'warning'
          : 'safe',
    score: match.entry.threatScore,
  }));
};

const evidenceFromSms = (
  report: ForensicReport
): QVAIEvidence[] => {
  return report.evidenceMatrix.map((item) => ({
    source: 'QV SMS Analysis',
    label: item.label,
    detail: `${item.value}. ${item.detail}`,
    status: item.status,
  }));
};

export const analyzeQVAI = (
  input: QVAIInput,
  context: QVAIContext
): QVAIResult => {
  const value = input.value.trim();

  if (!value) {
    return {
      inputType: input.type,
      threatLevel: 'UNKNOWN',
      threatScore: 0,
      summary: 'Chưa có dữ liệu để phân tích.',
      evidence: [],
      recommendedActions: ['Nhập dữ liệu cần kiểm tra.'],
      engineSources: [],
    };
  }

  let summary = 'Chưa phát hiện dấu hiệu rủi ro từ các engine hiện có.';
  const metadata = input.metadata ?? {};
  const evidence: QVAIEvidence[] = [];
  const engineSources: string[] = [];
  const recommendedActions: string[] = [];
  const riskSignals: QVRiskSignal[] = [];

  // Link/APK contributes deterministic signals, while QV AI decides how
  // those signals interact. A baseline/absence-of-data signal is never
  // treated as evidence of safety.
  if (input.type === 'url') {
    const existingRiskScore = metadata.existingRiskScore;
    const existingLabel = metadata.existingLabel;
    const isOfficialDomain = metadata.isOfficialDomain === true;
    const isGambling = metadata.isGambling === true;
    const isPhishing = metadata.isPhishing === true;
    const isApk = metadata.isApk === true;
    const isBaselineSignal = metadata.isBaselineSignal === true;

    const urlStructureSignals = analyzeUrlStructure(value);
    if (urlStructureSignals.length > 0) {
      riskSignals.push(...urlStructureSignals);
      engineSources.push('QV URL Structure Analysis');

      urlStructureSignals.forEach((signal) => {
        evidence.push({
          source: signal.source,
          label: 'Phân tích cấu trúc URL',
          detail: `Phát hiện cấu trúc URL cần kiểm tra thêm. Điểm tín hiệu: ${signal.score}/100.`,
          status:
            signal.score >= 70
              ? 'danger'
              : signal.score >= 40
                ? 'warning'
                : 'safe',
          score: signal.score,
        });
      });
    }

    const brandImpersonationSignals =
      analyzeBrandImpersonation(value, isOfficialDomain);

    if (brandImpersonationSignals.length > 0) {
      riskSignals.push(...brandImpersonationSignals);
      engineSources.push('QV Brand Impersonation Analysis');

      brandImpersonationSignals.forEach((signal) => {
        evidence.push({
          source: signal.source,
          label: 'Dấu hiệu giả mạo thương hiệu',
          detail: 'Tên thương hiệu/dịch vụ quen thuộc xuất hiện trong hostname nhưng tên miền thực tế không thuộc domain chính thức tương ứng.',
          status: 'danger',
          score: signal.score,
        });
      });

      recommendedActions.push(
        'Không nhập mật khẩu, OTP hoặc thông tin thanh toán nếu tên miền có dấu hiệu giả mạo thương hiệu; hãy tự mở website chính thức bằng địa chỉ đã biết.'
      );
    }

    if (isOfficialDomain) {
      riskSignals.push({
        source: 'QV Official Domain Analysis',
        score: 5,
        weight: 0.8,
        reliability: 0.95,
        kind: 'official',
      });
      engineSources.push('QV Official Domain Analysis');
      evidence.push({
        source: 'QV Official Domain Analysis',
        label: 'Tên miền khớp danh sách chính thống',
        detail: 'Đây là tín hiệu tích cực về danh tính tên miền, nhưng không phải bằng chứng tuyệt đối rằng mọi URL hoặc nội dung bên trong đều an toàn.',
        status: 'safe',
        score: 5,
      });
    }

    if (typeof existingRiskScore === 'number') {
      const normalizedScore = clampScore(existingRiskScore);
      riskSignals.push({
        source: 'QV Link/APK Analysis',
        score: normalizedScore,
        weight: 0.9,
        reliability: 0.85,
        kind: 'engine',
      });

      if (!isBaselineSignal) {
        engineSources.push('QV Link/APK Analysis');
        evidence.push({
          source: 'QV Link/APK Analysis',
          label:
            typeof existingLabel === 'string'
              ? existingLabel
              : 'Tín hiệu từ bộ phân tích Link/APK',
          detail: `Điểm rủi ro từ bộ phân tích hiện tại: ${normalizedScore}/100.`,
          status:
            normalizedScore >= 70
              ? 'danger'
              : normalizedScore >= 40
                ? 'warning'
                : 'safe',
          score: normalizedScore,
        });
      }
    }

    // Behavior/category signals outrank a weak or stale database label.
    if (isGambling) {
      riskSignals.push({
        source: 'QV Gambling Signal Analysis',
        score: 98,
        weight: 1,
        reliability: 0.88,
        kind: 'behavior',
      });
      engineSources.push('QV Gambling Signal Analysis');
      evidence.push({
        source: 'QV Gambling Signal Analysis',
        label: 'Dấu hiệu cờ bạc/cá cược trực tuyến',
        detail: 'Phát hiện tín hiệu hành vi hoặc danh mục liên quan casino, cá cược, nạp/rút tiền hoặc game bài.',
        status: 'danger',
        score: 98,
      });
      recommendedActions.push('Không đăng ký, không nạp tiền và không cung cấp thông tin ngân hàng cho nền tảng cờ bạc/cá cược chưa được xác minh.');
    }

    if (isPhishing) {
      riskSignals.push({
        source: 'QV Phishing Signal Analysis',
        score: 95,
        weight: 1,
        reliability: 0.88,
        kind: 'behavior',
      });
      engineSources.push('QV Phishing Signal Analysis');
      evidence.push({
        source: 'QV Phishing Signal Analysis',
        label: 'Dấu hiệu mạo danh/phishing',
        detail: 'Tên miền có tín hiệu mạo danh cơ quan, ngân hàng hoặc dịch vụ chính thức.',
        status: 'danger',
        score: 95,
      });
      recommendedActions.push('Không nhập mật khẩu, OTP, CCCD hoặc thông tin ngân hàng trên tên miền này.');
    }

    if (isApk) {
      riskSignals.push({
        source: 'QV APK Risk Analysis',
        score: 80,
        weight: 1,
        reliability: 0.88,
        kind: 'behavior',
      });
      engineSources.push('QV APK Risk Analysis');
      evidence.push({
        source: 'QV APK Risk Analysis',
        label: 'Tệp APK cần phân tích',
        detail: 'Đuôi .APK tự nó không chứng minh mã độc; cần kiểm tra nguồn, chữ ký và hành vi của ứng dụng.',
        status: 'warning',
        score: 80,
      });
      recommendedActions.push('Không cài APK từ nguồn không xác minh; cần kiểm tra chữ ký và hành vi ứng dụng trước khi cài.');
    }

    if (isOfficialDomain && (isGambling || isPhishing || isApk)) {
      // Official-domain membership is not a universal safety override.
      // Keep the positive signal, but surface the contradiction for review.
      engineSources.push('QV Contradiction Analysis');
      evidence.push({
        source: 'QV Contradiction Analysis',
        label: 'Mâu thuẫn giữa domain chính thức và tín hiệu rủi ro',
        detail: 'Khớp danh sách domain chính thức nhưng đồng thời có tín hiệu rủi ro khác; không được kết luận an toàn chỉ từ domain.',
        status: 'warning',
      });
      summary = 'Phát hiện tín hiệu rủi ro mâu thuẫn với trạng thái domain chính thức; QV AI ưu tiên bằng chứng hành vi và yêu cầu kiểm tra thêm.';
    }
  }
  const targetType =
    input.type === 'url'
      ? 'link'
      : input.type === 'text'
        ? 'sms'
        : input.type;

  const matches = queryIntelligence(
    context.intelligence,
    targetType,
    value
  );

  if (matches.length > 0) {
    const strongestMatch = matches[0];
    const strongest = strongestMatch.entry;

    const intelligenceScore =
      strongestMatch.reason === 'exact'
        ? strongest.threatScore
        : strongestMatch.reason === 'normalized'
          ? Math.min(strongest.threatScore, 95)
          : Math.min(strongest.threatScore, 69);

    riskSignals.push({
      source: 'VERAFENSE Intelligence',
      score: intelligenceScore,
      weight:
        strongestMatch.reason === 'exact'
          ? 1.25
          : strongestMatch.reason === 'normalized'
            ? 1.05
            : 0.55,
      reliability:
        strongestMatch.reason === 'exact'
          ? 1
          : strongestMatch.reason === 'normalized'
            ? 0.95
            : 0.65,
      kind: 'intelligence',
    });

    evidence.push(...evidenceFromIntelligence(matches));
    engineSources.push('VERAFENSE Intelligence');

    if (strongest.advice) {
        recommendedActions.push(strongest.advice);
    }

    if (strongest.legalBasis) {
        recommendedActions.push(
            `Căn cứ/cảnh báo pháp lý: ${strongest.legalBasis}`
        );
    }
}

  if (input.type === 'phone') {
    const result = analyzePhone(value, matches[0]?.entry ?? null);

    if (result) {
      engineSources.push('QV Phone Analysis');

      if (result.status.includes('WANGIRI')) {
        riskSignals.push({
          source: 'QV Phone Analysis',
          score: 85,
          weight: 0.9,
          reliability: 0.8,
          kind: 'engine',
        });
      } else if (result.status.includes('VOIP')) {
        riskSignals.push({
          source: 'QV Phone Analysis',
          score: 75,
          weight: 0.7,
          reliability: 0.7,
          kind: 'engine',
        });
      }

      evidence.push({
        source: 'QV Phone Analysis',
        label: result.status,
        detail: result.type,
        status:
          result.status.includes('WANGIRI') ||
          result.status.includes('VOIP')
          ? 'danger'
          : 'safe',
        });

      if (result.advice) {
        recommendedActions.push(result.advice);
      }
    }
  }

  if (input.type === 'bank') {
    const result = analyzeBank(
      value,
      context.bankName || 'Chưa xác định',
      matches[0]?.entry ?? null
    );

    if (result) {
      engineSources.push('QV Bank Analysis');

      riskSignals.push({
        source: 'QV Bank Analysis',
        score: result.threatScore,
        weight: 1,
        reliability: 0.88,
        kind: 'behavior',
      });

      evidence.push({
        source: 'QV Bank Analysis',
        label: result.riskLevel,
        detail: result.pattern,
        status:
          result.threatScore >= 70
            ? 'danger'
            : result.threatScore > 0
              ? 'warning'
              : 'safe',
        score: result.threatScore,
      });

      if (result.action) {
        recommendedActions.push(result.action);
      }
    }
  }

  if (input.type === 'sms' || input.type === 'text') {
    const report = analyzeSms(value);

    if (report) {
      engineSources.push('QV SMS Analysis');

      riskSignals.push({
        source: 'QV SMS Analysis',
        score: report.threatScore,
        weight: 1,
        reliability: 0.88,
        kind: 'behavior',
      });
      evidence.push(...evidenceFromSms(report));

      if (report.actionPlan.length > 0) {
        recommendedActions.push(...report.actionPlan);
      }

      summary = report.elderlySummary || report.youthSummary || summary;
    }
  }

  if (matches.length > 0) {
    const strongestMatch = matches[0];
    const strongest = strongestMatch.entry;
    const intelligenceScore =
      strongestMatch.reason === 'exact'
        ? strongest.threatScore
        : strongestMatch.reason === 'normalized'
          ? Math.min(strongest.threatScore, 95)
          : Math.min(strongest.threatScore, 69);

    if (
      strongestMatch.reason === 'exact' ||
      strongestMatch.reason === 'normalized' ||
      intelligenceScore >= 70
    ) {
      summary =
        intelligenceScore >= 90
          ? `CẢNH BÁO NGHIÊM TRỌNG: dữ liệu trùng với tình báo gian lận đã ghi nhận.`
          : intelligenceScore >= 70
            ? `CẢNH BÁO: phát hiện dữ liệu có mức rủi ro cao.`
            : `Phát hiện dữ liệu có dấu hiệu cần kiểm tra thêm.`;
    }
  }

  const hasNonBaselineSignal = riskSignals.some(
    (signal) => signal.kind !== 'baseline'
  );

  const isOnlyBaseline =
    input.type === 'url' &&
    metadata.isBaselineSignal === true &&
    !hasNonBaselineSignal;

  const fusedScore = fuseRiskSignals(riskSignals);

  const finalScore = clampScore(
    isOnlyBaseline
      ? 20
      : fusedScore
  );

  const hasEvidence =
    hasNonBaselineSignal &&
    !isOnlyBaseline;

  const threatLevel = levelFromScore(
    finalScore,
    hasEvidence
  );

  if (!hasEvidence) {
    summary = 'Chưa đủ bằng chứng để kết luận an toàn. Không phát hiện tín hiệu rủi ro rõ ràng từ các engine hiện có.';
  } else if (
    summary === 'Chưa phát hiện dấu hiệu rủi ro từ các engine hiện có.'
  ) {
    summary =
      finalScore >= 90
        ? 'Nhiều bằng chứng độc lập cùng chỉ ra mức rủi ro rất cao.'
        : finalScore >= 70
          ? 'Đã phát hiện nhiều tín hiệu rủi ro cần đặc biệt cảnh giác.'
          : finalScore >= 40
            ? 'Đã phát hiện tín hiệu đáng ngờ; cần xác minh thêm trước khi tương tác.'
            : 'Chưa phát hiện tín hiệu rủi ro đáng kể từ các nguồn hiện có.';
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push(
        threatLevel === 'UNKNOWN'
            ? 'Chưa có đủ dữ liệu để kết luận. Không chuyển tiền hoặc cung cấp thông tin xác thực cho đến khi xác minh được nguồn.'
            : 'Không chuyển tiền, không cung cấp OTP hoặc thông tin xác thực khi chưa xác minh.'
    );
 }


 return {
    inputType: input.type,
    threatLevel,
    threatScore: finalScore,
    summary,
    evidence,
    recommendedActions: [...new Set(recommendedActions)],
    engineSources: [...new Set(engineSources)],
 };
};