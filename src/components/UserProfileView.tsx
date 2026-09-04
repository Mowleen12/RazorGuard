import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  KeyRound,
  Lock,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Edit3,
  Save,
  X,
  Award,
  TrendingUp,
  Activity,
  Sparkles,
  Laptop,
  AlertTriangle,
  BadgeCheck,
  Terminal,
  ShieldAlert,
  Copy,
  Check,
  Zap,
  Cpu,
  Fingerprint,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { RazorGuardEmblem } from './RazorGuardLogo';
import { ProfileCard } from './ProfileCard';

interface UserProfileViewProps {
  onBackToDashboard: () => void;
  onOpenInvestigator?: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'USR-88204-MLN',
  name: 'Mowleen',
  email: 'mowleen2006@gmail.com',
  role: 'Lead Fraud Risk Intelligence Officer',
  department: 'Financial Threat Intel & Autonomous Defense',
  clearanceLevel: 'LEVEL 4 · DIRECT AUTONOMOUS MITIGATION',
  organization: 'RazorGuard Enterprise Systems',
  badgeId: 'RG-9042-ALPHA',
  phone: '+1 (555) 392-8819',
  location: 'Tokyo / Asia-SE Cluster (Node sg1-cloud-04)',
  timezone: 'UTC+8 (Asia/Singapore)',
  joinedDate: 'March 14, 2024',
  status: 'ACTIVE',
  twoFactorEnabled: true,
  securityKey: 'FIDO2 YubiKey 5C NFC (Hardware Certified)',
  stats: {
    totalInvestigations: 1482,
    preventedFraudLoss: 3420500,
    falsePositiveRate: 0.008,
    accuracyScore: 99.4,
    mttmMinutes: 3.2,
  },
  permissions: [
    'Autonomous Hard-Block Execution',
    'Global Card BIN Range Freeze',
    'Gemini AI Model Calibration & Feedback',
    'Real-time Velocity Threshold Override',
    'Merchant Escalation Authorization',
    'Synthetic Identity Graph Traversal',
  ],
  recentActivity: [
    {
      id: 'act-1',
      action: 'Enforced Autonomous Hard-Block',
      target: 'TX-9042 (Distributed Botnet Card Testing)',
      timestamp: '14 minutes ago',
      status: 'warning',
    },
    {
      id: 'act-2',
      action: 'Verified High-Confidence Transaction',
      target: 'TX-4409 (₹1,53,150.00 Electronics Gateway)',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      id: 'act-3',
      action: 'Updated Rule Matrix Parameter',
      target: 'Velocity Heuristics: Delta > 15tx/min',
      timestamp: '3 hours ago',
      status: 'neutral',
    },
    {
      id: 'act-4',
      action: 'Completed AI Investigation Dossier',
      target: 'TX-1092 (Proxy Hopping Exploit Vector)',
      timestamp: 'Yesterday at 17:40 UTC',
      status: 'success',
    },
  ],
};

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBackToDashboard,
  onOpenInvestigator,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('razorguard_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [cardMode, setCardMode] = useState<'credential' | 'telemetry'>('credential');

  // Edit form state
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    department: profile.department,
    phone: profile.phone,
    location: profile.location,
    timezone: profile.timezone,
  });

  // Notification / preference toggles
  const [preferences, setPreferences] = useState({
    criticalAlerts: true,
    botnetAlarms: true,
    aiSummaryDigest: true,
    hapticFeedback: false,
  });

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      ...formData,
    };
    setProfile(updated);
    localStorage.setItem('razorguard_user_profile', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleCopy = (text: string, type: 'badge' | 'id') => {
    navigator.clipboard.writeText(text);
    if (type === 'badge') {
      setCopiedBadge(true);
      setTimeout(() => setCopiedBadge(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-100 font-workspace">
      
      {/* Background glow filament */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[750px] rounded-full bg-[#0091F5]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Top Header Bar & Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 text-[#0091F5]" />
              <span>Back to Dashboard</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-mono">
              <span>/</span>
              <span>Workspace</span>
              <span>/</span>
              <span className="text-white font-semibold">User Profile & Credentials</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Duty Status: {profile.status}</span>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setFormData({
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    department: profile.department,
                    phone: profile.phone,
                    location: profile.location,
                    timezone: profile.timezone,
                  });
                  setIsEditing(true);
                }
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                isEditing
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'
                  : 'border border-white/15 bg-white/[0.05] text-white hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-3.5 w-3.5 text-[#0091F5]" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3D PROFILE DECK: IDENTICAL TO HOME PAGE HERO PAYMENT CARD    */}
        {/* ============================================================ */}
        <div className="relative w-full max-w-2xl mx-auto py-4 mb-12 select-none">
          
          {/* Floating ambient sparkles matching home page */}
          <div className="pointer-events-none absolute -top-4 right-10 text-[#0091F5] text-2xl animate-pulse">
            ✦
          </div>
          <div className="pointer-events-none absolute -bottom-4 left-4 text-[#ec4899] text-xl">
            ✦
          </div>
          <div className="pointer-events-none absolute top-1/2 -right-6 text-[#8b5cf6] text-sm opacity-60">
            ✦
          </div>

          {/* Interactive Mode Switcher Capsule on top of the card */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cardMode === 'telemetry' ? 'bg-emerald-400' : 'bg-[#0091F5]'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cardMode === 'telemetry' ? 'bg-emerald-500' : 'bg-[#0091F5]'}`} />
              </span>
              <span className="text-sm font-mono tracking-wider text-slate-300 uppercase">
                {cardMode === 'telemetry' ? 'Live Telemetry & Defense Matrix' : 'Official Operator Security Clearance'}
              </span>
            </div>

            <div className="inline-flex rounded-full border border-white/15 bg-[#060913]/90 p-1 shadow-inner backdrop-blur-md">
              <button
                onClick={() => setCardMode('credential')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-semibold transition-all ${
                  cardMode === 'credential'
                    ? 'bg-[#0091F5]/25 text-white border border-[#0091F5]/50 shadow-[0_0_15px_rgba(0,145,245,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Executive Badge</span>
              </button>
              <button
                onClick={() => setCardMode('telemetry')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-semibold transition-all ${
                  cardMode === 'telemetry'
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Defense Telemetry</span>
              </button>
            </div>
          </div>

          {/* ReactBits ProfileCard 3D Animation Container */}
          <ProfileCard
            enableTilt={true}
            tiltMaxAngleX={14}
            tiltMaxAngleY={14}
            scale={1.025}
            perspective={1200}
            behindGlowEnabled={true}
            behindGlowColor={cardMode === 'telemetry' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(0, 145, 245, 0.45)'}
            behindGlowSize="500px"
            glareEnabled={true}
            glareMaxOpacity={0.28}
            className="w-full"
          >
            {/* The 3D Card Container */}
            <div className="relative min-h-[440px] sm:min-h-[460px] flex items-center justify-center">

              {/* =========================================================================
                  PRIMARY HOLOGRAPHIC DEFENSE CARD (Live Threat & Credential HUD)
                  ========================================================================= */}
              <motion.div
                animate={{
                  rotate: cardMode === 'telemetry' ? 0.5 : 0,
                  y: 0,
                  x: 0,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
                className={`w-full rounded-3xl holo-card-border p-6 sm:p-7 backdrop-blur-2xl overflow-hidden z-20 transition-all duration-700 ${
                  cardMode === 'telemetry'
                    ? 'bg-gradient-to-br from-[#052b1e] via-[#09412c] to-[#031c13] shadow-[0_30px_70px_-10px_rgba(16,185,129,0.5),0_0_45px_rgba(0,145,245,0.4)] border-2 border-emerald-400/80'
                    : 'bg-gradient-to-br from-[#091d3d] via-[#0d2f63] to-[#06142b] shadow-[0_30px_70px_-10px_rgba(0,145,245,0.55),0_0_45px_rgba(139,92,246,0.4)] border-2 border-[#0091F5]/80'
                }`}
              >
                {/* Prismatic Sheen & Reflection Layers */}
                <div className="card-shine absolute inset-0 pointer-events-none" />
                <div className="card-foil-sheen absolute inset-0 pointer-events-none opacity-80" />

                {/* Dynamic Laser Border Glow inside card */}
                <div
                  className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[70px] pointer-events-none transition-colors duration-700 ${
                    cardMode === 'telemetry' ? 'bg-emerald-400/35' : 'bg-[#0091F5]/40'
                  }`}
                />
                <div
                  className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[70px] pointer-events-none transition-colors duration-700 ${
                    cardMode === 'telemetry' ? 'bg-cyan-500/30' : 'bg-purple-600/35'
                  }`}
                />

                <div className="relative z-10">
                  {/* 1. Card Top Bar: EMV Chip + NFC Waves + Official Emblem + Status Badge */}
                  <div className="flex items-start justify-between mb-6">
                    
                    {/* Left: Realistic Gold EMV Chip & Contactless wave */}
                    <div className="flex items-center gap-3">
                      {/* Microchip */}
                      <div className="relative h-9 w-12 rounded-lg chip-gold overflow-hidden p-[2px] shadow-md">
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
                          <span className="text-[8px] font-mono tracking-wider text-slate-300 uppercase">
                            Executive Defense
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Duty / Clearance Badge */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={cardMode}
                        initial={{ opacity: 0, scale: 0.9, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 6 }}
                        transition={{ duration: 0.35 }}
                        className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 border-2 shadow-lg backdrop-blur-xl ${
                          cardMode === 'telemetry'
                            ? 'border-emerald-400/80 bg-[#040916] shadow-[0_0_20px_rgba(16,185,129,0.5)] text-emerald-300'
                            : 'border-[#0091F5]/80 bg-[#040916] shadow-[0_0_20px_rgba(0,145,245,0.5)] text-[#0091F5]'
                        }`}
                      >
                        <span className="relative flex h-2.5 w-2.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cardMode === 'telemetry' ? 'bg-emerald-400' : 'bg-[#0091F5]'} opacity-80`} />
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cardMode === 'telemetry' ? 'bg-emerald-400' : 'bg-[#0091F5]'}`} />
                        </span>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-sm font-semibold tracking-wider text-slate-300">
                            {cardMode === 'telemetry' ? 'PRECISION:' : 'CLEARANCE:'}
                          </span>
                          <span className="text-sm font-extrabold tracking-tight text-white">
                            {cardMode === 'telemetry' ? `${profile.stats.accuracyScore}%` : 'LEVEL 4'}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* 2. Embossed Card / Badge Number with authentic 3D silver light & shadow */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between">
                      <div className="embossed-card-number text-xl sm:text-2xl font-bold tracking-widest select-all">
                        8820 &nbsp;9042 &nbsp;2006 &nbsp;3090
                      </div>
                      <button
                        onClick={() => handleCopy(profile.badgeId, 'badge')}
                        className="text-sm font-mono text-slate-300 hover:text-white flex items-center gap-1.5 bg-[#040816] px-2.5 py-1 rounded-md border border-white/20 shadow-sm"
                        title="Copy Badge Number"
                      >
                        {copiedBadge ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span className="text-sm">{profile.badgeId}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Cardholder & Expiry Row */}
                  <div className="flex items-end justify-between mb-5 text-sm font-mono border-b border-white/20 pb-4">
                    <div>
                      <span className="block text-sm uppercase tracking-widest text-slate-300 mb-0.5">Operator / Identity</span>
                      <span className="embossed-card-meta font-bold text-white text-sm sm:text-sm uppercase">
                        {profile.name}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm uppercase tracking-widest text-slate-300 mb-0.5">Official Role</span>
                      <span className="embossed-card-meta font-semibold text-white">
                        LEAD RISK INTEL
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm uppercase tracking-widest text-slate-300 mb-0.5">Auth Protocol</span>
                      <span className="embossed-card-meta font-semibold text-emerald-400">
                        FIDO2-YUBI
                      </span>
                    </div>
                  </div>

                  {/* 4. Integrated RazorGuard Live Telemetry & Identity HUD */}
                  <div className="rounded-2xl border-2 border-white/20 bg-[#030713] p-3 sm:p-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${cardMode === 'telemetry' ? 'bg-emerald-500/25 text-emerald-400' : 'bg-[#0091F5]/25 text-[#0091F5]'}`}>
                          {cardMode === 'telemetry' ? <TrendingUp className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-sm font-mono font-bold tracking-wider text-white">
                          {cardMode === 'telemetry' ? 'OPERATIONAL DEFENSE METRICS' : 'VERIFIED CREDENTIAL INTELLIGENCE'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-sm text-slate-300">
                        <Zap className="h-3 w-3 text-amber-300" />
                        <span>3.2m MTTM Latency</span>
                      </div>
                    </div>

                    {/* Detail Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-sm font-mono">
                      {cardMode === 'telemetry' ? (
                        <>
                          <span className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-emerald-300 font-semibold">
                            ₹{(profile.stats.preventedFraudLoss / 100000).toFixed(1)}L Loss Prevented
                          </span>
                          <span className="rounded-md border border-[#0091F5]/40 bg-[#0091F5]/20 px-2.5 py-0.5 text-sky-200 font-semibold">
                            {profile.stats.totalInvestigations.toLocaleString()} Investigations
                          </span>
                          <span className="rounded-md border border-purple-500/40 bg-purple-500/20 px-2.5 py-0.5 text-purple-200 font-semibold">
                            {profile.stats.falsePositiveRate}% False Positives
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="rounded-md border border-[#0091F5]/40 bg-[#0091F5]/20 px-2.5 py-0.5 text-sky-200 flex items-center gap-1 font-semibold">
                            <Mail className="h-3 w-3" />
                            {profile.email}
                          </span>
                          <span className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-emerald-300 font-semibold">
                            SSO Verified
                          </span>
                          <span className="rounded-md border border-purple-500/40 bg-purple-500/20 px-2.5 py-0.5 text-purple-200 font-semibold">
                            Autonomous Hard-Block
                          </span>
                        </>
                      )}
                    </div>

                    {/* Decision / Status Footer */}
                    <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-sm font-mono">
                      <span className="text-slate-300">
                        {cardMode === 'telemetry'
                          ? 'Real-time transaction analysis pipeline active'
                          : 'Cryptographic biometric token active on Asia-SE Cluster'}
                      </span>
                      <span className={`font-bold uppercase tracking-wider ${cardMode === 'telemetry' ? 'text-emerald-400' : 'text-[#0091F5]'}`}>
                        {cardMode === 'telemetry' ? 'ACTION: AUTONOMOUS INTERCEPTION' : 'STATUS: CLEARANCE LEVEL 4'}
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
                className="absolute -bottom-4 right-2 sm:right-6 z-30 flex items-center gap-2 rounded-full border-2 border-emerald-400/80 bg-[#050c1c] px-4 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.95)] backdrop-blur-xl"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">
                    ₹{(profile.stats.preventedFraudLoss / 100000).toFixed(1)}L Loss Prevented
                  </span>
                  <span className="text-sm font-mono text-emerald-400">Direct Autonomous Mitigation</span>
                </div>
              </motion.div>

              {/* Floating Capsule 2: Model Precision */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                style={{ transform: 'translateZ(45px)' }}
                className="absolute -top-3 left-0 sm:left-4 z-30 flex items-center gap-2 rounded-full border-2 border-[#0091F5]/80 bg-[#050c1c] px-3.5 py-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.95)] backdrop-blur-xl"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#0091F5]" />
                <span className="text-sm font-mono font-bold text-slate-200">Level 4 Autonomous Defense</span>
              </motion.div>

            </div>
          </ProfileCard>
        </div>

        {/* ============================================================ */}
        {/* EDIT PROFILE MODAL / INLINE CARD (WHEN ACTIVE)               */}
        {/* ============================================================ */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 overflow-hidden rounded-3xl border-2 border-[#0091F5]/60 bg-[#070e22] p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <Edit3 className="h-5 w-5 text-[#0091F5]" />
                  <h2 className="text-lg font-bold text-white">Modify User Profile & Workstation Details</h2>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Full Name / Handle
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Official Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Secure Comm Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase text-slate-300 mb-2">
                    Cluster / Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-[#030612] px-4 py-2.5 text-sm text-white focus:border-[#0091F5] focus:outline-none focus:ring-1 focus:ring-[#0091F5]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 rounded-xl bg-[#0091F5] px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#0081dd]"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* USER DETAILS CARDS GRID                                      */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* CARD 1: Identity & Workstation Details */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-[#0091F5]/35 bg-gradient-to-b from-[#09142b] via-[#060e20] to-[#040916] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0091F5]/25 text-[#0091F5] border border-[#0091F5]/40">
                    <User className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Contact & Identity</h3>
                </div>
                <span className="text-sm font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  Verified Active
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-slate-300 font-mono block text-sm mb-1">Corporate Email</span>
                  <div className="flex items-center justify-between bg-[#02050f] p-2.5 rounded-xl border border-white/15">
                    <span className="text-slate-100 font-mono font-medium">{profile.email}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  </div>
                </div>

                <div>
                  <span className="text-slate-300 font-mono block text-sm mb-1">Direct Secure Line</span>
                  <div className="bg-[#02050f] p-2.5 rounded-xl border border-white/15 text-slate-100 font-mono">
                    {profile.phone}
                  </div>
                </div>

                <div>
                  <span className="text-slate-300 font-mono block text-sm mb-1">Timezone & Locale</span>
                  <div className="bg-[#02050f] p-2.5 rounded-xl border border-white/15 text-slate-100">
                    {profile.timezone}
                  </div>
                </div>

                <div>
                  <span className="text-slate-300 font-mono block text-sm mb-1">Primary Workstation Node</span>
                  <div className="bg-[#02050f] p-2.5 rounded-xl border border-white/15 text-slate-200 font-mono text-sm">
                    {profile.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-sm text-slate-400">
              <span>Member Since: {profile.joinedDate}</span>
              <span className="text-[#0091F5] font-mono font-semibold">RG-TENANT-01</span>
            </div>
          </motion.div>

          {/* CARD 2: Operational Performance & Respective Details */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border-2 border-emerald-500/35 bg-gradient-to-b from-[#081f18] via-[#051611] to-[#030d0a] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-400 border border-emerald-400/40">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Analyst Performance</h3>
                </div>
                <span className="text-sm font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">Last 90 Days</span>
              </div>

              {/* 4 Metric Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-emerald-500/30 bg-[#020f0a] p-3 shadow-inner">
                  <span className="text-sm uppercase font-mono text-slate-300 block mb-1">Total Cases</span>
                  <span className="text-xl font-extrabold text-white font-display">
                    {profile.stats.totalInvestigations.toLocaleString()}
                  </span>
                  <span className="text-sm text-emerald-400 font-semibold block mt-0.5">Top 1% throughput</span>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-[#020f0a] p-3 shadow-inner">
                  <span className="text-sm uppercase font-mono text-slate-300 block mb-1">Capital Saved</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-display">
                    ₹{(profile.stats.preventedFraudLoss / 100000).toFixed(1)}L
                  </span>
                  <span className="text-sm text-slate-300 block mt-0.5">INR preserved</span>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-[#020f0a] p-3 shadow-inner">
                  <span className="text-sm uppercase font-mono text-slate-300 block mb-1">False Positives</span>
                  <span className="text-xl font-extrabold text-[#0091F5] font-display">
                    {profile.stats.falsePositiveRate}%
                  </span>
                  <span className="text-sm text-slate-300 block mt-0.5">Ceiling: 0.05%</span>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-[#020f0a] p-3 shadow-inner">
                  <span className="text-sm uppercase font-mono text-slate-300 block mb-1">Avg Latency (MTTM)</span>
                  <span className="text-xl font-extrabold text-white font-display">
                    {profile.stats.mttmMinutes} <span className="text-sm font-normal text-slate-300">min</span>
                  </span>
                  <span className="text-sm text-emerald-400 font-semibold block mt-0.5">Below 5m SLA</span>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div className="rounded-xl border border-emerald-500/30 bg-[#020f0a] p-3 shadow-inner">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300">Autonomous Decision Accuracy</span>
                  <span className="text-emerald-400 font-bold font-mono">{profile.stats.accuracyScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0091F5] to-emerald-400" style={{ width: `${profile.stats.accuracyScore}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-sm text-slate-400">
              <span>Audited by Global Risk Council</span>
              <span className="text-emerald-400 font-mono font-bold">Grade A+</span>
            </div>
          </motion.div>

          {/* CARD 3: Security Clearances & Auth Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border-2 border-purple-500/35 bg-gradient-to-b from-[#161030] via-[#0f0a22] to-[#080514] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/25 text-purple-400 border border-purple-400/40">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Security & Clearance</h3>
                </div>
                <span className="text-sm font-mono text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/40">
                  Level 4
                </span>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="bg-[#080414] p-3 rounded-xl border border-purple-500/30">
                  <span className="text-sm text-slate-300 uppercase font-mono block mb-1">Two-Factor Authentication</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{profile.securityKey}</span>
                  </div>
                </div>

                <div className="bg-[#080414] p-3 rounded-xl border border-purple-500/30">
                  <span className="text-sm text-slate-300 uppercase font-mono block mb-1">Session Protocol</span>
                  <div className="flex items-center justify-between text-slate-200 font-mono text-sm">
                    <span>TLS 1.3 / AES-256-GCM</span>
                    <span className="text-emerald-400 font-semibold">IP-Pinned</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-mono uppercase text-slate-300 block mb-2 font-semibold">
                  System Authorizations
                </span>
                <div className="space-y-1.5">
                  {profile.permissions.slice(0, 4).map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200 text-sm">
                      <Check className="h-3 w-3 text-[#0091F5] shrink-0" />
                      <span className="truncate">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-sm text-slate-400">
              <span>Role: Super Operator</span>
              <span className="text-purple-300 font-mono font-semibold">All Endpoints Open</span>
            </div>
          </motion.div>

        </div>

        {/* ============================================================ */}
        {/* SECOND ROW OF DETAILS: RECENT ACTIVITY & PREFERENCES          */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Left: Recent Activity Log Card (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-3xl border-2 border-[#0091F5]/35 bg-gradient-to-b from-[#0a152d] via-[#060e20] to-[#030814] p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/15">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-[#0091F5]" />
                <h3 className="text-base font-bold text-white">Analyst Audit & Mitigation Trail</h3>
              </div>
              <span className="text-sm font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">Personal Log</span>
            </div>

            <div className="space-y-4">
              {profile.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-4 p-3.5 rounded-2xl border border-white/15 bg-[#02050e] hover:border-[#0091F5]/50 transition-colors shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                        act.status === 'warning'
                          ? 'bg-rose-400 animate-pulse'
                          : act.status === 'success'
                          ? 'bg-emerald-400'
                          : 'bg-[#0091F5]'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">{act.action}</div>
                      <div className="text-sm text-slate-300 font-mono mt-0.5">{act.target}</div>
                    </div>
                  </div>
                  <span className="text-sm text-slate-300 font-mono shrink-0 whitespace-nowrap">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {onOpenInvestigator && (
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-sm text-slate-300">Want to investigate another live transaction?</span>
                <button
                  onClick={onOpenInvestigator}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0091F5]/25 border border-[#0091F5]/50 px-3.5 py-1.5 text-sm font-semibold text-sky-200 hover:bg-[#0091F5]/35 transition-all shadow"
                >
                  <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                  <span>Launch Investigator</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: Workspace & Alert Preferences Card (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 rounded-3xl border-2 border-purple-500/35 bg-gradient-to-b from-[#160e2e] via-[#0f0920] to-[#070412] p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <Laptop className="h-4 w-4 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Workspace Preferences</h3>
                </div>
                <span className="text-sm font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">Auto-Saved</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080414] border border-purple-500/30 shadow-md">
                  <div>
                    <div className="text-sm font-semibold text-white">Critical Risk Alerts (&gt;90)</div>
                    <div className="text-sm text-slate-300">Instant audio cue on high-risk ingress</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, criticalAlerts: !preferences.criticalAlerts })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      preferences.criticalAlerts ? 'bg-[#0091F5]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.criticalAlerts ? 'left-[22px]' : 'left-[3px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080414] border border-purple-500/30 shadow-md">
                  <div>
                    <div className="text-sm font-semibold text-white">Botnet Attack Warnings</div>
                    <div className="text-sm text-slate-300">Highlight distributed UPI testing probes</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, botnetAlarms: !preferences.botnetAlarms })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      preferences.botnetAlarms ? 'bg-[#0091F5]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.botnetAlarms ? 'left-[22px]' : 'left-[3px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080414] border border-purple-500/30 shadow-md">
                  <div>
                    <div className="text-sm font-semibold text-white">Gemini AI Investigation Digest</div>
                    <div className="text-sm text-slate-300">Pre-generate forensic summaries on load</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, aiSummaryDigest: !preferences.aiSummaryDigest })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      preferences.aiSummaryDigest ? 'bg-[#0091F5]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.aiSummaryDigest ? 'left-[22px]' : 'left-[3px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080414] border border-purple-500/30 shadow-md">
                  <div>
                    <div className="text-sm font-semibold text-white">Haptic Feedback Alerts</div>
                    <div className="text-sm text-slate-300">Vibration pulse on critical拦截</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, hapticFeedback: !preferences.hapticFeedback })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      preferences.hapticFeedback ? 'bg-[#0091F5]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.hapticFeedback ? 'left-[22px]' : 'left-[3px]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 text-center text-sm text-slate-300 font-mono">
              Last synchronised with RazorGuard Identity Cloud
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
};
