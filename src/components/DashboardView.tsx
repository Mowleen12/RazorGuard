import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  User,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { 
  Transaction, 
  DashboardKPIs, 
  RiskDistribution, 
  RiskTrendPoint, 
  RiskFactorItem 
} from '../types';
import { RazorGuardEmblem } from './RazorGuardLogo';

interface DashboardViewProps {
  transactions: Transaction[];
  kpis: DashboardKPIs;
  distribution: RiskDistribution[];
  trends: RiskTrendPoint[];
  riskFactors: RiskFactorItem[];
  modelMetrics: any;
  onSelectTransaction: (tx: Transaction) => void;
  onSimulateNewAttack?: () => void;
  onOpenProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  kpis,
  distribution,
  trends,
  riskFactors,
  modelMetrics,
  onSelectTransaction,
  onSimulateNewAttack,
  onOpenProfile,
}) => {
  // Simple filter: ALL, REVIEW (Critical + Elevated), SAFE
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'REVIEW' | 'SAFE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Counts for quick badges
  const reviewCount = transactions.filter(t => t.riskTier === 'CRITICAL' || t.riskTier === 'ELEVATED').length;
  const safeCount = transactions.filter(t => t.riskTier === 'SAFE' || t.riskTier === 'LOW').length;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = 
      activeFilter === 'ALL' ||
      (activeFilter === 'REVIEW' && (tx.riskTier === 'CRITICAL' || tx.riskTier === 'ELEVATED')) ||
      (activeFilter === 'SAFE' && (tx.riskTier === 'SAFE' || tx.riskTier === 'LOW'));

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;

    const matchesSearch =
      tx.id.toLowerCase().includes(query) ||
      tx.customerName.toLowerCase().includes(query) ||
      tx.merchantName.toLowerCase().includes(query) ||
      tx.primaryFlag.toLowerCase().includes(query) ||
      tx.cardLast4.includes(query) ||
      tx.ipAddress.includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-100 pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* =========================================================================
          PAGE HEADER: Clean, Friendly & Easy to Scan
          ========================================================================= */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 sm:p-7 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0091F5]/30 bg-[#0091F5]/10 shadow-[0_0_20px_rgba(0,145,245,0.2)] shrink-0">
              <RazorGuardEmblem size={28} glow={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Live System Active
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-400 font-mono">
                  {kpis.meanLatencyMs}ms average response
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Fraud &amp; Risk Dashboard
              </h1>
              <p className="text-base text-slate-300 mt-1 max-w-2xl">
                Real-time overview of payments, prevented fraud, and transactions requiring manual review.
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white transition-all"
                title="View Lead Analyst Profile"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#0091F5] to-emerald-400 text-xs font-bold text-black shadow-sm">
                  M
                </div>
                <span className="hidden sm:inline">Profile</span>
              </button>
            )}

            {onSimulateNewAttack && (
              <button
                onClick={onSimulateNewAttack}
                className="flex items-center gap-2 rounded-xl border border-[#0091F5]/40 bg-[#0091F5]/15 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0091F5]/30 active:scale-95"
              >
                <Zap className="h-4 w-4 text-[#0091F5]" />
                <span>Simulate Test Payment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY NUMBERS AT A GLANCE: 4 clear, well-spaced metrics
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Volume */}
        <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span className="font-medium">Total Volume Today</span>
            <TrendingUp className="h-4 w-4 text-[#0091F5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            ₹{(kpis.totalVolumeMonitored / 100000).toFixed(1)}L
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Across <span className="text-slate-200 font-medium">{kpis.totalTransactionsCount.toLocaleString()}</span> processed payments
          </div>
        </div>

        {/* Fraud Prevented */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-300 text-sm mb-2">
            <span className="font-semibold">Fraud Blocked</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-200 font-mono">
            ₹{kpis.highRiskBlockedAmount.toLocaleString()}
          </div>
          <div className="text-sm text-rose-300/80 mt-2">
            <span className="font-semibold text-rose-200">{kpis.highRiskBlockedCount} suspicious attempts</span> stopped automatically
          </div>
        </div>

        {/* Needs Review */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-300 text-sm mb-2">
            <span className="font-semibold">Needs Review</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-200 font-mono">
            {kpis.activeReviewQueueCount} <span className="text-base font-normal text-amber-300/80">cases</span>
          </div>
          <div className="text-sm text-amber-300/80 mt-2">
            Flagged for human verification
          </div>
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-300 text-sm mb-2">
            <span className="font-semibold">Protection Health</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-200 font-mono">
            99.9%
          </div>
          <div className="text-sm text-emerald-300/80 mt-2">
            False positive rate: <span className="font-semibold text-emerald-200">{kpis.falsePositiveRate}%</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SIMPLIFIED RISK OVERVIEW: Clear, easy-to-read breakdown
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left: Simple Risk Breakdown Bar */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#070b14]/70 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Payment Risk Distribution
              </h2>
              <span className="text-sm text-slate-400">Past 24 Hours</span>
            </div>

            {/* Single clean progress bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex mb-4 bg-slate-800">
              <div 
                style={{ width: `${distribution[0].percentage}%` }} 
                className="h-full bg-emerald-500 transition-all" 
                title={`Low Risk: ${distribution[0].percentage}%`}
              />
              <div 
                style={{ width: `${distribution[1].percentage}%` }} 
                className="h-full bg-amber-500 transition-all" 
                title={`Medium Risk: ${distribution[1].percentage}%`}
              />
              <div 
                style={{ width: `${distribution[2].percentage}%` }} 
                className="h-full bg-rose-500 transition-all" 
                title={`High Risk: ${distribution[2].percentage}%`}
              />
            </div>

            {/* 3 clear categories */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-slate-300">Safe (Low)</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{distribution[0].percentage}%</div>
                <div className="text-xs text-slate-400 mt-0.5">Approved automatically</div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-sm font-semibold text-slate-300">Elevated</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{distribution[1].percentage}%</div>
                <div className="text-xs text-slate-400 mt-0.5">Needs 2nd check</div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-sm font-semibold text-slate-300">High Risk</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{distribution[2].percentage}%</div>
                <div className="text-xs text-slate-400 mt-0.5">Quarantined / Blocked</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 mt-4 pt-3 border-t border-white/5">
            💡 <strong className="text-slate-300">Rule of thumb:</strong> Transactions with a score of <strong>75 or higher</strong> are quarantined automatically to prevent chargebacks.
          </p>
        </div>

        {/* Right: What triggers alerts most often? (Clean, human-readable list) */}
        <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 p-6 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white mb-1">
            Top Fraud Reasons
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Most common flags detected in today's stream:
          </p>

          <div className="space-y-3">
            {riskFactors.slice(0, 3).map((factor, idx) => (
              <div key={factor.id} className="rounded-xl border border-white/5 bg-black/30 p-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-200">
                    {idx + 1}. {factor.name}
                  </span>
                  <span className="text-rose-400 font-mono text-sm font-bold">
                    +{factor.averageScoreImpact} pts
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Found in {factor.frequencyPercentage}% of flagged cases</span>
                  <span className="text-slate-500 font-mono">{factor.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          TRANSACTION LIST / REVIEW QUEUE: Simplified, scannable table
          ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-[#070b14]/80 overflow-hidden shadow-xl backdrop-blur-xl">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Recent Transactions
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Click any transaction or click <strong className="text-slate-300">"Review Case"</strong> to inspect details with the AI Investigator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, card last 4, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/60 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:border-[#0091F5] focus:outline-none w-56 sm:w-64 transition-all"
              />
            </div>

            {/* Clean 3-tab Filter */}
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1 text-sm">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({transactions.length})
              </button>
              
              <button
                onClick={() => setActiveFilter('REVIEW')}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === 'REVIEW'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Needs Review</span>
                <span className="rounded-full bg-amber-950/60 text-amber-200 px-1.5 text-xs font-bold">
                  {reviewCount}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('SAFE')}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                  activeFilter === 'SAFE'
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Safe ({safeCount})
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table - Simplified & Readable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-slate-400 uppercase font-semibold text-xs">
              <tr>
                <th className="py-3.5 px-5">Customer &amp; Payment</th>
                <th className="py-3.5 px-5">Time</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Risk Level</th>
                <th className="py-3.5 px-5">Why Flagged</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => {
                const isCritical = tx.riskTier === 'CRITICAL';
                const isElevated = tx.riskTier === 'ELEVATED';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className={`cursor-pointer transition-colors hover:bg-white/[0.04] ${
                      isCritical ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Customer & Card */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-100 text-base">{tx.customerName}</div>
                      <div className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                        <span>{tx.cardBrand} •••• {tx.cardLast4}</span>
                        <span className="text-slate-500">•</span>
                        <span>{tx.issuingCountry}</span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-5 text-slate-400 text-sm">
                      {tx.timestamp.split(' ')[1]} UTC
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 font-mono font-bold text-white text-base">
                      ₹{tx.amount.toFixed(2)}
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-4 px-5">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-sm font-bold text-rose-300">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          High ({tx.riskScore}/100)
                        </span>
                      ) : isElevated ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-sm font-bold text-amber-300">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          Medium ({tx.riskScore}/100)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-sm font-bold text-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Low ({tx.riskScore}/100)
                        </span>
                      )}
                    </td>

                    {/* Why Flagged - Clean Summary */}
                    <td className="py-4 px-5 max-w-xs text-slate-300 text-sm">
                      <span className="line-clamp-2 leading-relaxed">
                        {tx.primaryFlag}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span 
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                          tx.status === 'BLOCKED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : tx.status === 'HELD'
                            ? 'bg-amber-500/20 text-amber-300'
                            : tx.status === 'SAFE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {tx.status === 'BLOCKED' && <XCircle className="h-3.5 w-3.5" />}
                        {tx.status === 'SAFE' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {tx.status === 'HELD' && <AlertCircle className="h-3.5 w-3.5" />}
                        {tx.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#0091F5] hover:border-[#0091F5] active:scale-95"
                      >
                        <span>Review Case</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default DashboardView;
