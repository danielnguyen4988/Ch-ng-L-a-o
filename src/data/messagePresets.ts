export interface MessagePreset {
  id: string;
  type: 'sms' | 'zalo' | 'telegram' | 'custom';
  title: string;
  senderName: string;
  senderPhoneOrId: string;
  timestamp: string;
  rawText: string;
  channel: 'SMS Banking' | 'Zalo Chat' | 'Telegram' | 'Messenger';
  extractedEntities: {
    amount: string;
    amountNumber: number;
    beneficiaryName: string;
    accountNumber: string;
    transId: string;
    transTime: string;
  };
  urgencyKeywords: string[];
  urgencyScore: number; // 0 - 100
  scamTactic: string;
  scamTacticDetail: string;
  generateSvgDataUrl: () => string;
}

// 1. Zalo Chat: Giục hàng & viện cớ "Napas nghẽn 24/7, tiền đang treo"
export function createZaloUrgencyChatSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720" style="background:#e5ebf1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Zalo Top Header Bar -->
    <rect x="0" y="0" width="480" height="75" fill="#0068ff"/>
    <text x="50" y="44" fill="#ffffff" font-size="18" font-weight="bold">Khách Mua Hàng Hỏa Tốc (Zalo)</text>
    <text x="50" y="62" fill="#dbeafe" font-size="12">Đang hoạt động</text>
    <!-- Back arrow -->
    <path d="M 22 42 L 34 30 M 22 42 L 34 54" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Phone & Video icons -->
    <circle cx="410" cy="42" r="16" fill="#ffffff" fill-opacity="0.15"/>
    <path d="M 405 38 C 405 35 415 35 415 38 L 415 44 C 415 47 405 47 405 44 Z" stroke="#ffffff" stroke-width="1.8" fill="none"/>
    <circle cx="448" cy="42" r="16" fill="#ffffff" fill-opacity="0.15"/>

    <!-- Timestamp divider -->
    <rect x="180" y="95" width="120" height="24" rx="12" fill="#cbd5e1" opacity="0.8"/>
    <text x="240" y="111" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Hôm nay 15:15</text>

    <!-- Message Bubble 1: "Em vừa chuyển 1tr325k rồi đó anh ơi" -->
    <g transform="translate(20, 140)" filter="url(#shadow)">
      <rect x="0" y="0" width="370" height="70" rx="16" fill="#ffffff"/>
      <text x="16" y="26" fill="#0f172a" font-size="14.5" font-weight="500">Em vừa chuyển khoản</text>
      <text x="164" y="26" fill="#0068ff" font-size="15" font-weight="bold">1.325.371đ</text>
      <text x="250" y="26" fill="#0f172a" font-size="14.5" font-weight="500">rồi đó anh,</text>
      <text x="16" y="50" fill="#0f172a" font-size="14.5" font-weight="500">ảnh bill em gửi qua liền cho anh check nhé!</text>
      <text x="325" y="62" fill="#94a3b8" font-size="10.5">15:15</text>
    </g>

    <!-- Simulated Bill Thumbnail Attachment -->
    <g transform="translate(20, 225)" filter="url(#shadow)">
      <rect x="0" y="0" width="220" height="150" rx="14" fill="#ffffff" stroke="#cbd5e1"/>
      <rect x="10" y="10" width="200" height="130" rx="8" fill="#f8fafc"/>
      <rect x="25" y="25" width="80" height="12" rx="3" fill="#dc2626"/>
      <text x="25" y="60" fill="#00a859" font-size="15" font-weight="bold">VND 1,325,371</text>
      <text x="25" y="80" fill="#64748b" font-size="10">FT26232021989278</text>
      <text x="25" y="100" fill="#64748b" font-size="10">V-GREEN -&gt; QUOC VIET</text>
      <rect x="25" y="115" width="100" height="14" rx="4" fill="#e2e8f0"/>
      <text x="175" y="142" fill="#94a3b8" font-size="10">15:15</text>
    </g>

    <!-- Message Bubble 2: KỊCH BẢN THAO TÚNG TÂM LÝ "TIỀN TREO + GIỤC GIAO HÀNG GẤP" -->
    <g transform="translate(20, 390)" filter="url(#shadow)">
      <rect x="0" y="0" width="410" height="160" rx="16" fill="#ffffff"/>
      <!-- Highlighted urgency phrases -->
      <rect x="12" y="14" width="386" height="46" rx="6" fill="#fef2f2" stroke="#fecaca"/>
      <text x="20" y="32" fill="#dc2626" font-size="13.5" font-weight="bold">⚠️ "Tiền đang treo bên cổng 24/7 Napas"</text>
      <text x="20" y="50" fill="#b91c1c" font-size="12">Viện cớ liên ngân hàng nghẽn mạng để giải thích vì sao chưa nảy số dư.</text>

      <text x="16" y="85" fill="#1e293b" font-size="14" font-weight="500">Do em chuyển từ tài khoản công ty V-Green khác</text>
      <text x="16" y="107" fill="#1e293b" font-size="14" font-weight="500">ngân hàng nên hệ thống bảo trì đang giữ lệnh 30p.</text>
      
      <text x="16" y="132" fill="#0f172a" font-size="14" font-weight="bold">Anh cho shipper chạy giao gấp qua cho em trước đi,</text>
      <text x="16" y="150" fill="#0f172a" font-size="14" font-weight="bold">em chuẩn bị ra sân bay bay gấp rồi ạ!</text>
      <text x="365" y="152" fill="#94a3b8" font-size="10.5">15:16</text>
    </g>

    <!-- Bottom Input Bar Mock -->
    <rect x="0" y="660" width="480" height="60" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="15" y="670" width="370" height="40" rx="20" fill="#f1f5f9"/>
    <text x="35" y="695" fill="#94a3b8" font-size="13.5">Soạn tin nhắn...</text>
    <circle cx="435" cy="690" r="18" fill="#0068ff"/>
    <path d="M 430 684 L 442 690 L 430 696 Z" fill="#ffffff"/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// 2. SMS Banking: Biến động số dư thật từ Techcombank (Lệch rõ rệt: Chỉ vào 25.371đ thay vì 1.325.371đ)
export function createSmsRealDiscrepancySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720" style="background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <defs>
      <filter id="smsShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- iOS SMS Header -->
    <rect x="0" y="0" width="480" height="85" fill="#1e293b"/>
    <circle cx="240" cy="35" r="20" fill="#dc2626"/>
    <text x="240" y="41" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">TCB</text>
    <text x="240" y="68" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Techcombank</text>
    <text x="240" y="80" fill="#94a3b8" font-size="10" text-anchor="middle">SMS Banking Chính Thức</text>

    <!-- Timestamp -->
    <text x="240" y="125" fill="#64748b" font-size="11.5" font-weight="600" text-anchor="middle">Hôm nay 15:14</text>

    <!-- Real SMS Notification Bubble (SỐ TIỀN THỰC CHỈ CÓ 25,371 VND) -->
    <g transform="translate(25, 145)" filter="url(#smsShadow)">
      <rect x="0" y="0" width="430" height="230" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      
      <!-- Brand icon badge -->
      <g transform="translate(20, 20)">
        <text x="0" y="15" fill="#38bdf8" font-size="13" font-weight="bold">TECHCOMBANK THONG BAO BIEN DONG SO DU:</text>
      </g>

      <text x="20" y="62" fill="#cbd5e1" font-size="14" font-family="monospace">TK: <tspan fill="#f8fafc" font-weight="bold">1410040988 (NGUYEN HA QUOC VIET)</tspan></text>
      
      <!-- Highlighted Discrepancy Amount: +25,371 VND -->
      <rect x="18" y="76" width="394" height="34" rx="6" fill="#047857" fill-opacity="0.2" stroke="#10b981" stroke-dasharray="3,3"/>
      <text x="28" y="98" fill="#34d399" font-size="17" font-weight="bold" font-family="monospace">PS: +25,371 VND</text>
      <text x="200" y="97" fill="#f87171" font-size="12" font-weight="bold">(LỆCH 1.300.000đ SO VỚI BILL!)</text>

      <text x="20" y="132" fill="#cbd5e1" font-size="13" font-family="monospace">TG: 15:14 20/08/2026</text>
      <text x="20" y="154" fill="#cbd5e1" font-size="13" font-family="monospace">SD: 450,210 VND</text>
      <text x="20" y="176" fill="#cbd5e1" font-size="13" font-family="monospace">ND: CPTD V E HCM11369 26062026-25072026</text>
      <text x="20" y="196" fill="#94a3b8" font-size="12" font-family="monospace">Ma GD: <tspan fill="#f8fafc" font-weight="bold">FT26232021989278</tspan></text>
      
      <text x="375" y="218" fill="#64748b" font-size="11">15:14</text>
    </g>

    <!-- Discrepancy Alert Card Box -->
    <g transform="translate(25, 400)">
      <rect x="0" y="0" width="430" height="150" rx="14" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
      <text x="20" y="32" fill="#f87171" font-size="15" font-weight="bold">BẰNG CHỨNG LỪA ĐẢO SỬA BILL ĐƯỢC XÁC NHẬN:</text>
      
      <text x="20" y="62" fill="#ffffff" font-size="13.5">• Trên ảnh biên lai kẻ gian gửi: <tspan fill="#f87171" font-weight="bold">VND 1,325,371</tspan></text>
      <text x="20" y="86" fill="#ffffff" font-size="13.5">• Trên SMS Techcombank thực nhận: <tspan fill="#34d399" font-weight="bold">VND 25,371</tspan></text>
      <text x="20" y="110" fill="#fbbf24" font-size="13.5">• Mã FT trùng khớp: <tspan font-family="monospace">FT26232021989278</tspan></text>
      <text x="20" y="132" fill="#e2e8f0" font-size="12.5">Kẻ gian thực chất chỉ chuyển 25.371đ rồi dùng AI inpainting vẽ thêm "1,3"!</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// 3. Telegram: Chiêu trò "Giải ngân tài khoản ngân hàng quốc tế / Napas bảo trì"
