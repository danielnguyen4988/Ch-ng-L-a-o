import React, { useState, useEffect } from 'react';
import {
  X,
  AlertOctagon,
  ShieldAlert,
  Send,
  CheckCircle2,
  DollarSign,
  Phone,
  Link as LinkIcon,
  CreditCard,
  MessageSquare,
  Users,
  FileCheck,
  Truck,
} from 'lucide-react';
import { FraudTargetType } from '../../types';
import { useIntelligence } from '../../context/IntelligenceContext';
import { useAccount } from '../../context/AccountContext';

interface ReportFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: FraudTargetType;
  defaultValue?: string;
  defaultCategory?: string;
  onNotify: (msg: string) => void;
}

export const ReportFraudModal: React.FC<ReportFraudModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'phone',
  defaultValue = '',
  defaultCategory = '',
  onNotify,
}) => {
  const { submitReport, findIntelligence } = useIntelligence();
  const { account, incrementReportsSubmitted } = useAccount();

  const [targetType, setTargetType] = useState<FraudTargetType>(defaultType);
  const [targetValue, setTargetValue] = useState(defaultValue);
  const [category, setCategory] = useState(defaultCategory || 'Cờ bạc & Cá cược trực tuyến');
  const [lossAmount, setLossAmount] = useState<string>('0');
  const [channel, setChannel] = useState('Zalo');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [reporterName, setReporterName] = useState(account.name || '');
  const [reporterPhone, setReporterPhone] = useState(account.phone || '');
  const [reporterCccd, setReporterCccd] = useState(account.cccd || '');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Check if target already has reports
  const existingIntel = targetValue.trim() ? findIntelligence(targetType, targetValue) : null;

  useEffect(() => {
    if (defaultType) setTargetType(defaultType);
    if (defaultValue) setTargetValue(defaultValue);
    if (defaultCategory) setCategory(defaultCategory);
    setReporterName(account.name || '');
    setReporterPhone(account.phone || '');
    setReporterCccd(account.cccd || '');
  }, [defaultType, defaultValue, defaultCategory, account, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue.trim()) {
      onNotify('Vui lòng nhập mục tiêu bị tố giác!');
      return;
    }
    if (!evidenceDesc.trim()) {
      onNotify('Vui lòng mô tả chi tiết thủ đoạn của đối tượng!');
      return;
    }

    const cleanLoss = parseFloat(lossAmount.replace(/[^0-9]/g, '')) || 0;

    const res = submitReport({
      targetType,
      targetValue: targetValue.trim(),
      category,
      reporterName: reporterName || 'Công dân nặc danh',
      reporterPhone: reporterPhone || 'Không cung cấp',
      reporterCccd,
      lossAmount: cleanLoss,
      channel,
      evidenceDesc: evidenceDesc.trim(),
    });

    incrementReportsSubmitted();

    if (res.isDuplicate) {
      onNotify(
        `Đã gộp tố giác thành công! Mục tiêu này hiện có ${res.totalReportsForTarget} lượt tố giác (Tổng thiệt hại ${res.accumulatedLoss.toLocaleString('vi-VN')} VND).`
      );
    } else {
      onNotify('Đã tạo hồ sơ tố giác mới và kích hoạt giám sát cảnh báo cộng đồng!');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/80 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Tố Giác Gian Lận & Cảnh Báo Cộng Đồng</span>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  BẢO MẬT ĐỊNH DANH
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Thông tin đóng góp sẽ được khử định danh và đối soát với Hệ thống Cảnh báo Rủi ro Cộng đồng
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

        {/* DUPLICATE WARNING BANNER IF TARGET ALREADY REPORTED */}
        {existingIntel && existingIntel.reportsCount > 0 && (
          <div className="bg-amber-950/70 border-b border-amber-500/40 p-3 sm:p-4 flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 space-y-1">
              <p className="font-bold text-amber-300">
                PHÁT HIỆN TỐ GIÁC TRÙNG LẶP: ĐÃ CÓ {existingIntel.reportsCount} NẠN NHÂN TỐ CÁO MỤC TIÊU NÀY!
              </p>
              <p className="text-slate-300">
                Tổng thiệt hại lũy kế ước tính:{' '}
                <strong className="text-amber-300 font-mono">
                  {existingIntel.totalLossReported.toLocaleString('vi-VN')} VND
                </strong>
                . Lời khai của bạn sẽ được gộp vào hồ sơ để tăng trọng số cảnh báo toàn diện!
              </p>
            </div>
          </div>
        )}

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* TARGET TYPE SELECTOR */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">Loại mục tiêu cần tố giác:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('phone')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  targetType === 'phone'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Số Điện Thoại</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('bank')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  targetType === 'bank'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>STK Ngân Hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('link')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  targetType === 'link'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Web / App</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('sms')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  targetType === 'sms'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tin Nhắn / Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('logistics')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all ${
                  targetType === 'logistics'
                    ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Shipper / Bom Hàng</span>
              </button>
            </div>
          </div>

          {/* TARGET VALUE INPUT */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              {targetType === 'phone' && 'Số điện thoại lừa đảo (VD: 0248889922):'}
              {targetType === 'bank' && 'Số tài khoản & Tên Ngân hàng (VD: 102938484 VCB):'}
              {targetType === 'link' && 'Địa chỉ đường link / Tên miền (VD: jun88wl.com):'}
              {targetType === 'sms' && 'Tiêu đề hoặc trích đoạn nội dung tin nhắn lừa đảo:'}
              {targetType === 'logistics' && 'Số điện thoại khách bom hàng / bùng cước / gửi hàng cấm:'}
            </label>
            <input
              type="text"
              required
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Nhập thông tin mục tiêu chính xác..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          {/* CATEGORY & CHANNEL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Thủ đoạn / Hành vi gian lận:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
              >
                <optgroup label="Thương mại điện tử & Vận tải">
                  <option value="Bom hàng thương mại điện tử (Shopee, TikTok Shop, Lazada)">Bom hàng chuyên nghiệp (TikTok / Shopee / Lazada)</option>
                  <option value="Khách bùng cước xe ôm công nghệ (Grab, Be, Xanh SM)">Khách bùng cước xe ôm công nghệ / quỵt tiền cuốc xe</option>
                  <option value="Bẫy lợi dụng shipper vận chuyển hàng cấm / ma túy">BẪY LỢI DỤNG SHIPPER VẬN CHUYỂN HÀNG CẤM (Điều 250 BLHS)</option>
                  <option value="Bẫy lừa ứng tiền COD khống bưu kiện ảo">Bẫy lừa shipper ứng tiền COD khống bưu kiện ảo</option>
                  <option value="Bom đơn đồ ăn / nước uống số lượng lớn">Bom đơn đồ ăn / thức uống GrabFood / ShopeeFood</option>
                </optgroup>
                <optgroup label="Tội phạm không gian mạng">
                  <option value="Cờ bạc & Cá cược trực tuyến trái phép">Cờ bạc & Cá cược trực tuyến trái phép (Jun88, New88...)</option>
                  <option value="Giả danh Công an / Tòa án dọa bắt giam">Giả danh Công an / Tòa án dọa bắt giam (Tống tiền)</option>
                  <option value="Bẫy tình cảm đầu tư tài chính / BĐS (Pig Butchering)">Bẫy tình cảm kết bạn rủ đầu tư (Mổ Heo / Pig Butchering)</option>
                  <option value="Bẫy làm nhiệm vụ CTV Shopee / TikTok">Bẫy làm nhiệm vụ CTV Shopee / TikTok (Ponzi)</option>
                  <option value="Giả mạo Ngân hàng đánh cắp OTP">Giả mạo Ngân hàng đánh cắp OTP (Phishing)</option>
                  <option value="Mã độc APK giả Dịch vụ công chiếm quyền">Mã độc APK giả Dịch vụ công chiếm quyền điện thoại</option>
                  <option value="Lừa đảo nạp thẻ game / Quà tặng ảo">Lừa đảo nạp thẻ game / Quà tặng ảo học sinh</option>
                  <option value="Lừa cước viễn thông quốc tế vệ tinh">Lừa cước viễn thông quốc tế vệ tinh (+882...)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Kênh tiếp cận / Nền tảng:</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
              >
                <option value="Cuộc gọi trực tiếp">Cuộc gọi thoại trực tiếp</option>
                <option value="Ứng dụng đặt xe (Grab / Be / Xanh SM)">Ứng dụng gọi xe (Grab / Be / Xanh SM)</option>
                <option value="Ứng dụng giao hàng (Ahamove / Lalamove / GHTK / GHN)">Ứng dụng giao hàng (Ahamove / Lalamove / GHTK...)</option>
                <option value="Sàn TMĐT (Shopee / TikTok Shop / Lazada)">Sàn TMĐT (Shopee / TikTok Shop / Lazada)</option>
                <option value="Zalo">Zalo cá nhân / Nhóm Zalo</option>
                <option value="Telegram">Telegram (Nhóm ẩn danh / Bot)</option>
                <option value="Facebook / Messenger">Facebook / Messenger</option>
                <option value="Tin nhắn SMS Brandname giả">Tin nhắn SMS (Mạo danh trạm BTS)</option>
                <option value="TikTok">TikTok / Video ngắn</option>
                <option value="Khác">Kênh khác</option>
              </select>
            </div>
          </div>

          {/* LOSS AMOUNT */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Số tiền bị chiếm đoạt hoặc phát sinh (VNĐ): <span className="text-slate-500 font-normal">(Nếu chưa mất tiền, ghi 0đ)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={lossAmount}
                onChange={(e) => setLossAmount(e.target.value)}
                placeholder="Ví dụ: 20000000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-red-500"
              />
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* EVIDENCE DESCRIPTION */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Mô tả chi tiết kịch bản & thủ đoạn của kẻ gian: <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={evidenceDesc}
              onChange={(e) => setEvidenceDesc(e.target.value)}
              placeholder="Kẻ gian tiếp cận bằng cách nào? Nói những gì? Ép chuyển khoản hay gửi link gì?..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* REPORTER INFO (AUTO-FILLED FROM ACCOUNT) */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                Thông tin người tố giác (Bảo mật tuyệt đối):
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">Đã liên kết tài khoản</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Họ và tên"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                value={reporterCccd}
                onChange={(e) => setReporterCccd(e.target.value)}
                placeholder="Số CCCD (Xác thực)"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* TERMS CHECKBOX */}
          <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 focus:ring-0 cursor-pointer"
            />
            <span>
              Tôi cam kết các thông tin tố giác trên là đúng sự thật và chịu trách nhiệm trước pháp luật về tính chính xác của tài liệu cung cấp.
            </span>
          </label>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold transition-all cursor-pointer text-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!agreedTerms}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Đơn Tố Giác Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
