import { AnalysisPreset, PhoneResult, BankResult, ForensicReport } from '../types';

export const PRESET_LINKS: AnalysisPreset[] = [
  {
    label: 'Bẫy Dịch Vụ Công Giả (.apk)',
    url: 'http://dichvucong-chinhphu.site/dvc.apk',
    level: 'MÃ ĐỘC TỐI NGUY HIỂM (100%)',
    color: 'border-red-600 bg-red-950/40 text-red-300',
    badge: 'bg-red-600 text-white',
    vector: 'Chiếm quyền Trợ Năng (Accessibility Service) trên Android',
    desc: 'Sau khi cài đặt file .APK này, mã độc sẽ tự động theo dõi màn hình, đọc trộm mã OTP ngân hàng và điều khiển điện thoại từ xa vào ban đêm để chuyển sạch tiền!',
    action: 'Tuyệt đối KHÔNG TẢI. Nếu đã lỡ cài, hãy BẬT CHẾ ĐỘ MÁY BAY ngay lập tức và mang máy ra trung tâm uy tín chạy lại ROM gốc.',
    isProOnly: true,
  },
  {
    label: 'Web Nhái Đăng Nhập VCB',
    url: 'https://vietcombank-smartbanking-security.online',
    level: 'TRANG WEB PHISHING ĐÁNH CẮP TÀI KHOẢN (99%)',
    color: 'border-red-600 bg-red-950/40 text-red-300',
    badge: 'bg-red-600 text-white',
    vector: 'Phishing thu thập tên đăng nhập, mật khẩu và OTP',
    desc: 'Giao diện sao chép y hệt Vietcombank SmartBanking. Máy chủ đặt ẩn danh tại nước ngoài nhằm thu thập thông tin thẻ và tài khoản nạn nhân.',
    action: 'Tuyệt đối không nhập thông tin. Tên miền chính thức duy nhất là vietcombank.com.vn.',
  },
  {
    label: 'Cổng Dịch Vụ Công Quốc Gia Thật',
    url: 'https://dichvucong.gov.vn',
    level: 'CHỨNG CHỈ SỐ NHÀ NƯỚC AN TOÀN (100%)',
    color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300',
    badge: 'bg-emerald-600 text-white',
    vector: 'Chứng chỉ số Nhà nước cấp (.GOV.VN)',
    desc: 'Cổng thông tin chính thức của Chính phủ nước CHXHCN Việt Nam, xác thực bởi Ban Cơ yếu Chính phủ.',
    action: 'Website chính thống, an toàn tuyệt đối để thực hiện thủ tục hành chính.',
  },
  {
    label: 'Bẫy Nạp Thẻ Game Giảm 80% (Teen)',
    url: 'https://napthe-freefire-garena-khuyenmai.xyz',
    level: 'TRANG WEB LỪA ĐẢO NẠP THẺ GAME (100%)',
    color: 'border-rose-600 bg-rose-950/40 text-rose-300',
    badge: 'bg-rose-600 text-white',
    vector: 'Bẫy nạp thẻ cào giả mạo chiếm đoạt mã PIN & Seri',
    desc: 'Trang web mạo danh NPH Garena/Roblox hứa hẹn nhân 5 lần kim cương hoặc quân huy. Thực chất nuốt trọn mã thẻ cào điện thoại của các bạn học sinh.',
    action: 'Tuyệt đối không nạp thẻ ngoài trang nạp chính thức. Báo ngay cho bố mẹ nếu bị lừa tiền.',
  }
];

export const MOCK_LICENSES: Record<string, { tier: 'pro' | 'enterprise'; tierName: string; days: number; org?: string }> = {
  'VERA-PRO-2026-CYBER': {
    tier: 'pro',
    tierName: 'Gói Chuyên Viên Điều Tra Số (Pro Defense)',
    days: 365,
    org: 'Chuyên Gia Cá Nhân'
  },
  'VERA-ENT-2026-VIP': {
    tier: 'enterprise',
    tierName: 'Gói Doanh Nghiệp & Văn Phòng Luật',
    days: 730,
    org: 'Công Ty & Đoàn Luật Sư'
  },
  'VERA-PRO-FORENSIC-2026': {
    tier: 'pro',
    tierName: 'Gói Chuyên Viên Điều Tra Số (Pro Defense)',
    days: 365,
    org: 'Tài Khoản Dùng Thử Nghiệm'
  }
};
