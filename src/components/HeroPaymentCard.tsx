import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { RazorGuardEmblem } from './RazorGuardLogo';
import { ProfileCard } from './ProfileCard';

export const HeroPaymentCard: React.FC = () => {
  // Interactive state: allows user to toggle card between Threat state and Clean state
  const [simulationMode, setSimulationMode] = useState<'threat' | 'clean'>('threat');
  const isThreat = simulationMode === 'threat';

  return (
    <div className="relative w-full max-w-xl mx-auto py-4 select-none">
      
      {/* Floating ambient sparkles matching reference screenshot */}
      <div className="pointer-events-none absolute -top-6 right-6 text-[#0091F5] text-2xl animate-pulse">
        ✦
      </div>
      <div className="pointer-events-none absolute -bottom-6 left-2 text-[#ec4899] text-xl">
        ✦
      </div>
      <div className="pointer-events-none absolute top-1/2 -right-8 text-[#8b5cf6] text-sm opacity-60">
        ✦
      </div>

      {/* Interactive Simulation Switcher Capsule on top */}
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isThreat ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isThreat ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </span>
          <span className="text-sm font-mono tracking-wider text-slate-400 uppercase">
            Interactive Telemetry Demo
          </span>
        </div>

        <div className="inline-flex rounded-full border border-white/20 bg-[#050c1c] p-1 shadow-inner backdrop-blur-md">
          <button
            onClick={() => setSimulationMode('threat')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-mono font-bold transition-all ${
              isThreat
                ? 'bg-rose-500/30 text-rose-200 border-2 border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3 w-3" />
            <span>Attack Intercept</span>
          </button>
          <button
            onClick={() => setSimulationMode('clean')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-mono font-bold transition-all ${
              !isThreat
                ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3 w-3" />
            <span>Clean Payment</span>
          </button>
        </div>
      </div>

      {/* ReactBits ProfileCard 3D Animation Container (https://reactbits.dev/components/profile-card) */}
      <ProfileCard
        enableTilt={true}
        tiltMaxAngleX={14}
        tiltMaxAngleY={14}
        scale={1.025}
        perspective={1200}
        behindGlowEnabled={true}
        behindGlowColor={isThreat ? 'rgba(244, 63, 94, 0.55)' : 'rgba(0, 145, 245, 0.5)'}
        behindGlowSize="460px"
        glareEnabled={true}
        glareMaxOpacity={0.28}
        className="w-full"
      >
        {/* The 3D Card Container */}
        <div className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center">

          {/* =========================================================================
              PRIMARY HOLOGRAPHIC DEFENSE CARD (Live Threat HUD)
              ========================================================================= */}
          <motion.div
            animate={{
              rotate: isThreat ? 0.5 : 0,
              y: 0,
              x: 0,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
            className={`w-full rounded-3xl holo-card-border p-6 sm:p-7 backdrop-blur-2xl overflow-hidden z-20 transition-all duration-700 ${
            isThreat 
              ? 'bg-gradient-to-br from-[#3b0d1e] via-[#4c1328] to-[#1e050d] shadow-[0_30px_70px_-10px_rgba(244,63,94,0.55),0_0_45px_rgba(139,92,246,0.4)] border-2 border-rose-500/80' 
              : 'bg-gradient-to-br from-[#091d3d] via-[#0d2f63] to-[#06142b] shadow-[0_30px_70px_-10px_rgba(16,185,129,0.5),0_0_45px_rgba(0,145,245,0.4)] border-2 border-emerald-400/80'
          }`}
        >
          {/* Prismatic Sheen & Reflection Layers */}
          <div className="card-shine absolute inset-0 pointer-events-none" />
          <div className="card-foil-sheen absolute inset-0 pointer-events-none opacity-80" />

          {/* Dynamic Laser Border Glow inside card */}
          <div 
            className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[70px] pointer-events-none transition-colors duration-700 ${
              isThreat ? 'bg-rose-500/40' : 'bg-emerald-400/35'
            }`} 
          />
          <div 
            className={`absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-[70px] pointer-events-none transition-colors duration-700 ${
              isThreat ? 'bg-purple-600/35' : 'bg-cyan-500/35'
            }`} 
          />

          <div className="relative z-10">
            {/* 1. Card Top Bar: EMV Chip + NFC Waves + Official Emblem + Score Badge */}
            <div className="flex items-start justify-between mb-6">
              
              {/* Left: Realistic Gold EMV Chip & Contactless wave */}
              <div className="flex items-center gap-3">
                {/* Microchip */}
                <div className="relative h-9 w-12 rounded-lg chip-gold overflow-hidden p-[2px] shadow-md">
                  {/* Etched microcircuit contact lines */}
                  <div className="h-full w-full border border-[#7a5b06]/60 rounded-[5px] grid grid-cols-3 grid-rows-2 gap-[1.5px] p-[2px]">
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                    <div className="border border-[#8f6d0a]/40 rounded-[2px] bg-white/10" />
                  </div>
                </div>

                {/* NFC Contactless Symbol */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white/85"
                >
                  <path d="M 8 9 C 9.5 10.5, 9.5 13.5, 8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 12 6 C 15 9, 15 15, 12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 16 3 C 20.5 7.5, 20.5 16.5, 16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>

                {/* RazorGuard Platinum Brandmark */}
                <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-white/20">
                  <RazorGuardEmblem size={24} glow={true} />
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-extrabold tracking-widest text-white">RAZORGUARD</span>
                    <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">Neural Shield</span>
                  </div>
                </div>
              </div>

              {/* Right: Live Risk Score Indicator with animated gauge aura */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={simulationMode}
                  initial={{ opacity: 0, scale: 0.9, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 6 }}
                  transition={{ duration: 0.35 }}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 border shadow-lg backdrop-blur-xl ${
                    isThreat
                      ? 'border-rose-500/60 bg-black/70 shadow-[0_0_20px_rgba(244,63,94,0.4)] text-rose-300'
                      : 'border-emerald-400/60 bg-black/70 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-300'
                  }`}
                >
                  <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isThreat ? 'bg-rose-400' : 'bg-emerald-400'} opacity-80`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isThreat ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                  </span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-semibold tracking-wider text-slate-300">RISK:</span>
                    <span className="text-sm font-extrabold tracking-tight">
                      {isThreat ? '94' : '07'}
                    </span>
                    <span className="text-sm text-slate-400">/100</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 2. Embossed Card Number with authentic 3D silver light & shadow */}
            <div className="mb-5">
              <div className="embossed-card-number text-xl sm:text-2xl font-bold tracking-widest select-all">
                4829 &nbsp;8412 &nbsp;9302 &nbsp;3090
              </div>
            </div>

            {/* 3. Cardholder & Expiry Row */}
            <div className="flex items-end justify-between mb-5 text-xs font-mono border-b border-white/15 pb-4">
              <div>
                <span className="block text-xs uppercase tracking-widest text-slate-300 mb-0.5">Cardholder</span>
                <span className="embossed-card-meta font-bold text-white text-xs sm:text-sm">ALEXANDRA CHEN</span>
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase tracking-widest text-slate-300 mb-0.5">Expires</span>
                <span className="embossed-card-meta font-semibold text-white">09/27</span>
              </div>
              <div className="text-right">
                <span className="block text-xs uppercase tracking-widest text-slate-300 mb-0.5">Security CVV</span>
                <span className="embossed-card-meta font-semibold text-white">742</span>
              </div>
            </div>

            {/* 4. Integrated RazorGuard Live Telemetry HUD */}
            <div className="rounded-2xl border border-white/15 bg-black/60 p-3 sm:p-3.5 backdrop-blur-xl shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${isThreat ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {isThreat ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-sm font-mono font-bold tracking-wider text-white">
                    {isThreat ? 'AUTONOMOUS INTERCEPTION' : 'AUTHORIZED TRANSACTION'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-sm text-slate-400">
                  <Zap className="h-3 w-3 text-amber-300" />
                  <span>{isThreat ? '8.2ms' : '6.4ms'} Latency</span>
                </div>
              </div>

              {/* Attribution Signals (SHAP Vector tags) */}
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-mono">
                {isThreat ? (
                  <>
                    <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-rose-300">
                      Tor Exit +38
                    </span>
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-300">
                      Velocity Spike +27
                    </span>
                    <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-purple-300">
                      Headless Browser +19
                    </span>
                  </>
                ) : (
                  <>
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                      Known Device Hash -34
                    </span>
                    <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-sky-300">
                      Trusted Subnet -28
                    </span>
                    <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-indigo-300">
                      3DS Biometric -18
                    </span>
                  </>
                )}
              </div>

              {/* Decision Footer */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-sm font-mono">
                <span className="text-slate-400">
                  {isThreat ? 'Threat vector quarantined before settlement' : 'Payment token released to acquirer'}
                </span>
                <span className={`font-bold uppercase tracking-wider ${isThreat ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isThreat ? 'ACTION: AUTO-QUARANTINE' : 'ACTION: AUTO-APPROVE'}
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* =========================================================================
            SURROUNDING FLOATING STATUS CAPSULES
            ========================================================================= */}
        {/* Floating Capsule 1: Loss Prevented */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute -bottom-4 right-2 sm:right-6 z-30 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#060913]/95 px-4 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">₹1,18,200 Loss Prevented</span>
            <span className="text-xs font-mono text-emerald-400">Direct Mitigation</span>
          </div>
        </motion.div>

          {/* Floating Capsule 2: Model Precision */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            style={{ transform: 'translateZ(45px)' }}
            className="absolute -top-3 left-0 sm:left-4 z-30 flex items-center gap-2 rounded-full border border-[#0091F5]/40 bg-[#060913]/95 px-3.5 py-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <Cpu className="h-3.5 w-3.5 text-[#0091F5]" />
            <span className="text-sm font-mono font-bold text-slate-200">99.8% ML Precision</span>
          </motion.div>

        </div>
      </ProfileCard>
    </div>
  );
};

export default HeroPaymentCard;
