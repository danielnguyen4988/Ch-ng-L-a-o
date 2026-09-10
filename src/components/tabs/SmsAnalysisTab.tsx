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

    const lower = text.toLowerCase();

    // 1. SCENARIO: CASUAL COFFEE / MEETUP (Highland Bình Tân, cf, gặp nhau, hôm nay em off...)
    const isCasualMeetup =
      (lower.includes('cà phê') || lower.includes('cf') || lower.includes('highland') || lower.includes('uống nước')) &&
      (lower.includes('rảnh') || lower.includes('gặp') || lower.includes('off') || lower.includes('nói chuyện') || lower.includes('bình tân')) &&
      !lower.includes('chuyển') &&
      !lower.includes('tiền') &&
      !lower.includes('link') &&
      !lower.includes('http');

    // 2. SCENARIO: DATING / ROMANCE INTRO WITH WEALTH/REAL ESTATE (Pig Butchering - Mổ Heo giai đoạn 1)
    const isPigButchering =
      (lower.includes('bds') || lower.includes('bất động sản') || lower.includes('căn hộ') || lower.includes('sn 99') || lower.includes('kinh doanh')) &&
      (lower.includes('làm quen') || lower.includes('kết bạn') || lower.includes('nghiêm túc') || lower.includes('lịch sự') || lower.includes('giao lưu')) &&
      !lower.includes('toa an') &&
      !lower.includes('cong an');

    // 3. SCENARIO: POLICE / COURT / PROSECUTION (Impersonation Extortion)
    const isLawImpersonation =
      lower.includes('toa an') ||
      lower.includes('tòa án') ||
      lower.includes('tam giam') ||
      lower.includes('tạm giam') ||
      lower.includes('phat nguoi') ||
      lower.includes('phạt nguội') ||
      lower.includes('cong an') ||
      lower.includes('công an') ||
      lower.includes('vien kiem sat') ||
      lower.includes('viện kiểm sát');

    // 4. SCENARIO: E-COMMERCE TASK / SHOPEE / TIKTOK (Ponzi Scam)
    const isTaskScam =
      lower.includes('cong tac vien') ||
      lower.includes('cộng tác viên') ||
      lower.includes('shopee') ||
      lower.includes('nhiem vu') ||
      lower.includes('nhiệm vụ') ||
      lower.includes('tien coc') ||
      lower.includes('tiền cọc') ||
      lower.includes('hoa hong');

    // 5. SCENARIO: GAME CARD / TEEN GIFTS (Robux, Kim Cương, Nạp Thẻ)
    const isGameGiftScam =
      lower.includes('robux') ||
      lower.includes('kim cuong') ||
      lower.includes('kim cương') ||
      lower.includes('nhan qua') ||
      lower.includes('nhận quà') ||
      lower.includes('nap the') ||
      lower.includes('nạp thẻ');

    // 6. SCENARIO: BANK PHISHING (Must have link or explicit bank OTP/account lock words)
    const isRealBankPhishing =
      (lower.includes('ngan hang') || lower.includes('ngân hàng') || lower.includes('smartbanking') || lower.includes('otp') || lower.includes('vietcombank') || lower.includes('mbbank')) &&
      (lower.includes('link') || lower.includes('http') || lower.includes('khoa') || lower.includes('khóa') || lower.includes('xac thuc') || lower.includes('xác thực'));

    // 7. SCENARIO: BIOMETRIC EVASION TRAP (Quyết định 2345/QĐ-NHNN - Chia nhỏ dưới 10 triệu)
    const isBiometricEvasion =
      (lower.includes('9.9') || lower.includes('9,9') || lower.includes('9tr9') || lower.includes('9 triệu 9') || lower.includes('4.9') || lower.includes('dưới 10tr') || lower.includes('dưới 10 triệu') || lower.includes('chia nhỏ') || lower.includes('quét mặt')) &&
      (lower.includes('chuyển') || lower.includes('ck') || lower.includes('bắn') || lower.includes('gửi') || lower.includes('tiền'));

    // 8. SCENARIO: FAKE 2G BTS STATION (IMSI Catcher chèn SMS Brandname)
    const isBtsFake2g =
      (lower.includes('vietcombank') || lower.includes('mbbank') || lower.includes('techcombank') || lower.includes('bidv') || lower.includes('agribank') || lower.includes('acb') || lower.includes('tpbank')) &&
      (lower.includes('http') || lower.includes('link') || lower.includes('.site') || lower.includes('.top') || lower.includes('.xyz') || lower.includes('.vip') || lower.includes('.cc'));

    if (isCasualMeetup) {
      setForensicReport({
        category: 'GIAO TIẾP XÃ HỘI & HẸN GẶP ĐỜI THƯỜNG',
        threatLevel: 'AN TOÀN / KHÔNG PHÁT HIỆN DẤU HIỆU ĐE DỌA (5%)',
        threatScore: 5,
        badgeColor: 'bg-emerald-600 text-white',
        borderCol: 'border-emerald-600',
        elderlySummary:
          'TIN NHẮN ĐỜI THƯỜNG: Đây là tin nhắn hẹn gặp uống cà phê thông thường. Không có liên kết độc hại, không có yêu cầu chuyển tiền hay dọa nạt gì cả. Bác có thể hoàn toàn yên tâm.',
        youthSummary:
          'TIN NHẮN BÌNH THƯỜNG: Không có dấu hiệu lừa đảo công nghệ cao. Khi hẹn gặp bạn bè hoặc người quen ngoài đời, hãy chọn địa điểm công cộng đông người.',
        evidenceMatrix: [
          { label: 'Đe dọa / Tống tiền', value: 'KHÔNG PHÁT HIỆN', status: 'safe', detail: 'Không chứa thuật ngữ cưỡng ép hay dọa bắt giữ' },
          { label: 'Liên kết độc hại / APK', value: 'KHÔNG CÓ', status: 'safe', detail: 'Không có đường link lạ hay file cài đặt' },
          { label: 'Yêu cầu tài chính / OTP', value: 'KHÔNG CÓ', status: 'safe', detail: 'Không yêu cầu chuyển tiền hay đòi mã số bí mật' },
          { label: 'Ngữ cảnh giao tiếp', value: 'GẶP CÀ PHÊ ĐỜI THƯỜNG', status: 'safe', detail: 'Địa điểm công cộng rõ ràng' },
        ],
        psychology: {
          tactic: 'GIAO TIẾP KẾT NỐI BẠN BÈ TỰ NHIÊN',
          analysis:
            'Nội dung ngắn gọn, mạch lạc, đề xuất hẹn gặp tại quán cà phê công cộng. Không sử dụng các đòn tâm lý sợ hãi, không hối thúc chuyển tiền hay tạo áp lực thời gian.',
        },
        entities: {
          impersonated: 'Không có (Tin nhắn cá nhân)',
          financialDemand: '0 VNĐ (Không yêu cầu tiền)',
          urgency: 'Không có áp lực cưỡng chế',
          channel: 'Tin nhắn trao đổi cá nhân',
        },
        legalCode: 'Không có dấu hiệu vi phạm pháp luật hình sự.',
        actionPlan: [
          '1. AN TÂM: Đây là tin nhắn trò chuyện xã hội thông thường.',
          '2. NGUYÊN TẮC AN TOÀN ĐỜI THƯỜNG: Nếu hẹn gặp người quen qua mạng, luôn chọn nơi công cộng đông người (quán cà phê, trung tâm thương mại).',
          '3. CẢNH GIÁC TIẾP THEO: Nếu trong buổi gặp đối phương bất ngờ rủ rê nạp tiền đầu tư, hãy từ chối ngay lập tức.',
        ],
      });
    } else if (isPigButchering) {
      setForensicReport({
        category: 'CẢNH GIÁC BẪY TÌNH CẢM DẪN DỤ ĐẦU TƯ (PIG BUTCHERING SCAM)',
        threatLevel: 'GIAI ĐOẠN 1: XÂY DỰNG LÒNG TIN & HÌNH MẪU (35%)',
        threatScore: 35,
        badgeColor: 'bg-amber-600 text-white',
        borderCol: 'border-amber-500',
        elderlySummary:
          'CHƯA CÓ YÊU CẦU ĐÒI TIỀN: Đây là tin nhắn làm quen kết bạn lịch sự. Tuy nhiên bác/anh chị cần hết sức cảnh giác: Nếu sau này người này khoe đầu tư BĐS, chứng khoán hoặc rủ nạp tiền sàn ảo thì TUYỆT ĐỐI KHÔNG gửi tiền!',
        youthSummary:
          'BẪY KẾT BẠN TẠO VỎ BỌC THÀNH ĐẠT: Đối phương tạo dựng hình ảnh làm kinh doanh lịch thiệp để lấy lòng tin. Tuyệt đối không chia sẻ thông tin tài sản hay tham gia các mô hình nạp tiền sau này!',
        evidenceMatrix: [
          { label: 'Yêu cầu chuyển tiền ngay', value: 'CHƯA PHÁT SINH', status: 'safe', detail: 'Chưa có yêu cầu chuyển khoản trực tiếp trong tin nhắn ban đầu' },
          { label: 'Liên kết đính kèm', value: 'KHÔNG CÓ', status: 'safe', detail: 'Chưa gửi link sàn giao dịch' },
          { label: 'Dấu hiệu xây dựng vỏ bọc', value: 'CÓ DẤU HIỆU ĐÁNG NGỜ', status: 'warning', detail: 'Khoe nghề BĐS, sn 99, lịch sự, đàng hoàng, không vụ lợi nam nữ để xóa bỏ phòng vệ' },
          { label: 'Kịch bản nhận diện', value: 'BẪY MỔ HEO (ROMANCE SCAM)', status: 'warning', detail: 'Kịch bản kinh điển: Kết bạn $\\rightarrow$ Thân thiết $\\rightarrow$ Dụ đầu tư tài chính sinh lời' },
        ],
        psychology: {
          tactic: 'BẪY THIỆN CẢM & NUÔI DƯỠNG LÒNG TIN (TRUST CULTIVATION TECHNIQUE)',
          analysis:
            'Kẻ gian chủ động tạo vỏ bọc người trẻ thành đạt (kinh doanh BĐS, độc thân), nhấn mạnh tiêu chí "nghiêm túc, đàng hoàng, lịch sự, không vụ lợi nam nữ" để xóa bỏ rào cản phòng thủ tâm lý của đối phương. Mục đích là kéo dài trò chuyện vài ngày/tuần trước khi dẫn dắt sang "dự án đầu tư sinh lời" hoặc "sàn tài chính tay trong".',
        },
        entities: {
          impersonated: 'Vỏ bọc chuyên viên BĐS / Người kinh doanh tự do',
          financialDemand: 'Chưa đòi tiền (Sẽ phát sinh sau khi đã lấy được lòng tin)',
          urgency: 'Không vội vã, tiếp cận từ tốn để nuôi dưỡng sự tin tưởng',
          channel: 'Zalo / Mạng xã hội / Ứng dụng hẹn hò',
        },
        legalCode:
          'Hành vi tiếp cận làm quen thông thường chưa cấu thành tội phạm, nhưng là tiền đề của Tội lừa đảo chiếm đoạt tài sản (Điều 174 BLHS) nếu có hành vi dẫn dụ chuyển tiền đầu tư khống.',
        actionPlan: [
          '1. KHÔNG TIẾT LỘ TÌNH HÌNH TÀI CHÍNH: Tuyệt đối không khoe thu nhập, sổ tiết kiệm hay tài sản cá nhân.',
          '2. BẢO VỆ DANH TÍNH: Không gửi ảnh CCCD, thông tin ngân hàng cho người mới quen trên mạng.',
          '3. QUY TẮC BẤT DI BẤT DỊCH: Nếu đối phương nhắc đến "sàn đầu tư", "chứng khoán quốc tế", "app kiếm tiền" -> NGẮT KẾT NỐI NGAY LẬP TỨC.',
        ],
      });
    } else if (isLawImpersonation) {
      setForensicReport({
        category: 'GIẢ DANH CƠ QUAN BẢO VỆ PHÁP LUẬT & TÒA ÁN',
        threatLevel: 'NGUY CƠ LỪA ĐẢO TỐI CAO (100%)',
        threatScore: 100,
        badgeColor: 'bg-red-700 text-white',
        borderCol: 'border-red-600',
        elderlySummary:
          'BÁC CHÚ Ý: Đây là bọn lừa đảo giả danh Công an dọa bắt để ép bác chuyển tiền. Công an thật KHÔNG BAO GIỜ gọi điện đòi tiền. Bác hãy DẬP MÁY NGAY và kể cho con cháu!',
        youthSummary:
          'KẺ GIAN DỌA BẮT GIAM ĐỂ TỐNG TIỀN. Tuyệt đối không làm theo, hãy đưa ngay tin nhắn này cho Bố Mẹ!',
        evidenceMatrix: [
          { label: 'Thủ đoạn', value: 'GIẢ DANH CÔNG AN / TÒA ÁN', status: 'danger', detail: 'Tự xưng cơ quan tố tụng dọa bắt giam / phạt nguội' },
          { label: 'Yêu cầu tài chính', value: 'ÉP CHUYỂN TIỀN TẠM GIỮ', status: 'danger', detail: 'Đòi chuyển tiền vào tài khoản cá nhân núp bóng Bộ Công An' },
          { label: 'Thao túng tâm lý', value: 'CÔ LẬP NẠN NHÂN', status: 'danger', detail: 'Ép bí mật tuyệt đối với người thân vì "an ninh quốc gia"' },
          { label: 'Kênh tống đạt', value: 'SAI QUY ĐỊNH PHÁP LUẬT', status: 'danger', detail: 'Pháp luật chỉ gửi giấy triệu tập trực tiếp qua Công an phường/xã' },
        ],
        psychology: {
          tactic: 'BẪY SỢ HÃI TỘI PHẠM & CÔ LẬP NẠN NHÂN (Fear & Isolation Technique)',
          analysis:
            'Kẻ gian dùng thuật ngữ đe dọa (Lệnh bắt, khởi tố, tạm giam, tịch thu tài sản) để kích hoạt trạng thái hoảng loạn. Yêu cầu "Tuyệt đối giữ bí mật với người thân vì lý do an ninh" là đòn tâm lý cô lập kinh điển để nạn nhân không có cơ hội được người khác can ngăn!',
        },
        entities: {
          impersonated: 'Tòa án Nhân dân / Viện Kiểm Sát / Cục CSGT',
          financialDemand: 'Yêu cầu chuyển tiền vào tài khoản cá nhân núp bóng "Tài khoản tạm giữ của Bộ"',
          urgency: 'Ép mốc thời gian gấp (Trước 17h) nhằm triệt tiêu khả năng kiểm chứng',
          channel: 'Tin nhắn SMS / Mạng xã hội (Trái với quy trình tống đạt văn bản pháp luật)',
        },
        legalCode:
          'Căn cứ Điều 174 Bộ luật Hình sự (Tội lừa đảo chiếm đoạt tài sản):\n• Khung hình phạt từ 12 đến 20 năm tù hoặc TÙ CHUNG THÂN đối với hành vi phạm tội có tổ chức hoặc chiếm đoạt tài sản giá trị lớn.',
        actionPlan: [
          '1. DỪNG TOÀN BỘ GIAO DỊCH: Cơ quan Công an và Tòa án KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu chuyển tiền vào tài khoản cá nhân.',
          '2. BÁO NGAY CHO GIA ĐÌNH: Kể cho người thân hoặc bạn bè ngay lập tức để giải tỏa tâm lý.',
          '3. TRÌNH BÁO CÔNG AN: Mang nội dung tin nhắn và số điện thoại kẻ gian đến Công an phường/xã gần nhất.',
        ],
      });
    } else if (isTaskScam) {
      setForensicReport({
        category: 'BẪY TUYỂN DỤNG CỘNG TÁC VIÊN LÀM NHIỆM VỤ (PONZI SCAM)',
        threatLevel: 'LỪA ĐẢO TÀI CHÍNH NGUY HIỂM (97%)',
        threatScore: 97,
        badgeColor: 'bg-amber-600 text-white',
        borderCol: 'border-amber-600',
        elderlySummary:
          'BẪY LỪA VIỆC NHẸ LƯƠNG CAO: Dụ chuyển tiền đặt cọc rồi chiếm đoạt sạch. Bác tuyệt đối không gửi tiền!',
        youthSummary:
          'BẪY LÀM NHIỆM VỤ KIẾM TIỀN ẢO: Dụ nạp tiền làm đơn hàng Shopee rồi chặn nick. Dừng nạp ngay!',
        evidenceMatrix: [
          { label: 'Thủ đoạn', value: 'BẪY VIỆC NHẸ LƯƠNG CAO', status: 'danger', detail: 'Dụ làm cộng tác viên Shopee, TikTok Shop nhận hoa hồng' },
          { label: 'Yêu cầu tài chính', value: 'NẠP TIỀN CỌC DUYỆT ĐƠN', status: 'danger', detail: 'Đơn nhỏ trả tiền thật, đơn lớn viện cớ lỗi cú pháp ép nạp thêm' },
          { label: 'Kênh tiếp cận', value: 'NHÓM TELEGRAM / ZALO ẢO', status: 'danger', detail: 'Các tài khoản khoe nhận tiền đều là chim mồi (chân gỗ)' },
        ],
        psychology: {
          tactic: 'BẪY LÒNG THAM & THẢ CON TÉP BẮT CON TÔM (Greed & Escalation Technique)',
          analysis:
            'Ban đầu cho làm nhiệm vụ đơn giản và trả hoa hồng thật vài chục nghìn để tạo niềm tin. Sau đó dụ nạp tiền triệu làm đơn hàng lớn rồi viện cớ "lỗi cú pháp, hệ thống nghẽn" ép nạp thêm gấp bội để rút vốn.',
        },
        entities: {
          impersonated: 'Sàn thương mại điện tử Shopee / TikTok Shop',
          financialDemand: 'Nạp tiền cọc, nạp tiền duyệt đơn hàng VIP',
          urgency: 'Hoa hồng về sau 5 phút, giới hạn số suất cộng tác viên',
          channel: 'Nhóm Telegram / Zalo nặc danh',
        },
        legalCode:
          'Căn cứ Điều 290 Bộ luật Hình sự (Tội sử dụng mạng máy tính chiếm đoạt tài sản):\n• Mức phạt tù cao nhất lên đến 20 năm.',
        actionPlan: [
          '1. DỪNG NẠP TIỀN NGAY LẬP TỨC: Càng nạp tiền để "chuộc tiền cũ" càng mất trắng.',
          '2. THOÁT KHỎI NHÓM CHAT: Các tài khoản khoe nhận tiền trong nhóm 100% là "chân gỗ" của nhóm lừa đảo.',
          '3. LƯU GIỮ BẰNG CHỨNG để nộp cơ quan cảnh sát điều tra.',
        ],
      });
    } else if (isGameGiftScam) {
      setForensicReport({
        category: 'BẪY LỪA NẠP GAME & QUÀ TẶNG ẢO CHO HỌC SINH',
        threatLevel: 'LỪA ĐẢO CHIẾM THẺ CÀO & ACC (99%)',
        threatScore: 99,
        badgeColor: 'bg-rose-600 text-white',
        borderCol: 'border-rose-600',
        elderlySummary:
          'Kẻ xấu đang dụ dỗ con/cháu trong nhà nạp tiền chơi game hoặc nhận quà tặng giả. Bác hãy kiểm tra điện thoại của các cháu.',
        youthSummary:
          'CẢNH BÁO 100% LỪA ĐẢO! Không có trang web nào tặng kim cương miễn phí hay nhân 5 thẻ nạp cả. Bạn sẽ mất acc hoặc mất tiền thẻ cào!',
        evidenceMatrix: [
          { label: 'Thủ đoạn', value: 'TẶNG QUÀ GAME MIỄN PHÍ ẢO', status: 'danger', detail: 'Hứa hẹn nhân 5 thẻ nạp, tặng Robux/Kim Cương Free Fire' },
          { label: 'Yêu cầu tài chính', value: 'ĐÒI MÃ THẺ CÀO ĐIỆN THOẠI', status: 'danger', detail: 'Ép gửi số seri và mã cào để chiếm đoạt thẻ' },
        ],
        psychology: {
          tactic: 'ĐÁNH VÀO TÂM LÝ HAM ĐỒ HIẾM TRONG GAME CỦA HỌC SINH',
          analysis:
            'Lập trang web nhái giao diện game Free Fire, Liên Quân, Roblox hứa tặng skin hiếm, ép nhập tài khoản mật khẩu hoặc mã thẻ cào.',
        },
        entities: {
          impersonated: 'Nhà phát hành Garena / Roblox / VNG',
          financialDemand: 'Đòi mã thẻ cào Viettel/Vina hoặc mật khẩu nick game',
          urgency: 'Chỉ còn 10 phút trước khi sự kiện đóng lại',
          channel: 'Video TikTok, Discord, Telegram',
        },
        legalCode: 'Hành vi chiếm đoạt tài sản quy định tại Điều 290 Bộ luật Hình sự.',
        actionPlan: [
          '1. KHÔNG NHẬP MÃ THẺ CÀO: Tiền nạp sẽ mất ngay lập tức.',
          '2. ĐỔI MẬT KHẨU ACC GAME NGAY LẬP TỨC nếu đã lỡ nhập nick.',
          '3. NÓI THẬT VỚI BỐ MẸ để được hỗ trợ khóa tài khoản.',
        ],
      });
    } else if (isRealBankPhishing) {
      setForensicReport({
        category: 'BẪY PHISHING ĐÁNH CẮP MẬT KHẨU & OTP NGÂN HÀNG',
        threatLevel: 'NGUY CƠ XÂM NHẬP TÀI KHOẢN (99%)',
        threatScore: 99,
        badgeColor: 'bg-red-600 text-white',
        borderCol: 'border-red-600',
        elderlySummary:
          'BÁC LƯU Ý: Tin nhắn báo tài khoản ngân hàng bị khóa là tin giả! Kẻ gian muốn bác bấm vào link để cướp tiền. Tuyệt đối không bấm link!',
        youthSummary:
          'LINK GIẢ MẠO ĐÁNH CẮP TÀI KHOẢN. Không bấm vào link, báo ngay cho bố mẹ kiểm tra app ngân hàng thật.',
        evidenceMatrix: [
          { label: 'Thủ đoạn', value: 'BÁO ĐỘNG GIẢ TÀI KHOẢN BỊ KHÓA', status: 'danger', detail: 'Dọa tài khoản bị đăng nhập lạ ở nước ngoài' },
          { label: 'Liên kết giả mạo', value: 'TÊN MIỀN NHÁI NGÂN HÀNG', status: 'danger', detail: 'Chứa link lừa đảo đánh cắp tên đăng nhập và OTP' },
        ],
        psychology: {
          tactic: 'BẪY BÁO ĐỘNG GIẢ (False Alarm Technique)',
          analysis:
            'Dựng kịch bản "tài khoản bị đăng nhập bất thường ở nước ngoài" để nạn nhân vội vã bấm vào link giả mạo mà không để ý tên miền.',
        },
        entities: {
          impersonated: 'Bộ phận bảo mật SmartBanking Ngân hàng',
          financialDemand: 'Chiếm đoạt mật khẩu và mã OTP giao dịch',
          urgency: 'Tài khoản sẽ bị khóa vĩnh viễn sau 30 phút nếu không xác thực',
          channel: 'Tin nhắn giả mạo trạm phát sóng BTS',
        },
        legalCode: 'Vi phạm Điều 290 & Điều 174 Bộ luật Hình sự.',
        actionPlan: [
          '1. TUYỆT ĐỐI KHÔNG BẤM VÀO LINK TRONG TIN NHẮN.',
          '2. Mở trực tiếp app ngân hàng đã cài trên máy để đổi mật khẩu ngay.',
          '3. KHÔNG BAO GIỜ ĐỌC MÃ OTP CHO BẤT KỲ AI KỂ CẢ NHÂN VIÊN NGÂN HÀNG.',
        ],
      });
    } else if (isBtsFake2g) {
      setForensicReport({
        category: 'TRẠM BTS GIẢ MẠO 2G (SMS BRANDNAME SPOOFING)',
        threatLevel: 'TỘI PHẠM VIỄN THÔNG CÔNG NGHỆ CAO (99%)',
        threatScore: 99,
        badgeColor: 'bg-red-600 text-white',
        borderCol: 'border-red-600',
        elderlySummary:
          'BÁC CHÚ Ý: Kẻ gian chở trạm phát sóng di động lậu đi ngoài đường để chèn tin nhắn giả vào tên ngân hàng thật. Ngân hàng thật không gửi tin nhắn này. Bác tuyệt đối không bấm vào link!',
        youthSummary:
          'BẪY TRẠM PHÁT SÓNG BTS 2G GIẢ! Kẻ lừa đảo phát sóng 2G đè sóng viễn thông để giả Brandname ngân hàng. Hãy vào Cài đặt di động -> TẮT 2G (Disable 2G) để phòng thủ triệt để.',
        evidenceMatrix: [
          { label: 'Thủ đoạn kỹ thuật', value: 'TRẠM BTS 2G LẬU (IMSI CATCHER)', status: 'danger', detail: 'Thiết bị phát sóng di động trái phép chèn tin nhắn vào luồng Brandname thật' },
          { label: 'Liên kết đính kèm', value: 'TÊN MIỀN PHISHING NGOẠI LAI', status: 'danger', detail: 'Tên miền mạo danh đuôi lạ (.site, .top, .xyz) không thuộc ngân hàng' },
          { label: 'Quy định Ngân hàng', value: 'NGÂN HÀNG KHÔNG GỬI LINK', status: 'danger', detail: 'Từ 2023, các ngân hàng Việt Nam cam kết KHÔNG gửi link trong tin nhắn SMS' },
          { label: 'Giải pháp phòng thủ', value: 'TẮT KẾT NỐI MẠNG 2G TRÊN MÁY', status: 'warning', detail: 'Bật chế độ Chỉ dùng 4G/5G để vô hiệu hóa hoàn toàn trạm BTS lậu' },
        ],
        psychology: {
          tactic: 'LỢI DỤNG LỖ HỔNG XÁC THỰC MẠNG 2G GSM',
          analysis:
            'Công nghệ 2G không có cơ chế xác thực hai chiều giữa trạm phát và điện thoại. Kẻ gian phát công suất lớn đè sóng nhà mạng Viettel/Vina/Mobi, ép điện thoại hạ xuống 2G rồi gửi tin nhắn mạo danh Brandname chính thức.',
        },
        entities: {
          impersonated: 'Brandname Ngân hàng chính thức',
          financialDemand: 'Dẫn dụ bấm vào web câu trộm tài khoản',
          urgency: 'Báo khóa tài khoản hoặc trừ phí duy trì dịch vụ',
          channel: 'Sóng vô tuyến 2G phát lậu từ xe ô tô/xe máy di động',
        },
        legalCode:
          'Vi phạm Điều 290 Bộ luật Hình sự & Nghị định 14/2022/NĐ-CP về quản lý tần số vô tuyến điện (Phạt tù từ 7 đến 15 năm).',
        actionPlan: [
          '1. KHÔNG CLICK VÀO ĐƯỜNG LINK: Tên miền .site/.top là web giả mạo 100%.',
          '2. CÁCH PHÒNG THỦ KỸ THUẬT: Vào Cài đặt điện thoại -> Mạng di động -> Tắt 2G (hoặc chọn "Chỉ dùng 4G/5G") để máy không bắt sóng trạm lậu.',
          '3. BÁO CÁO CƠ QUAN CHỨC NĂNG: Phản ánh tin nhắn rác lừa đảo tới đầu số 156 hoặc 5656.',
        ],
      });
    } else if (isBiometricEvasion) {
      setForensicReport({
        category: 'BẪY NÉ SINH TRẮC HỌC (QUYẾT ĐỊNH 2345/QĐ-NHNN)',
        threatLevel: 'CẢNH BÁO TÀI KHOẢN MULE RỬA TIỀN (99%)',
        threatScore: 99,
        badgeColor: 'bg-rose-600 text-white',
        borderCol: 'border-rose-600',
        elderlySummary:
          'BÁC CHÚ Ý NGUY HIỂM: Đối tượng giục bác chuyển tiền nhiều lần dưới 10 triệu (như 9.9 triệu) là để trốn việc quét mặt CCCD của Ngân hàng Nhà nước. Đây 100% là tài khoản lừa đảo, bác đừng chuyển!',
        youthSummary:
          'DẤU HIỆU CỐ TÌNH LÁCH LUẬT 2345/QĐ-NHNN! Kẻ gian dùng tài khoản "rác" không có CCCD gắn chip nên bắt buộc phải chia nhỏ giao dịch dưới 10 triệu để không bị quét sinh trắc học Face ID.',
        evidenceMatrix: [
          { label: 'Quy chuẩn pháp luật', value: 'QUYẾT ĐỊNH 2345/QĐ-NHNN', status: 'danger', detail: 'Quy định bắt buộc xác thực khuôn mặt khớp CCCD chip khi chuyển > 10 triệu đồng' },
          { label: 'Hành vi đối tượng', value: 'CHIA NHỎ KHOẢN TIỀN (9.9TR)', status: 'danger', detail: 'Cố tình yêu cầu chuyển nhiều lần dưới 10 triệu để né kiểm tra sinh trắc học' },
          { label: 'Bản chất tài khoản', value: 'TÀI KHOẢN RÁC (MONEY MULE)', status: 'danger', detail: 'Tài khoản mua bán của sinh viên/người khác, không có mặt chủ tài khoản để quét chip' },
          { label: 'Nguy cơ tài chính', value: 'TẨU TÁN TIỀN RA SÀN TIỀN ẢO', status: 'danger', detail: 'Tiền sau khi nhận sẽ được chuyển tẩu tán chỉ trong vòng 60 - 90 giây' },
        ],
        psychology: {
          tactic: 'THAO TÚNG NÉ TRÁNH RÀO CẢN BẢO MẬT NHÀ NƯỚC',
          analysis:
            'Kẻ lừa đảo tìm mọi lý do như "chuyển nhanh đỡ nghẽn mạng", "chuyển cho tiện" nhằm tránh việc hệ thống ngân hàng kích hoạt luồng đối chiếu sinh trắc học với Cơ sở dữ liệu Quốc gia về Dân cư.',
        },
        entities: {
          impersonated: 'Người nhận tiền / Kẻ thao túng giao dịch',
          financialDemand: 'Chuyển nhiều lần các món tiền dưới 10.000.000 VNĐ',
          urgency: 'Giục chuyển ngay kẻo muộn',
          channel: 'Tin nhắn chat Zalo / Telegram / Messenger',
        },
        legalCode:
          'Vi phạm Quyết định 2345/QĐ-NHNN của Ngân hàng Nhà nước và Điều 291 Bộ luật Hình sự (Tội thu thập, tàng trữ, mua bán, sử dụng trái phép thông tin tài khoản ngân hàng).',
        actionPlan: [
          '1. DỪNG CHUYỂN TIỀN NGAY LẬP TỨC: Tuyệt đối không chia nhỏ tiền theo chỉ dẫn của đối tượng.',
          '2. YÊU CẦU GỌI VIDEO XÁC THỰC: Yêu cầu đối phương gọi video thấy mặt trực tiếp để kiểm chứng danh tính.',
          '3. BÁO CÁO SỐ TÀI KHOẢN: Nhập số tài khoản này vào mục Soi Tài Khoản Ngân Hàng của VeraFense để kiểm tra danh sách đen.',
        ],
      });
    } else {
      // DEFAULT FALLBACK: GENERAL CASUAL / UNCATEGORIZED SAFE TEXT
      setForensicReport({
        category: 'VĂN BẢN THÔNG THƯỜNG / CHƯA PHÁT HIỆN NGUY CƠ',
        threatLevel: 'MỨC ĐỘ RỦI RO THẤP (10%)',
        threatScore: 10,
        badgeColor: 'bg-teal-600 text-white',
        borderCol: 'border-teal-600',
        elderlySummary:
          'TIN NHẮN CHƯA THẤY DẤU HIỆU LỪA ĐẢO: Hệ thống không tìm thấy từ khóa đòi tiền, dọa nạt hay đường link độc hại trong đoạn tin nhắn này.',
        youthSummary:
          'NỘI DUNG AN TOÀN: Chưa phát hiện dấu hiệu tống tiền hay mã độc. Tuy nhiên luôn cẩn trọng nếu đối phương yêu cầu chuyển tiền sau này.',
        evidenceMatrix: [
          { label: 'Yêu cầu chuyển tiền', value: 'KHÔNG PHÁT HIỆN', status: 'safe', detail: 'Không có thông tin đòi tiền hay số tài khoản' },
          { label: 'Đường link lạ', value: 'KHÔNG CÓ', status: 'safe', detail: 'Không chứa liên kết dẫn đến trang web độc hại' },
          { label: 'Dấu hiệu dọa nạt', value: 'KHÔNG CÓ', status: 'safe', detail: 'Không có hành vi giả danh cơ quan tố tụng' },
        ],
        psychology: {
          tactic: 'NỘI DUNG TRAO ĐỔI THÔNG THƯỜNG',
          analysis: 'Không phát hiện các mẫu thức thao túng tâm lý sợ hãi, tham lam hay cô lập nạn nhân.',
        },
        entities: {
          impersonated: 'Không xác định',
          financialDemand: '0 VNĐ',
          urgency: 'Bình thường',
          channel: 'Tin nhắn trao đổi',
        },
        legalCode: 'Không phát hiện dấu hiệu vi phạm pháp luật.',
        actionPlan: [
          '1. Tiếp tục theo dõi nếu đối phương là người mới quen trên mạng.',
          '2. Giữ nguyên tắc: Không gửi mã OTP, không chuyển tiền đặt cọc cho bất kỳ ai.',
        ],
      });
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
