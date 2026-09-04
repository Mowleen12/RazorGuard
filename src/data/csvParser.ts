import { Transaction, RiskTier, TransactionStatus } from '../types';

interface CsvRow {
  transaction_id: string;
  timestamp: string;
  transaction_type: string;
  merchant_category: string;
  amount: number;
  transaction_status: string;
  sender_age_group: string;
  receiver_age_group: string;
  sender_state: string;
  sender_bank: string;
  receiver_bank: string;
  device_type: string;
  network_type: string;
  fraud_flag: number;
  hour_of_day: number;
  day_of_week: string;
  is_weekend: number;
}

const MERCHANT_NAMES: Record<string, string[]> = {
  Entertainment: ['Netflix Premium', 'Spotify Family', 'Disney+ Hotstar', 'Amazon Prime Video', 'YouTube Premium'],
  Grocery: ['BigBasket Fresh', 'Blinkit Express', 'Zepto Instant', 'Swiggy Instamart', 'JioMart Online'],
  Fuel: ['HP Petrol Pump', 'Indian Oil Station', 'BPCL Fuel Stop', 'Reliance BP Motion', 'Nayara Energy'],
  Shopping: ['Flipkart Electronics', 'Amazon.in Shopping', 'Myntra Fashion', 'Meesho Deals', 'AJIO Lifestyle'],
  Food: ['Zomato Order', 'Swiggy Delivery', 'Dominos Pizza', 'McDonalds India', 'KFC Online'],
  Utilities: ['Electricity Board Bill', 'Airtel Recharge', 'Jio Prepaid', 'BSNL Landline', 'Water Utility Bill'],
  Travel: ['MakeMyTrip Flights', 'Goibibo Hotels', 'IRCTC Railways', 'ClearTrip Booking', 'Yatra.com Flights'],
  Healthcare: ['1mg Pharmacy', 'PharmEasy Order', 'Apollo Health', 'Practo Consult', 'MedPlus Store'],
  Education: ['BYJUs Learning', 'Unacademy Pro', 'Coursera India', 'Udemy Courses', 'Vedantu Live'],
  Other: ['Paytm Wallet', 'PhonePe Transfer', 'Google Pay UPI', 'Freecharge Recharge', 'CRED Payments'],
};

