import React from 'react';

interface LogoProps {
  className?: string;
  size?: number; // Size for emblem icon
  showWordmark?: boolean;
  showTagline?: boolean;
  showInsigniaDivider?: boolean;
  layout?: 'horizontal' | 'vertical';
  glow?: boolean;
}

/**
 * RazorGuardEmblem:
 * High-precision vector recreation of the official RazorGuard shield emblem,
 * featuring the crested shield outline, diagonal razor blade slash,
 * geometric 'R' monogram cutout, and the 3 telemetry signal bars.
 */
export const RazorGuardEmblem: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 44, className = '', glow = false }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(157, 124, 255, 0.45) 0%, rgba(0, 145, 245, 0.2) 60%, transparent 80%)',
            transform: 'scale(1.4)',
          }}
        />
      )}

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Subtle metallic/white-purple gradient for the shield */}
          <linearGradient id="shieldGrad" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Razor blade sharp gradient */}
          <linearGradient id="razorGrad" x1="20" y1="45" x2="175" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Ambient glow underneath */}
          <filter id="bladeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#9d7cff" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Shield Outline with razor cutouts */}
        {/* Top-right & right & bottom curve of shield */}
        <path
          d="M 100 25
             L 160 38
             C 166 65, 168 96, 165 118
             C 160 144, 138 168, 100 182
             C 74 172, 54 154, 44 135"
          stroke="url(#shieldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-left crest segment (before the razor slash entry) */}
        <path
          d="M 100 25
             L 64 33
             L 48 37"
          stroke="url(#shieldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left side segment below the razor slash */}
        <path
          d="M 37 92
             C 38 108, 40 122, 44 135"
          stroke="url(#shieldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 2. The 'R' Monogram inside the shield (upper loop) */}
        {/* Upper horizontal & rounded loop */}
        <path
          d="M 80 60
             L 126 60
             C 142 60, 150 70, 150 82
             C 150 94, 140 102, 126 102
             L 112 102"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Left vertical stem of R (top segment) */}
        <path
          d="M 80 60
             L 80 82"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 3. The 3 Rising Telemetry Signal Bars (lower left) */}
        {/* Bar 1 (Short) */}
        <rect
          x="68"
          y="126"
          width="5"
          height="14"
          rx="2.5"
          fill="#FFFFFF"
        />
        {/* Bar 2 (Medium) */}
        <rect
          x="77"
          y="118"
          width="5"
          height="22"
          rx="2.5"
          fill="#FFFFFF"
        />
        {/* Bar 3 (Tall) */}
        <rect
          x="86"
          y="110"
          width="5"
          height="30"
          rx="2.5"
          fill="#FFFFFF"
        />

        {/* 4. The Razor Slash (Dramatic diagonal blade with needle points) */}
        {/* Dark cutout / mask shadow behind blade for sharp separation */}
        <path
          d="M 20 44
             L 174 170
             L 148 156
             L 52 74
             Z"
          fill="#020202"
          opacity="0.95"
        />

        {/* Razor Blade Body */}
        <path
          d="M 18 44
             L 176 172
             L 146 156
             L 48 76
             Z"
          fill="url(#razorGrad)"
          filter="url(#bladeGlow)"
        />

        {/* Sharp central shine along the blade's cutting edge */}
        <line
          x1="22"
          y1="46"
          x2="172"
          y2="169"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/**
 * RazorGuardWordmark:
 * Clean, geometric typography matching the exact brand styling:
 * "RAZOR" in crisp white, "GUARD" in electric lavender with the iconic crossbar-less "Ʌ".
 */
