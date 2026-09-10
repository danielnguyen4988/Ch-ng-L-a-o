import React, { useState } from 'react';
import {
  Gamepad2,
  AlertOctagon,
  ShieldCheck,
  Search,
  Sparkles,
  ExternalLink,
  Flame,
  MessageSquareWarning,
  Lock,
  ArrowRight,
  HelpCircle,
  Share2,
  Ticket,
} from 'lucide-react';
import { PersonaMode, FraudTargetType } from '../../types';

interface TeenCampusViewProps {
  onSwitchToPro: () => void;
  onOpenReport?: (type: FraudTargetType, value: string, category?: string) => void;
}

export const TeenCampusView: React.FC<TeenCampusViewProps> = ({
  onSwitchToPro,
  onOpenReport,
}) => {
  const [inputText, setInputText] = useState('');
  const [checkResult, setCheckResult] = useState<{
    tested: boolean;
    isTrap: boolean;
    trapName: string;
    lossType: string;
    advice: string;
  } | null>(null);

  const TEEN_TRAPS = [
    {
      id: 'game',
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      title: 'Lừa Nạp Game & Shop Acc Ảo',
      tag: 'Liên Quân / Free Fire / Roblox',
      color: 'border-purple-500/40 bg-purple-950/20',
      sample: 'Shop nap kim cuong x10 napthegiare247.vn ban nick lien quan full tuong chi 50k chuyen khoan momo truoc giu cho.',
      risk: 'Mất trắng tiền nạp, bị chiếm đoạt tài khoản Facebook/Garena hoặc lộ mã thẻ cào.',
      rule: 'Không có nạp lậu x10 từ Garena/Riot. Chỉ nạp qua kênh chính thức VNG / Garena!',
    },
    {
      id: 'tiktok_job',
      icon: <Flame className="w-5 h-5 text-pink-400" />,
      title: 'Bẫy CTV "Việc Nhẹ Lương Cao"',
      tag: 'Like TikTok / Thả Tim Shopee',
      color: 'border-pink-500/40 bg-pink-950/20',
      sample: 'Tuyen hoc sinh sinh vien lam them online tai nha, xem 1 video tiktok nhan 20k, ngay kiem 300k-500k khong can von, ib zalo de nhan task.',
      risk: 'Bẫy nạp tiền làm nhiệm vụ nâng cấp VIP (Mô hình Ponzi). Mất sạch tiền tích lũy và học phí.',
      rule: 'Không có công việc nào chỉ bấm like mà kiếm 500k/ngày. Nạp tiền để mở nhiệm vụ = 100% lừa đảo!',
    },
    {
      id: 'ticket',
      icon: <Ticket className="w-5 h-5 text-amber-400" />,
      title: 'Vé Concert & Thần Tượng Giả',
      tag: 'Anh Trai Say Hi / K-Pop',
      color: 'border-amber-500/40 bg-amber-950/20',
      sample: 'Pass gap 2 ve concert Anh Trai Say Hi khu vuc VIP gia re do ban lich, chuyen khoan coc 50% gui ma QR check-in qua mail ngay.',
      risk: 'Kẻ gian bán 1 mã QR ảo cho hàng chục người hoặc làm giả ảnh vé Photoshop.',
      rule: 'Chỉ giao dịch vé trực tiếp face-to-face hoặc qua cổng phân phối chính thức, không cọc online.',
    },
    {
      id: 'sextortion',
      icon: <Lock className="w-5 h-5 text-red-400" />,
      title: 'Tống Tiền Bằng Ảnh Nhạy Cảm',
      tag: 'Sextortion / Bắt Nạt Mạng',
      color: 'border-red-500/40 bg-red-950/20',
      sample: 'Gửi ảnh nhạy cảm hoặc video call lén quay màn hình, đe dọa gửi cho phụ huynh và bạn bè trên Facebook nếu không chuyển 2 triệu.',
      risk: 'Sang chấn tâm lý, bị tống tiền liên tục không có điểm dừng.',
      rule: 'TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN (càng chuyển càng bị tống tiền tiếp). Chụp lại bằng chứng, chặn tài khoản và tâm sự ngay với Bố Mẹ hoặc Thầy Cô!',
    },
  ];

  const handleRunCheck = (customInput?: string) => {
    const text = (customInput || inputText).trim();
    if (!text) return;

    const lower = text.toLowerCase();
    let isTrap = false;
    let trapName = 'Bẫy lừa đảo mạng xã hội';
    let lossType = 'Nguy cơ mất tiền hoặc mất tài khoản game/mạng xã hội';
    let advice = 'Không click vào đường link lạ và không chuyển tiền cho người không quen biết.';

    if (lower.includes('kim cuong') || lower.includes('napthe') || lower.includes('nick') || lower.includes('lien quan') || lower.includes('roblox')) {
      isTrap = true;
      trapName = 'BẪY SHOP ACC GAME & NẠP LẬU ẢO';
      lossType = 'Mất tiền cọc, bị hack nick game qua web phishing';
      advice = 'Chỉ nạp game qua trang chính thức (napthe.vn của Garena hoặc web nạp chính hãng). Tuyệt đối không đăng nhập tài khoản Facebook/Google vào các trang web nạp x10!';
    } else if (lower.includes('tiktok') || lower.includes('viec nhe') || lower.includes('kiem tien') || lower.includes('nhiem vu') || lower.includes('ctv')) {
      isTrap = true;
      trapName = 'BẪY TUYỂN CTV LIKE TIKTOK / SHOPEE LỪA TIỀN';
      lossType = 'Mất sạch tiền nạp cọc nhiệm vụ';
      advice = 'Đây là chiêu trò Ponzi kinh điển: Chúng cho bạn rút 50k đầu tiên, sau đó bắt nạp 500k, 2 triệu, 10 triệu để "hoàn tất đơn hàng" rồi khóa máy biến mất!';
    } else if (lower.includes('concert') || lower.includes('ve') || lower.includes('pass') || lower.includes('qr')) {
      isTrap = true;
      trapName = 'BẪY PASS VÉ CONCERT / SỰ KIỆN QUA MẠNG';
      lossType = 'Mất tiền vé, ôm vé giả không vào được cổng';
      advice = 'Không chuyển tiền cọc cho người lạ trên Facebook/Threads. Rất nhiều kẻ lừa đảo dùng 1 file PDF vé để bán cho 50 người cùng lúc!';
    } else if (lower.includes('bat tam giam') || lower.includes('cong an') || lower.includes('rua tien')) {
      isTrap = true;
      trapName = 'GIẢ DANH CƠ QUAN ĐIỀU TRA TỐNG TIỀN';
      lossType = 'Dọa nạt tâm lý, lừa tiền tiết kiệm';
      advice = 'Công an không bao giờ gọi điện hăm dọa học sinh/sinh viên. Hãy nói ngay với Bố Mẹ!';
    }

    setCheckResult({
      tested: true,
      isTrap,
      trapName,
      lossType,
      advice,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* TEEN HEADER */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border-2 border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border-2 border-purple-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-purple-500/20">
            🎮
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl font-black text-purple-200">
                Góc Phòng Thủ Học Đường & Không Gian Mạng (Gen Z)
              </h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono font-bold">
                Anti-Lừa Game & Việc Ảo
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Bảo vệ tài khoản game, tiền tiêu vặt và quyền riêng tư trước các bẫy lừa đảo tinh vi trên TikTok, Zalo, Discord!
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToPro}
          className="bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md"
        >
          Chế Độ Điều Tra (Bản PRO) →
        </button>
      </div>

      {/* QUICK CHECK INPUT CARD */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
        <div className="space-y-1">
          <label className="block text-sm sm:text-base font-bold text-white">
            Nhập đường link shop, tin nhắn tuyển CTV hoặc bài đăng bạn đang phân vân:
          </label>
          <p className="text-xs text-slate-400">
            Dán link web shop nạp game, tin nhắn Zalo tuyển CTV hoặc bài pass vé concert...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCheck()}
            placeholder="Ví dụ: napthegiare247.vn hoặc tuyển bạn like video nhận 300k..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 shadow-inner"
          />
          <button
            onClick={() => handleRunCheck()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Check Nhanh Ngay</span>
          </button>
        </div>

        {/* RESULT PREVIEW IF CHECKED */}
        {checkResult && (
          <div
            className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in duration-200 ${
              checkResult.isTrap
                ? 'bg-red-950/40 border-red-500 text-red-100'
                : 'bg-emerald-950/40 border-emerald-500 text-emerald-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm uppercase flex items-center gap-2">
                {checkResult.isTrap ? (
                  <>
                    <AlertOctagon className="w-5 h-5 text-red-400 animate-bounce" />
                    <span>CẢNH BÁO ĐỎ: {checkResult.trapName}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>CHƯA THẤY DẤU HIỆU BẪY ĐIỂN HÌNH</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div>
                <strong>Hậu quả nếu dính bẫy:</strong> {checkResult.lossType}
              </div>
              <div>
                <strong>Lời khuyên bảo vệ:</strong> {checkResult.advice}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 HOTTEST TRAPS FACED BY STUDENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>4 Chiêu Trò Kẻ Gian Đang Giăng Ra Để Lừa Giới Trẻ:</span>
          </h3>
          <span className="text-xs text-slate-500">Bấm để xem mẫu thực tế</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEEN_TRAPS.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-2xl border ${t.color} space-y-3 flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.icon}
                    <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  </div>
                  <span className="text-[10px] bg-slate-900/90 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                    {t.tag}
                  </span>
                </div>

                <div className="text-xs text-slate-300/90 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800 italic">
                  "{t.sample}"
                </div>

                <div className="text-xs text-red-300 space-y-1">
                  <div>
                    <strong>Cạm bẫy:</strong> {t.risk}
                  </div>
                  <div className="text-slate-200">
                    <strong>Bí kíp né bẫy:</strong> {t.rule}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setInputText(t.sample);
                  handleRunCheck(t.sample);
                }}
                className="w-full bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Kiểm Tra Thử Mẫu Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* EMERGENCY ADVICE WHEN TRAPPED */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Nếu Lỡ Bị Lừa Tiền Hoặc Bị Đe Dọa Trên Mạng, Cần Làm Gì Ngay?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="font-bold text-white mb-1">1. Đổi Pass & Khóa Tài Khoản</div>
            Đổi mật khẩu Facebook, iCloud, Garena ngay lập tức và bật xác thực 2 bước (2FA).
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="font-bold text-white mb-1">2. Tâm Sự Với Bố Mẹ / Thầy Cô</div>
            Đừng sợ hãi giấu một mình. Kẻ gian chỉ dám bắt nạt khi bạn cô đơn và hoảng loạn!
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="font-bold text-white mb-1">3. Chặn Kẻ Tống Tiền & Báo Cáo</div>
            Chụp lại toàn bộ tin nhắn làm bằng chứng, chặn đối tượng và gửi tố giác lên hệ thống.
          </div>
        </div>
      </div>
    </div>
  );
};
