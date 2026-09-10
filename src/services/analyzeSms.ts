import { ForensicReport } from '../types';

export const analyzeSms = (textToAnalyze: string): ForensicReport | null => {
  const text = textToAnalyze.trim();
  if (!text) return null;

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
      return {
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
      };
    } else if (isPigButchering) {
      return {
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
      };
    } else if (isLawImpersonation) {
      return {
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
      };
    } else if (isTaskScam) {
      return {
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
      };
    } else if (isGameGiftScam) {
      return {
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
      };
    } else if (isRealBankPhishing) {
      return {
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
      };
    } else if (isBtsFake2g) {
      return {
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
      };
    } else if (isBiometricEvasion) {
      return {
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
      };
    } else {
      // DEFAULT FALLBACK: GENERAL CASUAL / UNCATEGORIZED SAFE TEXT
      return {
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
      };
    }
};

