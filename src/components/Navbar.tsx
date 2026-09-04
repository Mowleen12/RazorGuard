import React, { useState } from 'react';
import { Sparkles, Activity, Search, User, Menu, X } from 'lucide-react';
import { RazorGuardEmblem, RazorGuardWordmark } from './RazorGuardLogo';

interface NavbarProps {
  activeTab: 'landing' | 'dashboard' | 'investigator' | 'profile';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'investigator' | 'profile') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onNavigateSection }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Activity, activeColor: 'border-[#0091F5]/40 bg-[#0091F5]/15 text-[#0091F5] shadow-[0_0_15px_-3px_rgba(0,145,245,0.4)]', pulse: true },
    { id: 'investigator' as const, label: 'AI Investigator', icon: Search, activeColor: 'border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#c084fc] shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)]', sparkle: true },
    { id: 'profile' as const, label: 'Profile', icon: User, activeColor: 'border-[#10b981]/40 bg-[#10b981]/15 text-[#34d399] shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]' },
  ];

  const handleNav = (id: typeof activeTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl border-0 outline-none" style={{ boxShadow: 'none' }}>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('landing')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <RazorGuardEmblem size={34} glow={true} />
          <RazorGuardWordmark size="sm" />
        </div>

        {/* Center Navigation (desktop) */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? item.activeColor
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.pulse && <span className="flex h-1.5 w-1.5 rounded-full bg-[#0091F5] animate-pulse" />}
              {item.sparkle && <Sparkles className="h-3 w-3 text-[#c084fc]" />}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleNav('dashboard')}
            className="hidden sm:flex rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/[0.08]"
          >
            Live Monitor
          </button>

          <button
            onClick={() => handleNav('profile')}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'border-emerald-500/60 bg-emerald-500/20 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'
                : 'border-white/15 bg-white/[0.04] text-slate-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
            }`}
            title="View User Profile & Credentials"
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#0091F5] to-emerald-400 text-sm font-bold text-black shadow-sm">
              M
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-black" />
            </div>
            <span className="hidden sm:inline">Mowleen</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/[0.04] text-slate-300 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#020202]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-[90rem] px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? item.activeColor
                    : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.pulse && <span className="flex h-1.5 w-1.5 rounded-full bg-[#0091F5] animate-pulse" />}
                {item.sparkle && <Sparkles className="h-3 w-3 text-[#c084fc]" />}
              </button>
            ))}
            <button
              onClick={() => handleNav('dashboard')}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white sm:hidden"
            >
              <Activity className="h-4 w-4" />
              <span>Live Monitor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
