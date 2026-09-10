import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Crown,
  Wallet,
  CheckCircle2,
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Copy,
  Clock,
  Building2,
} from 'lucide-react';
import { useAccount } from '../../context/AccountContext';

interface TopUpPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const TopUpPaymentModal: React.FC<TopUpPaymentModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const { account, topUpWallet, purchasePlan } = useAccount();
  const [activeSubTab, setActiveSubTab] = useState<'packages' | 'topup'>('packages');

  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: number;
    days: number;
    tier: 'pro' | 'enterprise';
    desc: string;
    popular?: boolean;
  }>({
    id: 'pro_year',
    name: 'Gói PRO Chuyên Sâu (1 Năm)',
    price: 199000,
    days: 365,
    tier: 'pro',
    desc: 'Không giới hạn lượt phân tích chuyên sâu, trích xuất hồ sơ tố giác kèm mã băm SHA-256',
    popular: true,
  });

  const [topUpAmount, setTopUpAmount] = useState<number>(100000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'pro_month',
      name: 'Gói PRO Chuyên Sâu (1 Tháng)',
      price: 49000,
      days: 30,
      tier: 'pro' as const,
      desc: 'Dành cho người cần phân tích kỹ thuật sâu tệp APK hoặc xuất hồ sơ bằng chứng số tham khảo tố giác',
    },
    {
      id: 'pro_year',
      name: 'Gói PRO Chuyên Sâu (1 Năm)',
      price: 199000,
      days: 365,
      tier: 'pro' as const,
      desc: 'Bảo vệ nâng cao 365 ngày, trích xuất hồ sơ kỹ thuật số kèm mã băm SHA-256 bảo toàn vật chứng',
      popular: true,
    },
    {
      id: 'shop_half_year',
      name: 'Gói Chủ Shop & Bán Hàng Online (6 Tháng)',
      price: 149000,
      days: 180,
      tier: 'pro' as const,
      desc: 'Quét biên lai chuyển khoản nhanh chóng, cảnh báo số điện thoại bom hàng & đối soát đơn',
    },
    {
      id: 'ent_year',
      name: 'Gói Doanh Nghiệp & Xử Lý Hàng Loạt (1 Năm)',
      price: 499000,
      days: 365,
      tier: 'enterprise' as const,
      desc: 'Soi biên lai chuyển khoản hàng loạt tự động, xuất báo cáo đối soát kế toán, hỗ trợ chuyên gia 24/7',
    },
  ];

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidSuccess(true);

      if (activeSubTab === 'packages') {
        const res = purchasePlan(
          selectedPlan.id,
          selectedPlan.name,
          selectedPlan.days,
          selectedPlan.price,
          selectedPlan.tier
        );
        onNotify(res.message);
      } else {
        const res = topUpWallet(topUpAmount);
        onNotify(res.message);
      }

      setTimeout(() => {
        setIsPaidSuccess(false);
        onClose();
      }, 2000);
    }, 1800);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onNotify(`Đã sao chép ${label} vào bộ nhớ tạm!`);
  };

  const paymentAmount = activeSubTab === 'packages' ? selectedPlan.price : topUpAmount;
  const transferContent = `VERA ${account.phone.replace(/[^0-9]/g, '') || account.id} ${
    activeSubTab === 'packages' ? selectedPlan.id.toUpperCase() : 'TOPUP'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Nâng Cấp Gói Cước & Nạp Tiền Ví Thẩm Định
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                  VietQR 24/7
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mở khóa không giới hạn lượt soi biên lai, bóc tách mã độc APK và đối soát Napas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB TABS */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-2">
          <button
            onClick={() => setActiveSubTab('packages')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'packages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Chọn Gói Bản Quyền (Tiết Kiệm Nhất)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('topup')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'topup'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Nạp Tiền Vào Ví Thẩm Định</span>
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* CURRENT STATUS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Tài khoản:</span>
              <span className="font-bold text-white">{account.name}</span>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded font-mono">
                {account.phone}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Số dư ví:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {(account.walletBalance || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Hạng:</span>
                <span className="font-bold text-amber-300 uppercase">{account.tier}</span>
              </div>
            </div>
          </div>

          {activeSubTab === 'packages' ? (
            /* PACKAGES SELECTION */
            <div className="space-y-4">
              {/* CLEAR POLICY BANNER */}
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start sm:items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">
                  <strong>Thông báo:</strong> Các công cụ kiểm tra thông thường (soi biên lai, kiểm tra tin nhắn lừa đảo, quét link/SĐT) luôn <strong>MIỄN PHÍ 100% CHO TẤT CẢ MỌI NGƯỜI</strong>. Gói trả phí chỉ dành riêng cho ai cần tính năng <strong>Chuyên Sâu Hơn</strong> (xử lý hàng loạt cho shop/doanh nghiệp, bóc tách mã độc tầng cao, xuất hồ sơ bằng chứng số).
                </span>
              </div>

              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Lựa Chọn Gói Phù Hợp Cho Bạn:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((p) => {
                  const isSelected = selectedPlan.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                          KHUYÊN DÙNG • TIẾT KIỆM 65%
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-white">{p.name}</h4>
                          <span className="font-mono font-black text-amber-400 text-base">
                            {p.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-teal-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          Không giới hạn lượt soi
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TOP-UP AMOUNT SELECTION */
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Chọn Mệnh Giá Nạp Tiền Vào Ví:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[50000, 100000, 200000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      topUpAmount === amt
                        ? 'bg-teal-500/20 border-teal-500 text-white font-bold ring-1 ring-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-sm block">{amt.toLocaleString('vi-VN')} đ</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIETQR PAYMENT CARD */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs">
                  MB
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Ngân hàng TMCP Quân Đội (MB Bank)</div>
                  <div className="text-xs text-slate-400">Cổng thanh toán liên ngân hàng Napas 247</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Số tiền thanh toán:</span>
                <span className="text-xl font-mono font-black text-emerald-400">
                  {paymentAmount.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>

            {/* QR CODE DISPLAY & BANK DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* MOCK VIETQR CODE */}
              <div className="sm:col-span-5 flex flex-col items-center bg-white p-3 rounded-xl shadow-md">
                <div className="w-40 h-40 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-teal-500/60">
                  <QrCode className="w-28 h-28 text-teal-400" />
                  <span className="text-[9px] font-mono text-white bg-teal-950/80 px-2 py-0.5 rounded mt-1">
                    VIETQR • NAPAS 247
                  </span>
                </div>
                <span className="text-[10px] text-slate-800 font-bold mt-2 text-center">
                  Quét bằng App Ngân hàng bất kỳ để thanh toán tức thì
                </span>
              </div>

              {/* DETAILS TO COPY */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủ tài khoản:</span>
                    <span className="font-bold text-white">CONG TY TNHH AN NINH MANG VERAFENSE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số tài khoản MB Bank:</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">03888992288</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('03888992288', 'Số tài khoản')}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nội dung chuyển khoản (bắt buộc):</span>
                    <span className="font-mono font-bold text-teal-300 text-xs">{transferContent}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(transferContent, 'Nội dung chuyển khoản')}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CONFIRM BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing || isPaidSuccess}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                isPaidSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối đối soát Napas 247...</span>
                </>
              ) : isPaidSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Thanh Toán Thành Công! Đang kích hoạt...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Tôi Đã Chuyển Khoản • Xác Nhận Kích Hoạt Tức Thì</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Giao dịch được bảo hộ bởi ngân hàng TMCP Quân Đội MB Bank & Cổng Napas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
