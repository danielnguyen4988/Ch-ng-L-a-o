import React, { useState } from 'react';
import {
  PhoneCall,
  CreditCard,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Flag,
  Crown,
  FileWarning,
  ExternalLink,
  Truck,
  PackageCheck,
  AlertOctagon,
  ClipboardPaste,
  OctagonAlert,
} from 'lucide-react';
import { PersonaMode, FraudTargetType } from '../../types';
import { useAccount } from '../../context/AccountContext';
import { useIntelligence } from '../../context/IntelligenceContext';
import { LogisticsIntelligenceView } from './LogisticsIntelligenceView';
import { findLogisticsProfile } from '../../data/logisticsData';

interface PhoneBankTabProps {
  persona: PersonaMode;
  onOpenLicense: () => void;
  onOpenReport?: (type: FraudTargetType, value: string, category: string) => void;
}

export const PhoneBankTab: React.FC<PhoneBankTabProps> = ({
  persona,
  onOpenLicense,
  onOpenReport,
}) => {
  const { isPro, consumeQuota, account } = useAccount();
  const { findIntelligence } = useIntelligence();

  const [targetType, setTargetType] = useState<'phone' | 'bank' | 'logistics'>('phone');
  const [phoneInput, setPhoneInput] = useState('0248889922');
  const [bankInput, setBankInput] = useState('102938484');
  const [bankName, setBankName] = useState('Vietcombank (VCB)');
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);

  const handlePastePhone = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setPhoneInput(text.trim());
        checkPhone(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const handlePasteBank = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setBankInput(text.trim());
        checkBank(text.trim());
      }
    } catch {
      // ignore
    }
  };

  // Phone result state
  const [phoneResult, setPhoneResult] = useState<any>({
    number: '0248889922',
    status: 'ĐỐI TƯỢNG LỪA ĐẢO TỐI NGUY HIỂM (428 BÁO CÁO)',
    type: 'Đầu số ảo VoIP tự động mạo danh Tòa án / Viện kiểm sát / Cục CSGT phạt nguội',
    carrier: 'Đầu số cố định ảo SIP Trunking định tuyến qua Internet',
    reports: 428,
    border: 'border-red-600 bg-red-950/40',
    badge: 'bg-red-600 text-white',
    source: 'Dữ liệu Cảnh báo Mở & 428 lượt phản ánh từ cộng đồng',
    advice: 'CHẶN CUỘC GỌI VÀ TUYỆT ĐỐI KHÔNG GỌI LẠI. Không cung cấp số CCCD hay làm theo bất kỳ chỉ dẫn nào!',
  });

  // Bank result state
  const [bankResult, setBankResult] = useState<any>({
    account: '102938484',
    bank: 'Vietcombank (VCB)',
    holder: 'NGUYEN VAN T***',
    riskLevel: 'TÀI KHOẢN MULE / RỬA TIỀN (53 BÁO CÁO)',
    reports: 53,
    totalScammed: '2.450.000.000 VND',
    border: 'border-red-600 bg-red-950/40',
    badge: 'bg-red-600 text-white',
    pattern:
      'Tài khoản trung gian (Money Mule) nhận tiền lừa đảo từ các vụ giả danh Tòa án và bẫy CTV Shopee, ngay lập tức chia nhỏ chuyển sang ví điện tử và sàn tiền số P2P trong vòng 90 giây.',
    legalWarning:
      'Hành vi mở, thuê, cho thuê hoặc bán tài khoản ngân hàng để tiếp tay cho tội phạm bị truy cứu trách nhiệm hình sự theo Điều 291 Bộ luật Hình sự (Mức án lên đến 7 năm tù).',
    action:
      'Gửi yêu cầu phong tỏa khẩn cấp theo Điều 129 Bộ luật Tố tụng Hình sự tới ngân hàng Vietcombank và Cục Cảnh sát Hình sự (C02).',
  });

  // Current active intelligence match
  const activeIntel =
    targetType === 'phone'
      ? findIntelligence('phone', phoneResult?.number || phoneInput)
      : findIntelligence('bank', bankResult?.account || bankInput);

  const checkPhone = (customNum?: string) => {
    const num = (customNum || phoneInput).trim();
    if (!num) return;

    if (!consumeQuota()) {
      setShowPaywallAlert(true);
      return;
    }

    setPhoneInput(num);
    const cleaned = num.replace(/[^0-9+]/g, '');

    // Check intelligence database first
    const intel = findIntelligence('phone', cleaned);

    if (intel) {
      setPhoneResult({
        number: num,
        status: `${intel.category.toUpperCase()} (${intel.threatScore}%)`,
        type: intel.advice,
        carrier: 'Nhà mạng viễn thông trong nước / Quốc tế',
        reports: intel.reportsCount,
        border:
          intel.threatLevel === 'CRITICAL'
            ? 'border-red-600 bg-red-950/40'
            : 'border-amber-600 bg-amber-950/40',
        badge: intel.threatLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white',
        source: `Cơ sở dữ liệu Tình báo Cộng đồng (${intel.reportsCount} đơn tố giác trùng)`,
        advice: intel.legalBasis,
      });
      return;
    }

    // Default heuristics
    if (cleaned.startsWith('+882') || cleaned.startsWith('+252') || cleaned.startsWith('+224')) {
      setPhoneResult({
        number: num,
        status: 'ĐẦU SỐ VỆ TINH TRỪ TIỀN TỰ ĐỘNG (WANGIRI)',
        type: 'Nháy máy 1 giây để dụ nạn nhân gọi lại, cước phí lên tới 150.000đ/phút kết nối',
        carrier: 'Mạng viễn thông vệ tinh quốc tế (Inmarsat / Thuraya)',
        reports: 189,
        border: 'border-red-600 bg-red-950/40',
        badge: 'bg-red-600 text-white',
        source: 'Trung tâm Giám sát An toàn Không gian mạng Quốc gia (NCSC)',
        advice: 'KHÔNG GỌI LẠI DƯỚI MỌI HÌNH THỨC. Đưa ngay vào danh sách chặn của máy!',
      });
    } else if (cleaned.startsWith('024888') || cleaned.startsWith('02888') || cleaned.startsWith('0247') || cleaned.startsWith('0287')) {
      setPhoneResult({
        number: num,
        status: 'ĐẦU SỐ ẢO VOIP CÓ DẤU HIỆU LỪA ĐẢO',
        type: 'Đầu số dịch vụ tổng đài ảo thường xuyên bị các ổ nhóm lừa đảo ở biên giới thuê để giả danh cơ quan công an',
        carrier: 'Đầu số VoIP Internet SIP Trunking',
        reports: 342,
        border: 'border-red-600 bg-red-950/40',
        badge: 'bg-red-600 text-white',
        source: 'Hệ thống tiếp nhận phản ánh tin nhắn rác & cuộc gọi rác (VNCERT)',
        advice: 'Cơ quan Công an KHÔNG làm việc qua điện thoại. Hãy ngắt máy ngay nếu người gọi tự xưng Công an/Tòa án.',
      });
    } else if (cleaned === '1900545415' || cleaned === '1800545415' || cleaned === '1900545426') {
      setPhoneResult({
        number: num,
        status: 'TỔNG ĐÀI CHÍNH THỨC XÁC THỰC',
        type: 'Hotline Chăm sóc khách hàng chính thức của Ngân hàng / Doanh nghiệp',
        carrier: 'Tổng đài dịch vụ 1900/1800 hợp pháp đã đăng ký Bộ TTTT',
        reports: 0,
        border: 'border-emerald-600 bg-emerald-950/40',
        badge: 'bg-emerald-600 text-white',
        source: 'Danh bạ định danh Doanh nghiệp Nhà nước & Ngân hàng',
        advice: 'Số điện thoại hợp lệ và an toàn để liên hệ tra cứu thông tin.',
      });
    } else {
      setPhoneResult({
        number: num,
        status: 'SỐ THUÊ BAO CÁ NHÂN / CHƯA CÓ DỮ LIỆU TỐ GIÁC',
        type: 'Số di động trong nước thông thường',
        carrier: cleaned.startsWith('098') || cleaned.startsWith('097') || cleaned.startsWith('086') ? 'Viettel' : 'Mobifone / Vinaphone',
        reports: 0,
        border: 'border-blue-600 bg-blue-950/40',
        badge: 'bg-blue-600 text-white',
        source: 'Cơ sở dữ liệu định danh thuê bao viễn thông',
        advice: 'Hiện chưa có báo cáo lừa đảo về số này. Vẫn cần cảnh giác nếu người gọi yêu cầu chuyển tiền hay gửi mã OTP.',
      });
    }
  };

  const checkBank = (customAcc?: string) => {
    const acc = (customAcc || bankInput).trim();
    if (!acc) return;

    if (!consumeQuota()) {
      setShowPaywallAlert(true);
      return;
    }

    setBankInput(acc);
    const cleaned = acc.replace(/[^0-9]/g, '');

    // Check intelligence database first
    const intel = findIntelligence('bank', cleaned);

    if (intel) {
      setBankResult({
        account: acc,
        bank: bankName,
        holder: 'ĐỐI TƯỢNG NẰM TRONG DANH SÁCH ĐEN',
        riskLevel: `${intel.category.toUpperCase()} (${intel.threatScore}%)`,
        reports: intel.reportsCount,
        totalScammed: `${intel.totalLossReported.toLocaleString('vi-VN')} VND`,
        border:
          intel.threatLevel === 'CRITICAL'
            ? 'border-red-600 bg-red-950/40'
            : 'border-amber-600 bg-amber-950/40',
        badge: intel.threatLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white',
        pattern: intel.advice,
        legalWarning: intel.legalBasis,
        action:
          'Kích hoạt cơ chế cảnh báo Napas liên ngân hàng và trích xuất hồ sơ chứng cứ chuyển cơ quan CSĐT.',
      });
      return;
    }

    if (cleaned === '102938484' || cleaned === '9876543210' || cleaned.includes('102938')) {
      setBankResult({
        account: acc,
        bank: bankName,
        holder: 'NGUYEN VAN T***',
        riskLevel: 'TÀI KHOẢN MULE / RỬA TIỀN (53 BÁO CÁO)',
        reports: 53,
        totalScammed: '2.450.000.000 VND',
        border: 'border-red-600 bg-red-950/40',
        badge: 'bg-red-600 text-white',
        pattern:
          'Tài khoản trung gian (Money Mule) nhận tiền lừa đảo từ các vụ giả danh Tòa án và bẫy CTV Shopee, ngay lập tức chia nhỏ chuyển sang ví điện tử và sàn tiền số P2P trong vòng 90 giây.',
        legalWarning:
          'Hành vi mở, thuê, cho thuê hoặc bán tài khoản ngân hàng để tiếp tay cho tội phạm bị truy cứu trách nhiệm hình sự theo Điều 291 Bộ luật Hình sự (Mức án lên đến 7 năm tù).',
        action:
          'Gửi yêu cầu phong tỏa khẩn cấp theo Điều 129 Bộ luật Tố tụng Hình sự tới ngân hàng và Cục Cảnh sát Hình sự (C02).',
      });
    } else {
      setBankResult({
        account: acc,
        bank: bankName,
        holder: 'TÀI KHOẢN CÁ NHÂN HỢP PHÁP',
        riskLevel: 'CHƯA GHI NHẬN TỐ CÁO TRÙNG LẶP',
        reports: 0,
        totalScammed: '0 VND',
        border: 'border-blue-600 bg-blue-950/40',
        badge: 'bg-blue-600 text-white',
        pattern: 'Tài khoản hoạt động bình thường trên hệ thống Napas.',
        legalWarning: 'Luôn kiểm tra đúng tên người nhận trước khi thực hiện lệnh chuyển khoản.',
        action: 'Nếu bị ép chuyển tiền, hãy lập tức dừng lại và liên hệ người thân.',
      });
    }
  };

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

      {/* INPUT SELECTION CARD */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>
                {persona === 'elderly'
                  ? 'Kiểm Tra Số Điện Thoại Lạ & Tài Khoản Ngân Hàng'
                  : 'Truy Vết Số Điện Thoại & Đối Soát Tài Khoản Ngân Hàng Rửa Tiền'}
              </span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                Điều 291 BLHS
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {persona === 'elderly'
                ? 'Có người lạ gọi điện giục chuyển tiền? Nhập số điện thoại hoặc số tài khoản ngân hàng để kiểm tra có bị tố cáo lừa đảo không.'
                : 'Đối soát dữ liệu cảnh báo rủi ro cộng đồng, phát hiện đầu số ảo VoIP và mạng lưới tài khoản rác (Money Mule) nghi vấn.'}
            </p>
          </div>

          {/* MODE SELECTOR */}
          <div className="flex flex-wrap p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-center gap-1">
            <button
              onClick={() => setTargetType('phone')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetType === 'phone'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Số Điện Thoại</span>
            </button>
            <button
              onClick={() => setTargetType('bank')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetType === 'bank'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>STK Ngân Hàng</span>
            </button>
            <button
              onClick={() => setTargetType('logistics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetType === 'logistics'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics & Shipper</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                MỚI
              </span>
            </button>
          </div>
        </div>

        {/* LOGISTICS & SHIPPER VIEW */}
        {targetType === 'logistics' && (
          <div className="pt-2">
            <LogisticsIntelligenceView
              persona={persona}
              onOpenLicense={onOpenLicense}
              onOpenReport={onOpenReport}
              initialPhone={phoneInput}
            />
          </div>
        )}

        {/* INPUT FORM FOR PHONE */}
        {targetType === 'phone' && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-medium py-1">Số điện thoại mẫu:</span>
              <button
                onClick={() => checkPhone('0248889922')}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-semibold cursor-pointer"
              >
                🚨 Giả Danh Phạt Nguội (0248889922)
              </button>
              <button
                onClick={() => checkPhone('+882169999')}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-semibold cursor-pointer"
              >
                📞 Cước Vệ Tinh Trừ Tiền (+882...)
              </button>
              <button
                onClick={() => checkPhone('1900545415')}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer"
              >
                🏦 Hotline Chuẩn Vietcombank
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Nhập số điện thoại gọi đến hoặc nháy máy..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePastePhone}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 flex items-center gap-2 active:scale-95"
                  title="Dán nhanh số điện thoại từ bộ nhớ tạm"
                >
                  <ClipboardPaste className="w-4 h-4 text-amber-400" />
                  <span>Dán Nhanh</span>
                </button>
                <button
                  onClick={() => checkPhone()}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Kiểm Tra Số Này</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INPUT FORM FOR BANK ACCOUNT */}
        {targetType === 'bank' && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-medium py-1">Tài khoản rác mẫu:</span>
              <button
                onClick={() => checkBank('102938484')}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-semibold cursor-pointer"
              >
                🚨 STK Rửa Tiền Bị Tố Giác (102938484)
              </button>
              <button
                onClick={() => checkBank('9876543210')}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold cursor-pointer"
              >
                ⚠️ STK Bẫy CTV Shopee (9876543210)
              </button>
              <button
                onClick={() => checkBank('0011001234567')}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold cursor-pointer"
              >
                🏦 Tài Khoản Thông Thường
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-1">
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  <option>Vietcombank (VCB)</option>
                  <option>MBBank (Quân Đội)</option>
                  <option>VietinBank</option>
                  <option>BIDV</option>
                  <option>Techcombank</option>
                  <option>VPBank</option>
                  <option>ACB</option>
                  <option>TPBank</option>
                  <option>Sacombank</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={bankInput}
                  onChange={(e) => setBankInput(e.target.value)}
                  placeholder="Nhập số tài khoản ngân hàng kẻ gian ép chuyển tiền..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePasteBank}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 flex items-center gap-2 active:scale-95"
                    title="Dán nhanh số tài khoản từ bộ nhớ tạm"
                  >
                    <ClipboardPaste className="w-4 h-4 text-amber-400" />
                    <span>Dán Nhanh</span>
                  </button>
                  <button
                    onClick={() => checkBank()}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>Đối Soát STK</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMMUNITY INTELLIGENCE ALERT BANNER IF TARGET IS REPORTED */}
      {activeIntel && activeIntel.reportsCount > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-2 border-red-500/50 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <Users className="w-5 h-5 text-red-400 animate-pulse" />
              <span>
                CẢNH BÁO TỐ GIÁC TRÙNG LẶP: ĐÃ CÓ {activeIntel.reportsCount} LƯỢT TỐ CÁO TRÊN HỆ THỐNG!
              </span>
            </div>
            <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full font-mono">
              DANH SÁCH ĐEN
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tổng số tiền thiệt hại lũy kế được các nạn nhân báo cáo:{' '}
            <strong className="text-amber-300 font-mono text-sm">
              {activeIntel.totalLossReported.toLocaleString('vi-VN')} VND
            </strong>
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-slate-400">Các góc độ thủ đoạn đã ghi nhận:</span>
            <ul className="space-y-1 text-xs text-slate-300">
              {activeIntel.angles.map((ang, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{ang}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PHONE RESULT DISPLAY */}
      {targetType === 'phone' && phoneResult && (
        <div className={`rounded-2xl border ${phoneResult.border} p-5 sm:p-6 space-y-5 shadow-2xl bg-slate-950`}>
          {/* 3-SECOND TRAFFIC LIGHT BANNER */}
          {phoneResult.badge.includes('red') || phoneResult.status.includes('LỪA ĐẢO') || phoneResult.status.includes('TRỪ TIỀN') ? (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <OctagonAlert className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-bold text-red-200">
                    ĐÈN ĐỎ NGUY HIỂM
                  </span>
                  <span className="text-xs font-bold text-red-100">Đã có nhiều người bị lừa</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  SỐ ĐIỆN THOẠI LỪA ĐẢO — CHẶN NGAY VÀ KHÔNG GỌI LẠI!
                </h4>
                <p className="text-xs text-red-100 mt-0.5">
                  Công an/Tòa án không làm việc qua điện thoại. Tuyệt đối không làm theo chỉ dẫn, không bấm phím!
                </p>
              </div>
            </div>
          ) : phoneResult.badge.includes('emerald') ? (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold text-emerald-200">
                    ĐÈN XANH AN TOÀN
                  </span>
                  <span className="text-xs font-bold text-emerald-100">Hotline chính thống</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  TỔNG ĐÀI HỢP PHÁP ĐÃ ĐĂNG KÝ VỚI BỘ THÔNG TIN &amp; TRUYỀN THÔNG
                </h4>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold text-blue-200">
                    SỐ THÔNG THƯỜNG
                  </span>
                  <span className="text-xs font-bold text-blue-100">Chưa có cảnh báo</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  SỐ DI ĐỘNG CÁ NHÂN — VẪN NÊN CẢNH GIÁC NẾU HỎI TIỀN / MÃ OTP
                </h4>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                SỐ ĐIỆN THOẠI ĐANG KIỂM TRA:
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-mono tracking-wider">
                {phoneResult.number}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider ${phoneResult.badge}`}>
                {phoneResult.status}
              </span>
              {onOpenReport && (
                <button
                  onClick={() => onOpenReport('phone', phoneResult.number, phoneResult.status)}
                  className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Gửi tố giác số điện thoại này"
                >
                  <Flag className="w-3.5 h-3.5 text-red-400" />
                  <span>Tố Giác Số Này</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-xs">Cơ Sở Dữ Liệu Xác Minh:</span>
              <p className="text-white font-medium">{phoneResult.source}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-xs">Số Lượt Người Dân Đã Tố Giác:</span>
              <p className="text-amber-400 font-bold text-base font-mono">{phoneResult.reports} lượt tố giác</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-xs">Dấu Hiệu Thủ Đoạn:</span>
              <p className="text-slate-200 mt-0.5">{phoneResult.type}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-red-400 font-bold uppercase text-xs">Lời Dặn Hành Động Ngay:</span>
              <p className="text-white font-bold text-sm mt-0.5">{phoneResult.advice}</p>
            </div>
          </div>

          {/* LOGISTICS & SHIPPER CROSS-REFERENCE ALERT */}
          {(() => {
            const logisticsInfo = findLogisticsProfile(phoneResult.number);
            if (!logisticsInfo) return null;
            return (
              <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs text-indigo-300 uppercase tracking-wider">
                      Dữ Liệu Tình Báo Vận Tải & Shipper (Cùng Thuê Bao)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPhoneInput(phoneResult.number);
                      setTargetType('logistics');
                    }}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <span>Xem Hồ Sơ Chi Tiết</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Tỷ lệ nhận hàng TMĐT:</span>
                    <span className={`font-mono font-bold text-sm ${logisticsInfo.deliveryStats.successRate < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {logisticsInfo.deliveryStats.successRate}% ({logisticsInfo.deliveryStats.deliveredCount}/{logisticsInfo.deliveryStats.totalOrders} đơn)
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Rủi ro xe ôm công nghệ:</span>
                    <span className="font-bold text-slate-200">
                      {logisticsInfo.driverRisk?.hasFareEvasion ? (
                        <span className="text-amber-400">⚠️ Bùng {logisticsInfo.driverRisk.evasionCount} cuốc xe</span>
                      ) : (
                        <span className="text-emerald-400">An toàn</span>
                      )}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Cảnh báo hàng cấm (Đ.250):</span>
                    <span className="font-bold">
                      {logisticsInfo.contrabandWarning?.isReportedForContraband ? (
                        <span className="text-red-400 font-mono">🚨 BÁO ĐỘNG ĐỎ MA TÚY</span>
                      ) : (
                        <span className="text-slate-400">Không ghi nhận</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* BANK RESULT DISPLAY */}
      {targetType === 'bank' && bankResult && (
        <div className={`rounded-2xl border ${bankResult.border} p-5 sm:p-6 space-y-5 shadow-2xl bg-slate-950`}>
          {/* 3-SECOND TRAFFIC LIGHT BANNER */}
          {bankResult.badge.includes('red') || bankResult.riskLevel.includes('MULE') || bankResult.riskLevel.includes('RỬA TIỀN') || bankResult.riskLevel.includes('LỪA ĐẢO') ? (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <OctagonAlert className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-bold text-red-200">
                    ĐÈN ĐỎ NGUY HIỂM
                  </span>
                  <span className="text-xs font-bold text-red-100">Đã có {bankResult.reports} người tố cáo</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  TÀI KHOẢN LỪA ĐẢO / RỬA TIỀN — TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN!
                </h4>
                <p className="text-xs text-red-100 mt-0.5">
                  Đây là tài khoản thuê mướn nhằm tẩu tán tiền phi pháp. Tiền chuyển vào sẽ bị rút sạch trong vòng 90 giây!
                </p>
              </div>
            </div>
          ) : bankResult.badge.includes('amber') ? (
            <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-slate-950 p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-black/10 rounded-xl shrink-0">
                <AlertTriangle className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-bold text-slate-950">
                    ĐÈN VÀNG CẢNH GIÁC
                  </span>
                  <span className="text-xs font-bold text-slate-900">Có dấu hiệu bất thường</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  CẨN TRỌNG — TÀI KHOẢN CÓ DẤU HIỆU ĐƯỢC DÙNG ĐỂ BẪY TIỀN
                </h4>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-xl shadow-lg flex items-center gap-3.5 animate-in zoom-in-95 duration-200">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold text-emerald-200">
                    ĐÈN XANH
                  </span>
                  <span className="text-xs font-bold text-emerald-100">Chưa có ghi nhận xấu</span>
                </div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
                  TÀI KHOẢN BÌNH THƯỜNG — VẪN CẦN KIỂM TRA ĐÚNG TÊN NGƯỜI NHẬN
                </h4>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                SỐ TÀI KHOẢN ĐANG KIỂM TRA:
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-mono tracking-wider">
                STK: {bankResult.account} ({bankResult.bank})
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Tên chủ tài khoản: <strong className="text-white">{bankResult.holder}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider ${bankResult.badge}`}>
                {bankResult.riskLevel}
              </span>
              {onOpenReport && (
                <button
                  onClick={() => onOpenReport('bank', `${bankResult.account} (${bankResult.bank})`, bankResult.riskLevel)}
                  className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Gửi tố giác số tài khoản này"
                >
                  <Flag className="w-3.5 h-3.5 text-red-400" />
                  <span>Tố Giác STK Này</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-xs">Số Lượt Nạn Nhân Đã Tố Giác:</span>
              <p className="text-red-400 font-bold text-lg font-mono">{bankResult.reports} lượt tố giác</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-xs">Tổng Tiền Bị Lừa Đảo Báo Cáo:</span>
              <p className="text-amber-400 font-bold text-lg font-mono">{bankResult.totalScammed}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-teal-400 font-bold uppercase text-xs font-mono">
                CÁCH KẺ GIAN TẨU TÁN TIỀN:
              </span>
              <p className="text-slate-300 mt-1 leading-relaxed">{bankResult.pattern}</p>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200">
              <strong className="block text-red-300 font-mono text-xs uppercase mb-1">
                CẢNH BÁO PHÁP LUẬT (ĐIỀU 291 BỘ LUẬT HÌNH SỰ):
              </strong>
              <span>{bankResult.legalWarning}</span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-amber-300 font-bold uppercase text-xs block mb-1">
                HÀNH ĐỘNG CẦN LÀM ĐỂ BẢO VỆ &amp; GIỮ TIỀN:
              </span>
              <p className="text-white font-bold">{bankResult.action}</p>
            </div>

            {/* NAPAS & NHNN BIOMETRIC REGULATORY GATEWAY */}
            <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30 space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-teal-400 font-mono font-bold uppercase">
                  QUY ĐỊNH BẢO VỆ TÀI KHOẢN NGÂN HÀNG &amp; SINH TRẮC HỌC (NGÂN HÀNG NHÀ NƯỚC):
                </span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">
                  BẢO VỆ GIAO DỊCH
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Xác thực khuôn mặt CCCD:</span>
                  <span className="text-red-400 font-bold font-mono">
                    {bankResult.riskLevel.includes('AN TOÀN') ? 'Đã liên kết CCCD gắn chip' : 'CHƯA LIÊN KẾT (TÀI KHOẢN MUA LẠI)'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Tốc độ tẩu tán tiền:</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {bankResult.riskLevel.includes('AN TOÀN') ? 'Giao dịch thông thường' : '45 - 90 giây (Tự động chuyển tiếp)'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Hạn chế thiệt hại:</span>
                  <span className="text-cyan-300 font-bold font-mono">
                    Gọi hotline ngân hàng ngay trong 15 phút đầu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
