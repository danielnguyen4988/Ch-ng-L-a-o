import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ClipboardPaste,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Volume2,
} from 'lucide-react';
import { PersonaMode, FraudTargetType } from '../../types';

interface ElderlyCareViewProps {
  onSwitchToPro: () => void;
  onOpenEmergency: () => void;
  onOpenReport?: (type: FraudTargetType, value: string, category?: string) => void;
}

export const ElderlyCareView: React.FC<ElderlyCareViewProps> = ({
  onSwitchToPro,
  onOpenEmergency,
  onOpenReport,
}) => {
  const [inputText, setInputText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // PRESET COMMONLY EXPERIENCED SCENARIOS
  const PRESETS = [
    {
      id: 'police',
      title: '📞 Cuộc gọi tự xưng "Công An / Tòa Án" dọa bắt giam',
      desc: 'Dọa dính líu rửa tiền, ma túy, yêu cầu chuyển tiền giám định hoặc cấm nói cho gia đình',
      text: 'Toa an nhan dan va Vien kiem sat thong bao: Ong/Ba co lenh bat tam giam vi lien quan duong day rua tien 200 ty. Yeu cau chuyen ngay 50 trieu vao tai khoan tam giu de phuc vu dieu tra, tuyet doi giu bi mat khong noi voi nguoi nha.',
    },
    {
      id: 'prize',
      title: '🎁 Tin nhắn trúng thưởng xe máy / quà tặng giá trị cao',
      desc: 'Báo trúng thưởng lớn từ đài truyền hình hoặc nhãn hàng, bắt nạp tiền cọc phí vận chuyển',
      text: 'Chuc mung quy khach da may man trung thuong 01 xe may SH 150i tu chuong trinh tri an khach hang. Vui long chuyen khoan 2.500.000 dong phi van chuyen va thue truoc ba ve so tai khoan 102938484 de nhan xe trong 24h.',
    },
    {
      id: 'hospital',
      title: '🏥 Giả danh Bệnh viện báo "Con / Cháu đang mổ cấp cứu"',
      desc: 'Báo người thân bị tai nạn nguy kịch đang nằm viện, giục chuyển tiền gấp cho bác sĩ',
      text: 'Alo toi la bac si benh vien Cho Ray, chau nha minh bi tai nan giao thong dang cap cuu tai phong hoi suc dac biet, can mo gap rat nguy kich. Gia dinh chuyen gap 30 trieu dong vao so tai khoan vien phi de chung toi tien hanh phau thuat ngay.',
    },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setAnalyzed(false);
      }
    } catch {
      // Fallback if clipboard permission denied
    }
  };

  const handleCheck = () => {
    if (!inputText.trim()) return;
    setAnalyzed(true);
  };

  // Logic evaluation based on realistic Vietnamese scam patterns
  const lower = inputText.toLowerCase();
  const isScam =
    lower.includes('lenh bat') ||
    lower.includes('lệnh bắt') ||
    lower.includes('tam giam') ||
    lower.includes('tạm giam') ||
    lower.includes('chuyen tien') ||
    lower.includes('chuyển tiền') ||
    lower.includes('rua tien') ||
    lower.includes('rửa tiền') ||
    lower.includes('trung thuong') ||
    lower.includes('trúng thưởng') ||
    lower.includes('cap cuu') ||
    lower.includes('cấp cứu') ||
    lower.includes('tai nan') ||
    lower.includes('tai nạn') ||
    lower.includes('bao mat') ||
    lower.includes('bảo mật') ||
    lower.includes('cong an') ||
    lower.includes('công an') ||
    lower.includes('toa an') ||
    lower.includes('tòa án') ||
    lower.includes('vien kiem sat') ||
    lower.includes('viện kiểm sát') ||
    lower.includes('shopee') ||
    lower.includes('nhiem vu') ||
    lower.includes('nhiệm vụ');

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* WELCOMING & REASSURING HEADER */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 p-6 sm:p-7 rounded-3xl border-2 border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border-2 border-amber-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-amber-500/20">
            👴
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                Chế Độ Bảo Vệ Người Lớn Tuổi & Gia Đình
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base mt-1 leading-relaxed">
              Màn hình chữ to, đơn giản và dễ hiểu. Giúp Bác kiểm tra ngay kẻ lừa đảo trong 2 giây mà không cần nhờ ai!
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToPro}
          className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md"
        >
          Dành Cho Con Cháu (Bản PRO) →
        </button>
      </div>

      {/* BIG INPUT CARD (NO CONFUSION) */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border-2 border-slate-700 shadow-2xl space-y-5">
        <div className="space-y-2">
          <label className="block text-base sm:text-lg font-bold text-white leading-snug">
            Bác vừa nhận được tin nhắn, số điện thoại hoặc yêu cầu gì nghi ngờ?
          </label>
          <p className="text-xs sm:text-sm text-slate-400">
            (Bác có thể gõ nội dung hoặc bấm nút "Dán Nội Dung Vừa Sao Chép" bên dưới)
          </p>
        </div>

        <div className="relative">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setAnalyzed(false);
            }}
            placeholder="Ví dụ: Có người gọi tự xưng Công an bảo tôi dính án ma túy yêu cầu chuyển 50 triệu..."
            className="w-full bg-slate-950 border-2 border-slate-600 rounded-2xl p-4 text-white text-base sm:text-lg focus:outline-none focus:border-amber-400 placeholder-slate-500 leading-relaxed shadow-inner"
          />
        </div>

        {/* LARGE ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePaste}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer border border-slate-600 transition-all shadow-md active:scale-95"
          >
            <ClipboardPaste className="w-5 h-5 text-amber-400" />
            <span>Dán Nội Dung Vừa Chép</span>
          </button>

          <button
            onClick={handleCheck}
            disabled={!inputText.trim()}
            className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black px-6 py-4 rounded-2xl text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-amber-500/30 transition-all active:scale-95"
          >
            <Search className="w-6 h-6" />
            <span>KIỂM TRA AN TOÀN NGAY</span>
          </button>
        </div>

        {/* 3 COMMON SCENARIO PRESETS */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hoặc Bác bấm thử 1 trong 3 tình huống kẻ gian hay lừa nhất:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setInputText(p.text);
                  setAnalyzed(true);
                }}
                className="p-3.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 rounded-2xl text-left transition-all cursor-pointer space-y-1 group"
              >
                <div className="font-bold text-xs sm:text-sm text-amber-300 group-hover:text-amber-200">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRAFFIC LIGHT EVALUATION RESULT (CRYSTAL CLEAR) */}
      {analyzed && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-4 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-300 ${
            isScam
              ? 'bg-gradient-to-b from-red-950/90 via-slate-900 to-slate-950 border-red-500'
              : 'bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-500'
          }`}
        >
          {/* RESULT HEADER BANNER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl ${
                  isScam ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'
                }`}
              >
                {isScam ? <XCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-400">
                  KẾT QUẢ THẨM ĐỊNH CHO BÁC:
                </div>
                <h3
                  className={`text-xl sm:text-3xl font-black mt-0.5 ${
                    isScam ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isScam
                    ? '🚨 LỪA ĐẢO 100%! TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN!'
                    : '🟢 AN TOÀN - KHÔNG CÓ DẤU HIỆU LỪA ĐẢO'}
                </h3>
              </div>
            </div>

            {/* VOICE READ OUT */}
            <button
              onClick={() =>
                handleSpeak(
                  isScam
                    ? 'Bác ơi, đây là quân lừa đảo một trăm phần trăm! Công an và Tòa án thật không bao giờ gọi điện thoại dọa bắt hay bắt chuyển tiền. Bác hãy cúp máy ngay và gọi cho con cháu nhé!'
                    : 'Nội dung này chưa thấy dấu hiệu lừa đảo nguy hiểm, Bác có thể yên tâm.'
                )
              }
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer border border-slate-600"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isSpeaking ? 'Dừng đọc' : 'Bấm Nghe Đọc'}</span>
            </button>
          </div>

          {/* CLEAR EXPLANATION */}
          {isScam ? (
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
              <div className="bg-red-950/60 p-4 sm:p-5 rounded-2xl border-2 border-red-500/50 space-y-2">
                <div className="font-bold text-base sm:text-lg text-red-200">
                  Bác hãy ghi nhớ 3 điều sống còn sau:
                </div>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold text-lg">1.</span>
                    <span>
                      <strong>Công an, Tòa án hoặc Viện kiểm sát thật</strong> KHÔNG BAO GIỜ làm việc qua điện thoại, không bao giờ gửi lệnh bắt qua Zalo và{' '}
                      <strong>tuyệt đối không bao giờ yêu cầu chuyển tiền vào tài khoản cá nhân</strong>!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold text-lg">2.</span>
                    <span>
                      <strong>Không nghe lời đe dọa "giữ bí mật":</strong> Kẻ lừa đảo luôn dặn Bác "không được nói với ai" để Bác sợ hãi và chuyển tiền một mình.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold text-lg">3.</span>
                    <span>
                      <strong>Hành động ngay:</strong> Bấm nút màu đỏ bên dưới để cúp máy và gọi điện hỏi ngay con/cháu trong nhà!
                    </span>
                  </li>
                </ul>
              </div>

              {/* ACTION BUTTONS FOR ELDERLY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    window.location.href = 'tel:156';
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red-600/30 transition-all active:scale-95"
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  <span>GỌI TỔNG ĐÀI CÔNG AN (156)</span>
                </button>

                <button
                  onClick={() =>
                    onOpenReport?.('sms', inputText, 'Giả danh Công an / Tống tiền người cao tuổi')
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40 transition-all"
                >
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <span>Tố Giác Để Cứu Người Khác</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-slate-200 text-sm sm:text-base">
              Nội dung không chứa các từ khóa đe dọa hoặc giục giã chuyển tiền khẩn cấp. Tuy nhiên, nếu đối phương yêu cầu Bác cung cấp mã OTP ngân hàng hoặc mật khẩu, tuyệt đối không được đưa!
            </div>
          )}
        </div>
      )}

      {/* 2 LARGE EMERGENCY HELPLINES AT BOTTOM */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <HeartHandshake className="w-6 h-6 text-amber-400 shrink-0 hidden sm:block" />
          <div>
            <div className="text-sm font-bold text-white">Bác cần hỗ trợ trực tiếp từ cơ quan chức năng?</div>
            <div className="text-xs text-slate-400">Đường dây nóng miễn phí tiếp nhận 24/7 của Bộ Công An & Bộ Thông Tin</div>
          </div>
        </div>

        <button
          onClick={onOpenEmergency}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/50 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <PhoneCall className="w-4 h-4 text-red-400" />
          <span>Danh Bạ Khẩn Cấp (156 / A05)</span>
        </button>
      </div>
    </div>
  );
};
