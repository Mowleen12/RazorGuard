import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PauseCircle, 
  UserCheck, 
  UserX, 
  Send, 
  Sparkles, 
  ArrowLeft,
  Check,
  Loader2,
  HelpCircle,
  CreditCard,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Info,
  Download
} from 'lucide-react';
import { Transaction } from '../types';
import { RazorGuardEmblem, FaviconLogo } from './RazorGuardLogo';

interface InvestigatorWorkspaceProps {
  transaction: Transaction;
  allTransactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onUpdateTransactionStatus: (
    txId: string, 
    newStatus: 'HELD' | 'SAFE' | 'ESCALATED' | 'BLOCKED',
    analystNote: string,
    actionLabel: string
  ) => void;
  onBackToDashboard: () => void;
  onOpenProfile?: () => void;
}

interface QueryRecord {
  id: string;
  query: string;
  answer: string;
  evidenceTags: string[];
  confidence: number;
  recommendedAction: string;
  timestamp: string;
  isLiveAI?: boolean;
}

export const InvestigatorWorkspace: React.FC<InvestigatorWorkspaceProps> = ({
  transaction,
  allTransactions,
  onSelectTransaction,
  onUpdateTransactionStatus,
  onBackToDashboard,
  onOpenProfile,
}) => {
  const [analystNoteInput, setAnalystNoteInput] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // User Interactive Query State
  const [userQuery, setUserQuery] = useState('');
  const [isAskingQuery, setIsAskingQuery] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryRecord[]>([
    {
      id: 'init-1',
      query: `Why was this payment flagged?`,
      answer: `This transaction received a risk score of ${transaction.riskScore}/100 mainly because of ${transaction.primaryFlag.toLowerCase()}. The buyer is connecting from ${transaction.ipCity}, ${transaction.ipCountry} (${transaction.isProxyOrVpn ? 'detected proxy or VPN' : 'residential connection'}) while the card was issued in ${transaction.issuingCountry}. Additionally, ${transaction.velocityLastHour} checkout attempts occurred in the past hour.`,
      evidenceTags: [
        `Risk Score: ${transaction.riskScore}/100`,
        `Proxy / VPN: ${transaction.isProxyOrVpn ? 'Detected' : 'None'}`,
        `Recent Attempts: ${transaction.velocityLastHour}/hr`,
        `3DS Verification: ${transaction.threeDsStatus}`
      ],
      confidence: transaction.confidenceScore || 0.96,
      recommendedAction: transaction.riskScore >= 75 ? 'BLOCK_TRANSACTION' : 'HOLD_FOR_REVIEW',
      timestamp: 'Initial Analysis',
      isLiveAI: false
    }
  ]);

  const isCritical = transaction.riskTier === 'CRITICAL';
  const isElevated = transaction.riskTier === 'ELEVATED';

  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  const handleDownloadAudio = async (text: string) => {
    setIsDownloadingAudio(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 3000), lang: 'en' }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `razorguard-analysis-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download audio failed:', err);
      alert('Failed to generate audio. Please try again.');
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  // Handle analyst triage buttons
  const handleAction = (status: 'HELD' | 'SAFE' | 'ESCALATED' | 'BLOCKED', label: string) => {
    const note = analystNoteInput.trim() || `Analyst decision: ${label}`;
    onUpdateTransactionStatus(transaction.id, status, note, label);
    setAnalystNoteInput('');
    setActionSuccessMessage(`Decision recorded: ${label}`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Handle User Asking a Custom Query
  const handleAskQuery = async (queryToAsk?: string) => {
    const q = (queryToAsk || userQuery).trim();
    if (!q || isAskingQuery) return;

    setIsAskingQuery(true);
    setUserQuery('');

    try {
      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction,
          query: q,
        }),
      });

      const data = await response.json();
      
      let answerText = data.answer || data.summary || `Forensic evaluation: Transaction TX-${transaction.id} exhibits risk score ${transaction.riskScore}/100. Key signal is "${transaction.primaryFlag}". Buyer IP originates from ${transaction.ipCountry} with velocity of ${transaction.velocityLastHour} attempts/hr.`;
      
      // Unwrap double-encoded JSON answers from Gemini
      if (typeof answerText === 'string' && answerText.trimStart().startsWith('{')) {
        try {
          const parsed = JSON.parse(answerText);
          if (parsed.answer) answerText = parsed.answer;
        } catch {}
      }
      
      let evidenceTags = data.evidenceTags || [
        `Score: ${transaction.riskScore}/100`,
        `Flag: ${transaction.primaryFlag || 'Telemetry anomaly'}`
      ];
      
      if (typeof data.answer === 'string' && data.answer.trimStart().startsWith('{')) {
        try {
          const parsed = JSON.parse(data.answer);
          if (parsed.evidenceTags) evidenceTags = parsed.evidenceTags;
          if (parsed.recommendedAction) data.recommendedAction = data.recommendedAction || parsed.recommendedAction;
          if (parsed.confidence) data.confidence = data.confidence || parsed.confidence;
        } catch {}
      }

      const newRecord: QueryRecord = {
        id: `q-${Date.now()}`,
        query: q,
        answer: answerText,
        evidenceTags,
        confidence: data.confidence || 0.95,
        recommendedAction: data.recommendedAction || transaction.recommendedAction,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: Boolean(data.isLiveAI),
      };

      setQueryHistory((prev) => [newRecord, ...prev]);
    } catch (err) {
      console.warn('Network request failed, using instant local forensic evaluation:', err);
      const fallbackRecord: QueryRecord = {
        id: `q-${Date.now()}`,
        query: q,
        answer: `Instant local forensic evaluation: Transaction TX-${transaction.id} has a risk score of ${transaction.riskScore}/100. Primary trigger is "${transaction.primaryFlag}". Order originates from ${transaction.ipCountry} (${transaction.isProxyOrVpn ? 'Proxy/VPN active' : 'Residential'}) with ${transaction.velocityLastHour} checkout attempts/hr.`,
        evidenceTags: [
          `Risk: ${transaction.riskScore}/100`,
          `Trigger: ${transaction.primaryFlag}`,
          `Country: ${transaction.ipCountry}`
        ],
        confidence: 0.92,
        recommendedAction: transaction.recommendedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
      };
      setQueryHistory((prev) => [fallbackRecord, ...prev]);
    } finally {
      setIsAskingQuery(false);
    }
  };

  // Quick 1-click questions
  const quickQuestions = [
    { label: '💡 Why is this risky?', query: 'Explain in simple terms why this transaction is considered high risk.' },
    { label: '🌐 Is the IP address suspicious?', query: 'Is the IP address a known VPN or proxy, and does it match the cardholder?' },
    { label: '⚡ Check repeat attempts', query: 'How many times has this card or customer attempted checkout recently?' },
    { label: '📝 Write fraud summary', query: 'Draft a short, plain-English summary of this incident for our records.' },
  ];

  return (
    <div className="min-h-screen text-slate-100 pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/95 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-xl backdrop-blur-md animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP NAVIGATION BAR: Clean Breadcrumb & Quick Case Switcher
          ========================================================================= */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#070b14]/80 px-3.5 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#070b14]/80 px-3 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              title="View Lead Risk Analyst Profile"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-[#0091F5] to-emerald-400 text-sm font-bold text-black">
                M
              </div>
              <span className="hidden sm:inline">Analyst Profile</span>
            </button>
          )}
        </div>

        {/* Clean Case Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-sm text-slate-400 shrink-0 font-medium">Switch Case:</span>
          {allTransactions.slice(0, 5).map((t) => {
            const isCurrent = t.id === transaction.id;
            const isCrit = t.riskTier === 'CRITICAL';
            return (
              <button
                key={t.id}
                onClick={() => onSelectTransaction(t)}
                className={`rounded-lg px-2.5 py-1 text-sm font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'border border-[#0091F5] bg-[#0091F5]/20 text-white font-bold'
                    : 'border border-white/10 bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isCrit ? 'bg-rose-500' : 'bg-amber-400'}`} />
                <span>{t.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TRANSACTION SUMMARY BANNER: Everything at a Glance
          ========================================================================= */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#070b14]/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-5 mb-5">
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shrink-0">
              <User className="h-6 w-6 text-slate-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Transaction Review
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-sm font-mono font-bold text-slate-200">
                  {transaction.id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {transaction.customerName}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {transaction.customerEmail} • Processed at {transaction.timestamp}
              </p>
            </div>
          </div>

          {/* Amount and Status */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-sm text-slate-400 block font-medium">Order Amount</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                ₹{transaction.amount.toFixed(2)} <span className="text-sm font-normal text-slate-400">{transaction.currency}</span>
              </span>
            </div>

            <div className="h-10 w-[1px] bg-white/10" />

            <div>
              <span className="text-sm text-slate-400 block font-medium">Current Status</span>
              <span 
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold uppercase mt-1 ${
                  transaction.status === 'BLOCKED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : transaction.status === 'HELD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

        </div>

        {/* 4 Quick Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-[#0091F5] shrink-0" />
            <div>
              <div className="text-slate-400 text-sm">Card Instrument</div>
              <div className="text-white font-medium">{transaction.cardBrand} •••• {transaction.cardLast4} ({transaction.issuingCountry})</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-sm">Buyer Location</div>
              <div className="text-white font-medium">{transaction.ipCity}, {transaction.ipCountry} {transaction.isProxyOrVpn && '(VPN)'}</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center gap-3">
            <Zap className="h-4 w-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-sm">Recent Attempts</div>
              <div className="text-white font-medium">{transaction.velocityLastHour} checkout attempts / hr</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-sm">3D Secure Status</div>
              <div className={`font-medium ${transaction.threeDsStatus.includes('SUCCESS') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {transaction.threeDsStatus}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN 2-COLUMN WORKSPACE: 
          Left: Verdict & Decision | Right: Interactive AI Assistant
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* =====================================================================
            LEFT COLUMN (5 cols): The Verdict, Top Reasons, & Take Action
            ===================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Risk Assessment Verdict */}
          <div className="rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 backdrop-blur-xl shadow-lg">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Risk Assessment
              </h2>
              {isCritical ? (
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-0.5 text-sm font-bold text-rose-300">
                  HIGH RISK
                </span>
              ) : isElevated ? (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-sm font-bold text-amber-300">
                  MEDIUM RISK
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-sm font-bold text-emerald-300">
                  LOW RISK
                </span>
              )}
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-4 my-4 p-4 rounded-xl border border-white/5 bg-black/40">
              <div className="text-4xl font-extrabold font-mono text-white">
                {transaction.riskScore}
                <span className="text-base text-slate-400 font-normal"> / 100</span>
              </div>
              <div className="text-sm text-slate-300 leading-snug">
                {isCritical 
                  ? 'Strong probability of payment fraud or stolen credential abuse.' 
                  : isElevated 
                  ? 'Suspicious behavior detected. Verification is recommended.' 
                  : 'Normal consumer transaction pattern.'}
              </div>
            </div>

            {/* Why was it flagged? Top Reasons in Plain English */}
            <div className="space-y-2.5 mt-5">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">
                Key Reasons for Alert
              </h3>
              
              {transaction.evidence.map((ev, idx) => (
                <div key={ev.id || idx} className="rounded-xl border border-white/5 bg-black/30 p-3 text-sm">
                  <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                    <span>{idx + 1}. {ev.factor}</span>
                    <span className="text-rose-400 font-mono">+{ev.scoreDelta} pts</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Plain English AI Hypothesis */}
            <div className="mt-5 p-3.5 rounded-xl border border-[#0091F5]/20 bg-[#0091F5]/5 text-sm">
              <div className="font-semibold text-[#0091F5] mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Threat Assessment</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {transaction.attackHypothesis}
              </p>
            </div>

          </div>

          {/* Card 2: Take Action (Clean & Clear) */}
          <div className="rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 backdrop-blur-xl shadow-lg">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
              Take Action
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Choose how you want to handle this payment:
            </p>

            {/* 3 Main Action Buttons */}
            <div className="space-y-2.5 mb-4">
              
              {/* Block & Decline */}
              <button
                onClick={() => handleAction('BLOCKED', 'Decline & Block Transaction')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-200 hover:bg-rose-950/40 transition-all text-left active:scale-98 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                    <UserX className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Decline &amp; Block Payment</div>
                    <div className="text-sm text-rose-300/70">Cancel order and prevent financial chargeback</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Hold for Review */}
              <button
                onClick={() => handleAction('HELD', 'Put on Hold for Review')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-200 hover:bg-amber-950/40 transition-all text-left active:scale-98 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <PauseCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Hold for 24 Hours</div>
                    <div className="text-sm text-amber-300/70">Pause shipment to verify customer identity</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Approve & Mark Safe */}
              <button
                onClick={() => handleAction('SAFE', 'Approve Payment (False Positive)')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-200 hover:bg-emerald-950/40 transition-all text-left active:scale-98 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Approve Transaction</div>
                    <div className="text-sm text-emerald-300/70">Allow settlement as a legitimate order</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>

            </div>

            {/* Optional Note Field */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Add an optional note for this decision:
              </label>
              <input
                type="text"
                value={analystNoteInput}
                onChange={(e) => setAnalystNoteInput(e.target.value)}
                placeholder="e.g., Customer confirmed order via phone, card verified..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#0091F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Card 3: Optional Technical Telemetry (Collapsible so it doesn't clutter) */}
          <div className="rounded-2xl border border-white/10 bg-[#070b14]/80 p-5 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#0091F5]" />
                <span>Technical Telemetry Details</span>
              </div>
              {showTechnicalDetails ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 font-mono text-sm text-slate-300 animate-in fade-in">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">IP Address:</span>
                  <span>{transaction.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Device Client:</span>
                  <span>{transaction.deviceType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Device Hash:</span>
                  <span className="truncate max-w-[180px]">{transaction.deviceHash}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">BIN / Bank:</span>
                  <span>{transaction.bin} ({transaction.issuingBank})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Merchant Category:</span>
                  <span>{transaction.merchantCategory}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* =====================================================================
            RIGHT COLUMN (7 cols): Interactive AI Assistant (Ask RazorGuard AI)
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 backdrop-blur-xl shadow-lg flex flex-col h-full min-h-[600px]">
            
            {/* Assistant Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                  <FaviconLogo size={44} glow={true} />
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Ask RazorGuard AI</span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold px-2 py-0.5 border border-emerald-500/30">
                      Ready
                    </span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Powered by Google Gemini. Ask any question to understand this transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Question Buttons */}
            <div className="mb-4">
              <span className="text-sm text-slate-400 block mb-2 font-medium">
                Try asking one of these:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuery(q.query)}
                    disabled={isAskingQuery}
                    className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95 disabled:opacity-50 text-left"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input Box */}
            <div className="relative mb-5">
              <div className="flex items-center rounded-xl border border-white/15 bg-black/60 p-1.5 focus-within:border-[#0091F5] transition-all">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAskQuery();
                    }
                  }}
                  placeholder="Type a question (e.g., 'Is this normal for this card?') and press Enter..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => handleAskQuery()}
                  disabled={isAskingQuery || !userQuery.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0091F5] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0091F5]/80 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0"
                >
                  {isAskingQuery ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Ask</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conversation Log (Clear, easy to read answers) */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {queryHistory.map((item) => (
                <div 
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3"
                >
                  {/* Question */}
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white text-sm font-bold shrink-0 mt-0.5">
                      Q
                    </span>
                    <div className="text-sm font-bold text-white">
                      {item.query}
                    </div>
                  </div>

                  {/* AI Answer */}
                  <div className="rounded-lg bg-white/[0.03] p-3.5 border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className={`flex items-center gap-1.5 font-semibold ${item.isLiveAI ? 'text-emerald-400' : 'text-[#0091F5]'}`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{item.isLiveAI ? 'RazorGuard AI (Live)' : 'AI Forensic Answer'}</span>
                        {item.isLiveAI && (
                          <span className="ml-1.5 rounded bg-emerald-500/20 px-2 py-0.5 text-sm font-bold text-emerald-300 border border-emerald-500/30">
                            GEMINI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadAudio(item.answer)}
                          disabled={isDownloadingAudio}
                          className="flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all disabled:opacity-40"
                          title="Download as MP3"
                        >
                          {isDownloadingAudio ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3" />
                          )}
                          <span>Audio</span>
                        </button>
                        <span className="text-slate-400 font-mono text-sm">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed">
                      {item.answer}
                    </p>

                    {/* Evidence Chips */}
                    {item.evidenceTags && item.evidenceTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.evidenceTags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-sm font-mono text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recommendation Footer */}
                    <div className="pt-2 border-t border-white/5 text-sm flex items-center justify-between">
                      <span className="text-slate-400">AI Recommendation:</span>
                      <span className="font-bold text-rose-300">
                        {item.recommendedAction.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvestigatorWorkspace;
