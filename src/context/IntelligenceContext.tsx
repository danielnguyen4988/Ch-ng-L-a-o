import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunityReport, FraudIntelligenceEntry, FraudTargetType } from '../types';
import {
  normalizeIntelligenceKey,
  findIntelligenceMatch,
} from '../services/intelligenceService';

interface SubmitReportInput {
  targetType: FraudTargetType;
  targetValue: string;
  category: string;
  reporterName: string;
  reporterPhone: string;
  reporterCccd?: string;
  lossAmount: number;
  channel: string;
  evidenceDesc: string;
}

interface IntelligenceContextType {
  entries: Record<string, FraudIntelligenceEntry>;
  allReports: CommunityReport[];
  submitReport: (input: SubmitReportInput) => {
    report: CommunityReport;
    isDuplicate: boolean;
    totalReportsForTarget: number;
    accumulatedLoss: number;
  };
  findIntelligence: (type: FraudTargetType, value: string) => FraudIntelligenceEntry | null;
  getTopReported: (type?: FraudTargetType, limit?: number) => FraudIntelligenceEntry[];
}

const INITIAL_INTEL: FraudIntelligenceEntry[] = [
  {
    targetValue: 'https://www.jun88wl.com/',
    normalizedKey: 'jun88wl.com',
    targetType: 'link',
    category: 'CỜ BẠC & CÁ ĐỘ TRỰC TUYẾN BẤT HỢP PHÁP',
    threatLevel: 'CRITICAL',
    threatScore: 98,
    reportsCount: 142,
    totalLossReported: 8920000000,
    firstReportedAt: '12/01/2026',
    lastReportedAt: '07/09/2026',
    angles: [
      'Góc độ 1: Dụ dỗ người chơi nạp tiền cá cược bóng đá, khi thắng tiền lớn thì khóa tài khoản và báo "nghi vấn gian lận"',
      'Góc độ 2: Tuyển đại lý con qua Zalo/Telegram hứa hẹn chia hoa hồng 45%, sau đó bắt nạp tiền cọc giữ chức danh',
      'Góc độ 3: Quảng cáo bẫy xem phim lậu, gắn banner nhấp nháy dẫn dụ thanh thiếu niên nạp tiền cờ bạc casino',
    ],
    advice: 'CẢNH BÁO TỐI NGUY HIỂM: Website cờ bạc trực tuyến trái phép theo Nghị định 144/2021/NĐ-CP & Điều 321 BLHS. Tuyệt đối không đăng ký, không nạp tiền!',
    legalBasis: 'Điều 321 Bộ luật Hình sự (Tội đánh bạc) & Điều 322 (Tội tổ chức đánh bạc) - Khung hình phạt đến 10 năm tù.',
    reports: [
      {
        id: 'rep_jun_01',
        targetType: 'link',
        targetValue: 'https://www.jun88wl.com/',
        category: 'Cờ bạc trực tuyến lừa nạp tiền',
        reporterName: 'Trần Văn T***',
        reporterPhone: '0988***122',
        lossAmount: 45000000,
        channel: 'Telegram',
        evidenceDesc: 'Bị dụ nạp 45 triệu đánh tài xỉu, lúc rút thì báo hệ thống bảo trì rồi xóa luôn tài khoản',
        reportedAt: '06/09/2026',
        status: 'verified',
      },
    ],
  },
  {
    targetValue: 'http://dichvucong-chinhphu.site/dvc.apk',
    normalizedKey: 'dichvucong-chinhphu.site',
    targetType: 'link',
    category: 'MÃ ĐỘC CHIẾM QUYỀN TRỢ NĂNG ANDROID',
    threatLevel: 'CRITICAL',
    threatScore: 100,
    reportsCount: 89,
    totalLossReported: 6400000000,
    firstReportedAt: '15/02/2026',
    lastReportedAt: '07/09/2026',
    angles: [
      'Góc độ 1: Giả danh Công an quận gọi điện yêu cầu cài app Dịch Vụ Công để định danh mức 2 tại nhà',
      'Góc độ 2: Tự động âm thầm đọc mã OTP ngân hàng và cấp quyền Accessibility Service để chuyển sạch tiền trong đêm',
    ],
    advice: 'MÃ ĐỘC TỐI NGUY HIỂM: Tệp .APK giả mạo cổng thông tin chính phủ. Cổng dịch vụ công quốc gia chỉ dùng tên miền đuôi .GOV.VN!',
    legalBasis: 'Điều 285 & Điều 289 Bộ luật Hình sự về Tán phát chương trình tin học gây hại và Xâm nhập trái phép mạng viễn thông.',
    reports: [],
  },
  {
    targetValue: '0248889922',
    normalizedKey: '0248889922',
    targetType: 'phone',
    category: 'GIẢ DANH CƠ QUAN ĐIỀU TRA & TÒA ÁN',
    threatLevel: 'CRITICAL',
    threatScore: 99,
    reportsCount: 428,
    totalLossReported: 14500000000,
    firstReportedAt: '02/01/2026',
    lastReportedAt: '07/09/2026',
    angles: [
      'Góc độ 1: Giả danh Cán bộ Tòa án nhân dân TP Hà Nội dọa có lệnh bắt giam đường dây ma túy/rửa tiền',
      'Góc độ 2: Ép nạn nhân chuyển tiền vào "Tài khoản bảo chứng điều tra" của Bộ Công An để chứng minh trong sạch',
      'Góc độ 3: Bắt nạn nhân ra nhà nghỉ một mình, bật camera giám sát 24/24 và tuyệt đối giữ bí mật với người thân',
    ],
    advice: 'SỐ ĐIỆN THOẠI LỪA ĐẢO TRỰC TIẾP: Cơ quan Công an và Tòa án KHÔNG BAO GIỜ gọi điện thoại làm việc hay yêu cầu chuyển tiền vào tài khoản cá nhân!',
    legalBasis: 'Điều 174 Bộ luật Hình sự (Tội lừa đảo chiếm đoạt tài sản) - Khung hình phạt tù chung thân đối với hành vi phạm tội có tổ chức.',
    reports: [
      {
        id: 'rep_ph_01',
        targetType: 'phone',
        targetValue: '0248889922',
        category: 'Giả danh Viện Kiểm Sát dọa bắt giam',
        reporterName: 'Nguyễn Thị H***',
        reporterPhone: '0912***456',
        lossAmount: 120000000,
        channel: 'Cuộc gọi',
        evidenceDesc: 'Người gọi xưng Trung tá Lê Tuấn Anh dọa lệnh bắt tạm giam, ép chuyển 120 triệu chứng minh nguồn tiền.',
        reportedAt: '05/09/2026',
        status: 'verified',
      },
    ],
  },
  {
    targetValue: '102938484',
    normalizedKey: '102938484',
    targetType: 'bank',
    category: 'TÀI KHOẢN RÁC THUÊ MƯỚN RỬA TIỀN',
    threatLevel: 'CRITICAL',
    threatScore: 99,
    reportsCount: 53,
    totalLossReported: 2450000000,
    firstReportedAt: '18/03/2026',
    lastReportedAt: '07/09/2026',
    angles: [
      'Góc độ 1: Nạn nhân bị ép chuyển tiền "án phí / tạm giữ" từ các cuộc gọi giả danh cơ quan chức năng',
      'Góc độ 2: Dòng tiền sau khi vào tài khoản được phân tán ngay lập tức sang các ví mua tiền số USDT trong vòng 90 giây',
      'Góc độ 3: Chủ tài khoản mở bằng CMND/CCCD thu gom của học sinh, sinh viên nghèo hoặc làm giả thông tin sinh trắc học',
    ],
    advice: 'TÀI KHOẢN GIAN LẬN NGUY CƠ CAO: Tuyệt đối không chuyển tiền vào số tài khoản này dưới bất kỳ hình thức nào!',
    legalBasis: 'Điều 291 Bộ luật Hình sự về Tội thu thập, tàng trữ, trao đổi, mua bán trái phép thông tin tài khoản ngân hàng.',
    reports: [
      {
        id: 'rep_bk_01',
        targetType: 'bank',
        targetValue: '102938484',
        category: 'Tài khoản nhận tiền lừa đảo án phí giả',
        reporterName: 'Lê Minh Q***',
        reporterPhone: '0977***889',
        lossAmount: 50000000,
        channel: 'Chuyển khoản Napas',
        evidenceDesc: 'Chuyển 50 triệu vào số tài khoản này sau khi nhận lệnh bắt giả mạo, ngay sau đó kẻ gian khóa máy.',
        reportedAt: '04/09/2026',
        status: 'verified',
      },
    ],
  },
  {
    targetValue: '9876543210',
    normalizedKey: '9876543210',
    targetType: 'bank',
    category: 'TÀI KHOẢN NHẬN CỌC CTV NHIỆM VỤ SHOPEE / TIKTOK',
    threatLevel: 'HIGH',
    threatScore: 94,
    reportsCount: 78,
    totalLossReported: 4120000000,
    firstReportedAt: '05/02/2026',
    lastReportedAt: '06/09/2026',
    angles: [
      'Góc độ 1: Dụ làm nhiệm vụ đơn hàng hoàn hoa hồng 10-15%, đơn nhỏ trả tiền thật, đơn lớn từ chối rút',
      'Góc độ 2: Ép nạp tiền bù "lỗi cú pháp giao dịch" hoặc "thuế thu nhập cá nhân 20%" rồi mới cho rút vốn cũ',
    ],
    advice: 'BẪY PONZI NHIỆM VỤ ONLINE: Không nạp thêm bất kỳ đồng nào để mong rút tiền cũ!',
    legalBasis: 'Điều 290 Bộ luật Hình sự (Sử dụng mạng máy tính chiếm đoạt tài sản).',
    reports: [],
  },
];

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Record<string, FraudIntelligenceEntry>>(() => {
    const saved = localStorage.getItem('verafense_intel_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const map: Record<string, FraudIntelligenceEntry> = {};
    INITIAL_INTEL.forEach((item) => {
      map[item.normalizedKey] = item;
    });
    return map;
  });

  const [allReports, setAllReports] = useState<CommunityReport[]>(() => {
    const saved = localStorage.getItem('verafense_community_reports_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const list: CommunityReport[] = [];
    INITIAL_INTEL.forEach((item) => {
      list.push(...item.reports);
    });
    return list;
  });

  useEffect(() => {
    localStorage.setItem('verafense_intel_v2', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('verafense_community_reports_v2', JSON.stringify(allReports));
  }, [allReports]);

  const submitReport = (input: SubmitReportInput) => {
    const normKey = normalizeIntelligenceKey(
      input.targetType,
      input.targetValue
    );
    const newReportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowStr = new Date().toLocaleDateString('vi-VN');

    const newReport: CommunityReport = {
      id: newReportId,
      targetType: input.targetType,
      targetValue: input.targetValue.trim(),
      category: input.category,
      reporterName: input.reporterName,
      reporterPhone: input.reporterPhone,
      reporterCccd: input.reporterCccd,
      lossAmount: input.lossAmount || 0,
      channel: input.channel,
      evidenceDesc: input.evidenceDesc,
      reportedAt: nowStr,
      status: 'verified',
    };

    setAllReports((prev) => [newReport, ...prev]);

    let isDuplicate = false;
    let totalReportsForTarget = 1;
    let accumulatedLoss = input.lossAmount || 0;

    setEntries((prev) => {
      const existing = prev[normKey];
      if (existing) {
        isDuplicate = true;
        totalReportsForTarget = existing.reportsCount + 1;
        accumulatedLoss = existing.totalLossReported + (input.lossAmount || 0);

        const updatedAngles = [...existing.angles];
        if (input.evidenceDesc && !updatedAngles.some((a) => a.includes(input.channel))) {
          updatedAngles.push(`Góc độ mới (${input.channel}): ${input.evidenceDesc.substring(0, 120)}...`);
        }

        const newThreatScore = Math.min(100, existing.threatScore + 5);
        const newThreatLevel: 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'SAFE' =
          totalReportsForTarget >= 3 ? 'CRITICAL' : 'HIGH';

        return {
          ...prev,
          [normKey]: {
            ...existing,
            reportsCount: totalReportsForTarget,
            totalLossReported: accumulatedLoss,
            lastReportedAt: nowStr,
            threatScore: newThreatScore,
            threatLevel: newThreatLevel,
            angles: updatedAngles,
            reports: [newReport, ...existing.reports],
          },
        };
      } else {
        // Create new intelligence record
        const newEntry: FraudIntelligenceEntry = {
          targetValue: input.targetValue.trim(),
          normalizedKey: normKey,
          targetType: input.targetType,
          category: input.category,
          threatLevel: (input.lossAmount || 0) > 0 ? 'HIGH' : 'SUSPICIOUS',
          threatScore: (input.lossAmount || 0) > 0 ? 88 : 72,
          reportsCount: 1,
          totalLossReported: input.lossAmount || 0,
          firstReportedAt: nowStr,
          lastReportedAt: nowStr,
          angles: [`Góc độ tiếp cận qua ${input.channel}: ${input.evidenceDesc.substring(0, 140)}`],
          advice: `Mục tiêu đang bị cộng đồng phản ánh tố giác có dấu hiệu lừa đảo qua kênh ${input.channel}. Đề nghị thận trọng tuyệt đối không chuyển tiền!`,
          legalBasis: 'Hành vi có dấu hiệu vi phạm Điều 174 hoặc Điều 290 Bộ luật Hình sự.',
          reports: [newReport],
        };
        return {
          ...prev,
          [normKey]: newEntry,
        };
      }
    });

    return {
      report: newReport,
      isDuplicate,
      totalReportsForTarget,
      accumulatedLoss,
    };
  };

  const findIntelligence = (
    type: FraudTargetType,
    value: string
  ): FraudIntelligenceEntry | null => {
    const match = findIntelligenceMatch(entries, type, value);
    return match?.entry ?? null;
  };

  const getTopReported = (type?: FraudTargetType, limit: number = 5): FraudIntelligenceEntry[] => {
    let list: FraudIntelligenceEntry[] = Object.values(entries) as FraudIntelligenceEntry[];
    if (type) {
      list = list.filter((e) => e.targetType === type);
    }
    list.sort((a, b) => b.reportsCount - a.reportsCount);
    return list.slice(0, limit);
  };

  return (
    <IntelligenceContext.Provider
      value={{
        entries,
        allReports,
        submitReport,
        findIntelligence,
        getTopReported,
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
};
