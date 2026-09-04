export type RiskTier = 'CRITICAL' | 'ELEVATED' | 'LOW' | 'SAFE';

export type TransactionStatus = 'PENDING_REVIEW' | 'HELD' | 'SAFE' | 'ESCALATED' | 'BLOCKED';

export interface KeyEvidence {
  id: string;
  factor: string;
  scoreDelta: number; // e.g. +38 or -15
  severity: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  description: string;
}

export interface ShapExplanation {
  feature: string;
  weight: number; // normalized 0 to 1
  impact: 'risk_increase' | 'risk_decrease';
  value: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategory: string;
  customerName: string;
  customerEmail: string;
  cardBrand: 'Visa' | 'Mastercard' | 'Amex';
  cardLast4: string;
  cardExp: string;
  bin: string;
  issuingBank: string;
  issuingCountry: string;
  ipAddress: string;
  ipCountry: string;
  ipCity: string;
  isProxyOrVpn: boolean;
  deviceType: string;
  deviceOs: string;
  deviceHash: string;
  velocityLastHour: number;
  threeDsStatus: 'FRICTIONLESS' | 'CHALLENGE_FAILED' | 'CHALLENGE_SUCCESS' | 'NOT_ENROLLED';
  riskScore: number; // 0 to 100
  riskTier: RiskTier;
  status: TransactionStatus;
  primaryFlag: string;
  evidence: KeyEvidence[];
  shapExplanations: ShapExplanation[];
  aiSummary: string;
  attackHypothesis: string;
  recommendedAction: 'HARD_BLOCK' | 'HOLD_INVESTIGATION' | 'STEP_UP_3DS' | 'MARK_SAFE';
  confidenceScore: number; // 0.00 to 1.00
  analystNotes?: { author: string; timestamp: string; note: string; actionTaken: string }[];
}

export interface DashboardKPIs {
  totalVolumeMonitored: number;
  totalTransactionsCount: number;
  highRiskBlockedCount: number;
  highRiskBlockedAmount: number;
  activeReviewQueueCount: number;
  falsePositiveRate: number;
  meanLatencyMs: number;
}

export interface RiskDistribution {
  tier: RiskTier;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RiskTrendPoint {
  time: string;
  totalVolume: number;
  flaggedVolume: number;
  blockedCount: number;
}

export interface RiskFactorItem {
  id: string;
  name: string;
  frequencyPercentage: number;
  averageScoreImpact: number;
  trend: 'up' | 'down' | 'stable';
  category: 'Device' | 'Network' | 'Velocity' | 'Identity' | 'Card';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  clearanceLevel: string;
  organization: string;
  badgeId: string;
  phone: string;
  location: string;
  timezone: string;
  joinedDate: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'STANDBY';
  twoFactorEnabled: boolean;
  securityKey: string;
  stats: {
    totalInvestigations: number;
    preventedFraudLoss: number;
    falsePositiveRate: number;
    accuracyScore: number;
    mttmMinutes: number;
  };
  permissions: string[];
  recentActivity: {
    id: string;
    action: string;
    target: string;
    timestamp: string;
    status: 'success' | 'warning' | 'neutral';
  }[];
}

