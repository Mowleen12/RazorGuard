import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Cpu, 
  BarChart3, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface CapabilitiesSectionProps {
  onOpenInvestigator: () => void;
  onOpenDashboard: () => void;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ 
  onOpenInvestigator, 
  onOpenDashboard 
}) => {
  const [activeCapability, setActiveCapability] = useState<number>(0);

  const capabilities = [
    {
      id: 'fraud-detection',
      title: 'Deep Fraud Detection',
      tag: 'Supervised ML',
      icon: ShieldAlert,
      color: '#0091F5',
      summary: 'Interception of coordinated card testing, distributed BIN attacks, and synthetic identity fraud.',
      description: 'RazorGuard analyzes over 1,200 telemetry features per transaction against global fraud clusters. Deep classification models catch sophisticated fraudsters attempting automated credential stuffing before settlement occurs.',
      keySignals: [
        'Distributed card testing velocity thresholds',
        'Stolen BIN sequence prediction',
        'Synthetic identity creation signatures',
        'Account takeover (ATO) credential stuffing'
      ],
      metrics: '99.8% precision with sub-12ms scoring latency',
    },
    {
      id: 'anomaly-detection',
      title: 'Behavioral Anomaly Engine',
      tag: 'Unsupervised AI',
      icon: Cpu,
      color: '#8b5cf6',
      summary: 'Detects zero-day attack patterns without needing historical training labels.',
      description: 'Graph neural networks and isolation forests analyze deviations in physical velocity, checkout typing cadence, device hardware hashes, and egress proxy routing to flag stealthy zero-day attacks.',
      keySignals: [
        'Impossible travel geo-displacement analysis',
        'Headless browser & webdriver emulation identification',
        'Residential proxy & Tor exit node clustering',
        'Checkout behavioral keystroke & touch latency'
      ],
      metrics: 'Flags zero-day exploitation 48h before manual discovery',
    },
    {
      id: 'explainable-scoring',
      title: 'Explainable Risk Scoring',
      tag: 'Deterministic SHAP',
      icon: BarChart3,
      color: '#ec4899',
      summary: 'Every score from 0 to 100 comes with transparent mathematical attribution.',
      description: 'No black boxes. RazorGuard provides transparent TreeSHAP mathematical feature attributions for every score, explicitly displaying which factors increased or decreased the transaction risk.',
      keySignals: [
        'Exact delta weights (+38 Device Spoof, -14 Domestic IP)',
        'Clear risk tier classifications (Critical, Elevated, Low, Safe)',
        'Auditable decision trails for regulatory compliance',
        'Issuer & merchant custom risk thresholds'
      ],
      metrics: '100% auditable for SOC2 & European banking mandates',
    },
    {
      id: 'ai-investigation',
      title: 'AI Investigation Workspace',
      tag: 'Generative Intelligence',
      icon: Sparkles,
      color: '#0091F5',
      summary: 'Structured investigation workspace that synthesizes incident narratives instantly.',
      description: 'Rather than a generic chatbot, RazorGuard provides a structured workspace that compiles evidence, diagnoses the attack hypothesis, and drafts an executive summary for human fraud analysts.',
      keySignals: [
        'Automated executive risk narrative synthesis',
        'Adversary hypothesis & attack vector labeling',
        'Action confidence grading (e.g. 96% confidence to Block)',
        'Unified cross-merchant telemetry compilation'
      ],
      metrics: 'Reduces analyst triage time from 14 mins to 45 seconds',
    },
    {
      id: 'analyst-actions',
      title: 'Decisive Analyst Actions',
      tag: 'Workflow Automation',
      icon: Sliders,
      color: '#10b981',
      summary: 'One-click operational controls with an automated model feedback loop.',
      description: 'Arm your risk operations team with immediate levers: Hold Transaction, Mark Safe, Escalate to Tier 2, or Add to Global Watchlist. Every human decision continuously retrains the underlying model weights.',
      keySignals: [
        'Instant Hold, Escalate, and Whitelist/Blacklist triggers',
        'Automated 3DS 2.0 biometric step-up enforcement',
        'Continuous feedback loop updating model embeddings',
        'Complete audit log with analyst rationale capture'
      ],
      metrics: 'Zero-latency sync with merchant gateway and PSPs',
    },
  ];

  const current = capabilities[activeCapability];

  return (
    <section id="capabilities" className="relative border-t border-white/[0.08] bg-[#020202]/70 backdrop-blur-sm py-24">
      
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-[#0091F5]/5 blur-[160px]" />

      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-[#0091F5] mb-5">
            <span>CORE INTELLIGENCE ARCHITECTURE</span>
          </div>
          <ScrollReveal
            text="Engineered for Precision. Built for Rapid Action."
            containerClassName="justify-center max-w-3xl mx-auto mb-6 sm:mb-7"
            textClassName="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.18] sm:leading-[1.15]"
          />
          <ScrollReveal
            text="A comprehensive suite of machine learning models and operational workflows designed to stop payment fraud without creating unnecessary friction for genuine cardholders."
            containerClassName="justify-center max-w-2xl mx-auto"
            textClassName="text-base sm:text-lg text-slate-300 font-sans leading-relaxed text-center"
            baseOpacity={0.3}
          />
        </motion.div>

        {/* Capability Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            const isSelected = activeCapability === idx;
            return (
              <button
                key={cap.id}
                onClick={() => setActiveCapability(idx)}
                className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-base font-medium transition-all ${
                  isSelected
                    ? 'border border-[#0091F5]/50 bg-[#0091F5]/15 text-white shadow-[0_0_20px_-3px_rgba(0,145,245,0.4)]'
                    : 'border border-white/[0.08] bg-[#060913] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5" style={{ color: isSelected ? cap.color : '#94a3b8' }} />
                <span>{cap.title}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Selected Capability Deep-Dive Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#060913] to-[#03060f] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle ambient corner glow matching current capability color */}
          <div 
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[90px] opacity-25 pointer-events-none transition-all duration-700" 
            style={{ backgroundColor: current.color }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left explanation column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-white">
                  {current.tag}
                </span>
                <span className="text-sm text-slate-400 font-mono">
                  Module 0{activeCapability + 1} of 05
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {current.title}
              </h3>

              <p className="text-slate-300 text-base leading-relaxed mb-6">
                {current.description}
              </p>

              {/* Signals list */}
              <div className="mb-6 space-y-2.5">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Monitored Telemetry & Detection Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {current.keySignals.map((signal, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0091F5] mt-0.5" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance quote box */}
              <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5 text-sm text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#ec4899]" />
                  <span className="font-semibold text-white">Operational Benchmark:</span>
                  <span className="text-slate-300">{current.metrics}</span>
                </div>
              </div>
            </div>

            {/* Right preview display card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-white/10 bg-[#0d1224] p-5 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-mono text-slate-400 ml-2">Telemetry Stream</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">STATUS: LIVE</span>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="flex flex-col gap-1.5 bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Primary Vector</span>
                    <span className="text-white font-semibold leading-snug">{current.summary}</span>
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                    <span className="text-slate-400">Engine Response</span>
                    <span className="text-[#0091F5] font-semibold">&lt; 14 ms</span>
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                    <span className="text-slate-400">Verification</span>
                    <span className="text-emerald-400 font-semibold">Autonomous Flagging</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={onOpenInvestigator}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0091F5] py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-[#0080da]"
                  >
                    <span>Test in Investigator</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