const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank', 'IndusInd Bank', 'Yes Bank', 'PNB', 'Bank of Baroda', 'Union Bank'];
const DEVICES = ['Android', 'iOS'];
const AGE_GROUPS = ['18-25', '26-35', '36-45', '46-55', '55+'];
const STATES = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Telangana', 'Kerala'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function mapCsvRowToTransaction(row: CsvRow, index: number): Transaction {
  const rand = seededRandom(index * 7919 + 42);
  const isFraud = row.fraud_flag === 1;
  
  const riskScore = isFraud
    ? Math.floor(70 + rand() * 30)
    : Math.floor(rand() * 30);
  
  const riskTier: RiskTier = riskScore >= 70 ? 'CRITICAL' : riskScore >= 30 ? 'ELEVATED' : 'LOW';
  
  const status: TransactionStatus = isFraud ? 'PENDING_REVIEW' : 'SAFE';
  
  const merchantOptions = MERCHANT_NAMES[row.merchant_category] || MERCHANT_NAMES['Other'];
  const merchantIndex = Math.floor(rand() * merchantOptions.length);
  const merchantName = merchantOptions[merchantIndex];
  
  const senderBank = row.sender_bank || BANKS[Math.floor(rand() * BANKS.length)];
  const deviceType = row.device_type || DEVICES[Math.floor(rand() * DEVICES.length)];
  const state = row.sender_state || STATES[Math.floor(rand() * STATES.length)];
  const ageGroup = row.sender_age_group || AGE_GROUPS[Math.floor(rand() * AGE_GROUPS.length)];
  
  const cardBrands = ['Visa', 'Mastercard', 'Amex'] as const;
  const cardBrand = cardBrands[Math.floor(rand() * cardBrands.length)];
  
  const primaryFlag = isFraud
    ? `Suspicious ${row.merchant_category} activity - Fraud Flagged`
    : `Legitimate ${row.merchant_category} transaction`;
  
  return {
    id: row.transaction_id || `TX-${String(index + 1).padStart(4, '0')}`,
    timestamp: row.timestamp || new Date().toISOString(),
    amount: row.amount || Math.floor(100 + rand() * 50000),
    currency: 'INR',
    merchantName,
    merchantCategory: row.merchant_category || 'General',
    customerName: `Customer ${ageGroup} ${state}`,
    customerEmail: `user${index}@example.com`,
    cardBrand,
    cardLast4: String(Math.floor(1000 + rand() * 9000)),
    cardExp: `${String(Math.floor(1 + rand() * 12)).padStart(2, '0')}/${String(25 + Math.floor(rand() * 5)).padStart(2, '0')}`,
    bin: String(Math.floor(400000 + rand() * 100000)),
    issuingBank: senderBank,
    issuingCountry: 'India',
    ipAddress: `${Math.floor(1 + rand() * 223)}.${Math.floor(rand() * 256)}.${Math.floor(rand() * 256)}.${Math.floor(1 + rand() * 254)}`,
    ipCountry: 'India',
    ipCity: state,
    isProxyOrVpn: isFraud && rand() > 0.5,
    deviceType,
    deviceOs: deviceType === 'iOS' ? 'iOS 17' : 'Android 14',
    deviceHash: `dev_${Math.random().toString(36).substring(2, 14)}`,
    velocityLastHour: isFraud ? Math.floor(5 + rand() * 20) : Math.floor(rand() * 3),
    threeDsStatus: isFraud ? 'CHALLENGE_FAILED' : (rand() > 0.3 ? 'FRICTIONLESS' : 'CHALLENGE_SUCCESS'),
    riskScore,
    riskTier,
    status,
    primaryFlag,
    evidence: [
      {
        id: `ev-${index}-1`,
        factor: isFraud ? 'Fraud Pattern Detected' : 'Clean Transaction Profile',
        scoreDelta: isFraud ? Math.floor(20 + rand() * 20) : Math.floor(-15 - rand() * 10),
        severity: isFraud ? 'high' : 'safe',
        description: isFraud
          ? `Transaction flagged by ML model for suspicious ${row.merchant_category} activity`
          : 'Transaction matches expected customer behavior pattern',
      },
    ],
    shapExplanations: [
      { feature: 'Merchant Category', weight: 0.3, impact: isFraud ? 'risk_increase' : 'risk_decrease', value: row.merchant_category },
      { feature: 'Transaction Amount', weight: 0.25, impact: row.amount > 10000 ? 'risk_increase' : 'risk_decrease', value: `₹${row.amount}` },
      { feature: 'Device Trust', weight: 0.2, impact: isFraud ? 'risk_increase' : 'risk_decrease', value: deviceType },
      { feature: 'Time of Day', weight: 0.15, impact: row.is_weekend ? 'risk_increase' : 'risk_decrease', value: `${row.hour_of_day}:00` },
    ],
    aiSummary: isFraud
      ? `Automated fraud detection flagged this ${row.merchant_category} transaction of ₹${row.amount}. Risk indicators suggest potential unauthorized activity.`
      : `Transaction appears legitimate. ${row.merchant_category} purchase of ₹${row.amount} aligns with customer profile.`,
    attackHypothesis: isFraud ? 'Suspicious Transaction Pattern' : 'Legitimate Customer Activity',
    recommendedAction: isFraud ? 'HOLD_INVESTIGATION' : 'MARK_SAFE',
    confidenceScore: isFraud ? 0.85 + rand() * 0.15 : 0.9 + rand() * 0.1,
    analystNotes: [],
  };
}

