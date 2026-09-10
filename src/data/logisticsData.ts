import { LogisticsRiskProfile } from '../types';

export const LOGISTICS_DATABASE: LogisticsRiskProfile[] = [
  {
    phone: '0867889900',
    name: 'Khách Đặt Giao Nhanh Ẩn Danh (Quán Net / Chân Cầu)',
    carrier: 'Viettel',
    trustScore: 0,
    riskCategory: 'CONTRABAND_TRAP',
    categoryLabel: 'BẪY VẬN CHUYỂN HÀNG CẤM / MA TÚY (NGUY CƠ TÙ TỘI ĐIỀU 250 BLHS)',
    tagBadge: 'bg-red-600 text-white animate-pulse',
    borderColor: 'border-red-600 bg-red-950/40',
    deliveryStats: {
      totalOrders: 4,
      deliveredCount: 0,
      boomCount: 4,
      successRate: 0,
      averageOrderValue: 250000,
      primaryBoomReason: 'Công an bắt quả tang / Shipper nghi vấn từ chối giao',
      frequentRefusalKeyword: 'Bọc kín mít, dặn không được mở xem, giục giao gấp',
    },
    driverRisk: {
      hasFareEvasion: true,
      evasionCount: 1,
      reportedLossAmount: 350000,
      tacticSummary: 'Đặt giao ngoài app hoặc hủy đơn trên app để chuyển sang giao chui với giá cao gấp 3 lần',
      lastIncidentDesc: 'Hẹn tài xế ở gầm cầu vượt, đưa gói hàng bọc kín băng dính đen, bảo là tài liệu mật.',
      nightRideWarning: true,
    },
    contrabandWarning: {
      isReportedForContraband: true,
      threatSeverity: 'CRITICAL_LEGAL_RISK',
      substanceSuspected: 'Nghi vấn ma túy đá / thuốc lắc MDMA / bóng cười N2O',
      tacticSummary: 'Dùng shipper làm "con tốt thế thân". Nếu hàng trót lọt thì kẻ gian lấy, nếu bị CSGT/Cơ động bắt thì shipper bị giữ vì tang vật trong tay!',
      legalArticle: 'Điều 250 Bộ luật Hình sự (Tội vận chuyển trái phép chất ma túy - Khung hình phạt từ 2 năm tù đến TÙ CHUNG THÂN HOẶC TỬ HÌNH)',
      emergencyProtocol: [
        '1. DỨT KHOÁT TỪ CHỐI nếu người gửi không đồng ý mở gói hàng cho bạn kiểm tra tận mắt (Quy định đồng kiểm).',
        '2. Không nhận các đơn nhận hàng ở địa điểm vắng vẻ, công cộng (chân cầu, gốc cây, ngã ba không số nhà).',
        '3. Bật camera điện thoại quay lại toàn bộ quá trình đóng gói và khuôn mặt người gửi.',
        '4. Nếu đã lỡ nhận và phát hiện chất cấm, LẬP TỨC mang đến trụ sở Công an gần nhất trình báo tự nguyện để được bảo vệ và chứng minh vô can.',
      ],
    },
    recentReports: [
      {
        date: '05/09/2026',
        platform: 'Ahamove / Lalamove',
        lossAmount: 0,
        reporterType: 'courier',
        detail: 'Khách đứng góc tối đưa ly trà sữa bọc kín băng dính dặn giao hỏa tốc 150k. Tôi đòi mở ra thì giật lại bỏ chạy!',
        routeOrArea: 'Khu vực Ngã Tư Ga - Q.12, TP.HCM',
      },
      {
        date: '28/08/2026',
        platform: 'GrabExpress',
        lossAmount: 0,
        reporterType: 'courier',
        detail: 'Gói đồ nặng nghi là bình khí N2O bóng cười quấn chăn, báo công an phường lập biên bản tịch thu.',
        routeOrArea: 'Đống Đa, Hà Nội',
      },
    ],
    actionPlan: [
      'CHẶN NGAY SỐ NÀY và BÁO CÁO CÔNG TY CÔNG NGHỆ (Grab/Ahamove/Lalamove) khóa vĩnh viễn tài khoản người gửi.',
      'Lưu vết định vị GPS và tin nhắn yêu cầu làm bằng chứng bảo vệ bản thân nếu bị cơ quan chức năng triệu tập.',
    ],
  },
  {
    phone: '0938445566',
    name: 'Đối Tượng Đi Xe Quỵt Cước & Bùng Tiền Đêm',
    carrier: 'Mobifone',
    trustScore: 8,
    riskCategory: 'EVASION_RIDE',
    categoryLabel: 'KHÁCH BÙNG CƯỚC XE ÔM CÔNG NGHỆ & LỪA NẠP THẺ (GRAB/BE/XANH SM)',
    tagBadge: 'bg-amber-600 text-white',
    borderColor: 'border-amber-600 bg-amber-950/40',
    deliveryStats: {
      totalOrders: 6,
      deliveredCount: 1,
      boomCount: 5,
      successRate: 16.7,
      averageOrderValue: 320000,
      primaryBoomReason: 'Chạy vào hẻm cụt khóa cổng trốn, tắt máy',
      frequentRefusalKeyword: 'Bảo người nhà ra trả rồi tẩu thoát',
    },
    driverRisk: {
      hasFareEvasion: true,
      evasionCount: 5,
      reportedLossAmount: 1850000,
      tacticSummary: 'Đặt chuyến xa ban đêm (200k - 450k), tới nơi giả vờ vào nhà lấy tiền, khóa trái cửa hoặc trốn ngõ sau. Từng dụ tài xế nạp hộ card điện thoại 100k hứa trả tiền mặt rồi bùng cả đôi.',
      lastIncidentDesc: 'Chở từ Quận 1 về Nhà Bè cuốc 380k lúc 23h30. Đến nơi bảo chờ 5 phút người nhà ra trả rồi trèo tường biến mất.',
      nightRideWarning: true,
    },
    recentReports: [
      {
        date: '04/09/2026',
        platform: 'Grab',
        lossAmount: 380000,
        reporterType: 'driver',
        detail: 'Bị quỵt cuốc 380k đi đêm về Nhà Bè. Đối tượng giả vờ bấm chuông gọi người nhà rồi chạy tuốt vào hẻm sâu.',
        routeOrArea: 'Lê Văn Lương, H. Nhà Bè, TP.HCM',
      },
      {
        date: '22/08/2026',
        platform: 'Be',
        lossAmount: 420000,
        reporterType: 'driver',
        detail: 'Nhờ nạp card 100k và cước xe 320k. Lừa bảo vào quán bar lấy tiền gửi rồi trốn mất.',
        routeOrArea: 'Bùi Viện, Q.1, TP.HCM',
      },
      {
        date: '10/08/2026',
        platform: 'Xanh SM',
        lossAmount: 250000,
        reporterType: 'driver',
        detail: 'Khách đi từ Bến xe Miền Tây về Bình Tân, xuống xe bảo chuyển khoản nhưng chìa ảnh bill làm giả rồi phóng đi.',
        routeOrArea: 'Bình Tân, TP.HCM',
      },
    ],
    actionPlan: [
      'YÊU CẦU THANH TOÁN TRƯỚC đối với các cuốc xe đêm đi xa trên 150.000đ hoặc vào khu vực vắng vẻ.',
      'TUYỆT ĐỐI KHÔNG NẠP THẺ, KHÔNG CHUYỂN KHOẢN HỘ cho khách lạ dù bất kỳ lý do gì.',
      'Khi khách xin vào nhà lấy tiền, yêu cầu để lại ba lô/túi xách hoặc đứng cùng tài xế tại cổng.',
    ],
  },
  {
    phone: '0903112233',
    name: 'Nhóm "Thợ Săn Hàng Sale / Bom Hàng Chuyên Nghiệp"',
    carrier: 'Mobifone',
    trustScore: 12,
    riskCategory: 'BOOM_HANG',
    categoryLabel: 'TỶ LỆ BOM HÀNG 83.3% - CHUYÊN HẸN HOÃN & TẮT MÁY (TIKTOK / SHOPEE)',
    tagBadge: 'bg-rose-600 text-white',
    borderColor: 'border-rose-600 bg-rose-950/40',
    deliveryStats: {
      totalOrders: 18,
      deliveredCount: 3,
      boomCount: 15,
      successRate: 16.7,
      averageOrderValue: 450000,
      primaryBoomReason: 'Thuê bao không liên lạc được, hẹn 3 lần rồi bảo không có tiền lấy',
      frequentRefusalKeyword: 'Shop gửi sai màu, em không thích nữa, hết tiền',
    },
    driverRisk: {
      hasFareEvasion: false,
      evasionCount: 0,
      reportedLossAmount: 0,
      tacticSummary: 'Đặt hàng theo cảm xúc / săn mã giảm giá ảo, đến lúc giao thì hối hận không nhận. Thường cho địa chỉ ngõ ngách xa để shipper ngại quay lại.',
      lastIncidentDesc: 'Đặt 3 đơn đầm dạ hội trị giá 1.800.000đ của 3 shop khác nhau, shipper đến bấm chuông thì không mở cửa, gọi tắt máy.',
      nightRideWarning: false,
    },
    recentReports: [
      {
        date: '06/09/2026',
        platform: 'TikTok Shop',
        lossAmount: 70000,
        reporterType: 'shop',
        detail: 'Khách bom set mỹ phẩm 650k, shop mất 70k phí hoàn 2 chiều và bị giam hàng 10 ngày.',
        routeOrArea: 'Hà Đông, Hà Nội',
      },
      {
        date: '01/09/2026',
        platform: 'Shopee',
        lossAmount: 45000,
        reporterType: 'courier',
        detail: 'Shipper GHTK chạy 3 lần, lần nào cũng "chờ em 10 phút" rồi khóa máy. Đơn bị chuyển hoàn.',
        routeOrArea: 'Thanh Xuân, Hà Nội',
      },
      {
        date: '19/08/2026',
        platform: 'Lazada',
        lossAmount: 55000,
        reporterType: 'shop',
        detail: 'Đặt đôi giày 800k COD, shipper giao bóc ra xem xong chê rồi không trả tiền ship hoàn.',
        routeOrArea: 'Cầu Giấy, Hà Nội',
      },
    ],
    actionPlan: [
      'CHỦ SHOP: YÊU CẦU CHUYỂN KHOẢN CỌC TỐI THIỂU 50.000đ - 100.000đ tiền ship trước khi đóng gói gửi đi.',
      'KHÔNG GỬI HÀNG COD ĐẮT TIỀN (> 500k) cho số này trừ khi đã thanh toán 100% qua cổng thanh toán.',
      'BƯU TÁ: Gọi điện thoại xác nhận trước khi chở hàng đi, nếu 2 cuộc không bắt máy thì không mang theo.',
    ],
  },
  {
    phone: '0971223344',
    name: 'Kẻ Lừa Ứng Tiền COD Bưu Kiện Ảo (Gạch Đá / Giấy Vụn)',
    carrier: 'Viettel',
    trustScore: 5,
    riskCategory: 'FAKE_COD',
    categoryLabel: 'BẪY LỪA SHIPPER ỨNG TIỀN COD (MẤT TRẮNG 500K - 2TR)',
    tagBadge: 'bg-red-600 text-white',
    borderColor: 'border-red-600 bg-red-950/40',
    deliveryStats: {
      totalOrders: 5,
      deliveredCount: 0,
      boomCount: 5,
      successRate: 0,
      averageOrderValue: 1200000,
      primaryBoomReason: 'Số người nhận là số ảo, người gửi khóa máy ngay sau khi nhận tiền ứng',
      frequentRefusalKeyword: 'Ứng tiền hàng điện thoại/đồng hồ dỏm',
    },
    fakeCodRisk: {
      isReportedForFakeCod: true,
      advanceAmountLost: 3600000,
      itemClaimed: 'Hộp đồng hồ Thụy Sĩ / Tai nghe Airpods dỏm mua 30k ở chợ Trời',
      tactic: 'Người gửi đứng cổng bệnh viện vờ gấp, nhờ shipper ứng trước 1.200.000đ giao tới văn phòng thu 1.350.000đ. Tới nơi người nhận không tồn tại, mở hộp ra chỉ có đồng hồ hỏng hoặc cục đá.',
    },
    driverRisk: {
      hasFareEvasion: true,
      evasionCount: 3,
      reportedLossAmount: 3600000,
      tacticSummary: 'Lợi dụng lòng tin và nhu cầu kiếm thêm tiền cước ứng của tài xế.',
      lastIncidentDesc: 'Bắt tài xế ứng 1.500.000đ cho hộp linh kiện máy tính cũ nát.',
    },
    recentReports: [
      {
        date: '02/09/2026',
        platform: 'Giao Hàng Tự Do / Nhóm Facebook',
        lossAmount: 1200000,
        reporterType: 'courier',
        detail: 'Bị lừa ứng 1.2 triệu tiền giao tai nghe xịn ở cổng Bệnh viện Bạch Mai. Tới địa chỉ nhận là bãi đất trống, gọi cả 2 số đều ò í e.',
        routeOrArea: 'Hai Bà Trưng, Hà Nội',
      },
      {
        date: '15/08/2026',
        platform: 'Nhóm Shipper Sài Gòn',
        lossAmount: 1500000,
        reporterType: 'courier',
        detail: 'Ứng 1.5 triệu gói hàng mỹ phẩm, bóc ra toàn chai nước lọc dán nhãn giả.',
        routeOrArea: 'Quận 10, TP.HCM',
      },
    ],
    actionPlan: [
      'QUY TẮC VÀNG: KHÔNG ỨNG TIỀN CHO KHÁCH LẠ NGOÀI HỆ THỐNG ỨNG DỤNG CHÍNH THỨC.',
      'Nếu bắt buộc ứng, yêu cầu kiểm tra hàng tận mắt và chụp ảnh CCCD của người gửi kèm biển số xe.',
      'Chỉ nhận đơn có cước ứng qua các app có bảo hiểm bồi hoàn (như Ahamove, GrabExpress COD chính quy).',
    ],
  },
  {
    phone: '0915667788',
    name: 'Khách Bom Đồ Ăn & Trà Sữa (Food Boom)',
    carrier: 'Vinaphone',
    trustScore: 19,
    riskCategory: 'BOOM_HANG',
    categoryLabel: 'CHUYÊN BOM ĐỒ ĂN / TRÀ SỮA ĐƠN LỚN (GRABFOOD / SHOPEEFOOD)',
    tagBadge: 'bg-rose-600 text-white',
    borderColor: 'border-rose-600 bg-rose-950/40',
    deliveryStats: {
      totalOrders: 10,
      deliveredCount: 2,
      boomCount: 8,
      successRate: 20.0,
      averageOrderValue: 350000,
      primaryBoomReason: 'Đặt thử, đổi ý, bạn bè trêu đùa, đặt tới địa chỉ cơ quan lúc tan tầm',
      frequentRefusalKeyword: 'Em bận họp không ra lấy được đâu anh tự xử lý đi',
    },
    driverRisk: {
      hasFareEvasion: false,
      evasionCount: 0,
      reportedLossAmount: 0,
      tacticSummary: 'Đặt đơn đồ ăn lớn 300k - 700k bằng hình thức thanh toán tiền mặt COD rồi tắt máy, tài xế phải ngậm ngùi ăn trừ bữa hoặc mang về.',
      lastIncidentDesc: 'Đặt 8 ly trà sữa trị giá 420.000đ tới tòa nhà văn phòng, khi tài xế tới thì nhắn tin "em về nhà rồi anh mang về uống đi".',
    },
    recentReports: [
      {
        date: '03/09/2026',
        platform: 'ShopeeFood',
        lossAmount: 420000,
        reporterType: 'courier',
        detail: 'Bom 8 ly trà sữa 420k, shipper chờ 40 phút dưới mưa không liên lạc được.',
        routeOrArea: 'Duy Tân, Cầu Giấy, Hà Nội',
      },
      {
        date: '25/08/2026',
        platform: 'GrabFood',
        lossAmount: 310000,
        reporterType: 'courier',
        detail: 'Đặt 4 suất cơm sườn 310k rồi chặn số.',
        routeOrArea: 'Bình Thạnh, TP.HCM',
      },
    ],
    actionPlan: [
      'TÀI XẾ: Đơn thức ăn COD trên 300.000đ bắt buộc gọi điện xác nhận ngay sau khi nhận cuốc trên app.',
      'Nếu nghe máy ngập ngừng hoặc giọng trẻ con nghịch máy, bấm hủy đơn ngay hoặc báo tổng đài hỗ trợ.',
    ],
  },
  {
    phone: '0988776655',
    name: 'Khách Hàng Uy Tín Vàng (Đã Xác Thực 5 Sao)',
    carrier: 'Viettel',
    trustScore: 99,
    riskCategory: 'CLEAN',
    categoryLabel: 'TỶ LỆ NHẬN HÀNG 98.2% - KHÁCH HÀNG UY TÍN (AN TOÀN TUYỆT ĐỐI)',
    tagBadge: 'bg-emerald-600 text-white',
    borderColor: 'border-emerald-600 bg-emerald-950/40',
    deliveryStats: {
      totalOrders: 56,
      deliveredCount: 55,
      boomCount: 1,
      successRate: 98.2,
      averageOrderValue: 520000,
      primaryBoomReason: '1 đơn hoàn do bưu cục hỏng hàng trong vận chuyển',
      frequentRefusalKeyword: 'Không có lịch sử bom hàng',
    },
    driverRisk: {
      hasFareEvasion: false,
      evasionCount: 0,
      reportedLossAmount: 0,
      tacticSummary: 'Luôn nghe máy đúng giờ, thanh toán chuẩn xác, tip thêm tài xế khi trời mưa.',
      lastIncidentDesc: 'Không có bất kỳ sự cố nào.',
    },
    contrabandWarning: {
      isReportedForContraband: false,
      threatSeverity: 'NONE',
      substanceSuspected: 'Hàng hóa thông thường',
      tacticSummary: 'Khách hàng gương mẫu, lịch sử sạch trên mọi nền tảng logistics.',
      legalArticle: 'Lịch sử giao dịch trong sạch.',
      emergencyProtocol: [],
    },
    recentReports: [],
    actionPlan: [
      'GIAO HÀNG BÌNH THƯỜNG. Đây là khách hàng thân thiết, tỷ lệ nhận hàng xuất sắc.',
      'Có thể hỗ trợ kiểm hàng hoặc gửi hàng COD giá trị cao an tâm.',
    ],
  },
];

