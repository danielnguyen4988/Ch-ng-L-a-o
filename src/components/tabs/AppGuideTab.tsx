import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Volume2,
  Sparkles,
  ArrowRight,
  Smartphone,
  Layers,
  FileSearch,
  MessageSquareWarning,
  HelpCircle,
  HeartHandshake,
  Eye,
  Shield,
  Zap,
  Info,
  ExternalLink,
} from 'lucide-react';
import { TabKey } from '../NavigationTabs';

interface AppGuideTabProps {
  onNavigateTab: (tab: TabKey) => void;
  onSelectSmsScenario?: (text: string) => void;
  onOpenEmergency: () => void;
}

export const AppGuideTab: React.FC<AppGuideTabProps> = ({
  onNavigateTab,
  onSelectSmsScenario,
  onOpenEmergency,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Quick test scenarios with 1-tap launch
  const QUICK_SCENARIOS = [
    {
      id: 'police',
      tag: '👴 Người lớn tuổi',
      title: 'Cuộc gọi "Công An / Tòa Án dọa bắt giam"',
      desc: 'Kẻ xấu tự xưng cán bộ, dọa lệnh bắt vì dính đường dây rửa tiền, ép chuyển tiền bảo lãnh',
      tab: 'sms' as TabKey,
      sampleText:
        'Toa an nhan dan va Vien kiem sat thong bao: Ong/Ba co lenh bat tam giam vi lien quan duong day rua tien 200 ty. Yeu cau chuyen ngay 50 trieu vao tai khoan tam giu cua Bo Cong an so 102938484 de phuc vu dieu tra, tuyet doi giu bi mat khong noi voi nguoi nha.',
      btnLabel: 'Thử Kiểm Tra Kịch Bản Này',
    },
    {
      id: 'hospital',
      tag: '👴 Người lớn tuổi',
      title: 'Giả danh Bác sĩ: "Con cháu bị tai nạn cấp cứu gấp"',
      desc: 'Gọi điện thoại hốt hoảng giục chuyển 20 - 50 triệu viện phí phẫu thuật ngay trong 15 phút',
      tab: 'sms' as TabKey,
      sampleText:
        'Alo toi la bac si benh vien Cho Ray, con/chau nha minh bi tai nan giao thong dang cap cuu phong hoi suc, can mo gap rat nguy kich. Gia dinh chuyen gap 30 trieu dong vao so tai khoan vien phi de chung toi tien hanh phau thuat ngay.',
      btnLabel: 'Thử Kiểm Tra Kịch Bản Này',
    },
    {
      id: 'fake-bill',
      tag: '🛒 Bán hàng & Chủ shop',
      title: 'Khách mua hàng gửi ảnh "Đã chuyển khoản thành công"',
      desc: 'Ảnh biên lai ngân hàng giả, dùng phần mềm sửa số tiền hoặc chuyển thiếu 1 số 0',
      tab: 'bill' as TabKey,
      sampleText: '',
      btnLabel: 'Thử Soi Biên Lai Mẫu',
    },
    {
      id: 'job-online',
      tag: '💼 Sinh viên / Giới trẻ',
      title: 'Việc làm online "Thả tim TikTok / Đánh giá Shopee 500k/ngày"',
      desc: 'Dụ nạp tiền làm nhiệm vụ nhỏ để nhận hoa hồng, đến số tiền lớn thì khóa tài khoản và biến mất',
      tab: 'sms' as TabKey,
      sampleText:
        'Tuyen cong tac vien online xem video va tha tim TikTok tai nha, luong 300k - 500k/ngay nhan tien ngay trong ngay. Khong can kinh nghiem, cong viec nhe nhang. Nhan tin Zalo 0912345678 de nhan viec ngay.',
      btnLabel: 'Thử Kiểm Tra Kịch Bản Này',
    },
    {
      id: 'fake-bank-link',
      tag: '📱 Mọi người dùng',
      title: 'Tin nhắn mạo danh Ngân hàng gửi đường link lạ',
      desc: 'Báo tài khoản bị khóa hoặc đổi điểm thưởng, dụ bấm link để nhập mật khẩu và mã OTP',
      tab: 'link' as TabKey,
      sampleText: '',
      btnLabel: 'Thử Kiểm Tra Link Giả Mạo',
    },
    {
      id: 'fake-driver',
      tag: '🛵 Shipper & Tài xế',
      title: 'Bẫy bùng hàng (bom hàng) hoặc bẫy ứng tiền COD ảo',
      desc: 'Đặt đơn hàng ảo giá trị cao bắt shipper ứng tiền túi trước, sau đó chặn số và tắt máy',
      tab: 'phone' as TabKey,
      sampleText: '',
      btnLabel: 'Thử Tra Cứu Số Điện Thoại',
    },
  ];

  // FAQs
  const FAQS = [
    {
      q: 'Ứng dụng này có mất phí sử dụng không?',
      a: 'Hoàn toàn MIỄN PHÍ 100% cho mọi người dân, người cao tuổi, học sinh sinh viên và gia đình. Bạn có thể kiểm tra không giới hạn các tin nhắn, số điện thoại, link web và biên lai.',
    },
    {
      q: 'Công an hoặc Viện Kiểm sát có gọi điện thoại làm việc không?',
      a: 'TUYỆT ĐỐI KHÔNG. Theo quy định của pháp luật Việt Nam, cơ quan Công an, Viện kiểm sát và Tòa án các cấp chỉ gửi giấy mời hoặc giấy triệu tập trực tiếp qua Công an xã/phường nơi bạn cư trú, không bao giờ gọi điện dọa bắt hay yêu cầu chuyển tiền vào tài khoản.',
    },
    {
      q: 'Nếu tôi lỡ bấm vào đường link lạ thì phải làm gì ngay?',
      a: '1. Ngắt ngay kết nối Wifi và 4G trên điện thoại. 2. Không nhập bất kỳ mật khẩu ngân hàng hay mã OTP nào. 3. Mở app ngân hàng chính thức trên máy khác hoặc gọi ngay lên tổng đài ngân hàng để yêu cầu khóa thẻ/khóa ứng dụng tạm thời.',
    },
    {
      q: 'Làm sao để biết biên lai chuyển tiền là thật hay giả?',
      a: 'Cách an toàn nhất là mở trực tiếp ứng dụng ngân hàng của bạn để kiểm tra biến động số dư thực tế hoặc chờ tin nhắn SMS thông báo biến động từ số tổng đài chính thức của ngân hàng. Tuyệt đối không giao hàng chỉ dựa vào ảnh chụp biên lai khách gửi.',
    },
  ];

  const handleLaunchScenario = (sc: (typeof QUICK_SCENARIOS)[0]) => {
    onNavigateTab(sc.tab);
    if (sc.sampleText && onSelectSmsScenario) {
      onSelectSmsScenario(sc.sampleText);
    }
  };

  const handleSpeakGuide = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const speech =
        'Hướng dẫn sử dụng ứng dụng phòng vệ số: Bước một: Khi nhận tin nhắn, số điện thoại, đường link hoặc ảnh biên lai nghi ngờ, bạn bấm vào công cụ tương ứng. Bước hai: Bấm nút Dán Nhanh để đưa nội dung vào kiểm tra. Bước ba: Nhìn đèn giao thông trong ba giây. Đèn đỏ nghĩa là nguy hiểm hoặc lừa đảo, bạn hãy dập máy ngay và không chuyển tiền. Chúc bạn và gia đình luôn an toàn trên không gian mạng.';
      const utterance = new SpeechSynthesisUtterance(speech);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/50 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                CẨM NANG &amp; HƯỚNG DẪN DỄ HIỂU
              </span>
              <span className="text-xs text-slate-400">
                Dành cho cả gia đình • Dễ dùng cho mọi lứa tuổi
              </span>
            </div>

            {/* AUDIO VOICE BUTTON */}
            <button
              onClick={handleSpeakGuide}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border shadow-md ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                  : 'bg-slate-900/90 hover:bg-slate-850 text-amber-300 border-amber-500/40'
              }`}
              title="Nghe giọng nói hướng dẫn to rõ ràng cho người cao tuổi"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Đang đọc hướng dẫn...' : 'Bấm Nghe Đọc Hướng Dẫn'}</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cách Sử Dụng Ứng Dụng Trong 3 Bước Siêu Đơn Giản
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Ứng dụng giúp bạn và người thân phát hiện ngay dấu hiệu lừa đảo qua mạng chỉ trong 3 giây.
              Không cần hiểu biết kỹ thuật phức tạp, chỉ cần nhìn đèn báo màu và làm theo lời dặn.
            </p>
          </div>

          {/* 3 STEPS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-sm border border-teal-500/30">
                  1
                </span>
                <span className="text-[11px] font-bold text-teal-300">Chụp hoặc Sao chép</span>
              </div>
              <h3 className="font-bold text-white text-sm">Chọn Đúng Công Cụ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bấm vào 1 trong 4 tab ở thanh trên cùng (Biên lai, Tin nhắn, Link web hoặc SĐT/Tài khoản). Bấm nút <strong>"Dán Nhanh"</strong> để đưa nội dung vào.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/30">
                  2
                </span>
                <span className="text-[11px] font-bold text-amber-300">Nhìn Đèn Báo 3 Giây</span>
              </div>
              <h3 className="font-bold text-white text-sm">Đọc Kết Quả Trực Quan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-red-400 font-bold">Đỏ:</span> Nguy hiểm, lừa đảo 100%.{' '}
                <span className="text-amber-400 font-bold">Vàng:</span> Đáng ngờ, cần hỏi lại người thân.{' '}
                <span className="text-emerald-400 font-bold">Xanh:</span> An toàn, chính thức.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
                  3
                </span>
                <span className="text-[11px] font-bold text-emerald-300">Hành Động An Toàn</span>
              </div>
              <h3 className="font-bold text-white text-sm">Làm Theo Lời Dặn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Làm theo chỉ dẫn ngắn gọn: Dập máy ngay, không chuyển tiền, không cài ứng dụng lạ, hoặc gọi người thân kiểm chứng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 TOOLS OVERVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>4 Công Cụ Phòng Vệ Của Bạn</span>
          </h2>
          <span className="text-xs text-slate-400">Bấm nút để mở trực tiếp từng công cụ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TOOL 1: BILL */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileSearch className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Chống làm giả ảnh
                </span>
              </div>
              <h3 className="text-base font-bold text-white">1. Soi Biên Lai Chuyển Tiền Thật / Giả</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tải ảnh biên lai khách gửi lên. Công cụ sẽ tự động đọc chữ, so sánh số tiền với tin nhắn ngân hàng của bạn, và có kính lúp soi vết cắt ghép chữ số bằng Photoshop hoặc AI.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bill')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Mở Công Cụ Soi Biên Lai</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* TOOL 2: SMS */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Báo động dập máy
                </span>
              </div>
              <h3 className="text-base font-bold text-white">2. Kiểm Tra Tin Nhắn &amp; Kịch Bản Lừa</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dán nội dung tin nhắn hoặc lời kẻ lạ nói vào đây. App sẽ phân tích ngay thủ đoạn tâm lý thao túng, chỉ rõ dấu hiệu bịa đặt và khuyên bạn nên làm gì để không bị mất tiền.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('sms')}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Mở Công Cụ Kiểm Tra Tin Nhắn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* TOOL 3: LINK / APK */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Chặn web lừa &amp; app độc
                </span>
              </div>
              <h3 className="text-base font-bold text-white">3. Kiểm Tra Link Web &amp; Tệp Cài Đặt</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dán đường link được gửi qua Zalo/Facebook/SMS. App sẽ tra cứu xem tên miền mới lập bao nhiêu ngày, có nằm trong danh sách lừa đảo, cờ bạc hoặc chứa file mã độc đánh cắp mã OTP không.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('link')}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Mở Công Cụ Kiểm Tra Link Web</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* TOOL 4: PHONE / BANK */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Tra số rác &amp; tài khoản lừa
                </span>
              </div>
              <h3 className="text-base font-bold text-white">4. Tra Cứu Số Điện Thoại &amp; Tài Khoản Ngân Hàng</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nhập số điện thoại lạ gọi đến hoặc số tài khoản kẻ gian bảo bạn chuyển tiền. Đối soát ngay xem số đó đã bị bao nhiêu người tố cáo, có phải số chuyên bùng hàng hay tài khoản rửa tiền không.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('phone')}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Mở Tra Cứu SĐT &amp; Tài Khoản</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SCENARIOS SECTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Bấm 1 Chạm Để Thử Các Kịch Bản Lừa Đảo Phổ Biến</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chạm vào tình huống để xem ứng dụng phân tích và đưa ra lời cảnh báo thực tế như thế nào:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-teal-300 border border-slate-800">
                    {sc.tag}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-teal-400 font-mono transition-colors">
                    Ví dụ mẫu
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-200 transition-colors">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {sc.desc}
                </p>
              </div>

              <button
                onClick={() => handleLaunchScenario(sc)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-teal-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-800 hover:border-teal-500"
              >
                <span>{sc.btnLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3 KHÔNG - 2 CÓ HANDBOOK FOR FAMILIES */}
      <div className="bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/30 border border-red-500/30 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Sổ Tay An Toàn: Nguyên Tắc "3 KHÔNG - 2 CÓ" Cần Nhớ
            </h3>
            <p className="text-xs text-slate-300">
              Hãy dặn dò ông bà, cha mẹ và các em nhỏ trong nhà ghi nhớ 5 điều cốt lõi này:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-red-500/30 space-y-1">
            <span className="text-red-400 font-black text-sm block">1. KHÔNG CHUYỂN TIỀN</span>
            <p className="text-slate-300 leading-relaxed">
              Không chuyển tiền cho bất kỳ ai xưng là Công an, Tòa án, hay nhân viên viễn thông qua điện thoại.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-red-500/30 space-y-1">
            <span className="text-red-400 font-black text-sm block">2. KHÔNG CUNG CẤP OTP</span>
            <p className="text-slate-300 leading-relaxed">
              Mã OTP, mật khẩu và số thẻ ngân hàng là bí mật tuyệt đối. Ngân hàng không bao giờ hỏi mật khẩu của bạn.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-red-500/30 space-y-1">
            <span className="text-red-400 font-black text-sm block">3. KHÔNG BẤM LINK LẠ</span>
            <p className="text-slate-300 leading-relaxed">
              Không bấm vào các đường link nhận quà, trúng thưởng, hay tải file .apk cài đặt ngoài cửa hàng chính thức.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-black text-sm block">4. CÓ GỌI XÁC MINH</span>
            <p className="text-slate-300 leading-relaxed">
              Khi có người quen, người thân nhắn tin mượn tiền gấp, hãy gọi video call hoặc gặp trực tiếp để kiểm chứng.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-black text-sm block">5. CÓ BÁO CÔNG AN</span>
            <p className="text-slate-300 leading-relaxed">
              Nếu nghi ngờ bị lừa, hãy gọi ngay tổng đài 156 hoặc đến Công an gần nhất để được hỗ trợ kịp thời.
            </p>
          </div>
        </div>
      </div>

      {/* EMERGENCY CONTACT CARDS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-400" />
              <span>Đường Dây Nóng Khẩn Cấp Miễn Phí (24/7)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Khi gặp tình huống cấp bách, hãy liên hệ ngay các đầu số chính thức sau:
            </p>
          </div>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Xem Danh Sách Khẩn Cấp Đầy Đủ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Tổng Đài 156 (Bộ TT&amp;TT)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Miễn Phí
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Tiếp nhận phản ánh cuộc gọi rác, tin nhắn rác, cuộc gọi có dấu hiệu lừa đảo.
            </p>
            <a
              href="tel:156"
              className="inline-flex items-center gap-1 text-emerald-400 font-black text-sm pt-1"
            >
              Gọi ngay 156
            </a>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Cục An Ninh Mạng A05</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">
                Bộ Công An
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Đường dây nóng phòng chống tội phạm công nghệ cao và lừa đảo xuyên biên giới.
            </p>
            <a
              href="tel:0692343640"
              className="inline-flex items-center gap-1 text-red-400 font-black text-sm pt-1"
            >
              069.234.3640
            </a>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Tổng Đài Khóa Thẻ Ngân Hàng</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                Tức Thì
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Gọi ngay tổng đài ngân hàng để khóa tài khoản trong vòng 15 phút đầu tiên nếu lỡ bấm link lạ.
            </p>
            <span className="inline-block text-amber-300 font-bold text-xs pt-1">
              VCB: 1900545413 • MB: 1900545426
            </span>
          </div>
        </div>
      </div>

      {/* FAQS ACCORDION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3">
        <h3 className="text-base font-black text-white flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <span>Câu Hỏi Thường Gặp Của Người Dân</span>
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-mono text-base">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
