import React from 'react';
import {
  Scale,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  ExternalLink,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">
                ĐIỀU KHOẢN SỬ DỤNG & MIỄN TRỪ TRÁCH NHIỆM PHÁP LÝ
              </h3>
              <p className="text-xs text-slate-400">
                Tuân thủ Pháp luật Việt Nam • Nghị định 13/2023/NĐ-CP • Luật An toàn thông tin mạng
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

        {/* CORE NOTICE BANNER */}
        <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300">
            <div className="font-bold text-sm text-amber-300">
              THÔNG CÁO QUAN TRỌNG VỀ TÍNH ĐỘC LẬP & TƯ CÁCH PHÁP NHÂN
            </div>
            <p className="leading-relaxed">
              VeraFense là nền tảng công nghệ <strong>độc lập</strong> được phát triển nhằm hỗ trợ cộng đồng nhận diện các nguy cơ và dấu hiệu lừa đảo trên không gian mạng. Ứng dụng <strong>không đại diện</strong> và <strong>không mạo nhận</strong> là cơ quan công quyền, Bộ Công An hay bất kỳ Ngân hàng thương mại nào.
            </p>
          </div>
        </div>

        {/* DETAILED LEGAL SECTIONS */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* SECTION 1: PHẠM VI ÁP DỤNG & CHÍNH SÁCH MIỄN PHÍ TOÀN DÂN */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>1. CHÍNH SÁCH DỊCH VỤ: MIỄN PHÍ CHO TẤT CẢ MỌI NGƯỜI & BẢN CHUYÊN SÂU</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              - <strong>Miễn phí cho tất cả mọi người dùng:</strong> Toàn bộ các tính năng bảo vệ an toàn thường nhật (kiểm tra tin nhắn nghi vấn, soi biên lai đơn lẻ, tra cứu số điện thoại/tài khoản khả nghi, tra cứu link web) đều được cung cấp <strong>hoàn toàn miễn phí</strong> cho mọi cá nhân và hộ gia đình mà không giới hạn đối tượng.
              <br />
              - <strong>Bản trả phí chuyên sâu (PRO/Doanh nghiệp):</strong> Chỉ áp dụng khi người dùng có nhu cầu nâng cao như: xử lý dữ liệu hàng loạt cho hoạt động kinh doanh/thương mại, phân tích chuyên sâu tệp mã độc, hoặc trích xuất biểu mẫu hồ sơ tố tụng kèm mã băm bảo toàn vật chứng điện tử.
            </p>
          </div>

          {/* SECTION 2: MIỄN TRỪ TRÁCH NHIỆM KẾT QUẢ THUẬT TOÁN */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Info className="w-4 h-4 text-amber-400" />
              <span>2. TÍNH CHẤT THAM KHẢO CỦA KẾT QUẢ PHÂN TÍCH (DISCLAIMER)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              - Kết quả từ các thuật toán (như soi vết ghép ảnh, phân tích ngữ nghĩa tin nhắn, phát hiện mã độc, đối soát số tài khoản) mang <strong>tính chất cảnh báo kỹ thuật và tham khảo hữu ích</strong>, không phải là kết luận giám định tư pháp theo quy định của Luật Giám định tư pháp.
              <br />
              - Người dùng tự chịu trách nhiệm về quyết định tài chính của mình. VeraFense không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc người dùng hoàn toàn dựa vào kết quả phân tích mà không kiểm tra số dư thực tế qua ngân hàng chính thức hoặc liên hệ cơ quan có thẩm quyền.
            </p>
          </div>

          {/* SECTION 3: BẢO VỆ DỮ LIỆU CÁ NHÂN (NĐ 13/2023/NĐ-CP) */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>3. BẢO MẬT & BẢO VỆ DỮ LIỆU CÁ NHÂN (NGHỊ ĐỊNH 13/2023/NĐ-CP)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              - VeraFense tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân theo Nghị định số 13/2023/NĐ-CP của Chính phủ.
              <br />
              - Các thao tác xử lý ảnh biên lai hoặc phân tích tin nhắn đều được ưu tiên thực hiện trực tiếp trên trình duyệt thiết bị (Client-Side). Hệ thống <strong>không lưu trữ</strong> thông tin thẻ ngân hàng, mật khẩu, mã OTP hay các thông tin định danh nhạy cảm của người dùng.
              <br />
              - Các thông tin tố giác do người dùng tự nguyện đóng góp sẽ được khử định danh (anonymized) trước khi đối soát nhằm phục vụ lợi ích chung của cộng đồng.
            </p>
          </div>

          {/* SECTION 4: BẢN QUYỀN & NHÃN HIỆU THƯƠNG MẠI */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>4. SỞ HỮU TRÍ TUỆ & NHÃN HIỆU CỦA BÊN THỨ BA (FAIR USE)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              - Tên gọi của các Ngân hàng thương mại (như Vietcombank, Techcombank, MB Bank, v.v.) và các cổng dịch vụ được nhắc đến trong ứng dụng chỉ nhằm mục đích mô tả khách quan và hướng dẫn kỹ thuật tra cứu (nguyên tắc Fair Use trong Luật Sở hữu trí tuệ).
              <br />
              - VeraFense không sở hữu và không tuyên bố quyền sở hữu đối với các nhãn hiệu này, đồng thời không ngụ ý bất kỳ mối quan hệ tài trợ hoặc chứng thực chính thức nào trừ khi có thông báo bằng văn bản.
            </p>
          </div>

          {/* SECTION 5: TRÁCH NHIỆM NGƯỜI DÙNG & CHỐNG LẠM DỤNG */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <Scale className="w-4 h-4 text-rose-400" />
              <span>5. QUY TẮC SỬ DỤNG HỢP PHÁP CỦA NGƯỜI DÙNG</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              - Người dùng cam kết <strong>không sử dụng</strong> các công cụ của ứng dụng vào mục đích vu khống, bôi nhọ danh dự người khác, phát tán thông tin giả mạo hoặc vi phạm pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam (theo Điều 156 Bộ luật Hình sự và Điều 101 Nghị định 15/2020/NĐ-CP).
              <br />
              - Khi phát hiện hành vi phạm tội thực tế, người dùng cần lập tức báo cáo cho Cơ quan Công an nơi gần nhất hoặc qua đường dây nóng quốc gia <strong>156</strong> hoặc <strong>069.234.3640</strong> (Cục An ninh mạng A05).
            </p>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Được cập nhật và rà soát định kỳ theo quy chuẩn pháp lý hiện hành</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer transition-all shadow-md"
          >
            Tôi Đã Đọc &amp; Đồng Ý Điều Khoản
          </button>
        </div>
      </div>
    </div>
  );
};