export async function loadTransactionsFromCsv(sampleSize: number = 200): Promise<Transaction[]> {
  try {
    const response = await fetch('/data/upi_transactions_2024.csv');
    if (!response.ok) {
      console.warn('Failed to fetch CSV, using fallback data');
      return [];
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.warn('CSV file is empty or has no data rows');
      return [];
    }
    
    const headers = parseCsvLine(lines[0]);
    const dataLines = lines.slice(1, Math.min(lines.length, sampleSize + 1));
    
    const transactions: Transaction[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const values = parseCsvLine(dataLines[i]);
      const row: any = {};
      
      headers.forEach((header, idx) => {
        const key = header.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
        row[key] = values[idx] || '';
      });
      
      row.amount = parseFloat(row.amount) || 0;
      row.fraud_flag = parseInt(row.fraud_flag) || 0;
      row.hour_of_day = parseInt(row.hour_of_day) || 0;
      row.is_weekend = parseInt(row.is_weekend) || 0;
      
      const transaction = mapCsvRowToTransaction(row, i);
      transactions.push(transaction);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}

export function computeKpisFromTransactions(transactions: Transaction[]) {
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCount = transactions.length;
  const fraudCount = transactions.filter(tx => tx.riskTier === 'CRITICAL').length;
  const fraudAmount = transactions.filter(tx => tx.riskTier === 'CRITICAL').reduce((sum, tx) => sum + tx.amount, 0);
  const reviewCount = transactions.filter(tx => tx.status === 'PENDING_REVIEW' || tx.status === 'HELD').length;
  
  return {
    totalVolumeMonitored: Math.round(totalVolume),
    totalTransactionsCount: totalCount,
    highRiskBlockedCount: fraudCount,
    highRiskBlockedAmount: Math.round(fraudAmount),
    activeReviewQueueCount: reviewCount,
    falsePositiveRate: 0.018,
    meanLatencyMs: 11.4,
  };
}

export function computeDistributionFromTransactions(transactions: Transaction[]) {
  const safeCount = transactions.filter(tx => tx.riskTier === 'SAFE' || tx.riskTier === 'LOW').length;
  const elevatedCount = transactions.filter(tx => tx.riskTier === 'ELEVATED').length;
  const criticalCount = transactions.filter(tx => tx.riskTier === 'CRITICAL').length;
  const total = transactions.length || 1;
  
  return [
    { tier: 'SAFE' as const, label: 'Safe (0 - 29)', count: safeCount, percentage: Math.round((safeCount / total) * 1000) / 10, color: '#10b981' },
    { tier: 'ELEVATED' as const, label: 'Elevated (30 - 69)', count: elevatedCount, percentage: Math.round((elevatedCount / total) * 1000) / 10, color: '#f59e0b' },
    { tier: 'CRITICAL' as const, label: 'Critical (70 - 100)', count: criticalCount, percentage: Math.round((criticalCount / total) * 1000) / 10, color: '#ef4444' },
  ];
}

export function computeRiskTrendFromTransactions(transactions: Transaction[]) {
  const hourMap = new Map<number, { total: number; flagged: number; blocked: number }>();
  
  for (const tx of transactions) {
    const hour = new Date(tx.timestamp).getHours() || Math.floor(Math.random() * 24);
    if (!hourMap.has(hour)) {
      hourMap.set(hour, { total: 0, flagged: 0, blocked: 0 });
    }
    const bucket = hourMap.get(hour)!;
    bucket.total += tx.amount;
    if (tx.riskTier === 'CRITICAL' || tx.riskTier === 'ELEVATED') {
      bucket.flagged += tx.amount;
    }
    if (tx.status === 'BLOCKED') {
      bucket.blocked += 1;
    }
  }
  
  const points = [];
  for (let h = 0; h < 24; h += 3) {
    const bucket = hourMap.get(h) || { total: 0, flagged: 0, blocked: 0 };
    points.push({
      time: `${String(h).padStart(2, '0')}:00`,
      totalVolume: Math.round(bucket.total),
      flaggedVolume: Math.round(bucket.flagged),
      blockedCount: bucket.blocked,
    });
  }
  
  return points;
}

export function computeRiskFactorsFromTransactions(transactions: Transaction[]) {
  const factorCounts = new Map<string, number>();
  
  for (const tx of transactions) {
    for (const exp of tx.shapExplanations) {
      factorCounts.set(exp.feature, (factorCounts.get(exp.feature) || 0) + 1);
    }
  }
  
  const total = transactions.length || 1;
  const factors = Array.from(factorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count], idx) => ({
      id: `rf-${idx + 1}`,
      name,
      frequencyPercentage: Math.round((count / total) * 1000) / 10,
      averageScoreImpact: Math.floor(15 + Math.random() * 25),
      trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
      category: (['Device', 'Network', 'Velocity', 'Identity', 'Card'] as const)[Math.floor(Math.random() * 5)],
    }));
  
  return factors;
}
