import React, { useState } from 'react';
import {
  Crown,
  KeyRound,
  Check,
  XCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Trash2,
  HeartHandshake,
  Sparkles,
  FileCheck,
  Cpu,
  Database,
  Users,
} from 'lucide-react';
import { useAccount } from '../../context/AccountContext';

interface LicenseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const LicenseManagerModal: React.FC<LicenseManagerModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const {
    account,
    isPro,
    isEnterprise,
    activateLicense,
    deactivateLicense,
    switchTierDirectly,
  } = useAccount();

  const [inputKey, setInputKey] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const result = activateLicense(inputKey);
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      onNotify('Kích hoạt giấy phép bản quyền thành công!');
      setInputKey('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleQuickKey = (key: string) => {
    setInputKey(key);
    const result = activateLicense(key);
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      onNotify(`Đã áp dụng mã: ${key}`);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                CHÍNH SÁCH DỊCH VỤ & BẢN QUYỀN CHUYÊN SÂU
              </h3>
              <p className="text-xs text-slate-400">
                Miễn phí cho tất cả mọi người dùng • Chỉ trả phí khi có nhu cầu chuyên sâu & quy mô lớn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* CORE ETHOS BANNER (CLEAR PHILOSOPHY) */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/40 rounded-2xl flex items-start gap-3">
          <HeartHandshake className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300">
            <div className="font-bold text-sm text-emerald-300">
              Chính sách cam kết: MIỄN PHÍ HOÀN TOÀN CHO TẤT CẢ MỌI NGƯỜI DÙNG
            </div>
            <p className="leading-relaxed">
              <strong>Tất cả mọi người dân, cá nhân và hộ gia đình</strong> đều được sử dụng <strong>hoàn toàn miễn phí</strong> toàn bộ các công cụ phòng thủ thiết yếu: Kiểm tra biên lai đơn lẻ, phân tích tin nhắn đe dọa/dụ dỗ, quét đường link độc hại, tra cứu số điện thoại nghi vấn và tài khoản rác. Không bao giờ thu phí an toàn dân sự!
            </p>
          </div>
        </div>

        {/* ACTIVE LICENSE STATUS CARD */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                TRẠNG THÁI TÀI KHOẢN HIỆN TẠI
              </span>
            </div>
            <div className="flex items-center gap-2">
              {account.license ? (
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>BẢN CHUYÊN SÂU ({account.license.tierName})</span>
                </span>
              ) : (
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BẢN MIỄN PHÍ TOÀN DÂN (0Đ)</span>
                </span>
              )}
            </div>
          </div>

          {account.license ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">MÃ BẢN QUYỀN (KEY):</span>
                <strong className="text-amber-300 font-bold text-sm tracking-wide">
                  {account.license.key}
                </strong>
                <p className="text-[11px] text-slate-400 pt-0.5">{account.license.tierName}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">THỜI HẠN SỬ DỤNG:</span>
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Còn {account.license.daysRemaining} ngày</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-0.5">Hết hạn: {account.license.expiresAt}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">THIẾT BỊ LIÊN KẾT:</span>
                <div className="flex items-center gap-1.5 text-white font-bold truncate">
                  <Laptop className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span className="truncate">{account.license.deviceLinked}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-400">1/1 Thiết bị</span>
                  <button
                    onClick={() => {
                      deactivateLicense();
                      onNotify('Đã gỡ giấy phép bản quyền khỏi thiết bị!');
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hủy liên kết</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                Bạn đang sử dụng <strong>Bản Đại Chúng Miễn Phí</strong>. Toàn bộ tính năng phòng vệ dân sự đang hoạt động đầy đủ mà không cần trả tiền.
              </div>
              <button
                onClick={() => handleQuickKey('VERA-PRO-2026-CYBER')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Kích Hoạt Thử Bản PRO (Điều Tra Sâu)</span>
              </button>
            </div>
          )}
        </div>

        {/* REDEEM FORM */}
        <form onSubmit={handleActivate} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
              <span>🔑 NHẬP MÃ GIẤY PHÉP BẢN QUYỀN (REDEEM LICENSE KEY):</span>
            </label>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Mã thử nghiệm dành cho Chuyên gia:</span>
              <button
                type="button"
                onClick={() => handleQuickKey('VERA-PRO-2026-CYBER')}
                className="text-amber-400 hover:underline font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
              >
                VERA-PRO-2026-CYBER
              </button>
              <button
                type="button"
                onClick={() => handleQuickKey('VERA-ENT-2026-VIP')}
                className="text-cyan-400 hover:underline font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
              >
                VERA-ENT-2026-VIP
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Nhập mã bản quyền (ví dụ: VERA-PRO-2026-CYBER)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 uppercase"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Kích Hoạt Ngay</span>
            </button>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/40 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </form>

        {/* 2 TIERS EXPLANATION: FREE CHO TẤT CẢ MỌI NGƯỜI vs TRẢ PHÍ KHI CẦN CHUYÊN SÂU (PRO) */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
            PHÂN TÍCH MINH BẠCH: BẢN NÀO DÀNH CHO BẠN?
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* TIER 1: FREE CHO TẤT CẢ MỌI NGƯỜI */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-base text-white">BẢN MIỄN PHÍ TOÀN DÂN</h5>
                    </div>
                    <p className="text-xs text-emerald-400 font-bold">Mọi cá nhân, học sinh, sinh viên, người cao tuổi & gia đình</p>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                    0 Đ TRỌN ĐỜI
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>MIỄN PHÍ 100% CHO TẤT CẢ:</strong> Bất kể bạn là ai, bạn không cần phải trả bất kỳ khoản phí nào để bảo vệ bản thân và gia đình trước các cạm bẫy lừa đảo hằng ngày.
                </p>

                <div className="space-y-2 text-xs text-slate-200 pt-1">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Kiểm tra tin nhắn & cuộc gọi:</strong> Nhận diện bẫy thao túng tâm lý, giả danh Công an/Tòa án dọa bắt giam, bẫy việc làm TikTok, nạp tiền game ảo.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Soi biên lai chuyển khoản đơn lẻ:</strong> Phát hiện dấu vết cắt ghép phông chữ, lệch thời gian và số dư giả định.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Kiểm tra đường link & tệp lạ:</strong> Cảnh báo web cờ bạc, giả mạo cổng dịch vụ công hoặc tệp độc hại chiếm quyền máy.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Tra cứu số điện thoại & STK:</strong> Đối chiếu cảnh báo số điện thoại bom hàng, tài khoản rác bị cộng đồng phản ánh.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => switchTierDirectly('free')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  account.tier === 'free'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {account.tier === 'free' ? '✓ ĐANG SỬ DỤNG BẢN MIỄN PHÍ' : 'Sử Dụng Bản Miễn Phí'}
              </button>
            </div>

            {/* TIER 2: PRO - CHỈ DÀNH CHO NHU CẦU CHUYÊN SÂU */}
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-xl shadow-amber-500/10">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-base text-white">BẢN CHUYÊN SÂU (PRO)</h5>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                        CHUYÊN NGHIỆP
                      </span>
                    </div>
                    <p className="text-xs text-amber-300 font-bold">Chủ shop TMĐT • Kế toán doanh nghiệp • Chuyên gia & Tố tụng</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-400 font-mono">49.000 đ</div>
                    <div className="text-[10px] text-slate-400">/ tháng (hoặc 499k/năm)</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>CHỈ TRẢ TIỀN KHI CẦN CHUYÊN SÂU:</strong> Dành riêng cho doanh nghiệp cần xử lý số lượng lớn hoặc người cần công cụ phân tích kỹ thuật sâu và bảo toàn chứng cứ số.
                </p>

                <div className="space-y-2 text-xs text-slate-200 pt-1">
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Mẫu Hồ Sơ Tố Giác & Mã Băm SHA-256:</strong> Tự động tổng hợp hồ sơ tham khảo theo Bộ luật Tố tụng Hình sự kèm mã băm niêm phong vật chứng số để trình báo cơ quan công an.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Phân Tích Kỹ Thuật Mã Độc APK:</strong> Dò tìm máy chủ điều khiển C2 của ứng dụng độc hại, bóc tách chữ ký tệp nhị phân Dex/So.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Xử Lý Hàng Loạt Cho Doanh Nghiệp:</strong> Quét tự động hàng trăm hóa đơn/biên lai chuyển khoản mỗi ngày, xuất báo cáo đối soát kế toán.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Hạn Mức Cao & Hỗ Trợ Kỹ Thuật 24/7:</strong> Không giới hạn lượt tra cứu chuyên sâu phục vụ công việc kinh doanh và điều tra rủi ro.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => switchTierDirectly('pro')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {account.tier === 'pro' ? '✓ ĐANG KÍCH HOẠT GÓI PRO' : 'Kích Hoạt Gói Chuyên Sâu'}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