export function findLogisticsProfile(phone: string): LogisticsRiskProfile | null {
  const clean = phone.replace(/[^0-9]/g, '');
  if (!clean) return null;
  return (
    LOGISTICS_DATABASE.find((item) => {
      const dbClean = item.phone.replace(/[^0-9]/g, '');
      return dbClean === clean || clean.endsWith(dbClean) || dbClean.endsWith(clean);
    }) || null
  );
}

export function generateFallbackLogisticsProfile(phone: string): LogisticsRiskProfile {
  const clean = phone.replace(/[^0-9]/g, '');
  let carrier = 'Viettel';
  if (clean.startsWith('090') || clean.startsWith('093') || clean.startsWith('079') || clean.startsWith('070')) {
    carrier = 'MobiFone';
  } else if (clean.startsWith('091') || clean.startsWith('094') || clean.startsWith('083') || clean.startsWith('085')) {
    carrier = 'VinaPhone';
  } else if (clean.startsWith('092') || clean.startsWith('056') || clean.startsWith('058')) {
    carrier = 'Vietnamobile';
  }

  // Calculate pseudorandom deterministic metrics based on digits
  const sumDigits = clean.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  const estimatedOrders = (sumDigits % 12) + 2;
  const estimatedBooms = (sumDigits % 3);
  const delivered = Math.max(0, estimatedOrders - estimatedBooms);
  const rate = Math.round((delivered / estimatedOrders) * 100);

  return {
    phone,
    name: 'Thuê bao di động cá nhân',
    carrier,
    trustScore: rate >= 80 ? 85 : 65,
    riskCategory: rate >= 80 ? 'CLEAN' : 'BOOM_HANG',
    categoryLabel: rate >= 80 ? 'TỶ LỆ GIAO NHẬN TỐT (~85%) - CHƯA CÓ BÁO CÁO XẤU' : 'CẦN XÁC NHẬN TRƯỚC KHI SHIP COD',
    tagBadge: rate >= 80 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200',
    borderColor: 'border-slate-800 bg-slate-950/60',
    deliveryStats: {
      totalOrders: estimatedOrders,
      deliveredCount: delivered,
      boomCount: estimatedBooms,
      successRate: rate,
      averageOrderValue: 280000,
      primaryBoomReason: estimatedBooms > 0 ? 'Có thể có 1-2 lần hẹn hoãn do bận' : 'Không có ghi nhận xấu',
    },
    driverRisk: {
      hasFareEvasion: false,
      evasionCount: 0,
      reportedLossAmount: 0,
      tacticSummary: 'Chưa có tài xế nào phản ánh bùng tiền cuốc xe.',
      lastIncidentDesc: 'Thuê bao hoạt động bình thường.',
    },
    contrabandWarning: {
      isReportedForContraband: false,
      threatSeverity: 'NONE',
      substanceSuspected: 'Không có nghi vấn chất cấm',
      tacticSummary: 'Chưa từng bị tố giác liên quan đến vận chuyển hàng cấm.',
      legalArticle: '',
      emergencyProtocol: [],
    },
    recentReports: [],
    actionPlan: [
      'Giao nhận bình thường theo quy chuẩn của bưu cục / ứng dụng gọi xe.',
      'Vẫn duy trì nguyên tắc: Gọi điện xác nhận trước khi giao hàng và không nạp thẻ hộ người lạ.',
    ],
  };
}

