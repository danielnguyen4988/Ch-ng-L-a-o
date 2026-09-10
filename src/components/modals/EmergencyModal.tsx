import React from 'react';
import { PhoneCall, XCircle, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-red-500/60 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">ĐƯỜNG DÂY NÓNG CẤP CỨU & 15 PHÚT VÀNG</h3>
              <p className="text-xs text-slate-400">Các đầu số tiếp nhận phản ánh & hỗ trợ phong tỏa khẩn cấp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {/* HOTLINE 156 */}
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider block font-mono">
                TỔNG ĐÀI QUỐC GIA TIẾP NHẬN CUỘC GỌI & TIN NHẮN RÁC / LỪA ĐẢO
              </span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                156 <span className="text-xs font-normal text-slate-400">(Miễn cước toàn quốc)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Gửi tin nhắn phản ánh: Soạn cú pháp <strong>V [Số điện thoại rác] [Nội dung lừa đảo]</strong> gửi <strong>156</strong>.
              </p>
            </div>
            <a
              href="tel:156"
              className="bg-red-600 hover:bg-red-500 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer shadow-lg shadow-red-600/30"
            >
              <PhoneCall className="w-4 h-4" />
              <span>GỌI 156 NGAY</span>
            </a>
          </div>

          {/* HOTLINE A05 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block font-mono">
                CỤC AN NINH MẠNG VÀ PHÒNG CHỐNG TỘI PHẠM CÔNG NGHỆ CAO (A05 - BỘ CÔNG AN)
              </span>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                069.234.8560
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tiếp nhận hồ sơ tố giác tội phạm lừa đảo công nghệ cao có tổ chức và xuyên quốc gia.
              </p>
            </div>
            <a
              href="tel:0692348560"
              className="bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>GỌI A05</span>
            </a>
          </div>

          {/* 15 MINUTE GOLDEN WINDOW */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>QUY TRÌNH 15 PHÚT VÀNG KHI ĐÃ LỠ CHUYỂN TIỀN:</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-1.5 pl-4 list-decimal leading-relaxed">
              <li>
                <strong>Gọi ngay Hotline Ngân hàng của bạn:</strong> Yêu cầu điện thoại viên khóa tài khoản và liên hệ ngân hàng nhận để phong tỏa tài khoản người thụ hưởng khẩn cấp.
              </li>
              <li>
                <strong>Bật chế độ máy bay:</strong> Nếu bạn vừa cài tệp .APK lạ, hãy kích hoạt Chế độ máy bay ngay lập tức để ngắt kết nối với máy chủ C2 của kẻ gian.
              </li>
              <li>
                <strong>Chụp màn hình toàn bộ tin nhắn & lịch sử giao dịch:</strong> Lưu lại làm chứng cứ để nộp cơ quan Công an phường/xã.
              </li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
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