export function createTelegramPhishingSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720" style="background:#17212b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <!-- Telegram Top Bar -->
    <rect x="0" y="0" width="480" height="75" fill="#242f3d"/>
    <circle cx="35" cy="40" r="18" fill="#2aabee"/>
    <text x="35" y="46" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">CS</text>
    <text x="65" y="36" fill="#ffffff" font-size="15" font-weight="bold">Chăm Sóc Khách Hàng Napas 247</text>
    <text x="65" y="55" fill="#718b9e" font-size="12">bot hỗ trợ tự động</text>

    <!-- Message Bubble: Kịch bản lừa nhập mã OTP / Bấm link giải ngân -->
    <g transform="translate(20, 110)">
      <rect x="0" y="0" width="420" height="210" rx="14" fill="#242f3d"/>
      <text x="16" y="28" fill="#2aabee" font-size="14" font-weight="bold">HỆ THỐNG ĐỐI SOÁT LIÊN NGÂN HÀNG NAPAS 24/7</text>
      
      <text x="16" y="55" fill="#e0e6ec" font-size="13">Giao dịch 12.500.000 VND đang ở trạng thái:</text>
      <text x="16" y="78" fill="#f87171" font-size="14" font-weight="bold">"TẠM GIỮ DO SAI LỆCH NỘI DUNG / CHƯA ĐỐI SOÁT"</text>
      
      <text x="16" y="106" fill="#e0e6ec" font-size="13">Để mở khóa khoản tiền và nhận ngay vào tài khoản,</text>
      <text x="16" y="126" fill="#e0e6ec" font-size="13">vui lòng bấm liên kết bên dưới để xác thực danh tính:</text>
      
      <rect x="14" y="140" width="390" height="40" rx="8" fill="#0f172a" stroke="#ef4444"/>
      <text x="25" y="165" fill="#ef4444" font-size="13" font-weight="bold">👉 https://giai-ngan-napas247-check.top</text>
      <text x="365" y="198" fill="#718b9e" font-size="10.5">15:20</text>
    </g>

    <!-- Analysis Banner -->
    <g transform="translate(20, 350)">
      <rect x="0" y="0" width="420" height="120" rx="12" fill="#450a0a" stroke="#b91c1c"/>
      <text x="16" y="30" fill="#f87171" font-size="14" font-weight="bold">DẤU HIỆU LỪA ĐẢO PHISHING TỐI NGUY HIỂM:</text>
      <text x="16" y="55" fill="#fca5a5" font-size="12.5">• Napas và Ngân hàng Nhà nước KHÔNG BAO GIỜ có bot chat giải ngân.</text>
      <text x="16" y="77" fill="#fca5a5" font-size="12.5">• Tên miền đuôi lạ (.top) nhằm chiếm đoạt tài khoản và mã OTP.</text>
      <text x="16" y="100" fill="#fef08a" font-size="12.5">KHÔNG BẤM VÀO LINK - KHÔNG NHẬP MÃ OTP!</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// 4. SMS Hợp Lệ Khớp 100% (BIZ MBBank 12.500.000đ)
export function createSmsAuthenticMatchSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720" style="background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <!-- SMS Header -->
    <rect x="0" y="0" width="480" height="85" fill="#1e293b"/>
    <circle cx="240" cy="35" r="20" fill="#2563eb"/>
    <text x="240" y="41" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">MB</text>
    <text x="240" y="68" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">MBBank</text>

    <!-- Notification bubble -->
    <g transform="translate(25, 130)">
      <rect x="0" y="0" width="430" height="210" rx="18" fill="#1e293b" stroke="#059669" stroke-width="1.5"/>
      <text x="20" y="32" fill="#34d399" font-size="13" font-weight="bold">THONG BAO GIAO DICH THANH CONG BIZ MBBANK</text>
      <text x="20" y="62" fill="#cbd5e1" font-size="13.5" font-family="monospace">TK: 828299998888 (CTY HTO PLUS)</text>
      
      <rect x="18" y="74" width="394" height="34" rx="6" fill="#047857" fill-opacity="0.3"/>
      <text x="28" y="97" fill="#34d399" font-size="17" font-weight="bold" font-family="monospace">PS: +12,500,000 VND</text>
      <text x="240" y="96" fill="#6ee7b7" font-size="12" font-weight="bold">(KHỚP 100% BILL BIZ MB)</text>

      <text x="20" y="132" fill="#cbd5e1" font-size="13" font-family="monospace">TG: 14:32 20/08/2026</text>
      <text x="20" y="154" fill="#cbd5e1" font-size="13" font-family="monospace">ND: CTY HTO PLUS THANH TOAN DON HANG T8</text>
      <text x="20" y="176" fill="#cbd5e1" font-size="13" font-family="monospace">Ma GD: <tspan fill="#f8fafc" font-weight="bold">MB262329871029</tspan></text>
      <text x="375" y="198" fill="#64748b" font-size="11">14:32</text>
    </g>

    <!-- Verified Badge Card -->
    <g transform="translate(25, 370)">
      <rect x="0" y="0" width="430" height="110" rx="14" fill="#064e3b" stroke="#10b981"/>
      <text x="20" y="32" fill="#6ee7b7" font-size="15" font-weight="bold">KẾT LUẬN: ĐỐI SOÁT KHỚP HOÀN TOÀN 100%</text>
      <text x="20" y="60" fill="#ecfdf5" font-size="13">• Số tiền: 12.500.000 VND trùng khớp hoàn toàn.</text>
      <text x="20" y="82" fill="#ecfdf5" font-size="13">• Thời gian &amp; Mã giao dịch trùng khớp Core Banking MB.</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const MESSAGE_PRESETS: MessagePreset[] = [
  {
    id: 'zalo_vgreen_urgency',
    type: 'zalo',
    title: 'Zalo Giục Giao Hàng & Viện Cớ "Napas Treo 24/7"',
    senderName: 'Khách Mua Hàng Hỏa Tốc',
    senderPhoneOrId: '0987.xxx.889',
    timestamp: '15:15 20/08/2026',
    channel: 'Zalo Chat',
    rawText: 'Em vừa chuyển khoản 1.325.371đ rồi đó anh, ảnh bill em gửi qua liền cho anh check nhé! Do em chuyển từ tài khoản công ty V-Green khác ngân hàng nên hệ thống bảo trì đang giữ lệnh 30p. Anh cho shipper chạy giao gấp qua cho em trước đi, em chuẩn bị ra sân bay bay gấp rồi ạ!',
    extractedEntities: {
      amount: '1.325.371đ',
      amountNumber: 1325371,
      beneficiaryName: 'NGUYEN HA QUOC VIET',
      accountNumber: '1410040988',
      transId: 'FT26232021989278',
      transTime: '15:15 20/08/2026',
    },
    urgencyKeywords: ['giao gấp', 'ra sân bay', 'tiền đang treo', 'bảo trì hệ thống', 'khác ngân hàng', 'giữ lệnh 30p'],
    urgencyScore: 96,
    scamTactic: 'Tạo Áp Lực Thời Gian & Đổ Lỗi Hạ Tầng Ngân Hàng',
    scamTacticDetail: 'Kẻ gian viện cớ "khác ngân hàng 24/7 nên tiền treo", đồng thời hối thúc nạn nhân giao hàng ngay ("đang vội ra sân bay") để nạn nhân mất bình tĩnh, không kịp vào app ngân hàng kiểm tra số dư thực tế.',
    generateSvgDataUrl: createZaloUrgencyChatSvg,
  },
  {
    id: 'sms_techcombank_discrepancy',
    type: 'sms',
    title: 'SMS Techcombank Thật: Chỉ Vào 25.371đ (Lệch 1.3 Triệu!)',
    senderName: 'Techcombank',
    senderPhoneOrId: 'Brandname TCB',
    timestamp: '15:14 20/08/2026',
    channel: 'SMS Banking',
    rawText: 'Techcombank thong bao: TK 1410040988 (NGUYEN HA QUOC VIET) PS: +25,371 VND luc 15:14 20/08/2026. SD: 450,210 VND. ND: CPTD V E HCM11369 26062026-25072026 TDP6. Ma GD: FT26232021989278.',
    extractedEntities: {
      amount: '25,371 VND',
      amountNumber: 25371,
      beneficiaryName: 'NGUYEN HA QUOC VIET',
      accountNumber: '1410040988',
      transId: 'FT26232021989278',
      transTime: '15:14 20/08/2026',
    },
    urgencyKeywords: [],
    urgencyScore: 0,
    scamTactic: 'Bằng Chứng Thật Bóc Trần Bill Sửa Bằng AI',
    scamTacticDetail: 'SMS chính thức của Techcombank ghi nhận mã FT26232021989278 chỉ có giá trị 25.371 VND. Bóc trần hoàn toàn số tiền 1.325.371 VND trên bill là sản phẩm inpainting của AI!',
    generateSvgDataUrl: createSmsRealDiscrepancySvg,
  },
  {
    id: 'telegram_napas_phishing',
    type: 'telegram',
    title: 'Telegram Lừa Đảo: Gửi Link Phishing "Giải Ngân Treo"',
    senderName: 'Napas 24/7 Bot Hỗ Trợ',
    senderPhoneOrId: '@napas247_support_bot',
    timestamp: '15:20 20/08/2026',
    channel: 'Telegram',
    rawText: 'HỆ THỐNG ĐỐI SOÁT LIÊN NGÂN HÀNG NAPAS 24/7. Giao dịch 12.500.000 VND đang ở trạng thái TẠM GIỮ DO SAI LỆCH NỘI DUNG. Để mở khóa khoản tiền, vui lòng bấm liên kết bên dưới để xác thực danh tính: https://giai-ngan-napas247-check.top',
    extractedEntities: {
      amount: '12.500.000 VND',
      amountNumber: 12500000,
      beneficiaryName: 'Tài khoản tạm giữ',
      accountNumber: 'N/A',
      transId: 'NAPAS_TEMP_9918',
      transTime: '15:20 20/08/2026',
    },
    urgencyKeywords: ['tạm giữ', 'mở khóa khoản tiền', 'xác thực danh tính', 'liên kết bên dưới'],
    urgencyScore: 99,
    scamTactic: 'Phishing Đánh Cắp Tài Khoản & Mã OTP Ngân Hàng',
    scamTacticDetail: 'Lợi dụng tâm lý lo sợ tiền bị treo để lừa nạn nhân nhấp vào đường link giả mạo, nhập tên đăng nhập, mật khẩu app ngân hàng và mã OTP.',
    generateSvgDataUrl: createTelegramPhishingSvg,
  },
  {
    id: 'sms_biz_mb_match',
    type: 'sms',
    title: 'SMS MBBank Khớp 100% Với BIZ MB Doanh Nghiệp',
    senderName: 'MBBank',
    senderPhoneOrId: 'Brandname MBBANK',
    timestamp: '14:32 20/08/2026',
    channel: 'SMS Banking',
    rawText: 'THONG BAO GIAO DICH THANH CONG BIZ MBBANK. TK: 828299998888 (CTY HTO PLUS). PS: +12,500,000 VND luc 14:32 20/08/2026. ND: CTY HTO PLUS THANH TOAN DON HANG T8. Ma GD: MB262329871029.',
    extractedEntities: {
      amount: '12.500.000 VND',
      amountNumber: 12500000,
      beneficiaryName: 'CTY HTO PLUS',
      accountNumber: '828299998888',
      transId: 'MB262329871029',
      transTime: '14:32 20/08/2026',
    },
    urgencyKeywords: [],
    urgencyScore: 0,
    scamTactic: 'Giao Dịch Chuẩn Hợp Lệ 100%',
    scamTacticDetail: 'Mọi thông số về số tiền, đơn vị thụ hưởng, mã chuẩn chi và thời gian đều trùng khớp tuyệt đối giữa tin nhắn ngân hàng và biên lai.',
    generateSvgDataUrl: createSmsAuthenticMatchSvg,
  },
];
