import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  ArrowDown, 
  Database, 
  Binary, 
  Network, 
  Gauge, 
  Sparkles, 
  RefreshCw,
  Code2,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  GitCommit
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      phase: 'Phase I · Edge Gateway',
      title: 'Transaction Ingestion',
      icon: Database,
      timing: '< 4ms',
      algorithm: 'Streaming REST & ISO 8583 Normalizer',
      ioFlow: 'Raw PSP Webhook ➔ PCI-Hashed Token',
      summary: 'High-throughput streaming ingestion via REST API or direct PSP webhooks.',
      detail: 'Directly hooks into Stripe, Adyen, Checkout.com, or custom core banking ledgers. Normalizes ISO 8583 and modern JSON payloads, hashing sensitive PAN data into PCI-compliant tokens with sub-millisecond overhead.',
      color: '#0091F5',
      accentBg: 'bg-[#0091F5]/10',
      accentBorder: 'border-[#0091F5]/30',
      telemetrySample: {
        event: 'transaction.authorized',
        amount: 118200.00,
        currency: 'INR',
        card_token: 'tok_live_4829...3090',
        ip_hash: '185.220.101.45',
        device_id: 'dev_9f82ab30e1844b',
        gateway_ingress_ms: 2.1
      },
    },
    {
      step: '02',
      phase: 'Phase II · Feature Pipeline',
      title: 'ML Feature Extraction',
      icon: Binary,
      timing: '< 6ms',
      algorithm: '1,200+ Dimensional XGBoost & Transformer Embeddings',
      ioFlow: 'Telemetry Stream ➔ Normalized Feature Vector',
      summary: 'Ensemble gradient boosted trees & transformer models cross-examine 1,200+ features.',
      detail: 'Trained on over 480 million historical authorizations. Simultaneously evaluates device fingerprint telemetry, BIN sequence frequency, merchant category code risk, and historical card testing velocity bursts.',
      color: '#8b5cf6',
      accentBg: 'bg-[#8b5cf6]/10',
      accentBorder: 'border-[#8b5cf6]/30',
      telemetrySample: {
        feature_count: 1248,
        bin_country_match: false,
        historical_cluster_fraud_rate: 0.94,
        time_to_checkout_sec: 1.8,
        device_canvas_hash_match: false,
        feature_calc_ms: 4.8
      },
    },
    {
      step: '03',
      phase: 'Phase III · Topology Graph',
      title: 'Graph Anomaly Analysis',
      icon: Network,
      timing: '< 3ms',
      algorithm: 'Graph Neural Network (GAT) Entity Resolution',
      ioFlow: 'Feature Vector ➔ Clustered Threat Subgraph',
      summary: 'Graph neural network maps entity linkages and detects synthetic velocity bursts.',
      detail: 'Identifies hidden connection vectors across disconnected accounts: shared hardware fingerprints, Tor egress nodes, spoofed user-agents, and impossible geographic speed vectors within rolling 10-minute clusters.',
      color: '#ec4899',
      accentBg: 'bg-[#ec4899]/10',
      accentBorder: 'border-[#ec4899]/30',
      telemetrySample: {
        graph_nodes_linked: 14,
        tor_exit_confirmed: true,
        travel_speed_kmh: 3420,
        headless_browser: true,
        cluster_density_score: 0.88,
        graph_traversal_ms: 2.4
      },
    },
    {
      step: '04',
      phase: 'Phase IV · Explainable Core',
      title: 'Calibrated Risk Scoring',
      icon: Gauge,
      timing: '< 2ms',
      algorithm: 'TreeSHAP Exact Game-Theoretic Attribution',
      ioFlow: 'Subgraph ➔ 0–100 Score + Attribution Array',
      summary: 'Generates a deterministic 0–100 score with exact SHAP feature attributions.',
      detail: 'Calculates the final calibrated risk score. Outputs exact mathematical weights explaining why the score was assigned, eliminating the black-box dilemma for audit compliance, dispute prevention, and regulatory reviews.',
      color: '#f59e0b',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/30',
      telemetrySample: {
        final_risk_score: 96,
        risk_tier: 'CRITICAL',
        shap_top_signal: '+38 (Device Spoofing & Headless Chrome)',
        action_recommendation: 'HARD_BLOCK',
        score_latency_ms: 1.6
      },
    },
    {
      step: '05',
      phase: 'Phase V · Intelligence Layer',
      title: 'AI Investigation Synthesis',
      icon: Sparkles,
      timing: '< 15ms',
      algorithm: 'Server-Side Gemini Threat Correlation Engine',
      ioFlow: 'SHAP Evidence Pool ➔ Human Executive Briefing',
      summary: 'Synthesizes incident evidence into a structured narrative and hypothesis.',
      detail: 'Converts raw mathematical metrics and telemetry anomalies into a readable executive briefing for fraud investigators, highlighting adversary vectors, attack patterns, and empirical confidence scores.',
      color: '#00d4ff',
      accentBg: 'bg-[#00d4ff]/10',
      accentBorder: 'border-[#00d4ff]/30',
      telemetrySample: {
        hypothesis: 'Automated Card Testing via Proxy Cluster',
        confidence: 0.98,
        threat_actor_pattern: 'Distributed Credential Stuffing',
        suggested_action: 'Quarantine & Blacklist Device',
        inference_latency_ms: 11.2
      },
    },
    {
      step: '06',
      phase: 'Phase VI · Active Mitigation',
      title: 'Autonomous Action & Feedback',
      icon: RefreshCw,
      timing: 'Real-time',
      algorithm: 'Edge Rule Compiler & Online Reinforcement Memory',
      ioFlow: 'Decision Dispatch ➔ Instant Graph Retraining',
      summary: 'Analyst action executes immediately and continuous learning updates model weights.',
      detail: 'Whether held, blocked, stepped up to biometric 3DS, or released, the final resolution writes back to the graph memory and retrains edge scoring rules in real-time to inoculate all merchant accounts against identical vectors.',
      color: '#10b981',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/30',
      telemetrySample: {
        analyst_decision: 'CONFIRMED_FRAUD',
        device_blacklisted: true,
        model_retrained_in_sec: 0.8,
        psp_settlement_blocked: true,
        network_immunity_propagated: true
      },
    },
  ];

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  // Row 1: Steps 01, 02, 03 (flowing left to right)
  const rowOne = [steps[0], steps[1], steps[2]];
  // Row 2: Steps 04, 05, 06 in snake order (04 on right, 05 middle, 06 on left)
  const rowTwo = [steps[5], steps[4], steps[3]];

  return (
    <section id="how-it-works" className="relative border-t border-white/[0.08] bg-[#020202]/85 backdrop-blur-md py-24 overflow-hidden">
      
      {/* Background glow filament for the snake map */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-[#0091F5]/10 blur-[130px]" />
      
      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal & Section Scroll Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-[#0091F5] mb-5 sm:mb-6">
            <Activity className="h-4 w-4 text-[#0091F5]" />
            <span className="tracking-wider uppercase font-mono text-xs">Real-Time Pipeline Architecture</span>
          </div>

          <ScrollReveal
            text="How RazorGuard Operates in Milliseconds"
            containerClassName="justify-center max-w-5xl mx-auto mb-6 sm:mb-7"
            textClassName="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.18] sm:leading-[1.15] whitespace-nowrap"
          />

          <ScrollReveal
            text="From authorization request to decisive mitigation. Explore each telemetry milestone in our end-to-end decision pipeline before payment settlement."
            containerClassName="justify-center max-w-2xl mx-auto"
            textClassName="text-base sm:text-lg text-slate-300 leading-relaxed font-sans text-center"
            baseOpacity={0.3}
          />
        </motion.div>

        {/* ============================================================ */}
        {/* DETAILED SNAKE-PATTERN PROCESS MAP */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 rounded-3xl border border-white/[0.08] bg-[#050814]/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
        >
          
          {/* Legend and Map Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#0091F5] animate-ping" />
              <span className="text-sm font-mono uppercase tracking-wider text-slate-300">
                End-to-End Decision Path: <strong className="text-white">Sub-15ms Cumulative</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0091F5]" />
                <span>Ingest</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                <span>Extract</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ec4899]" />
                <span>Graph</span>
              </div>
              <ArrowDown className="h-3.5 w-3.5 text-[#f59e0b]" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                <span>Score</span>
              </div>
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00d4ff]" />
                <span>Explain</span>
              </div>
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span>Mitigate</span>
              </div>
            </div>
          </div>

          {/* DESKTOP SNAKE MAP CONTAINER */}
          <div className="relative space-y-8">
            
            {/* ---------------- ROW 1: Steps 01 -> 02 -> 03 (Left to Right) ---------------- */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rowOne.map((s, idx) => {
                  const Icon = s.icon;
                  const isSelected = activeStep === idx;
                  return (
                    <div
                      key={s.step}
                      onClick={() => setActiveStep(idx)}
                      className={`group relative flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-[#0091F5] bg-gradient-to-b from-[#0091F5]/15 to-[#060913] shadow-[0_0_30px_-5px_rgba(0,145,245,0.4)] scale-[1.02]'
                          : 'border-white/[0.08] bg-[#060913]/90 hover:border-white/20 hover:bg-[#0a0f22]'
                      }`}
                    >
                      {/* Top Header of the node */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-mono font-bold text-slate-300 border border-white/10">
                            STEP {s.step}
                          </span>
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                            {s.timing}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${s.color}20`, color: s.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-slate-400 block">{s.phase}</span>
                            <h4 className="text-base font-bold text-white tracking-tight">{s.title}</h4>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {s.summary}
                        </p>
                      </div>

                      {/* Bottom Schema & Algorithm footer */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-mono flex flex-col gap-1 text-slate-400">
                        <div className="flex items-center gap-1 text-slate-300 truncate">
                          <Cpu className="h-3.5 w-3.5 shrink-0 text-[#0091F5]" />
                          <span className="truncate">{s.algorithm}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="truncate">{s.ioFlow}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#0091F5] shrink-0 ml-1" />
                        </div>
                      </div>

                      {/* Active indicator dot */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0091F5] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0091F5]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Horizontal Connectors for Row 1 */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[32%] w-[2%] items-center justify-center pointer-events-none z-20">
                <ArrowRight className="h-4 w-4 text-[#0091F5] animate-pulse" />
              </div>
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[65%] w-[2%] items-center justify-center pointer-events-none z-20">
                <ArrowRight className="h-4 w-4 text-[#8b5cf6] animate-pulse" />
              </div>
            </div>

            {/* Downward connector from Step 03 to Step 04 */}
            <div className="hidden md:flex justify-end pr-24 py-1">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white/[0.04] border border-white/10 text-[#f59e0b]">
                <ArrowDown className="h-4 w-4 text-[#f59e0b] animate-pulse" />
              </div>
            </div>

            {/* ---------------- ROW 2: Steps 06 <- 05 <- 04 (Right to Left Snake Flow) ---------------- */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Notice rowTwo is ordered [Step 06, Step 05, Step 04] in the grid */}
                {rowTwo.map((s) => {
                  const Icon = s.icon;
                  // Map step number back to index
                  const idx = parseInt(s.step, 10) - 1;
                  const isSelected = activeStep === idx;
                  return (
                    <div
                      key={s.step}
                      onClick={() => setActiveStep(idx)}
                      className={`group relative flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-[#0091F5] bg-gradient-to-b from-[#0091F5]/15 to-[#060913] shadow-[0_0_30px_-5px_rgba(0,145,245,0.4)] scale-[1.02]'
                          : 'border-white/[0.08] bg-[#060913]/90 hover:border-white/20 hover:bg-[#0a0f22]'
                      }`}
                    >
                      {/* Top Header of the node */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-300 border border-white/10">
                            STEP {s.step}
                          </span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                            {s.timing}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${s.color}20`, color: s.color }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">{s.phase}</span>
                            <h4 className="text-sm font-bold text-white tracking-tight">{s.title}</h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {s.summary}
                        </p>
                      </div>

                      {/* Bottom Schema & Algorithm footer */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono flex flex-col gap-1 text-slate-400">
                        <div className="flex items-center gap-1 text-slate-300 truncate">
                          <Cpu className="h-3 w-3 shrink-0 text-[#0091F5]" />
                          <span className="truncate">{s.algorithm}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate">{s.ioFlow}</span>
                          <ArrowLeft className="h-3 w-3 text-[#10b981] shrink-0 ml-1" />
                        </div>
                      </div>

                      {/* Active indicator dot */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0091F5] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0091F5]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Horizontal Connectors for Row 2 (Pointing Left in Snake Flow) */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[65%] w-[2%] items-center justify-center pointer-events-none z-20">
                <ArrowLeft className="h-4 w-4 text-[#f59e0b] animate-pulse" />
              </div>
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[32%] w-[2%] items-center justify-center pointer-events-none z-20">
                <ArrowLeft className="h-4 w-4 text-[#00d4ff] animate-pulse" />
              </div>
            </div>

          </div>

          {/* Mobile indicator for snake progression */}
          <div className="md:hidden mt-6 text-center text-sm font-mono text-slate-400 flex items-center justify-center gap-2">
            <span>Tap any node above to inspect payload</span>
          </div>

        </motion.div>

        {/* ============================================================ */}
        {/* ACTIVE STAGE DEEP DIVE & TELEMETRY INSPECTOR */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#060913] via-[#040711] to-[#020202] p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0091F5]/10 rounded-full blur-[110px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner"
                  style={{ backgroundColor: `${current.color}25`, color: current.color }}
                >
                  <CurrentIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono uppercase tracking-wider" style={{ color: current.color }}>
                      {current.phase} · STEP {current.step}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                      Budget: {current.timing}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-200 font-medium mb-3">
                {current.summary}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                {current.detail}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5">
                  <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Core Algorithm / Engine</span>
                  <span className="text-sm font-semibold text-slate-200">{current.algorithm}</span>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5">
                  <span className="text-xs uppercase font-mono text-slate-400 block mb-1">Input / Output Transformation</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">{current.ioFlow}</span>
                </div>
              </div>
            </div>

            {/* Live State Payload JSON Inspector */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-[#020202] p-5 font-mono text-sm shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-[#0091F5]" />
                    <span className="font-semibold text-slate-300">Live Stage Payload (Step {current.step})</span>
                  </div>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-300 font-bold">JSON</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-xs leading-relaxed p-1 font-mono">
                  {JSON.stringify(current.telemetrySample, null, 2)}
                </pre>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