export const LOGISTICS_PRESET_BUTTONS = [
  {
    phone: '0867889900',
    label: '⚠️ Bẫy Vận Chuyển Ma Túy (Điều 250 BLHS)',
    typeBadge: 'HÀNG CẤM / NGUY HIỂM',
    badgeColor: 'bg-red-600 text-white',
  },
  {
    phone: '0938445566',
    label: '🏍️ Khách Bùng Cước Xe Ôm Cuốc Đêm',
    typeBadge: 'QUỴT TIỀN XE',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    phone: '0903112233',
    label: '📦 Bom Hàng Shopee/TikTok (Tỷ Lệ 16%)',
    typeBadge: 'BOM HÀNG CHUYÊN NGHIỆP',
    badgeColor: 'bg-rose-600 text-white',
  },
  {
    phone: '0971223344',
    label: '💸 Bẫy Lừa Ứng Tiền COD Khống 1.2Tr',
    typeBadge: 'LỪA ỨNG TIỀN HÀNG',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    phone: '0988776655',
    label: '✅ Khách Hàng Uy Tín Nhận Hàng 98%',
    typeBadge: 'AN TOÀN 5 SAO',
    badgeColor: 'bg-emerald-600 text-white',
  },
];

export const SHIPPER_SAFETY_RULES = [
  {
    id: 1,
    title: 'QUY TẮC 1: ĐỒNG KIỂM & TỪ CHỐI GÓI KÍN KHẢ NGHI',
    desc: 'Bất kỳ gói hàng nào bọc kín nhiều lớp băng dính đen, dặn không được mở ra, gửi tại địa điểm công cộng (gầm cầu, ngã ba không số nhà) thì DỨT KHOÁT TỪ CHỐI. Điều 250 BLHS xử lý tội vận chuyển ma túy rất nặng, đừng vì 100k - 200k tiền ship mà vướng lao lý!',
    tag: 'BẢO VỆ TÍNH MẠNG & PHÁP LÝ',
    color: 'text-red-400 border-red-500/30 bg-red-950/20',
  },
  {
    id: 2,
    title: 'QUY TẮC 2: KHÔNG ỨNG TIỀN COD NGOÀI ỨNG DỤNG',
    desc: 'Chỉ ứng tiền COD thông qua tính năng chính thức của app (Grab, Ahamove, Be) có bảo hiểm bồi hoàn. Tuyệt đối không nhận kèo ngoài từ nhóm Zalo/Facebook nhờ ứng 500k - 2tr rồi đi giao cho người nhận ma.',
    tag: 'CHỐNG MẤT VỐN',
    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
  },
  {
    id: 3,
    title: 'QUY TẮC 3: CUỐC XE ĐÊM VẮNG VẺ THU TIỀN TRƯỚC',
    desc: 'Khi chở khách đi đêm vào hẻm cụt, cánh đồng hoặc đoạn đường trên 100.000đ, hãy khéo léo yêu cầu khách thanh toán trước hoặc để tài xế dừng ngoài đầu đường sáng đèn. Tuyệt đối không nạp thẻ cào, không chuyển khoản hộ khách.',
    tag: 'AN TOÀN TÀI XẾ XE ÔM',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
  },
  {
    id: 4,
    title: 'QUY TẮC 4: CHỤP ẢNH XÁC NHẬN & TRA CỨU TỶ LỆ BOM',
    desc: 'Trước khi giao đơn COD giá trị cao, chủ shop và shipper tra cứu số điện thoại trên hệ thống VeraFense. Nếu tỷ lệ nhận hàng < 60%, hãy yêu cầu cọc tiền ship hoặc gọi xác nhận giọng nói trước khi đóng gói.',
    tag: 'TIẾT KIỆM CHI PHÍ HOÀN HÀNG',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
  },
];
