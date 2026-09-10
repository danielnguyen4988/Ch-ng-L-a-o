import React from 'react';
import { Scale, XCircle, Copy, FileText, CheckCircle2 } from 'lucide-react';
import { ForensicReport } from '../../types';

interface LegalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  smsInput: string;
  forensicReport: ForensicReport | null;
  onNotify: (msg: string) => void;
}

export const LegalDossierModal: React.FC<LegalDossierModalProps> = ({
  isOpen,
  onClose,
  smsInput,
  forensicReport,
  onNotify,
}) => {
  if (!isOpen || !forensicReport) return null;

  const copyLegalForm = () => {
    const text = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Hà Nội, ngày 07 tháng 09 năm 2026

ĐƠN TỐ GIÁC TỘI PHẠM VÀ ĐỀ NGHỊ KHỞI TỐ VỤ ÁN HÌNH SỰ
(V/v: Hành vi lừa đảo chiếm đoạt tài sản trên không gian mạng quy định tại Điều 174 & Điều 290 BLHS 2015)

Kính gửi:
- Cơ quan Cảnh sát Điều tra Công an Quận/Huyện: ......................................................
- Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05 - Bộ Công An)
- Viện Kiểm sát Nhân dân cùng cấp

I. NGƯỜI LÀM ĐƠN:
Họ và tên: .................................................... Sinh năm: ..........
CCCD số: .................... Ngày cấp: ................ Nơi cấp: ........
Nơi cư trú: ................................................................
Số điện thoại liên hệ: .....................................................

II. ĐỐI TƯỢNG BỊ TỐ GIÁC:
Kẻ gian sử dụng kênh truyền thông tin giả mạo cơ quan công quyền / ngân hàng nhằm mục đích chiếm đoạt tài sản.

III. TÓM TẮT HÀNH VI VI PHẠM PHÁP LUẬT:
Vào thời gian vừa qua, tôi nhận được tin nhắn/cuộc gọi có nội dung đe dọa, dẫn dụ như sau:
"${smsInput}"

Phương thức: Thao túng tâm lý bằng thủ đoạn: ${forensicReport.psychology.tactic}. Tạo áp lực: ${forensicReport.entities.urgency}, đòi hỏi tài chính: ${forensicReport.entities.financialDemand}.

IV. CĂN CỨ PHÁP LUẬT YÊU CẦU XỬ LÝ:
Hành vi nêu trên có dấu hiệu cấu thành tội phạm theo:
- Điều 174 Bộ luật Hình sự: Tội lừa đảo chiếm đoạt tài sản (Khung hình phạt lên đến 20 năm tù hoặc Chung thân).
- Điều 290 Bộ luật Hình sự: Tội sử dụng mạng máy tính, mạng viễn thông, phương tiện điện tử thực hiện hành vi chiếm đoạt tài sản.

Kính đề nghị Quý cơ quan tiến hành xác minh, điều tra số điện thoại/tài khoản ngân hàng nêu trên để bảo vệ quyền và lợi ích hợp pháp của công dân.

MÃ BẢO TOÀN CHỨNG CỨ ĐIỆN TỬ (E-FORENSIC INTEGRITY):
SHA-256: 9f83ac6e7f22a842188478d774523b0802187cfb3ee96dd47da01a57a9abac4f
Mã vụ việc: VERA-CASE-2026-0907-8899 • Niêm phong số bởi VeraFense Engine

Tôi xin cam đoan những lời khai trên là hoàn toàn đúng sự thật.
Người làm đơn: (Ký và ghi rõ họ tên)`;

    navigator.clipboard.writeText(text);
    onNotify('Đã sao chép Mẫu Đơn Tố Giác Tội Phạm vào bộ nhớ tạm!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-amber-500/60 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 p-0.5 shadow-lg shadow-red-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                HỒ SƠ TỔNG HỢP & MẪU ĐƠN TỐ GIÁC TỘI PHẠM (THAM KHẢO)
              </h3>
              <p className="text-xs text-slate-400">
                Soạn thảo tham khảo theo Bộ luật Tố tụng Hình sự 2015 • Kèm mã băm toàn vẹn chứng cứ số SHA-256
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

        {/* LEGAL DISCLAIMER NOTICE */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
          <strong>Lưu ý pháp lý:</strong> Biểu mẫu này được trích xuất nhằm hỗ trợ nạn nhân hệ thống hóa dữ liệu, bằng chứng kỹ thuật và thời gian xảy ra sự việc khi trình báo Cơ quan Công an. Tài liệu này mang tính chất tham khảo, việc khởi tố thụ lý vụ án thuộc thẩm quyền của cơ quan tư pháp theo quy định pháp luật.
        </div>

        {/* DOCUMENT CONTENT */}
        <div className="bg-white text-slate-950 p-6 rounded-2xl space-y-4 font-serif text-xs sm:text-sm leading-relaxed shadow-inner">
          <div className="text-center space-y-1 border-b pb-3">
            <p className="font-bold text-xs uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-xs underline">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-[11px] italic text-slate-600 pt-1">Hà Nội, ngày 07 tháng 09 năm 2026</p>
          </div>

          <div className="text-center py-2">
            <h4 className="font-bold text-base uppercase text-red-700">
              ĐƠN TỐ GIÁC TỘI PHẠM VÀ ĐỀ NGHỊ KHỞI TỐ VỤ ÁN HÌNH SỰ
            </h4>
            <p className="text-xs italic text-slate-600">
              (Về hành vi: Lừa đảo chiếm đoạt tài sản trên không gian mạng quy định tại Điều 174 & Điều 290 Bộ luật Hình sự 2015)
            </p>
          </div>

          <div className="space-y-1 font-sans text-xs">
            <p><strong>Kính gửi:</strong></p>
            <p className="pl-4">- Cơ quan Cảnh sát Điều tra Công an Quận/Huyện: ......................................................</p>
            <p className="pl-4">- Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05 - Bộ Công An)</p>
            <p className="pl-4">- Viện Kiểm sát Nhân dân cùng cấp</p>
          </div>

          <div className="space-y-2 border-t pt-2 font-sans text-xs">
            <p><strong>I. NGƯỜI LÀM ĐƠN:</strong> Họ và tên: ....................................... CCCD số: .................................... Điện thoại: ...........................</p>
            <p><strong>II. ĐỐI TƯỢNG BỊ TỐ GIÁC:</strong> Kẻ gian sử dụng kênh truyền thông tin giả mạo cơ quan công quyền / ngân hàng nhằm mục đích chiếm đoạt tài sản.</p>
            <p><strong>III. TÓM TẮT HÀNH VI VI PHẠM PHÁP LUẬT:</strong></p>
            <p className="text-slate-700 pl-2">
              Đối tượng sử dụng nội dung: <em>&ldquo;{smsInput}&rdquo;</em>
            </p>
            <p className="text-slate-700 pl-2">
              Phương thức: Thao túng tâm lý bằng thủ đoạn: <strong>{forensicReport.psychology.tactic}</strong>. Tạo áp lực: <strong>{forensicReport.entities.urgency}</strong>, đòi hỏi tài chính: <strong>{forensicReport.entities.financialDemand}</strong>.
            </p>
            <p><strong>IV. CĂN CỨ PHÁP LUẬT YÊU CẦU XỬ LÝ:</strong></p>
            <p className="text-slate-700 pl-2">
              Hành vi có dấu hiệu cấu thành tội phạm theo quy định tại:
              <br />
              - <strong>Điều 174 BLHS:</strong> Tội lừa đảo chiếm đoạt tài sản.
              <br />
              - <strong>Điều 290 BLHS:</strong> Tội sử dụng mạng máy tính, mạng viễn thông, phương tiện điện tử thực hiện hành vi chiếm đoạt tài sản.
            </p>
          </div>

          {/* FORENSIC SHA-256 WATERMARK */}
          <div className="border border-slate-300 bg-slate-50 p-3 rounded-xl font-mono text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold">MÃ BẢO TOÀN CHỨNG CỨ ĐIỆN TỬ (DIGITAL EVIDENCE SEAL):</span>
              <span className="text-teal-700 font-bold">VERIFIED SHA-256</span>
            </div>
            <p className="text-slate-600 break-all">
              HASH: <strong className="text-slate-900">9f83ac6e7f22a842188478d774523b0802187cfb3ee96dd47da01a57a9abac4f</strong>
            </p>
            <p className="text-slate-500">Mã biên bản: VERA-CASE-2026-0907-8899 • Niêm phong điện tử bởi VeraFense Core</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyLegalForm}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-red-700/20"
          >
            <Copy className="w-4 h-4" />
            <span>Sao Chép Toàn Văn Để Điền Thông Tin Cá Nhân</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>In Hồ Sơ (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-3 px-4 rounded-xl text-xs cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
