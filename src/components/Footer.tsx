import React from 'react';
import { Shield, Lock, FileCheck, Award, Github } from 'lucide-react';
import { RazorGuardEmblem, RazorGuardWordmark } from './RazorGuardLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#020202] py-16 text-slate-400">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <RazorGuardEmblem size={36} glow={true} />
              <RazorGuardWordmark size="sm" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Autonomous AI-powered payment risk intelligence platform. Detecting suspicious transactions, explaining fraud vectors with granular attribution, and empowering risk teams with decisive controls.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Production Model v4.8 Active</span>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Security &amp; Regulatory Compliance
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#060913] p-2.5">
                <Lock className="h-4 w-4 text-[#0091F5]" />
                <span className="text-slate-200">PCI-DSS Level 1</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#060913] p-2.5">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-200">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#060913] p-2.5">
                <Award className="h-4 w-4 text-[#8b5cf6]" />
                <span className="text-slate-200">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#060913] p-2.5">
                <Shield className="h-4 w-4 text-[#ec4899]" />
                <span className="text-slate-200">GDPR &amp; CCPA</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Platform Modules
            </span>
            <ul className="space-y-2 text-sm">
              <li><a href="#capabilities" className="hover:text-white transition-colors">Behavioral Anomaly Engine</a></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">TreeSHAP Explainable Risk Scoring</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Real-time Stream Ingestion API</a></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">AI Fraud Incident Workspace</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>
            © 2026 RazorGuard Technologies Inc. All rights reserved. Realistic sample transaction data used for demonstration.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
