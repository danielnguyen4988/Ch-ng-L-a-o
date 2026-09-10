export type PersonaMode = 'citizen' | 'pro' | 'elderly' | 'youth';

export type AccountTier = 'free' | 'pro' | 'enterprise';

export interface LicenseInfo {
  key: string;
  tier: AccountTier;
  tierName: string;
  activatedAt: string;
  expiresAt: string;
  daysRemaining: number;
  deviceLinked: string;
  organization?: string;
  isValid: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  age?: number;
  birthYear?: number;
  walletBalance?: number;
  cccd?: string; // Citizen ID for verified whistleblower reports
  isVerified: boolean;
  tier: AccountTier;
  license: LicenseInfo | null;
  dailyQuotaMax: number;
  dailyQuotaUsed: number;
  createdAt: string;
  reportsSubmitted: number;
}

export type FraudTargetType = 'phone' | 'bank' | 'link' | 'sms' | 'logistics';

export type QVAIInputType = 'text' | 'sms' | 'url' | 'phone' | 'bank' | 'logistics' | 'image';

export interface QVAIInput {
  type: QVAIInputType;
  value: string;
  metadata?: Record<string, unknown>;
}

export interface QVAIEvidence {
  source: string;
  label: string;
  detail: string;
  status: 'safe' | 'warning' | 'danger';
  score?: number;
}

export interface QVAIResult {
  inputType: QVAIInputType;
  threatLevel: 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'SAFE' | 'UNKNOWN';
  threatScore: number; // 0 - 100; risk score, not probability
  summary: string;
  evidence: QVAIEvidence[];
  recommendedActions: string[];
  engineSources: string[];
}

export interface CommunityReport {
  id: string;
  targetType: FraudTargetType;
  targetValue: string;
  category: string;
  reporterName: string;
  reporterPhone: string;
  reporterCccd?: string;
  lossAmount: number; // in VND
  channel: string; // 'Cuộc gọi' | 'Zalo' | 'Telegram' | 'Facebook' | 'SMS' | 'Khác'
  evidenceDesc: string;
  reportedAt: string;
  status: 'verified' | 'monitoring';
}

export interface FraudIntelligenceEntry {
  targetValue: string;
  normalizedKey: string;
  targetType: FraudTargetType;
  category: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'SAFE';
  threatScore: number; // 0 - 100
  reportsCount: number;
  totalLossReported: number;
  firstReportedAt: string;
  lastReportedAt: string;
  angles: string[]; // Different angles/scenarios reported by victims
  advice: string;
  legalBasis: string;
  reports: CommunityReport[];
}

export interface AnalysisPreset {
  label: string;
  url: string;
  level: string;
  color: string;
  vector: string;
  desc: string;
  action: string;
  badge: string;
  isProOnly?: boolean;
}

export interface EvidenceSignal {
  label: string;
  value: string;
  status: 'safe' | 'warning' | 'danger';
  detail: string;
}

export interface ForensicReport {
  category: string;
  threatLevel: string;
  threatScore: number; // 0 - 100
  badgeColor: string;
  borderCol: string;
  elderlySummary: string;
  youthSummary: string;
  evidenceMatrix: EvidenceSignal[];
  psychology: {
    tactic: string;
    analysis: string;
  };
  entities: {
    impersonated: string;
    financialDemand: string;
    urgency: string;
    channel: string;
  };
  legalCode: string;
  actionPlan: string[];
}

export interface PhoneResult {
  number: string;
  carrier?: string;
  status: string;
  source: string;
  reports: number;
  totalLoss?: string;
  badge: string;
  border: string;
  type: string;
  advice: string;
  angles?: string[];
}

export interface BankResult {
  account: string;
  bank: string;
  holder: string;
  riskLevel: string;
  threatScore: number;
  badge: string;
  border: string;
  reports: number;
  totalScammed: string;
  pattern: string;
  legalWarning: string;
  action: string;
  angles?: string[];
}

export interface InspectPoint {
  id: number;
  label: string;
  title: string;
  detail: string;
  badge: string;
}

export type LogisticsRiskType = 'CLEAN' | 'BOOM_HANG' | 'EVASION_RIDE' | 'CONTRABAND_TRAP' | 'FAKE_COD';

export interface LogisticsReportItem {
  date: string;
  platform: string; // 'Shopee' | 'TikTok Shop' | 'Lazada' | 'Grab' | 'Be' | 'Ahamove' | 'Lalamove' | 'GHTK' | 'Viettel Post'
  lossAmount: number;
  reporterType: 'shop' | 'driver' | 'courier';
  detail: string;
  routeOrArea?: string;
}

export interface LogisticsRiskProfile {
  phone: string;
  name?: string;
  carrier?: string;
  trustScore: number; // 0 - 100 (100 = safest, 0 = critical fraud)
  riskCategory: LogisticsRiskType;
  categoryLabel: string;
  tagBadge: string;
  borderColor: string;
  
  // Delivery metrics (Anti-bom hàng cho chủ shop & bưu tá)
  deliveryStats: {
    totalOrders: number;
    deliveredCount: number;
    boomCount: number;
    successRate: number; // percentage (e.g. 16.7%)
    averageOrderValue: number;
    primaryBoomReason?: string;
    frequentRefusalKeyword?: string;
  };

  // Driver / Ride evasion metrics (Cho tài xế xe ôm công nghệ Grab/Be/Xanh SM)
  driverRisk?: {
    hasFareEvasion: boolean;
    evasionCount: number;
    reportedLossAmount: number;
    tacticSummary: string;
    lastIncidentDesc: string;
    nightRideWarning?: boolean;
  };

  // Contraband / Dangerous Goods warning (Bẫy lợi dụng shipper giao ma túy, hàng cấm)
  contrabandWarning?: {
    isReportedForContraband: boolean;
    threatSeverity: 'CRITICAL_LEGAL_RISK' | 'WARNING' | 'NONE';
    substanceSuspected: string; // "Ma túy / Cần sa / Bóng cười N2O / Khí nén nguy hiểm"
    tacticSummary: string;
    legalArticle: string; // "Điều 250 Bộ luật Hình sự (Tội vận chuyển trái phép chất ma túy)"
    emergencyProtocol: string[];
  };

  // Fake COD Advancing trap (Bẫy lừa shipper ứng tiền hàng ảo)
  fakeCodRisk?: {
    isReportedForFakeCod: boolean;
    advanceAmountLost: number;
    itemClaimed: string;
    tactic: string;
  };

  recentReports: LogisticsReportItem[];
  actionPlan: string[];
}

