import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Volume2,
  Sparkles,
  Users,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Gamepad2,
  ShoppingBag,
  Building2,
} from 'lucide-react';
import { TabKey } from './NavigationTabs';
import { FraudTargetType } from '../types';

interface FamilyProtectionBannerProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onSelectSmsScenario?: (text: string) => void;
  onOpenEmergency: () => void;
  onOpenReport: (type: FraudTargetType, value: string, category?: string) => void;
}

export const FamilyProtectionBanner: React.FC<FamilyProtectionBannerProps> = ({
  activeTab,
  onSelectTab,
  onSelectSmsScenario,
  onOpenEmergency,
  onOpenReport,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const FAMILY_PRESETS = [
    {
      id: 'elderly-police',
      tag: '👴 Người lớn tuổi',
      title: 'Cuộc gọi "Công An dọa bắt giam"',
      desc: 'Dọa dính rửa tiền 200 tỷ, bắt chuyển tiền giám định',
      targetTab: 'sms' as TabKey,
      text: 'Toa an nhan dan va Vien kiem sat thong bao: Ong/Ba co lenh bat tam giam vi lien quan duong day rua tien 200 ty. Yeu cau chuyen ngay 50 trieu vao tai khoan tam giu cua Bo Cong an so 102938484 de phuc vu dieu tra, tuyet doi giu bi mat khong noi voi nguoi nha.',
    },
    {
      id: 'elderly-hospital',
      tag: '👴 Người lớn tuổi',
      title: 'Giả Bác sĩ báo "Con cấp cứu gấp"',
      desc: 'Giục chuyển 30 triệu viện phí ngay trong 15 phút',
      targetTab: 'sms' as TabKey,
      text: 'Alo toi la bac si benh vien Cho Ray, con/chau nha minh bi tai nan giao thong dang cap cuu phong hoi suc, can mo gap rat nguy kich. Gia dinh chuyen gap 30 trieu dong vao so tai khoan vien phi de chung toi tien hanh phau thuat ngay.',
    },
    {
      id: 'youth-game',
      tag: '🎮 Học sinh / Gen Z',
      title: 'Bẫy nạp thẻ game / Free Fire x10',
      desc: 'Nạp 50k nhận 10.000 kim cương hoặc acc VIP ảo',
      targetTab: 'sms' as TabKey,
      text: 'Su kien tri an Garena: Tang 10.000 KC Free Fire va acc VIP cho game thu nap the cao 50k dau tien tai web: napthe-garena-vip.xyz. Con 15 phut de nhan thuong!',
    },
    {
      id: 'youth-job',
      tag: '💼 Sinh viên / Giới trẻ',
      title: 'CTV Online thả tim TikTok 500k/ngày',
      desc: 'Làm nhiệm vụ nạp tiền hoàn vốn có lãi rồi khóa tiền',
      targetTab: 'sms' as TabKey,
      text: 'Tuyen cong tac vien online xem video va tha tim TikTok tai nha, luong 300k - 500k/ngay nhan tien ngay trong ngay. Khong can kinh nghiem, cong viec nhe nhang. Nhan tin Zalo 0912345678 de nhan viec ngay.',
    },
    {
      id: 'citizen-bts',
      tag: '📡 Mọi người dùng',
      title: 'Trạm BTS giả 2G (SMS Ngân hàng)',
      desc: 'Tin nhắn chui vào luồng Brandname báo khóa tài khoản',
      targetTab: 'sms' as TabKey,
      text: 'Vietcombank tran trong thong bao: Tai khoan SmartBanking cua Quy khach tam thoi bi khoa do phat hien truy cap la tu nuoc ngoai. Vui long bam vao http://vietcombank-smartbanking.site de xac thuc mo khoa trong 24h.',
    },
    {
      id: 'citizen-2345',
      tag: '⚡ Người tiêu dùng',
      title: 'Bẫy né quét mặt (QĐ 2345 9.9 triệu)',
      desc: 'Bắt chia nhỏ dưới 10tr để né quét sinh trắc học CCCD',
      targetTab: 'sms' as TabKey,
      text: 'Anh chuyen truoc 9 trieu 9 (9.900.000d) qua tai khoan nay giup em nhe, lat chuyen tiep 9.9 trieu nua cho nhanh do phai quet mat CCCD sinh trac hoc lang nhang.',
    },
  ];

  const handleLaunchPreset = (preset: typeof FAMILY_PRESETS[0]) => {
    onSelectTab(preset.targetTab);
    if (preset.targetTab === 'sms' && onSelectSmsScenario) {
      onSelectSmsScenario(preset.text);
    }
  };

  const handleSpeakFamilyGuidance = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const speechText =
        'Hệ thống phòng thủ số VeraFense bảo vệ toàn bộ gia đình. Kính gửi các Bác lớn tuổi và các bạn học sinh sinh viên: Cơ quan Công an và Tòa án Việt Nam không bao giờ làm việc qua điện thoại và không bao giờ yêu cầu chuyển tiền vào tài khoản cá nhân. Khi gặp số lạ xưng công an hoặc dọa nạt, các bác hãy dập máy ngay và bấm nút báo cho con cháu hoặc gọi một năm sáu.';
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mb-6 space-y-4 animate-in fade-in duration-300">
      {/* UNIFIED BANNER */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 border border-teal-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                BẢN ĐẠI CHÚNG MIỄN PHÍ TRỌN ĐỜI
              </span>
              <span className="text-xs text-slate-400">
                Dành cho: <strong className="text-white">Người cao tuổi • Học sinh, Sinh viên • Gia đình & Người tiêu dùng</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Lá Chắn Số Bảo Vệ Toàn Dân & Gia Đình</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Tất cả công cụ phòng vệ đều nằm trong 1 hệ thống duy nhất. Kích thước chữ và giao diện tự động đồng bộ theo cài đặt thu phóng (Zoom) của điện thoại Bác và gia đình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* SPEECH SYNTHESIS BUTTON FOR ELDERLY */}
            <button
              onClick={handleSpeakFamilyGuidance}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-black'
                  : 'bg-slate-950/80 hover:bg-slate-900 text-amber-300 border-amber-500/30'
              }`}
              title="Đọc to lời khuyên phòng thủ bằng giọng nói tiếng Việt cho người lớn tuổi"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Đang đọc hướng dẫn...' : 'Đọc To Hướng Dẫn'}</span>
            </button>

            {/* EMERGENCY 156 HOTLINE */}
            <button
              onClick={onOpenEmergency}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Khẩn Cấp (156 / A05)</span>
            </button>
          </div>
        </div>

        {/* 1-TAP QUICK CHECK PRESETS */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              BẤM 1 CHẠM ĐỂ KIỂM TRA NHANH CÁC KỊCH BẢN LỪA PHỔ BIẾN NHẤT:
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              (Chạm vào kịch bản để thẩm định ngay)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {FAMILY_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleLaunchPreset(p)}
                className="text-left p-2.5 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-xl transition-all group cursor-pointer flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-900 text-teal-300 border border-slate-800">
                    {p.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
