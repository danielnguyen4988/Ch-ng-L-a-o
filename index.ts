export type PersonaMode = 'elderly' | 'pro' | 'youth';

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
  email: string;
  tier: AccountTier;
  license: LicenseInfo | null;
  dailyQuotaMax: number;
  dailyQuotaUsed: number;
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

export interface ForensicReport {
  category: string;
  threatLevel: string;
  badgeColor: string;
  borderCol: string;
  elderlySummary: string;
  youthSummary: string;
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
  status: string;
  source: string;
  reports: number;
  badge: string;
  border: string;
  type: string;
  advice: string;
}

export interface BankResult {
  account: string;
  bank: string;
  holder: string;
  riskLevel: string;
  badge: string;
  border: string;
  reports: number;
  totalScammed: string;
  pattern: string;
  legalWarning: string;
  action: string;
}

export interface InspectPoint {
  id: number;
  label: string;
  title: string;
  detail: string;
  badge: string;
}
