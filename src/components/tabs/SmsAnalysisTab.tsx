import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Activity,
  Scale,
  Volume2,
  VolumeX,
  Share2,
  FileText,
  Copy,
  Crown,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Flag,
  Sparkles,
  ClipboardPaste,
  OctagonAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PersonaMode, ForensicReport, EvidenceSignal } from '../../types';
import { useAccount } from '../../context/AccountContext';
import { analyzeSms } from '../../services/analyzeSms';

interface SmsAnalysisTabProps {
  persona: PersonaMode;
  onOpenLegalDossier: () => void;
  onOpenLicense: () => void;
  onOpenReport?: (type: 'sms', value: string, category: string) => void;
  smsInput: string;
  setSmsInput: (s: string) => void;
  forensicReport: ForensicReport | null;
  setForensicReport: (r: ForensicReport | null) => void;
  onNotify: (msg: string) => void;
}

export const SmsAnalysisTab: React.FC<SmsAnalysisTabProps> = ({
  persona,
  onOpenLegalDossier,
  onOpenLicense,
  onOpenReport,
  smsInput,
  setSmsInput,
  forensicReport,
  setForensicReport,
  onNotify,
}) => {
  const { isPro, consumeQuota } = useAccount();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setSmsInput(text.trim());
        onNotify('Đã dán tin nhắn từ bộ nhớ tạm!');
        runAnalysis(text.trim());
      } else {
        onNotify('Bộ nhớ tạm đang trống!');
      }
    } catch {
      onNotify('Vui lòng chạm giữ vào ô để dán tin nhắn');
    }
  };

  const runAnalysis = (textToAnalyze?: string) => {
    const text = (textToAnalyze || smsInput).trim();
    if (!text) return;
    
    consumeQuota();
    setSmsInput(text);

    const report = analyzeSms(text);

    if (report) {
      setForensicReport(report);
    }
  };

  useEffect(() => {
    if (!forensicReport) {
      runAnalysis();
    }
  }, []);

  const speakWarning = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ phát âm thanh.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const shareWithParents = () => {
    const isCritical = (forensicReport?.threatScore || 0) >= 70;
    const cleanSnippet = smsInput.trim().substring(0, 120);
    const text = `⚠️ CẢNH BÁO TỪ CON / NGƯỜI THÂN:
Con vừa kiểm tra nội dung này trên hệ thống phòng chống lừa đảo VeraFense:
"${cleanSnippet}${smsInput.length > 120 ? '...' : ''}"

❌ KẾT QUẢ: ${isCritical ? 'LỪA ĐẢO NGUY HIỂM 100%' : forensicReport?.category || 'CẦN CẢNH GIÁC'}
⛔ LỜI DẶN: ${isCritical ? 'Tuyệt đối KHÔNG CHUYỂN TIỀN, KHÔNG BẤM LINK LẠ, DẬP MÁY NGAY. Bố mẹ bình tĩnh gọi lại cho con ngay nhé!' : 'Cần kiểm tra kỹ, không chuyển tiền vội vã.'}`;
    navigator.clipboard.writeText(text);
    onNotify('Đã sao chép lời dặn cảnh báo gửi người thân qua Zalo!');
  };

  return (
    <div className="space-y-6">
      {/* INPUT CARD */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>
                {persona === 'elderly'
                  ? 'Kiểm Tra Tin Nhắn Đe Dọa & Dụ Dỗ'
                  : 'Kiểm Tra Tin Nhắn & Lời Lừa Đảo Nghi Ngờ'}
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded border border-teal-500/30">
                Nhận Diện Nhanh
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {persona === 'elderly'
                ? 'Bác nhận được tin nhắn dọa bắt bớ hoặc rủ rê làm quen? Dán vào đây để kiểm tra ngay!'
                : 'Dán tin nhắn SMS, Zalo, hoặc lời kẻ lạ nói. App sẽ bóc tách chiêu trò lừa tiền và chỉ dẫn cách xử lý an toàn.'}
            </p>
          </div>

          {/* AUDIO BUTTON FOR ELDERLY */}
          {persona === 'elderly' && forensicReport && (
            <button
              onClick={() => speakWarning(forensicReport.elderlySummary)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/40'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'DỪNG ĐỌC' : '🔊 ĐỌC CẢNH BÁO CHO BÁC NGHE'}</span>
            </button>
          )}
        </div>

        {/* PRESET SCENARIO BUTTONS */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 font-medium py-1">Thử nghiệm kịch bản thực tế:</span>
          <button
            onClick={() => {
              const text =
                'Giờ anh rảnh không ạ? Hôm nay em off nếu mà giờ rảnh thì mình gặp cà phê luôn nha được thì anh qua bên Highland tên lửa Bình Tân đi anh em mình cà phê nói chuyện nhé,đi được thì phản hồi giúp e nhé :-*';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>☕</span>
            <span>Hẹn cà phê Bình Tân (Đời thường)</span>
          </button>

          <button
            onClick={() => {
              const text =
                'Chào bạn ạ ,rất vui được làm quen với bạn nhé , mình sn 99, kinh doanh bds bán căn hộ, mình o b tân, mình mong muốn kết bạn để nói chuyện rảnh cf ăn uống xem fim hoặc đi dạo ạ, mình cần ng nghiêm túc trưởng thành lịch thiệp với đàng hoàng và lịch su,nếu hợp thì làm bn ạ,k có nhu cau nam nữ mong bn đọc kĩ ạ mình cam ơn, trên tinh thần bạn bé giao lưu học hỏi ạ bạn có thể giới thiệu về mình, tks bn';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>🎭</span>
            <span>Bẫy Mổ Heo (Làm quen BĐS sn 99)</span>
          </button>

          <button
            onClick={() => {
              const text =
                'Toa an nhan dan TP Ha Noi thong bao: Ong/Ba co lenh bat tam giam tu Vien Kiem Sat vi lien quan duong day rua tien 200 ty. Yeu cau chuyen 50.000.000 VND vao tai khoan tam giu cua Bo Cong An so 102938484 VCB truoc 17h hom nay de phuc vu giam dinh. Tuyet doi giu bi mat khong tiet lo voi gia dinh vi ly do an ninh quoc gia.';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>⚖️</span>
            <span>Dọa Bắt Giam Tòa Án</span>
          </button>

          <button
            onClick={() => {
              const text =
                'Shopee tuyen dung CTV online lam nhiem vu duyet don hang tai nha, thu nhap 300k - 1 trieu/ngay. Yeu cau nạp tien coc 500k de nhan don dau tien, hoan tien va hoa hong 15% sau 10 phut.';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>💼</span>
            <span>CTV Nhiệm Vụ Shopee</span>
          </button>

          <button
            onClick={() => {
              const text =
                'Vietcombank tran trong thong bao: Tai khoan SmartBanking cua Quy khach tam thoi bi khoa do phat hien truy cap la tu nuoc ngoai. Vui long bam vao http://vietcombank-smartbanking.site de xac thuc mo khoa trong 24h.';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>📡</span>
            <span>Trạm BTS Giả 2G (SMS Brandname)</span>
          </button>

          <button
            onClick={() => {
              const text =
                'Anh chuyển trước 9 triệu 9 (9.900.000đ) qua tài khoản này giúp em nhé, lát chuyển tiếp 9.9 triệu nữa cho nhanh đỡ phải quét mặt CCCD sinh trắc học lằng nhằng.';
              runAnalysis(text);
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-pink-300 border border-pink-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1"
          >
            <span>⚡</span>
            <span>Né Sinh Trắc Học (QĐ 2345 9.9tr)</span>
          </button>
        </div>

        {/* TEXT INPUT AREA */}
        <div className="space-y-2 pt-2">
          <textarea
            rows={4}
            value={smsInput}
            onChange={(e) => setSmsInput(e.target.value)}
            placeholder="Dán toàn bộ nội dung tin nhắn SMS, tin nhắn Zalo hoặc đoạn chat nghi ngờ vào đây..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-sans leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500">
              Hệ thống tự động phát hiện chiêu trò lừa đảo, cảnh báo bẫy tiền và chỉ dẫn an toàn ngay lập tức.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 flex items-center gap-2 active:scale-95 shadow-sm"
                title="Dán nhanh nội dung đang sao chép trong điện thoại"
              >
                <ClipboardPaste className="w-4 h-4 text-amber-400" />
                <span>Dán Nhanh</span>
              </button>
              <button
                onClick={() => runAnalysis()}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-teal-600/20 flex items-center gap-2 active:scale-95"
              >
                <Activity className="w-4 h-4" />
                <span>Kiểm Tra Tin Này</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULT CARD */}
      {forensicReport && (
        <div
          className={`bg-slate-950 p-5 sm:p-6 rounded-2xl border-2 ${forensicReport.borderCol} shadow-2xl space-y-5 transition-all duration-300`}
        >
          {/* 1. ĐÈN GIAO THÔNG 3 GIÂY - KẾT LUẬN RÕ RÀNG NGAY LẬP TỨC */}
          {forensicReport.threatScore >= 70 ? (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
                  <OctagonAlert className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-black/40 px-2 py-0.5 rounded-full font-mono font-black text-red-200">
                      ĐÈN ĐỎ NGUY HIỂM
                    </span>
                    <span className="text-xs font-bold text-red-100">Xác suất lừa đảo 99%</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-0.5">
                    LỪA ĐẢO 100% — DẬP MÁY / TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN!
                  </h2>
                  <p className="text-xs text-red-100 mt-1 leading-relaxed">
                    Công an, Viện kiểm sát và Tòa án <strong>không bao giờ gọi điện hay nhắn tin đòi chuyển tiền</strong>. Tuyệt đối không bấm link lạ, không đưa mật khẩu/OTP!
                  </p>
                </div>
              </div>
              <button
                onClick={() => speakWarning(forensicReport.elderlySummary)}
                className="shrink-0 bg-white hover:bg-slate-100 text-red-700 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'DỪNG ĐỌC' : '🔊 ĐỌC TO KHẨN CẤP'}</span>
              </button>
            </div>
          ) : forensicReport.threatScore >= 25 ? (
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-black/10 rounded-2xl shrink-0">
                  <AlertTriangle className="w-8 h-8 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded-full font-mono font-black text-slate-950">
                      ĐÈN VÀNG CẢNH GIÁC
                    </span>
                    <span className="text-xs font-bold text-slate-900">Dấu hiệu mồi chài / Nghi vấn ({forensicReport.threatScore}%)</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    CẢNH GIÁC BẪY DỤ DỖ — HÃY HỎI Ý KIẾN NGƯỜI THÂN!
                  </h2>
                  <p className="text-xs text-slate-900 mt-1 leading-relaxed">
                    Có dấu hiệu kết bạn làm quen mồi chài nạp tiền đầu tư, làm nhiệm vụ online hoặc né tránh sinh trắc học. Tuyệt đối không nạp tiền đặt cọc!
                  </p>
                </div>
              </div>
              <button
                onClick={() => speakWarning(forensicReport.elderlySummary)}
                className="shrink-0 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'DỪNG ĐỌC' : '🔊 ĐỌC TO CẢNH BÁO'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-white/20 rounded-2xl shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-black/30 px-2 py-0.5 rounded-full font-mono font-black text-emerald-200">
                      ĐÈN XANH AN TOÀN
                    </span>
                    <span className="text-xs font-bold text-emerald-100">Tin nhắn đời thường (5%)</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    AN TOÀN — GIAO TIẾP / HẸN GẶP BÌNH THƯỜNG
                  </h2>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Không phát hiện dấu hiệu đe dọa, đòi tiền hay chứa liên kết độc hại. Nếu hẹn gặp người quen ngoài đời hãy chọn nơi công cộng đông người.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LỜI DẶN DỄ HIỂU CHO BÁC LỚN TUỔI & CHIA SẺ ZALO */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border-2 border-amber-500/50 rounded-2xl text-amber-200 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <span>🛡️</span>
                <span>LỜI DẶN DỄ HIỂU CHO GIA ĐÌNH & BÁC LỚN TUỔI:</span>
              </span>
              <button
                onClick={shareWithParents}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia Sẻ Cho Người Thân Qua Zalo</span>
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {forensicReport.elderlySummary}
            </p>
            {forensicReport.youthSummary && (
              <div className="pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-purple-200 flex items-start gap-2">
                <span className="shrink-0 font-bold text-purple-400">Góc cảnh báo học sinh / sinh viên:</span>
                <span className="text-slate-300">{forensicReport.youthSummary}</span>
              </div>
            )}
          </div>

          {/* NÚT TỐ GIÁC */}
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">
              Nhận diện kịch bản: <strong className="text-white font-bold">{forensicReport.category}</strong>
            </span>
            {onOpenReport && (
              <button
                onClick={() => onOpenReport('sms', smsInput.substring(0, 80), forensicReport.category)}
                className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Flag className="w-3.5 h-3.5 text-red-400" />
                <span>Tố Giác Tin Nhắn Này</span>
              </button>
            )}
          </div>

          {/* NÚT MỞ RỘNG: BÓC TÁCH CHI TIẾT & CĂN CỨ ĐIỀU LUẬT */}
          <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs sm:text-sm font-bold text-teal-300 flex items-center justify-between cursor-pointer transition-all"
          >
            <span className="flex items-center gap-2">
              <span>🔬</span>
              <span>{showTechDetails ? 'Thu gọn phân tích chuyên sâu' : 'Bấm để xem bóc tách chi tiết, bằng chứng & điều luật hình sự'}</span>
            </span>
            {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* PHẦN CHI TIẾT CHUYÊN SÂU (ẨN THEO MẶC ĐỊNH ĐỂ NGƯỜI DÙNG KHÔNG BỊ RỐI MẮT) */}
          {showTechDetails && (
            <div className="space-y-5 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
              {/* DẤU HIỆU ĐÁNH GIÁ THỰC TẾ */}
              {forensicReport.evidenceMatrix && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono block">
                    BẢNG DẤU HIỆU ĐÁNH GIÁ THỰC TẾ:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {forensicReport.evidenceMatrix.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3"
                      >
                        {item.status === 'safe' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                        {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                        {item.status === 'danger' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                        <div className="text-xs space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold">{item.label}:</span>
                            <strong
                              className={
                                item.status === 'safe'
                                  ? 'text-emerald-300'
                                  : item.status === 'warning'
                                  ? 'text-amber-300'
                                  : 'text-red-400'
                              }
                            >
                              {item.value}
                            </strong>
                          </div>
                          <p className="text-[11px] text-slate-400">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BÓC TÁCH KỸ THUẬT THAO TÚNG TÂM LÝ */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono block">
                  1. CÁCH KẺ XẤU THAO TÚNG TÂM LÝ ĐỂ DỤ DỖ:
                </span>
                <h4 className="font-bold text-sm text-white">{forensicReport.psychology.tactic}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  {forensicReport.psychology.analysis}
                </p>
              </div>

              {/* ĐÒN TÂM LÝ & YÊU CẦU TIỀN BẠC */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono block">
                  2. CÁC ĐÒN TÂM LÝ &amp; YÊU CẦU TIỀN BẠC:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Tự xưng là ai:</span>
                    <strong className="text-white">{forensicReport.entities.impersonated}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Yêu cầu tài chính:</span>
                    <strong className="text-amber-400">{forensicReport.entities.financialDemand}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Tạo áp lực thời gian:</span>
                    <strong className="text-purple-400">{forensicReport.entities.urgency}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Kênh liên lạc:</span>
                    <strong className="text-teal-400">{forensicReport.entities.channel}</strong>
                  </div>
                </div>
              </div>

              {/* CĂN CỨ BỘ LUẬT HÌNH SỰ & XUẤT MẪU ĐƠN TỐ GIÁC THAM KHẢO */}
              <div className="p-4 bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/40 border border-red-500/40 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono block">
                      3. CĂN CỨ ĐIỀU LUẬT HÌNH SỰ VIỆT NAM (ĐIỀU 174 &amp; 290 BLHS):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line mt-1">
                      {forensicReport.legalCode}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!isPro) {
                        onOpenLicense();
                      } else {
                        onOpenLegalDossier();
                      }
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 flex-shrink-0 transition-all active:scale-95"
                  >
                    {isPro ? <FileText className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                    <span>{isPro ? '🏛️ XUẤT MẪU ĐƠN TỐ GIÁC (THAM KHẢO)' : '💎 XUẤT MẪU ĐƠN TỐ GIÁC (PRO)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
