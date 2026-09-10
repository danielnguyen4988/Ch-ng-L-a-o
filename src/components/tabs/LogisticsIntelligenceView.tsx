import React, { useState } from 'react';
import {
  Truck,
  PackageCheck,
  PackageX,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  DollarSign,
  Clock,
  MapPin,
  Copy,
  Check,
  Ban,
  Search,
  RefreshCw,
  Sparkles,
  Navigation,
  UserCheck,
  UserX,
  AlertOctagon,
  Share2,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { PersonaMode, FraudTargetType, LogisticsRiskProfile } from '../../types';
import { useAccount } from '../../context/AccountContext';
import { useIntelligence } from '../../context/IntelligenceContext';
import {
  LOGISTICS_DATABASE,
  findLogisticsProfile,
  generateFallbackLogisticsProfile,
  LOGISTICS_PRESET_BUTTONS,
  SHIPPER_SAFETY_RULES,
} from '../../data/logisticsData';

interface LogisticsIntelligenceViewProps {
  persona: PersonaMode;
  onOpenLicense: () => void;
  onOpenReport?: (type: FraudTargetType, value: string, category: string) => void;
  initialPhone?: string;
}

export const LogisticsIntelligenceView: React.FC<LogisticsIntelligenceViewProps> = ({
  persona,
  onOpenLicense,
  onOpenReport,
  initialPhone = '0867889900',
}) => {
  const { consumeQuota } = useAccount();
  const { findIntelligence } = useIntelligence();

  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [activeProfile, setActiveProfile] = useState<LogisticsRiskProfile>(() => {
    return findLogisticsProfile(initialPhone) || LOGISTICS_DATABASE[0];
  });
  const [copiedWarning, setCopiedWarning] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  // Check if target also has general community fraud reports
  const communityIntel = findIntelligence('phone', activeProfile.phone);

  const handleSearch = (customPhone?: string) => {
    const target = (customPhone || phoneInput).trim();
    if (!target) return;

    if (!consumeQuota()) {
      onOpenLicense();
      return;
    }

    setPhoneInput(target);
    const found = findLogisticsProfile(target);
    if (found) {
      setActiveProfile(found);
    } else {
      setActiveProfile(generateFallbackLogisticsProfile(target));
    }
  };

  const handleCopyAlert = () => {
    const text = `🚨 CẢNH BÁO TÌNH BÁO LOGISTICS & SHIPPER VERAFENSE:
- Số điện thoại: ${activeProfile.phone} (${activeProfile.name || 'Chưa định danh'})
- Mức độ rủi ro: ${activeProfile.categoryLabel}
- Tỷ lệ nhận hàng thành công: ${activeProfile.deliveryStats.successRate}% (${activeProfile.deliveryStats.deliveredCount}/${activeProfile.deliveryStats.totalOrders} đơn)
- Số lần bom/hủy hàng: ${activeProfile.deliveryStats.boomCount} đơn
${activeProfile.driverRisk?.hasFareEvasion ? `- Cảnh báo bùng cước xe ôm công nghệ: Đã quỵt ${activeProfile.driverRisk.reportedLossAmount.toLocaleString('vi-VN')}đ` : ''}
${activeProfile.contrabandWarning?.isReportedForContraband ? `⚠️ CẢNH BÁO TỐI KHẨN: Nghi vấn lợi dụng shipper vận chuyển hàng cấm / ma túy (${activeProfile.contrabandWarning.legalArticle})` : ''}
Cung cấp bởi Hệ thống Giám sát & Điều tra số VeraFense 2026.`;

    navigator.clipboard.writeText(text);
    setCopiedWarning(true);
    setTimeout(() => setCopiedWarning(false), 2500);
  };

  // Color logic for success rate
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (rate >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const filteredReports = activeProfile.recentReports.filter((item) => {
    if (filterPlatform === 'all') return true;
    return item.platform.toLowerCase().includes(filterPlatform.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER EXPLANATION BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {persona === 'elderly'
                  ? 'Kiểm Tra SĐT Giao Hàng & Xe Ôm Chở Khách'
                  : 'Tình Báo Logistics & Phòng Chống Gian Lận Vận Tải'}
              </h2>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/40 font-mono font-bold">
                Điều 250 BLHS (Hàng Cấm)
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
                Anti-Bom Hàng COD
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Dữ liệu đối soát tập trung cho <strong>Chủ Shop</strong>, <strong>Bưu Tá Giao Hàng</strong> và{' '}
              <strong>Tài Xế Xe Ôm Công Nghệ (Grab, Be, Xanh SM, Ahamove, Lalamove, GHTK, GHN, Viettel Post)</strong>. Phát hiện ngay các đối tượng chuyên bom hàng, bùng tiền cước xe ôm cuốc đêm và bẫy lợi dụng shipper vận chuyển chất cấm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() =>
              onOpenReport?.(
                'logistics',
                activeProfile.phone,
                activeProfile.riskCategory === 'CONTRABAND_TRAP'
                  ? 'Bẫy lợi dụng shipper vận chuyển hàng cấm / ma túy'
                  : activeProfile.riskCategory === 'EVASION_RIDE'
                  ? 'Khách bùng cước xe ôm công nghệ (Grab, Be, Xanh SM)'
                  : 'Bom hàng thương mại điện tử (Shopee, TikTok Shop, Lazada)'
              )
            }
            className="flex-1 md:flex-initial bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20 transition-all whitespace-nowrap"
          >
            <Flag className="w-4 h-4" />
            <span>Tố Giác SĐT Này</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & PRESETS */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Nhập Số Điện Thoại Cần Tra Cứu (Khách Đặt Hàng / Khách Gọi Xe):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nhập SĐT khách hàng, bưu tá hoặc cuốc xe (VD: 0867889900)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              {phoneInput && (
                <button
                  onClick={() => setPhoneInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5"
                >
                  Xóa
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Kiểm Tra Tình Báo</span>
            </button>
          </div>
        </div>

        {/* QUICK PRESETS */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tình huống thực tế tiêu biểu cần kiểm tra nhanh:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {LOGISTICS_PRESET_BUTTONS.map((item) => (
              <button
                key={item.phone}
                onClick={() => {
                  setPhoneInput(item.phone);
                  handleSearch(item.phone);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  activeProfile.phone === item.phone
                    ? 'bg-slate-900 border-indigo-500/80 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="truncate">
                  <div className="font-bold truncate">{item.label}</div>
                  <div className="font-mono text-[11px] text-slate-400">{item.phone}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap ${item.badgeColor}`}>
                  {item.typeBadge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CRITICAL CONTRABAND WARNING BANNER (IF APPLICABLE) */}
      {activeProfile.contrabandWarning?.isReportedForContraband && (
        <div className="bg-gradient-to-r from-red-950 via-slate-950 to-red-950 border-2 border-red-500 p-5 rounded-2xl shadow-2xl shadow-red-950/60 relative overflow-hidden animate-in fade-in">
          <div className="absolute top-0 right-0 bg-red-600 text-white font-mono font-bold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse">
            BÁO ĐỘNG ĐỎ HÌNH SỰ - NGUY CƠ TÙ TỘI
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-red-600/30 border border-red-500/50 rounded-2xl text-red-400 flex-shrink-0">
              <AlertOctagon className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2.5 flex-1">
              <div>
                <h3 className="text-base sm:text-lg font-black text-red-200 flex items-center gap-2">
                  <span>CẢNH BÁO TỐI KHẨN: BẪY LỢI DỤNG SHIPPER VẬN CHUYỂN CHẤT CẤM / MA TÚY!</span>
                </h3>
                <p className="text-xs text-red-300/90 font-mono mt-0.5">
                  Căn cứ pháp lý:{' '}
                  <strong className="underline text-red-200">
                    {activeProfile.contrabandWarning.legalArticle}
                  </strong>
                </p>
              </div>

              <div className="bg-red-950/60 p-3.5 rounded-xl border border-red-500/30 text-xs text-red-100 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-red-300 flex-shrink-0">Thủ đoạn bẫy:</span>
                  <span>{activeProfile.contrabandWarning.tacticSummary}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-red-300 flex-shrink-0">Chất cấm nghi vấn:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {activeProfile.contrabandWarning.substanceSuspected}
                  </span>
                </div>
              </div>

              {/* EMERGENCY PROTOCOL FOR SHIPPER */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-red-500/40 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Quy Trình Thoát Hiểm Khẩn Cấp 4 Bước Cho Shipper:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {activeProfile.contrabandWarning.emergencyProtocol.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INTELLIGENCE DOSSIER CARD */}
      <div className={`p-6 rounded-2xl border shadow-xl space-y-6 ${activeProfile.borderColor}`}>
        {/* DOSSIER TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
                {activeProfile.phone}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${activeProfile.tagBadge}`}>
                {activeProfile.riskCategory === 'CLEAN' ? 'Uy Tín Cao' : 'Rủi Ro Cao'}
              </span>
              {activeProfile.carrier && (
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-mono">
                  Mạng: {activeProfile.carrier}
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <span>{activeProfile.name || 'Thuê bao chưa đăng ký tên'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{activeProfile.categoryLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyAlert}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all"
            >
              {copiedWarning ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWarning ? 'Đã Sao Chép Cảnh Báo!' : 'Sao Chép Cảnh Báo'}</span>
            </button>
            <button
              onClick={() => {
                const url = `tel:${activeProfile.phone}`;
                window.location.href = url;
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>Gọi Xác Nhận</span>
            </button>
          </div>
        </div>

        {/* GRID: DELIVERY STATS (ANTI-BOM) & DRIVER RISK (ANTI-BÙNG CƯỚC) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* COLUMN 1: DELIVERY METRICS (ANTI-BOM HÀNG CHO SHOP & BƯU TÁ) */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Chỉ Số Nhận Hàng TMĐT (Anti-Bom Hàng COD)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Shopee • TikTok • Lazada</span>
            </div>

            {/* BIG SUCCESS RATE BADGE */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${getSuccessRateColor(activeProfile.deliveryStats.successRate)}`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Tỷ Lệ Nhận Hàng Thành Công:
                </div>
                <div className="text-3xl font-mono font-black mt-0.5">
                  {activeProfile.deliveryStats.successRate}%
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs font-mono font-bold">
                  Giao thành công: {activeProfile.deliveryStats.deliveredCount} / {activeProfile.deliveryStats.totalOrders} đơn
                </div>
                <div className="text-xs font-mono font-bold text-red-400">
                  Đã bom / hoàn: {activeProfile.deliveryStats.boomCount} đơn
                </div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Tiến độ nhận hàng</span>
                <span>{activeProfile.deliveryStats.successRate}% uy tín</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${activeProfile.deliveryStats.successRate}%` }}
                />
                <div
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: `${100 - activeProfile.deliveryStats.successRate}%` }}
                />
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-400">Giá trị đơn trung bình:</span>
                <span className="text-white font-mono font-bold">
                  {activeProfile.deliveryStats.averageOrderValue.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-lg space-y-1">
                <span className="text-slate-400 block">Lý do bom hàng chủ yếu:</span>
                <span className="text-amber-300 font-medium block">
                  {activeProfile.deliveryStats.primaryBoomReason || 'Chưa ghi nhận'}
                </span>
              </div>
              {activeProfile.deliveryStats.frequentRefusalKeyword && (
                <div className="p-2 bg-slate-900/60 rounded-lg space-y-1">
                  <span className="text-slate-400 block">Từ khóa thường từ chối / bao biện:</span>
                  <span className="text-slate-200 font-mono text-[11px] block italic">
                    "{activeProfile.deliveryStats.frequentRefusalKeyword}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: DRIVER RIDE EVASION & FARE RISKS (CHO TÀI XẾ XE ÔM) */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Chỉ Số Rủi Ro Xe Ôm Công Nghệ (Grab / Be / Xanh SM)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Cuốc Xe Đêm</span>
            </div>

            {activeProfile.driverRisk?.hasFareEvasion ? (
              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    CẢNH BÁO BÙNG TIỀN CƯỚC XE ÔM!
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    {activeProfile.driverRisk.evasionCount} LƯỢT TỐ CÁO
                  </span>
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {activeProfile.driverRisk.tacticSummary}
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-[11px] flex justify-between items-center">
                  <span className="text-slate-400">Tổng thiệt hại tài xế bị quỵt:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {activeProfile.driverRisk.reportedLossAmount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                {activeProfile.driverRisk.lastIncidentDesc && (
                  <div className="text-[11px] text-slate-400 italic">
                    Vụ gần nhất: "{activeProfile.driverRisk.lastIncidentDesc}"
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Chưa ghi nhận phản ánh bùng tiền cuốc xe</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Thuê bao này chưa có lịch sử quỵt tiền tài xế trên hệ thống chia sẻ liên minh tài xế công nghệ.
                </p>
              </div>
            )}

            {/* FAKE COD ADVANCING WARNING */}
            {activeProfile.fakeCodRisk?.isReportedForFakeCod && (
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    BẪY LỪA ỨNG TIỀN COD BƯU KIỆN ẢO
                  </span>
                  <span className="font-mono text-purple-200">
                    Mất {activeProfile.fakeCodRisk.advanceAmountLost.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <p className="text-slate-200 text-[11px]">
                  {activeProfile.fakeCodRisk.tactic}
                </p>
              </div>
            )}

            {/* COMMUNITY INTEL CROSS-REFERENCE */}
            {communityIntel && (
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Đối soát Dữ liệu Cảnh báo Rủi ro Cộng đồng:
                  </span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">
                    {communityIntel.reportsCount} đơn tố giác
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Số này đồng thời bị tố cáo ở danh mục:{' '}
                  <strong className="text-amber-300">{communityIntel.category}</strong> (Tổng số tiền thiệt hại tích lũy:{' '}
                  {communityIntel.totalLossReported.toLocaleString('vi-VN')}đ).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTION RECOMMENDATIONS */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2Icon className="w-4 h-4 text-indigo-400" />
            <span>Khuyến Nghị Hành Động Cho Chủ Shop & Tài Xế:</span>
          </h4>
          <div className="space-y-1.5">
            {activeProfile.actionPlan.map((act, idx) => (
              <div key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT INCIDENTS & REPORTS LOG */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Nhật Ký Phản Ánh & Tố Giác Từ Cộng Đồng ({activeProfile.recentReports.length} ghi nhận):</span>
            </h4>

            {/* FILTER BUTTONS */}
            <div className="flex items-center gap-1 text-[11px] bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setFilterPlatform('all')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterPlatform === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterPlatform('Shopee')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterPlatform === 'Shopee' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shopee/TikTok
              </button>
              <button
                onClick={() => setFilterPlatform('Grab')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterPlatform === 'Grab' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Grab/Be
              </button>
              <button
                onClick={() => setFilterPlatform('Ahamove')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterPlatform === 'Ahamove' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Giao Hàng
              </button>
            </div>
          </div>

          {filteredReports.length > 0 ? (
            <div className="space-y-2">
              {filteredReports.map((rep, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-slate-400 text-[11px]">{rep.date}</span>
                      <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded text-[10px]">
                        {rep.platform}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        Nguồn:{' '}
                        {rep.reporterType === 'shop'
                          ? 'Chủ Shop TMĐT'
                          : rep.reporterType === 'driver'
                          ? 'Tài xế xe ôm'
                          : 'Bưu tá giao hàng'}
                      </span>
                    </div>
                    <div className="text-slate-200">{rep.detail}</div>
                    {rep.routeOrArea && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>Khu vực: {rep.routeOrArea}</span>
                      </div>
                    )}
                  </div>

                  {rep.lossAmount > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-slate-400">Thiệt hại:</div>
                      <div className="font-mono font-bold text-red-400">
                        -{rep.lossAmount.toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
              Không có sự cố xấu nào được ghi nhận cho bộ lọc này.
            </div>
          )}
        </div>
      </div>

      {/* 4 GOLDEN SAFETY RULES FOR SHIPPERS & DRIVERS */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Cẩm Nang Sống Còn: 4 Quy Tắc Bảo Vệ Tài Xế & Bưu Tá Trước Cạm Bẫy
            </h3>
            <p className="text-xs text-slate-400">
              Được khuyến nghị bởi Hiệp hội Vận tải & Luật sư chuyên trách Hình sự
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SHIPPER_SAFETY_RULES.map((rule) => (
            <div key={rule.id} className={`p-4 rounded-xl border ${rule.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{rule.title}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 uppercase">
                  {rule.tag}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