export const RazorGuardWordmark: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-sm tracking-[0.25em]',
    md: 'text-lg tracking-[0.3em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.35em]',
    xl: 'text-3xl sm:text-5xl tracking-[0.38em]',
  };

  return (
    <div className={`font-mono font-bold uppercase select-none ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-extrabold">RAZOR</span>
      <span className="ml-2 text-[#9d7cff] font-extrabold inline-flex items-center">
        GU<span className="inline-block transform scale-y-95">Ʌ</span>RD
      </span>
    </div>
  );
};

/**
 * RazorGuardInsigniaDivider:
 * The signature bottom divider from the logo with the mini shield emblem.
 */
export const RazorGuardInsigniaDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 w-full max-w-xs mx-auto ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40" />
      {/* Mini shield outline */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-[#9d7cff] shrink-0"
      >
        <path
          d="M 12 3 L 18 5.5 C 18 11 16 16 12 20 C 8 16 6 11 6 5.5 L 12 3 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40" />
    </div>
  );
};

/**
 * RazorGuardFullLogo:
 * Complete composite logo matching the exact uploaded image with:
 * - Shield Emblem with razor slash & signal bars
 * - "RAZOR GUARD" Wordmark
 * - "DETECT RISK. EXPLAIN CLEARLY. PROTECT CONFIDENTLY." Tagline
 * - Insignia divider
 */
export const RazorGuardFullLogo: React.FC<LogoProps> = ({
  size = 140,
  showWordmark = true,
  showTagline = true,
  showInsigniaDivider = true,
  layout = 'vertical',
  glow = true,
  className = '',
}) => {
  if (layout === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        <RazorGuardEmblem size={size} glow={glow} />
        <div className="flex flex-col">
          <RazorGuardWordmark size="md" />
          {showTagline && (
            <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 uppercase mt-0.5">
              Detect Risk. Explain Clearly. Protect Confidently.
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* 1. Shield Emblem */}
      <RazorGuardEmblem size={size} glow={glow} className="mb-6" />

      {/* 2. Wordmark */}
      {showWordmark && (
        <RazorGuardWordmark size="lg" className="mb-3" />
      )}

      {/* 3. Tagline */}
      {showTagline && (
        <p className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.26em] text-slate-400 uppercase mb-4 max-w-md">
          Detect Risk. Explain Clearly. Protect Confidently.
        </p>
      )}

      {/* 4. Insignia Divider */}
      {showInsigniaDivider && <RazorGuardInsigniaDivider />}
    </div>
  );
};

/**
 * FaviconLogo:
 * Clean, high-contrast version of the RazorGuard favicon shield,
 * optimized for use as a small badge icon (AI assistant avatar, app icon, etc.).
 * - Dark rounded square background matching the brand (#020202)
 * - White shield outline with the diagonal razor slash
 * - "R" monogram and telemetry signal bars
 * - Subtle purple radial glow for depth
 */
export const FaviconLogo: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 40, className = '', glow = false }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: '#020202' }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-xl blur-lg opacity-70 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(157, 124, 255, 0.5) 0%, rgba(0, 145, 245, 0.2) 60%, transparent 80%)',
            transform: 'scale(1.3)',
          }}
        />
      )}

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 p-1.5"
        aria-label="RazorGuard"
      >
        <defs>
          <linearGradient id="favShieldGrad" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="favRazorGrad" x1="20" y1="45" x2="175" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Shield outline */}
        <path
          d="M 100 25 L 160 38 C 166 65, 168 96, 165 118 C 160 144, 138 168, 100 182 C 74 172, 54 154, 44 135"
          stroke="url(#favShieldGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 100 25 L 64 33 L 48 37"
          stroke="url(#favShieldGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 37 92 C 38 108, 40 122, 44 135"
          stroke="url(#favShieldGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* R monogram */}
        <path
          d="M 80 60 L 126 60 C 142 60, 150 70, 150 82 C 150 94, 140 102, 126 102 L 112 102"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 80 60 L 80 82"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Telemetry bars */}
        <rect x="68" y="126" width="7" height="14" rx="3.5" fill="#FFFFFF" />
        <rect x="79" y="118" width="7" height="22" rx="3.5" fill="#FFFFFF" />
        <rect x="90" y="110" width="7" height="30" rx="3.5" fill="#FFFFFF" />

        {/* Razor slash */}
        <path
          d="M 20 44 L 174 170 L 148 156 L 52 74 Z"
          fill="#020202"
        />
        <path
          d="M 18 44 L 176 172 L 146 156 L 48 76 Z"
          fill="url(#favRazorGrad)"
        />
        <line x1="22" y1="46" x2="172" y2="169" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/**
 * RazorpayLogo:
 * Vector recreation of the official Razorpay brand mark:
 * - Rounded blue square background (#3395FF — Razorpay primary)
 * - White stylized "R" with the signature diagonal sweep cutout
 * - Clean, geometric, recognizable at small sizes
 */
export const RazorpayLogo: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 40, className = '', glow = false }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: '#3395FF' }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-xl blur-lg opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(51, 149, 255, 0.55) 0%, rgba(51, 149, 255, 0.15) 60%, transparent 80%)',
            transform: 'scale(1.3)',
          }}
        />
      )}

      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
        aria-label="Razorpay"
      >
        {/* Stylized "R" — vertical stem with rounded top loop and signature diagonal sweep */}
        {/* Top loop of R */}
        <path
          d="M 9 7
             L 19 7
             C 23 7, 25 9, 25 12
             C 25 15, 23 17, 19 17
             L 14 17
             L 9 17"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left vertical stem */}
        <path
          d="M 9 7
             L 9 25"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Diagonal leg of R (signature Razorpay sweep) */}
        <path
          d="M 15 17
             L 23 25"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default RazorGuardFullLogo;
