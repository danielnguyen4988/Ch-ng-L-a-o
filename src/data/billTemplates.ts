export interface InspectMarker {
  id: number;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  title: string;
  detail: string;
  badge: string;
  riskScore: number;
  isAiEdited?: boolean;
}

export interface BillTemplate {
  id: string;
  bankName: string;
  type: 'authentic' | 'ai_edited' | 'fake_generator' | 'deepfake';
  title: string;
  subtitle: string;
  amount: string;
  sender: string;
  recipient: string;
  recipientBank: string;
  recipientAccount: string;
  transId: string;
  transTime: string;
  tamperRiskScore: number;
  verdict: string;
  verdictDetail: string;
  badgeText: string;
  badgeColor: string;
  pins: InspectMarker[];
  generateSvgDataUrl: () => string;
}

// Generate an authentic-looking BIZ MBBank Enterprise receipt SVG (Matching real business bill)
function createBizMbBankSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="1060" viewBox="0 0 480 1060" style="background:#edf4fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <defs>
      <linearGradient id="bizTopCurve" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ea5f5" />
        <stop offset="100%" stop-color="#2563eb" />
      </linearGradient>
      <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08"/>
      </filter>
    </defs>

    <!-- Top sky blue curved decoration -->
    <path d="M 0 0 L 480 0 L 480 100 Q 240 140 0 70 Z" fill="url(#bizTopCurve)"/>
    
    <!-- Top BIZ MBBank Header -->
    <g transform="translate(130, 28)">
      <!-- MB Star Logo (Red star rays) -->
      <path d="M 20 5 L 23 15 L 33 15 L 25 21 L 28 31 L 20 25 L 12 31 L 15 21 L 7 15 L 17 15 Z" fill="#ef4444"/>
      <text x="38" y="24" fill="#002d72" font-size="22" font-weight="900" letter-spacing="-0.5">BIZ MBBank</text>
    </g>
    <text x="240" y="66" fill="#002d72" font-size="16" font-weight="bold" text-anchor="middle">Giao dịch thành công!</text>

    <!-- Main Information Card -->
    <rect x="20" y="85" width="440" height="630" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="url(#cardShadow)"/>
    
    <text x="40" y="116" fill="#0f172a" font-size="16" font-weight="bold">Thông tin giao dịch</text>
    <line x1="40" y1="130" x2="440" y2="130" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 1. Tài khoản nguồn -->
    <text x="40" y="152" fill="#64748b" font-size="11.5">Tài khoản nguồn</text>
    <text x="40" y="172" fill="#0f172a" font-size="13.5" font-weight="600">8877588888</text>
    <line x1="40" y1="186" x2="440" y2="186" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 2. Tên tài khoản -->
    <text x="40" y="206" fill="#64748b" font-size="11.5">Tên tài khoản</text>
    <text x="40" y="225" fill="#0f172a" font-size="12.5" font-weight="bold">CONG TY TNHH SX TM DV HTO PLUS</text>
    <line x1="40" y1="238" x2="440" y2="238" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 3. Loại giao dịch -->
    <text x="40" y="258" fill="#64748b" font-size="11.5">Loại giao dịch</text>
    <text x="40" y="277" fill="#0f172a" font-size="13" font-weight="500">Chuyển tiền nhanh 24/7</text>
    <line x1="40" y1="290" x2="440" y2="290" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 4. Ngân hàng thụ hưởng -->
    <text x="40" y="310" fill="#64748b" font-size="11.5">Ngân hàng thụ hưởng</text>
    <text x="40" y="328" fill="#0f172a" font-size="12" font-weight="600">TCB - Ngan hang TMCP Ky thuong</text>
    <text x="40" y="344" fill="#0f172a" font-size="12" font-weight="600">Viet Nam</text>
    <line x1="40" y1="356" x2="440" y2="356" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 5. Số tham chiếu -->
    <text x="40" y="376" fill="#64748b" font-size="11.5">Số tham chiếu</text>
    <text x="40" y="395" fill="#0f172a" font-size="13" font-family="monospace" font-weight="600">202601101063833560</text>
    <line x1="40" y1="407" x2="440" y2="407" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 6. Thông tin thụ hưởng -->
    <text x="40" y="427" fill="#64748b" font-size="11.5">Thông tin thụ hưởng</text>
    <text x="40" y="446" fill="#0f172a" font-size="12.5" font-weight="bold">CT TNHH TM XUAT NHAP KHAU FANI</text>
    <line x1="40" y1="458" x2="440" y2="458" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 7. Số tài khoản -->
    <text x="40" y="478" fill="#64748b" font-size="11.5">Số tài khoản</text>
    <text x="40" y="497" fill="#0f172a" font-size="13" font-weight="600">75767979</text>
    <line x1="40" y1="509" x2="440" y2="509" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 8. Số tiền -->
    <text x="40" y="529" fill="#64748b" font-size="11.5">Số tiền</text>
    <text x="40" y="548" fill="#0f172a" font-size="13.5" font-weight="bold">5,049,000 VND</text>
    <line x1="40" y1="560" x2="440" y2="560" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 9. Phí giao dịch -->
    <text x="40" y="580" fill="#64748b" font-size="11.5">Phí giao dịch</text>
    <text x="40" y="598" fill="#0f172a" font-size="12.5" font-weight="500">0 VND</text>
    <line x1="40" y1="609" x2="440" y2="609" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 10. Tổng số tiền -->
    <text x="40" y="628" fill="#64748b" font-size="11.5">Tổng số tiền</text>
    <text x="40" y="646" fill="#0f172a" font-size="13.5" font-weight="bold">5,049,000 VND</text>
    <line x1="40" y1="656" x2="440" y2="656" stroke="#f1f5f9" stroke-width="1"/>

    <!-- 11. Nội dung -->
    <text x="40" y="674" fill="#64748b" font-size="11.5">Nội dung chuyển khoản (tối đa 200 ký tự)</text>
    <text x="40" y="692" fill="#0f172a" font-size="12.5" font-weight="500">Cong ty HTO PLUS chuyen khoan</text>

    <!-- Bottom Promo Banner Card -->
    <rect x="20" y="730" width="440" height="185" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="url(#cardShadow)"/>
    <!-- Banner header with laptop illustration simulation -->
    <rect x="28" y="738" width="424" height="90" rx="10" fill="#2563eb"/>
    <text x="44" y="760" fill="#ffffff" font-size="11" font-weight="bold">★ MB</text>
    <rect x="280" y="746" width="140" height="72" rx="6" fill="#ffffff" opacity="0.95"/>
    <text x="350" y="768" fill="#002d72" font-size="10" font-weight="bold" text-anchor="middle">★ BIZ MBBank</text>
    <text x="44" y="790" fill="#ffffff" font-size="12" font-weight="900">CHUYỂN KHOẢN LÔ LƯƠNG</text>
    <text x="44" y="806" fill="#93c5fd" font-size="10" font-weight="bold">NHANH 24/07 QUA NAPAS TRÊN BIZ MBBANK</text>
    
    <!-- Banner bullet points -->
    <circle cx="48" cy="848" r="7" fill="#dbeafe"/>
    <path d="M 45 848 L 47 850 L 52 846" stroke="#2563eb" stroke-width="1.8" fill="none"/>
    <text x="62" y="847" fill="#1e293b" font-size="10.5" font-weight="600">Nhận tiền nhanh chóng với giao dịch chuyển</text>
    <text x="62" y="860" fill="#1e293b" font-size="10.5" font-weight="600">khoản lô lương nhanh 24/07</text>

    <circle cx="48" cy="884" r="7" fill="#dbeafe"/>
    <path d="M 45 884 L 47 886 L 52 882" stroke="#2563eb" stroke-width="1.8" fill="none"/>
    <text x="62" y="883" fill="#1e293b" font-size="10.5" font-weight="600">Tự động kiểm tra tên người thụ hưởng giảm thiểu</text>
    <text x="62" y="896" fill="#1e293b" font-size="10.5" font-weight="600">lỗi nhập liệu tối đa cho khách hàng</text>

    <!-- Bottom QR App Card -->
    <rect x="20" y="930" width="440" height="110" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="url(#cardShadow)"/>
    <text x="40" y="955" fill="#002d72" font-size="13" font-weight="bold">Tải BIZ APP tại đây</text>
    <!-- Simulated QR Box -->
    <rect x="40" y="966" width="60" height="60" rx="6" fill="#000000"/>
    <rect x="44" y="970" width="52" height="52" fill="#ffffff"/>
    <rect x="48" y="974" width="14" height="14" fill="#000000"/>
    <rect x="74" y="974" width="14" height="14" fill="#000000"/>
    <rect x="48" y="1000" width="14" height="14" fill="#000000"/>
    <rect x="68" y="994" width="8" height="8" fill="#000000"/>
    <rect x="80" y="1006" width="8" height="8" fill="#000000"/>

    <g transform="translate(130, 985)">
      <path d="M 12 3 L 14 9 L 20 9 L 15 13 L 17 19 L 12 15 L 7 19 L 9 13 L 4 9 L 10 9 Z" fill="#ef4444"/>
      <text x="24" y="16" fill="#002d72" font-size="18" font-weight="900">BIZ MBBank</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate Techcombank receipt with AI-Edited Amount (Keeping authentic layout & metadata, but amount altered by AI)
function createTechcombankVgreenAiEditedSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="920" viewBox="0 0 480 920" style="background:#fcfbfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <defs>
      <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="15" result="blur"/>
      </filter>
      <!-- Simulated AI inpainting halo artifact around amount -->
      <filter id="aiHalo" x="-15%" y="-30%" width="130%" height="160%">
        <feGaussianBlur stdDeviation="3" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Subtle golden bokeh orbs in background -->
    <circle cx="150" cy="120" r="14" fill="#fde68a" opacity="0.3" filter="url(#subtleGlow)"/>
    <circle cx="280" cy="200" r="22" fill="#fef08a" opacity="0.25" filter="url(#subtleGlow)"/>
    <circle cx="420" cy="160" r="30" fill="#fde68a" opacity="0.2" filter="url(#subtleGlow)"/>

    <!-- Green circular arrow icon at top left -->
    <circle cx="60" cy="120" r="28" fill="#ffffff" stroke="#22c55e" stroke-width="2.2"/>
    <path d="M 50 130 L 70 110 M 56 110 L 70 110 L 70 124" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Techcombank Logo with Red Diamond -->
    <g transform="translate(30, 190)">
      <text x="0" y="22" fill="#1e293b" font-size="20" font-weight="900" letter-spacing="0.5">TECHCOMBANK</text>
      <!-- Double diamond logo -->
      <g transform="translate(178, 4)">
        <polygon points="12,0 24,12 12,24 0,12" fill="#dc2626"/>
        <polygon points="26,0 38,12 26,24 14,12" fill="#dc2626"/>
        <polygon points="19,5 26,12 19,19 12,12" fill="#ffffff"/>
      </g>
    </g>

    <!-- AI Inpainting Patch: Vết mờ làm mịn do AI xóa số tiền cũ và inpainting số mới -->
    <rect x="24" y="242" width="316" height="44" rx="6" fill="#00a859" opacity="0.04"/>
    <rect x="25" y="243" width="314" height="42" rx="6" fill="#ffffff" opacity="0.5"/>

    <!-- Amount & Timestamp (Con số VND 1,325,371 do AI vẽ đè lên) -->
    <text x="30" y="275" fill="#00a859" font-size="34" font-weight="900" letter-spacing="-0.5" filter="url(#aiHalo)">VND 1,325,371</text>
    <text x="30" y="306" fill="#64748b" font-size="14.5" font-weight="600">15:14 20/08/2026</text>

    <!-- Section 1: Từ tài khoản (THÔNG TIN THẬT CỦA V-GREEN ĐỂ ĐÁNH LỪA LÒNG TIN) -->
    <text x="30" y="375" fill="#64748b" font-size="15" font-weight="500">Từ tài khoản</text>
    <text x="30" y="405" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">V-GREEN GLOBAL CHARGING</text>
    <text x="30" y="432" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">STATIONSDEVELOPMEN JOINT STOCK</text>
    <text x="30" y="459" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">COMPANY</text>
    <text x="30" y="488" fill="#334155" font-size="15" font-weight="600">Techcombank</text>
    <text x="30" y="513" fill="#0f172a" font-size="16" font-weight="800" letter-spacing="0.5">19139965653881</text>

    <!-- Section 2: Tới tài khoản (THÔNG TIN THẬT CỦA QUỐC VIỆT) -->
    <text x="30" y="575" fill="#64748b" font-size="15" font-weight="500">Tới tài khoản</text>
    <text x="30" y="605" fill="#0f172a" font-size="17.5" font-weight="900" letter-spacing="0.2">NGUYEN HA QUOC VIET</text>
    <text x="30" y="634" fill="#334155" font-size="15" font-weight="600">Techcombank</text>
    <text x="30" y="659" fill="#0f172a" font-size="16" font-weight="800" letter-spacing="0.5">1410040988</text>

    <!-- Section 3: Lời nhắn -->
    <text x="30" y="722" fill="#64748b" font-size="15" font-weight="500">Lời nhắn</text>
    <text x="30" y="752" fill="#0f172a" font-size="15.5" font-weight="900">CPTD V E HCM11369 26062026-25072026</text>
    <text x="30" y="776" fill="#0f172a" font-size="15.5" font-weight="900">TDP6</text>

    <!-- Section 4: Mã giao dịch FT (MÃ THẬT NHƯNG TIỀN GẮN VỚI MÃ TRÊN HỆ THỐNG KHÁC) -->
    <text x="30" y="842" fill="#0f172a" font-size="14.5" font-weight="bold">Mã giao dịch: <tspan font-weight="900" fill="#0f172a">FT26232021989278</tspan></text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate an authentic Techcombank receipt SVG (Matching real modern light UI)
function createTechcombankAuthenticSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="920" viewBox="0 0 480 920" style="background:#fcfbfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <defs>
      <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="15" result="blur"/>
      </filter>
    </defs>

    <!-- Subtle golden bokeh orbs in background -->
    <circle cx="150" cy="120" r="14" fill="#fde68a" opacity="0.3" filter="url(#subtleGlow)"/>
    <circle cx="280" cy="200" r="22" fill="#fef08a" opacity="0.25" filter="url(#subtleGlow)"/>
    <circle cx="420" cy="160" r="30" fill="#fde68a" opacity="0.2" filter="url(#subtleGlow)"/>

    <!-- Green circular arrow icon at top left -->
    <circle cx="60" cy="120" r="28" fill="#ffffff" stroke="#22c55e" stroke-width="2.2"/>
    <path d="M 50 130 L 70 110 M 56 110 L 70 110 L 70 124" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Techcombank Logo with Red Diamond -->
    <g transform="translate(30, 190)">
      <text x="0" y="22" fill="#1e293b" font-size="20" font-weight="900" letter-spacing="0.5">TECHCOMBANK</text>
      <!-- Double diamond logo -->
      <g transform="translate(178, 4)">
        <polygon points="12,0 24,12 12,24 0,12" fill="#dc2626"/>
        <polygon points="26,0 38,12 26,24 14,12" fill="#dc2626"/>
        <polygon points="19,5 26,12 19,19 12,12" fill="#ffffff"/>
      </g>
    </g>

    <!-- Amount & Timestamp (Số tiền thật gốc) -->
    <text x="30" y="275" fill="#00a859" font-size="34" font-weight="900" letter-spacing="-0.5">VND 25,371</text>
    <text x="30" y="306" fill="#64748b" font-size="14.5" font-weight="600">15:14 20/08/2026</text>

    <!-- Section 1: Từ tài khoản -->
    <text x="30" y="375" fill="#64748b" font-size="15" font-weight="500">Từ tài khoản</text>
    <text x="30" y="405" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">V-GREEN GLOBAL CHARGING</text>
    <text x="30" y="432" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">STATIONSDEVELOPMEN JOINT STOCK</text>
    <text x="30" y="459" fill="#0f172a" font-size="17" font-weight="900" letter-spacing="0.2">COMPANY</text>
    <text x="30" y="488" fill="#334155" font-size="15" font-weight="600">Techcombank</text>
    <text x="30" y="513" fill="#0f172a" font-size="16" font-weight="800" letter-spacing="0.5">19139965653881</text>

    <!-- Section 2: Tới tài khoản -->
    <text x="30" y="575" fill="#64748b" font-size="15" font-weight="500">Tới tài khoản</text>
    <text x="30" y="605" fill="#0f172a" font-size="17.5" font-weight="900" letter-spacing="0.2">NGUYEN HA QUOC VIET</text>
    <text x="30" y="634" fill="#334155" font-size="15" font-weight="600">Techcombank</text>
    <text x="30" y="659" fill="#0f172a" font-size="16" font-weight="800" letter-spacing="0.5">1410040988</text>

    <!-- Section 3: Lời nhắn -->
    <text x="30" y="722" fill="#64748b" font-size="15" font-weight="500">Lời nhắn</text>
    <text x="30" y="752" fill="#0f172a" font-size="15.5" font-weight="900">CPTD V E HCM11369 26062026-25072026</text>
    <text x="30" y="776" fill="#0f172a" font-size="15.5" font-weight="900">TDP6</text>

    <!-- Section 4: Mã giao dịch FT -->
    <text x="30" y="842" fill="#0f172a" font-size="14.5" font-weight="bold">Mã giao dịch: <tspan font-weight="900" fill="#0f172a">FT26232021989278</tspan></text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate an authentic-looking MB Bank consumer receipt SVG (Ground Truth Benchmark)
function createMbBankSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="760" viewBox="0 0 480 760" style="background:#071426;font-family:sans-serif;">
    <defs>
      <linearGradient id="mbHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0e3a75" />
        <stop offset="100%" stop-color="#051c3d" />
      </linearGradient>
      <linearGradient id="mbBtn" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1452a3" />
        <stop offset="100%" stop-color="#0a2a54" />
      </linearGradient>
    </defs>
    
    <!-- Top status bar -->
    <rect width="480" height="40" fill="#040f1f"/>
    <text x="36" y="26" fill="#8ba3c7" font-size="12" font-weight="600">14:32</text>
    <text x="430" y="26" fill="#8ba3c7" font-size="12" text-anchor="end">📶 5G 🔋 98%</text>

    <!-- MB Header -->
    <rect y="40" width="480" height="110" fill="url(#mbHeader)"/>
    <circle cx="65" cy="95" r="24" fill="#0066ff"/>
    <text x="65" y="103" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">MB</text>
    <text x="105" y="90" fill="#ffffff" font-size="17" font-weight="bold">NGÂN HÀNG QUÂN ĐỘI</text>
    <text x="105" y="110" fill="#69a3f5" font-size="11">MBBank • Napas 247 Chuyển nhanh</text>

    <!-- Success checkmark icon -->
    <circle cx="240" cy="195" r="32" fill="#00b074"/>
    <path d="M228 195 L236 203 L254 185" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="240" y="246" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">GIAO DỊCH THÀNH CÔNG</text>
    <text x="240" y="266" fill="#8ba3c7" font-size="12" text-anchor="middle">07/09/2026 14:32:10 • Napas 247</text>

    <!-- Amount Card -->
    <rect x="25" y="285" width="430" height="95" rx="16" fill="#0c2344" stroke="#1d4378" stroke-width="1.5"/>
    <text x="240" y="318" fill="#8ba3c7" font-size="12" text-anchor="middle" letter-spacing="1">SỐ TIỀN GIAO DỊCH</text>
    <text x="240" y="356" fill="#2fe695" font-size="28" font-weight="800" text-anchor="middle">5,000,000 VND</text>

    <!-- Transaction Details -->
    <rect x="25" y="395" width="430" height="260" rx="16" fill="#091b35" stroke="#143059" stroke-width="1"/>
    
    <text x="45" y="430" fill="#758ea8" font-size="12">Người nhận:</text>
    <text x="435" y="430" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">DANG VAN B</text>
    <line x1="45" y1="446" x2="435" y2="446" stroke="#142c4f" stroke-width="1"/>

    <text x="45" y="475" fill="#758ea8" font-size="12">Tài khoản nhận:</text>
    <text x="435" y="475" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">0987654321</text>
    <line x1="45" y1="491" x2="435" y2="491" stroke="#142c4f" stroke-width="1"/>

    <text x="45" y="520" fill="#758ea8" font-size="12">Ngân hàng thụ hưởng:</text>
    <text x="435" y="520" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Vietcombank (VCB)</text>
    <line x1="45" y1="536" x2="435" y2="536" stroke="#142c4f" stroke-width="1"/>

    <text x="45" y="565" fill="#758ea8" font-size="12">Mã giao dịch (Napas):</text>
    <text x="435" y="565" fill="#58a6ff" font-size="12" font-family="monospace" text-anchor="end">MB260907998822</text>
    <line x1="45" y1="581" x2="435" y2="581" stroke="#142c4f" stroke-width="1"/>

    <text x="45" y="610" fill="#758ea8" font-size="12">Nội dung:</text>
    <text x="435" y="610" fill="#d0dce8" font-size="12" text-anchor="end">Thanh toan tien hang MB</text>

    <!-- Bottom Button -->
    <rect x="25" y="675" width="430" height="50" rx="14" fill="url(#mbBtn)" stroke="#225ba3" stroke-width="1"/>
    <text x="240" y="706" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">CHIA SẺ BIÊN LAI CHÍNH THỨC</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate Techcombank Bill with AI-Edited Amount (Inpainted from 500k to 50,000,000 VND)
function createTechcombankAiEditedSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="760" viewBox="0 0 480 760" style="background:#141414;font-family:sans-serif;">
    <defs>
      <linearGradient id="tcbRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ea1c24" />
        <stop offset="100%" stop-color="#b00e15" />
      </linearGradient>
      <filter id="aiNoiseGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Top status bar with slight blur -->
    <rect width="480" height="40" fill="#0a0a0a"/>
    <text x="36" y="26" fill="#999999" font-size="12" font-weight="600">11:15</text>
    <text x="430" y="26" fill="#999999" font-size="12" text-anchor="end">📶 LTE 🔋 84%</text>

    <!-- Techcombank Header -->
    <rect y="40" width="480" height="110" fill="#1b1b1b" stroke-bottom="#333"/>
    <rect x="36" y="75" width="38" height="38" rx="8" fill="url(#tcbRed)"/>
    <path d="M45 88 L55 88 L65 100 L55 100 Z" fill="#ffffff"/>
    <path d="M45 100 L55 100 L65 88 L55 88 Z" fill="#ffffff" opacity="0.6"/>
    <text x="88" y="92" fill="#ffffff" font-size="18" font-weight="900" letter-spacing="1">TECHCOMBANK</text>
    <text x="88" y="111" fill="#ea1c24" font-size="11" font-weight="bold">CHUYỂN TIỀN NHANH NAPAS 24/7</text>

    <!-- Success checkmark icon -->
    <circle cx="240" cy="195" r="30" fill="#ea1c24"/>
    <path d="M229 195 L237 203 L253 186" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <text x="240" y="244" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Chuyển khoản thành công</text>
    <text x="240" y="264" fill="#888888" font-size="12" text-anchor="middle">07/09/2026 11:15:42</text>

    <!-- AI Inpainted Amount Area (Simulating AI generative fill artifact) -->
    <rect x="25" y="285" width="430" height="100" rx="16" fill="#1c1c1c" stroke="#333333" stroke-width="1"/>
    <!-- Simulated AI Inpainting smudge patch around amount -->
    <rect x="80" y="320" width="320" height="48" rx="8" fill="#242222" opacity="0.9"/>
    
    <text x="240" y="315" fill="#888888" font-size="12" text-anchor="middle">Số tiền đã chuyển</text>
    
    <!-- Lệch baseline và font nét không đều do AI tạo: số "5" và "0" lệch 1.9px, độ đậm khác biệt -->
    <g transform="translate(0, 0)">
      <text x="135" y="356" fill="#ffffff" font-size="30" font-weight="900" font-family="serif" letter-spacing="-0.5">5</text>
      <text x="156" y="358" fill="#ffffff" font-size="29" font-weight="700" letter-spacing="0.5">0,</text>
      <text x="188" y="357" fill="#f8f8f8" font-size="30" font-weight="800" letter-spacing="1">000,</text>
      <text x="255" y="359" fill="#ffffff" font-size="28" font-weight="700" letter-spacing="2">000</text>
      <text x="325" y="356" fill="#ea1c24" font-size="18" font-weight="bold">VND</text>
    </g>

    <!-- Details Card -->
    <rect x="25" y="400" width="430" height="255" rx="16" fill="#181818" stroke="#2b2b2b" stroke-width="1"/>
    
    <text x="45" y="435" fill="#888888" font-size="12">Người nhận:</text>
    <text x="435" y="435" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">LE THI C</text>
    <line x1="45" y1="451" x2="435" y2="451" stroke="#252525" stroke-width="1"/>

    <text x="45" y="480" fill="#888888" font-size="12">Tài khoản nhận:</text>
    <text x="435" y="480" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">19034567890011</text>
    <line x1="45" y1="496" x2="435" y2="496" stroke="#252525" stroke-width="1"/>

    <text x="45" y="525" fill="#888888" font-size="12">Ngân hàng hưởng:</text>
    <text x="435" y="525" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Techcombank</text>
    <line x1="45" y1="541" x2="435" y2="541" stroke="#252525" stroke-width="1"/>

    <text x="45" y="570" fill="#888888" font-size="12">Mã chuẩn chi FT:</text>
    <text x="435" y="570" fill="#ea1c24" font-size="12" font-family="monospace" text-anchor="end">FT2609078811</text>
    <line x1="45" y1="586" x2="435" y2="586" stroke="#252525" stroke-width="1"/>

    <text x="45" y="615" fill="#888888" font-size="12">Lời nhắn:</text>
    <text x="435" y="615" fill="#cccccc" font-size="12" text-anchor="end">Tien mua may tinh</text>

    <!-- Bottom Button -->
    <rect x="25" y="675" width="430" height="50" rx="14" fill="#ea1c24"/>
    <text x="240" y="706" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">LƯU BIÊN LAI VÀO BỘ SƯU TẬP</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate Vietcombank Fake Bill Generator SVG
function createVietcombankFakeSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="760" viewBox="0 0 480 760" style="background:#091913;font-family:sans-serif;">
    <rect width="480" height="40" fill="#040e0a"/>
    <text x="36" y="26" fill="#7fa694" font-size="12">09:41</text>
    <text x="430" y="26" fill="#7fa694" font-size="12" text-anchor="end">📶 5G 🔋 100%</text>

    <rect y="40" width="480" height="100" fill="#062e1d"/>
    <circle cx="65" cy="90" r="22" fill="#00d072"/>
    <text x="65" y="97" fill="#062e1d" font-size="14" font-weight="900" text-anchor="middle">VCB</text>
    <text x="100" y="87" fill="#ffffff" font-size="16" font-weight="bold">VIETCOMBANK</text>
    <text x="100" y="105" fill="#00d072" font-size="11">Dịch vụ VCB Digibank</text>

    <circle cx="240" cy="190" r="30" fill="#00d072"/>
    <path d="M229 190 L237 198 L253 182" fill="none" stroke="#062e1d" stroke-width="4" stroke-linecap="round"/>
    <text x="240" y="240" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">Chuyển tiền thành công</text>
    <text x="240" y="260" fill="#7fa694" font-size="12" text-anchor="middle">07/09/2026 09:41:20</text>

    <rect x="25" y="280" width="430" height="95" rx="16" fill="#082b1c" stroke="#00d072" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="240" y="312" fill="#7fa694" font-size="12" text-anchor="middle">SỐ TIỀN</text>
    <text x="240" y="352" fill="#00ff88" font-size="28" font-weight="900" text-anchor="middle">50,000,000 VND</text>

    <rect x="25" y="390" width="430" height="260" rx="16" fill="#051f14" stroke="#0f3d28" stroke-width="1"/>
    <text x="45" y="428" fill="#7fa694" font-size="12">Người nhận:</text>
    <text x="435" y="428" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">NGUYEN VAN A</text>
    <line x1="45" y1="444" x2="435" y2="444" stroke="#0c3822" stroke-width="1"/>

    <text x="45" y="475" fill="#7fa694" font-size="12">Số tài khoản:</text>
    <text x="435" y="475" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">1029384849</text>
    <line x1="45" y1="491" x2="435" y2="491" stroke="#0c3822" stroke-width="1"/>

    <text x="45" y="520" fill="#7fa694" font-size="12">Ngân hàng:</text>
    <text x="435" y="520" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Vietcombank</text>
    <line x1="45" y1="536" x2="435" y2="536" stroke="#0c3822" stroke-width="1"/>

    <text x="45" y="565" fill="#7fa694" font-size="12">Mã tham chiếu:</text>
    <text x="435" y="565" fill="#00d072" font-size="12" font-family="monospace" text-anchor="end">FT26090712345</text>
    <line x1="45" y1="581" x2="435" y2="581" stroke="#0c3822" stroke-width="1"/>

    <text x="45" y="610" fill="#7fa694" font-size="12">Nội dung:</text>
    <text x="435" y="610" fill="#ffffff" font-size="12" text-anchor="end">Chuyen khoan dat coc</text>

    <rect x="25" y="670" width="430" height="50" rx="14" fill="#00d072"/>
    <text x="240" y="701" fill="#062e1d" font-size="14" font-weight="bold" text-anchor="middle">THỰC HIỆN GIAO DỊCH MỚI</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Generate Video Call Deepfake SVG Frame
function createDeepfakeCallSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="760" viewBox="0 0 480 760" style="background:#09090b;font-family:sans-serif;">
    <rect width="480" height="760" fill="#121216"/>
    
    <!-- Top Call Bar -->
    <rect width="480" height="60" fill="#000000" opacity="0.6"/>
    <circle cx="35" cy="30" r="6" fill="#ef4444"/>
    <text x="50" y="34" fill="#ef4444" font-size="12" font-weight="bold">Zalo Video Call • 00:42</text>
    <text x="445" y="34" fill="#999999" font-size="11" text-anchor="end">Mạng yếu (Giả lập giật hình)</text>

    <!-- Deepfake avatar / body -->
    <rect x="60" y="100" width="360" height="420" rx="20" fill="#1c1d24" stroke="#ef4444" stroke-width="2"/>
    
    <!-- Police uniform mockup -->
    <path d="M120 520 L160 380 L320 380 L360 520 Z" fill="#1f402b"/>
    <polygon points="200,380 240,430 280,380" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="240" y="470" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">BỘ CÔNG AN</text>

    <!-- Head and AI face swap -->
    <circle cx="240" cy="270" r="75" fill="#e5b894" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
    
    <!-- Police Cap -->
    <path d="M165 220 Q240 180 315 220 L325 240 Q240 220 155 240 Z" fill="#183622"/>
    <circle cx="240" cy="210" r="10" fill="#facc15"/>

    <!-- Face features with AI blur artifacts -->
    <!-- Eyes -->
    <ellipse cx="215" cy="265" rx="8" ry="4" fill="#333333"/>
    <ellipse cx="265" cy="265" rx="8" ry="4" fill="#333333"/>
    <circle cx="215" cy="264" r="2" fill="#ffffff"/>
    <circle cx="265" cy="264" r="2" fill="#ffffff"/>
    <!-- Unnatural mouth audio sync -->
    <ellipse cx="240" cy="305" rx="14" ry="7" fill="#881337"/>
    
    <!-- Deepfake warning label overlay -->
    <rect x="80" y="480" width="320" height="30" rx="6" fill="#ef4444" opacity="0.9"/>
    <text x="240" y="500" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">⚠️ KHUÔN MẶT AI SWAP - VÀNH TAI & MẮT BỊ LỆCH KHẨU HÌNH</text>

    <!-- Call control buttons -->
    <circle cx="160" cy="620" r="30" fill="#333333"/>
    <text x="160" y="626" font-size="20" text-anchor="middle">🎙️</text>

    <circle cx="240" cy="620" r="35" fill="#ef4444"/>
    <text x="240" y="628" font-size="24" text-anchor="middle">📞</text>

    <circle cx="320" cy="620" r="30" fill="#333333"/>
    <text x="320" y="626" font-size="20" text-anchor="middle">🔄</text>

    <text x="240" y="695" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">TỰ XƯNG: ĐẠI ÚY TRẦN VĂN H - PHÒNG ĐIỀU TRA A05</text>
    <text x="240" y="718" fill="#888888" font-size="11" text-anchor="middle">Yêu cầu gọi video để nạn nhân thấy sắc phục rồi đe dọa</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const BILL_TEMPLATES: BillTemplate[] = [
  {
    id: 'biz_mb_authentic',
    bankName: 'BIZ MBBank',
    type: 'authentic',
    title: 'BIZ MBBank - Bill Doanh Nghiệp (Thật 100% - Chuẩn Đối Chiếu)',
    subtitle: 'Biên lai chuyển khoản BIZ MBBank Doanh nghiệp chuẩn: CONG TY TNHH SX TM DV HTO PLUS chuyển 5,049,000 VND.',
    amount: '5,049,000 VND',
    sender: 'CONG TY TNHH SX TM DV HTO PLUS (8877588888)',
    recipient: 'CT TNHH TM XUAT NHAP KHAU FANI',
    recipientBank: 'TCB - Ngan hang TMCP Ky thuong Viet Nam',
    recipientAccount: '75767979',
    transId: '202601101063833560',
    transTime: '10/01/2026',
    tamperRiskScore: 1,
    verdict: 'BIÊN LAI DOANH NGHIỆP HỢP LỆ 100% (CHUẨN ĐỐI CHIẾU)',
    verdictDetail: 'Cấu trúc hóa đơn doanh nghiệp BIZ MBBank chính quy: Số tham chiếu hợp lệ, tên doanh nghiệp HTO PLUS, banner lô lương 24/7 và mã QR nguyên bản.',
    badgeText: 'BIZ MB Doanh Nghiệp Thật',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    generateSvgDataUrl: createBizMbBankSvg,
    pins: [
      {
        id: 0,
        x: 50,
        y: 6,
        title: 'Điểm 1: Header BIZ MBBank & Giao Dịch Thành Công',
        detail: 'Huy hiệu sao đỏ MB và biểu tượng chữ BIZ MBBank màu xanh hải quân chuẩn xác, không có viền răng cưa hay vết cắt dán.',
        badge: 'Logo BIZ Chuẩn',
        riskScore: 1,
      },
      {
        id: 1,
        x: 50,
        y: 22,
        title: 'Điểm 2: Tên Tài Khoản Doanh Nghiệp Nguồn',
        detail: 'CONG TY TNHH SX TM DV HTO PLUS (TK: 8877588888). Định dạng tên pháp nhân doanh nghiệp chuẩn mực của Ngân hàng MB.',
        badge: 'Pháp Nhân Thật',
        riskScore: 1,
      },
      {
        id: 2,
        x: 50,
        y: 38,
        title: 'Điểm 3: Số Tham Chiếu Core Banking BIZ MB',
        detail: 'Dãy 18 chữ số 202601101063833560 bắt đầu bằng năm 2026 + ngày 01/10 + mã phiên giao dịch Napas 24/7 chính quy.',
        badge: 'Số Tham Chiếu Chuẩn',
        riskScore: 1,
      },
      {
        id: 3,
        x: 50,
        y: 54,
        title: 'Điểm 4: Số Tiền Giao Dịch 5,049,000 VND',
        detail: 'Font số Segoe UI / San Francisco chuẩn hệ thống, nét chữ đồng nhất, baseline thẳng hàng 0.0°, không có quầng sáng làm mờ do AI inpainting.',
        badge: 'Số Tiền Chuẩn 100%',
        riskScore: 1,
      },
      {
        id: 4,
        x: 50,
        y: 84,
        title: 'Điểm 5: Banner Lô Lương Napas & QR Code BIZ APP',
        detail: 'Banner truyền thông tính năng lô lương của MB và mã QR tải app BIZ MBBank sắc nét, chuẩn thiết kế xuất từ ứng dụng MB chính thức.',
        badge: 'Banner BIZ Hợp Lệ',
        riskScore: 1,
      },
    ],
  },
  {
    id: 'techcombank_vgreen_ai_edited',
    bankName: 'Techcombank',
    type: 'ai_edited',
    title: 'Techcombank - AI Sửa Số Tiền Giữ Bố Cục Thật (V-Green -> Quốc Việt)',
    subtitle: 'Mọi thông tin V-Green, Quốc Việt, mã FT đều là THẬT 100%, nhưng con số VND 1,325,371 đã bị AI inpainting can thiệp sửa đổi!',
    amount: 'VND 1,325,371 (BỊ AI SỬA)',
    sender: 'V-GREEN GLOBAL CHARGING STATIONSDEVELOPMEN JOINT STOCK COMPANY',
    recipient: 'NGUYEN HA QUOC VIET',
    recipientBank: 'Techcombank',
    recipientAccount: '1410040988',
    transId: 'FT26232021989278',
    transTime: '15:14 20/08/2026',
    tamperRiskScore: 98,
    verdict: 'CẢNH BÁO GIAN LẬN: AI SỬA SỐ TIỀN TRÊN NỀN BILL THẬT',
    verdictDetail: 'Thủ đoạn lừa đảo tinh vi bậc nhất: Giữ 100% thông tin pháp nhân V-GREEN và người nhận NGUYEN HA QUOC VIET thật để tạo lòng tin tuyệt đối, nhưng dùng AI Inpainting xóa số tiền gốc và vẽ đè con số VND 1,325,371.',
    badgeText: 'AI Sửa Tiền (Bố Cục Thật)',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    generateSvgDataUrl: createTechcombankVgreenAiEditedSvg,
    pins: [
      {
        id: 0,
        x: 45,
        y: 30,
        title: 'Điểm 1: Số Tiền VND 1,325,371 (BỊ AI INPAINTING SỬA ĐỔI)',
        detail: 'ĐÂY CHÍNH LÀ ĐIỂM BỊ SỬA! Toàn bộ tên công ty, người nhận, mã FT đều đúng, nhưng số tiền VND 1,325,371 đã bị AI can thiệp (Generative Fill / Inpainting). Vùng này có phương sai nhiễu cực mịn bất thường (Noise Variance chỉ 2.1), mất cấu trúc nén JPEG tự nhiên và có quầng viền mờ halo của AI.',
        badge: 'AI Sửa Tiền (98% Nguy Cơ)',
        riskScore: 98,
        isAiEdited: true,
      },
      {
        id: 1,
        x: 50,
        y: 47,
        title: 'Điểm 2: Tài Khoản Doanh Nghiệp V-GREEN (Thông Tin Thật 100%)',
        detail: 'V-GREEN GLOBAL CHARGING STATIONSDEVELOPMEN JOINT STOCK COMPANY (TK: 19139965653881). Thông tin pháp nhân và số tài khoản là THẬT 100% được giữ nguyên để tạo sự tin tưởng tuyệt đối cho nạn nhân.',
        badge: 'Pháp Nhân Thật 100%',
        riskScore: 2,
      },
      {
        id: 2,
        x: 50,
        y: 69,
        title: 'Điểm 3: Người Thụ Hưởng NGUYEN HA QUOC VIET (Thông Tin Thật 100%)',
        detail: 'Số tài khoản 1410040988 và tên người nhận NGUYEN HA QUOC VIET là dữ liệu thật trên hệ thống Techcombank, bố cục font nguyên bản không bị sửa.',
        badge: 'Thụ Hưởng Thật 100%',
        riskScore: 2,
      },
      {
        id: 3,
        x: 50,
        y: 92,
        title: 'Điểm 4: Mã Giao Dịch FT26232021989278 (Mã Thật - Tiền Hệ Thống Khác)',
        detail: 'Mã FT26232021989278 là mã giao dịch thật trên Core Banking Techcombank, tuy nhiên số tiền thực tế gắn với mã này trong hệ thống ngân hàng không phải là VND 1,325,371 mà là số tiền ban đầu trước khi bị AI can thiệp!',
        badge: 'Mã FT Thật - Sai Tiền',
        riskScore: 95,
        isAiEdited: true,
      },
    ],
  },
  {
    id: 'techcombank_authentic',
    bankName: 'Techcombank Gốc',
    type: 'authentic',
    title: 'Techcombank - Giao Diện Mới (Bill Gốc Đối Chiếu 100%)',
    subtitle: 'Mẫu biên lai giao diện mới Techcombank nguyên bản Core Banking (chưa qua chỉnh sửa số tiền).',
    amount: 'VND 25,371',
    sender: 'V-GREEN GLOBAL CHARGING STATIONSDEVELOPMEN JOINT STOCK COMPANY',
    recipient: 'NGUYEN HA QUOC VIET',
    recipientBank: 'Techcombank',
    recipientAccount: '1410040988',
    transId: 'FT26232021989278',
    transTime: '15:14 20/08/2026',
    tamperRiskScore: 1,
    verdict: 'BIÊN LAI TECHCOMBANK GỐC (CHUẨN ĐỐI CHIẾU)',
    verdictDetail: 'Đầy đủ các đặc trưng app mới của Techcombank: Chữ số màu xanh lá #00A859, nền kem ánh kim, mã giao dịch FT26232021989278 chuẩn Core Banking, chưa bị sửa đổi số tiền.',
    badgeText: 'Techcombank Gốc Thật',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    generateSvgDataUrl: createTechcombankAuthenticSvg,
    pins: [
      {
        id: 0,
        x: 45,
        y: 30,
        title: 'Điểm 1: Số Tiền Gốc VND 25,371 (Chưa Bị AI Sửa)',
        detail: 'Màu sắc chữ số chuẩn mã màu #00A859 của ứng dụng Techcombank mới. Độ thẳng hàng baseline 0.0°, dải nhiễu nén JPEG đồng nhất toàn khung.',
        badge: 'Font Xanh Chuẩn Gốc',
        riskScore: 1,
      },
      {
        id: 1,
        x: 50,
        y: 47,
        title: 'Điểm 2: Tài Khoản Nguồn Doanh Nghiệp V-GREEN',
        detail: 'V-GREEN GLOBAL CHARGING STATIONSDEVELOPMEN JOINT STOCK COMPANY. Tài khoản TCB 19139965653881.',
        badge: 'Doanh Nghiệp V-Green',
        riskScore: 1,
      },
      {
        id: 2,
        x: 50,
        y: 69,
        title: 'Điểm 3: Tài Khoản Nhận NGUYEN HA QUOC VIET',
        detail: 'Số tài khoản thụ hưởng 1410040988 tại Techcombank. Tên người nhận viết hoa in đậm rõ ràng.',
        badge: 'Thụ Hưởng Rõ Ràng',
        riskScore: 1,
      },
      {
        id: 3,
        x: 50,
        y: 92,
        title: 'Điểm 4: Mã Giao Dịch FT26232021989278',
        detail: 'Mã chuẩn chi FT 16 ký tự đồng nhất với Core Banking Techcombank.',
        badge: 'Mã FT Chuẩn',
        riskScore: 1,
      },
    ],
  },
  {
    id: 'mb_authentic',
    bankName: 'MB Bank Cá Nhân',
    type: 'authentic',
    title: 'MB Bank Cá Nhân - Bill Thật (Chuẩn Đối Chiếu)',
    subtitle: 'Mẫu biên lai giao dịch cá nhân MB Bank nền xanh truyền thống chuyển tiền nhanh Napas 247.',
    amount: '5,000,000 VND',
    sender: 'NGUYEN HOANG NAM (MB)',
    recipient: 'DANG VAN B',
    recipientBank: 'Vietcombank (VCB)',
    recipientAccount: '0987654321',
    transId: 'MB260907998822',
    transTime: '07/09/2026 14:32:10',
    tamperRiskScore: 2,
    verdict: 'BIÊN LAI HỢP LỆ (CHUẨN ĐỐI CHIẾU)',
    verdictDetail: 'Các thông số quang học, kerning font chữ, dải nhiễu màu dithering và mã kiểm tra checksum Napas đều đồng nhất tuyệt đối.',
    badgeText: 'MB Cá Nhân Thật',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    generateSvgDataUrl: createMbBankSvg,
    pins: [
      {
        id: 0,
        x: 50,
        y: 44,
        title: 'Vùng Số Tiền Gốc (5,000,000 VND)',
        detail: 'Font số San Francisco/Segoe UI chuẩn hệ thống MB, tỷ lệ giãn cách chữ số đồng đều, không có quầng sáng làm mờ do công cụ chỉnh sửa đồ họa.',
        badge: 'Font Chuẩn MB',
        riskScore: 2,
      },
      {
        id: 1,
        x: 65,
        y: 62,
        title: 'STK Người Nhận & Tên Thụ Hưởng',
        detail: 'Nét chữ sắc nét, độ dày nét (stroke-width) đồng nhất với toàn bộ giao diện app MB. Tương phản viền pixel chuẩn màn hình OLED.',
        badge: 'Chữ Thật 100%',
        riskScore: 1,
      },
      {
        id: 2,
        x: 65,
        y: 74,
        title: 'Mã Giao Dịch Napas 247 Hợp Chuẩn',
        detail: 'Cấu trúc tiền tố MB + ngày giờ (260907) + 6 số thứ tự đối soát liên ngân hàng. Thuật toán kiểm tra số dư Napas hoàn toàn khớp.',
        badge: 'Mã Napas Chuẩn',
        riskScore: 2,
      },
      {
        id: 3,
        x: 18,
        y: 12,
        title: 'Logo MB & Vân Nền Bảo Mật',
        detail: 'Dải hạt nhiễu dải màu (gradient dithering) tự nhiên của camera/app. Không có vết cắt viền xung quanh huy hiệu MB.',
        badge: 'Watermark Nguyên Bản',
        riskScore: 3,
      },
    ],
  },
  {
    id: 'tech_ai_edited',
    bankName: 'Techcombank',
    type: 'ai_edited',
    title: 'Techcombank - Bill Chỉnh Sửa Giá Tiền Bằng AI',
    subtitle: 'Bill gốc chỉ chuyển 500,000 VND nhưng kẻ gian dùng Generative AI Inpainting sửa đè thành 50,000,000 VND.',
    amount: '50,000,000 VND',
    sender: 'TRAN MINH T (Techcombank)',
    recipient: 'LE THI C',
    recipientBank: 'Techcombank',
    recipientAccount: '19034567890011',
    transId: 'FT2609078811',
    transTime: '07/09/2026 11:15:42',
    tamperRiskScore: 97,
    verdict: 'CAN THIỆP ĐỒ HỌA BẰNG AI (INPAINTING FRAUD)',
    verdictDetail: 'Phát hiện vùng số tiền bị xóa số cũ và tạo số mới bằng AI. Quầng sáng halo xung quanh con số và sai lệch ma trận nén JPEG lên tới 46%.',
    badgeText: 'AI Inpainting Sửa Giá',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    generateSvgDataUrl: createTechcombankAiEditedSvg,
    pins: [
      {
        id: 0,
        x: 50,
        y: 44,
        title: 'Điểm 1: Vùng Số Tiền Bị AI Inpainting (50,000,000 VND)',
        detail: 'Phương sai nhiễu cục bộ (Local Noise Variance) chỉ đạt 2.1 - cực kỳ mịn do thuật toán AI khuyếch tán (Diffusion model) làm mờ hạt nhiễu JPEG nguyên thủy để xóa số 500.000 cũ.',
        badge: 'AI Diffusion Smudge',
        riskScore: 98,
        isAiEdited: true,
      },
      {
        id: 1,
        x: 35,
        y: 46,
        title: 'Điểm 2: Kerning & Baseline Lệch Trục 1.9px',
        detail: 'Số 5 và các số 0 kế tiếp không nằm cùng một đường chân chữ (baseline). Khoảng cách giữa các dấu phẩy ngăn cách hàng nghìn bị co giãn bất thường.',
        badge: 'Lệch Baseline 1.9px',
        riskScore: 94,
        isAiEdited: true,
      },
      {
        id: 2,
        x: 75,
        y: 44,
        title: 'Điểm 3: Mất Chi Tiết Vân Mờ Watermark Nền',
        detail: 'Khu vực hình chữ nhật bao quanh chữ "50,000,000 VND" bị mất hoàn toàn vân hoa văn chìm của Techcombank do công cụ Clone Stamp/AI Fill.',
        badge: 'Mất Vân Nền',
        riskScore: 96,
        isAiEdited: true,
      },
      {
        id: 3,
        x: 70,
        y: 75,
        title: 'Điểm 4: Mã Chuẩn Chi FT Thiếu Checksum Chi Nhánh',
        detail: 'Mã FT2609078811 bị cắt ngắn, thiếu 4 ký tự mã định danh chi nhánh giao dịch thực tế của hệ thống Core Banking Techcombank.',
        badge: 'FT Napas Rác',
        riskScore: 92,
      },
      {
        id: 4,
        x: 58,
        y: 47,
        title: 'Điểm 5: Vầng Quang Sai AI Halo Bao Quanh Con Số',
        detail: 'Bộ lọc Sobel tách viền phát hiện quầng sáng vi mô dạng vầng hào quang (halo artifact) ở rìa ngoài các con số 0 - đặc trưng khi mô hình AI ghép chữ lên ảnh chụp có sẵn.',
        badge: 'Quầng Halo AI',
        riskScore: 95,
        isAiEdited: true,
      },
      {
        id: 5,
        x: 65,
        y: 45,
        title: 'Điểm 6: Mất Anti-Aliasing Tự Nhiên Rìa Ký Tự',
        detail: 'Phân tích kênh màu RGB cho thấy viền chữ số bị sắc cạnh cơ học (pixel-sharp), không có độ chuyển đổi mờ subpixel mượt mà của bộ kết xuất đồ họa hệ điều hành điện thoại.',
        badge: 'Mất Subpixel Smoothing',
        riskScore: 91,
        isAiEdited: true,
      },
    ],
  },
  {
    id: 'vcb_fake_gen',
    bankName: 'Vietcombank',
    type: 'fake_generator',
    title: 'Vietcombank - Bill Tạo Bằng Web Fake Bill',
    subtitle: 'Biên lai tạo tự động từ các trang web giả mạo biên lai chuyển tiền 50 triệu đồng.',
    amount: '50,000,000 VND',
    sender: 'NGUYEN VAN D (VCB)',
    recipient: 'NGUYEN VAN A',
    recipientBank: 'Vietcombank',
    recipientAccount: '1029384849',
    transId: 'FT26090712345',
    transTime: '07/09/2026 09:41:20',
    tamperRiskScore: 99,
    verdict: 'BIÊN LAI TẠO BỞI WEB FAKE BILL',
    verdictDetail: 'Sử dụng font chữ Google Fonts Roboto thay cho font thương hiệu Vietcombank. Logo và mã giao dịch không có tính toàn vẹn Napas.',
    badgeText: 'Web Fake Bill 100%',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    generateSvgDataUrl: createVietcombankFakeSvg,
    pins: [
      {
        id: 0,
        x: 50,
        y: 44,
        title: 'Số Tiền 50 Triệu Sai Font Độc Quyền VCB',
        detail: 'Web giả mạo dùng font Roboto/Arial cơ bản, trong khi app VCB Digibank sử dụng font SF Pro Text tùy biến riêng biệt.',
        badge: 'Sai Font VCB',
        riskScore: 99,
      },
      {
        id: 1,
        x: 70,
        y: 62,
        title: 'STK Người Nhận & Baseline Lệch Trục',
        detail: 'Chữ số 1029384849 lệch trục chân 2.2px, khoảng cách giữa các số không đều.',
        badge: 'Kerning Bất Thường',
        riskScore: 93,
      },
      {
        id: 2,
        x: 70,
        y: 75,
        title: 'Mã Tham Chiếu FT Không Hợp Chuẩn',
        detail: 'Mã đối soát FT26090712345 không chứa thuật toán checksum kiểm tra tính toàn vẹn liên ngân hàng.',
        badge: 'Mã Đối Soát Giả',
        riskScore: 98,
      },
    ],
  },
  {
    id: 'deepfake_call',
    bankName: 'Cuộc Gọi Deepfake',
    type: 'deepfake',
    title: 'Cuộc Gọi Video Deepfake Mạo Danh Công An',
    subtitle: 'Khung hình trích xuất từ cuộc gọi video Zalo kẻ lừa đảo dùng công nghệ Face-Swap ghép mặt vào sắc phục công an.',
    amount: 'Yêu cầu chuyển 200 Triệu',
    sender: 'Tự xưng: Cán bộ Điều tra A05',
    recipient: 'Nạn nhân người dân',
    recipientBank: 'Tài khoản giả tạm giữ',
    recipientAccount: '102938484 VCB',
    transId: 'ZALO_CALL_0042',
    transTime: '07/09/2026 10:15:00',
    tamperRiskScore: 95,
    verdict: 'CUỘC GỌI VIDEO DEEPFAKE AI',
    verdictDetail: 'Khẩu hình lệch âm thanh, viền vành tai mờ nhòe và mắt không chớp tự nhiên. Cố tình gây mạng giật lag để che giấu lỗi AI.',
    badgeText: 'Deepfake Face-Swap',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    generateSvgDataUrl: createDeepfakeCallSvg,
    pins: [
      {
        id: 0,
        x: 50,
        y: 35,
        title: 'Khuôn Mặt AI Ghép Lên Sắc Phục',
        detail: 'Đường viền khuôn mặt có hiện tượng mờ quang học (blur edge), độ sáng của mặt không ăn khớp với hướng sáng chiếu trên mũ và quân phục.',
        badge: 'Face Swap Artifact',
        riskScore: 97,
        isAiEdited: true,
      },
      {
        id: 1,
        x: 45,
        y: 35,
        title: 'Đôi Mắt Đơ Cứng & Thiếu Phản Xạ Giác Mạc',
        detail: 'Ánh nhìn cố định về phía camera, thiếu cử động nháy mắt tự nhiên của con người (Micro-saccades).',
        badge: 'Ánh Nhìn Đơ AI',
        riskScore: 95,
      },
      {
        id: 2,
        x: 50,
        y: 40,
        title: 'Khẩu Hình Lệch So Với Âm Thanh (Lip-Sync)',
        detail: 'Chuyển động môi bị trễ 180ms so với giọng nói đe dọa phát qua loa, khẩu hình không tạo đúng nguyên âm.',
        badge: 'Lệch Khẩu Hình',
        riskScore: 94,
      },
    ],
  },
];
