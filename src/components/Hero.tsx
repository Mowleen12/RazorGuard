import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RazorGuardEmblem } from './RazorGuardLogo';
import { HeroPaymentCard } from './HeroPaymentCard';
import { DecryptedText } from './DecryptedText';
import { ScrollReveal } from './ScrollReveal';

interface HeroProps {
  onOpenInvestigator: () => void;
  onOpenDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInvestigator, onOpenDashboard }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-24 lg:pt-6 lg:pb-32">
      {/* Background ambient glows & wireframe grids */}
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#0091F5]/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-[#8b5cf6]/12 blur-[140px]" />
      
      {/* Laser line SVG sweep in background */}
      <svg 
        className="pointer-events-none absolute top-1/2 left-0 w-full opacity-60" 
        height="320" 
        viewBox="0 0 1440 320" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M -100 240 C 320 290, 480 180, 720 210 C 960 240, 1120 120, 1540 180" 
          stroke="url(#laserGradient)" 
          strokeWidth="2.5" 
          strokeDasharray="6 4"
          className="laser-wire"
        />
        <defs>
          <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0091F5" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#ec4899" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0091F5" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Typography & CTAs (closely mimicking the reference screenshot) */}
          <div className="lg:col-span-6 xl:col-span-7">

            {/* Main Headline: Decrypted Text animations on Detect Risk, Before It, and Becomes Loss */}
            <div className="mb-6 tracking-tight">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl leading-[1.08] text-white">
                <span className="block font-light italic font-serif text-slate-200">
                  <DecryptedText 
                    text="Detect Risk" 
                    speed={80} 
                    maxIterations={12}
                    sequential={true} 
                    className="font-light italic font-serif text-slate-200"
                    encryptedClassName="text-[#8b5cf6] font-mono not-italic font-bold"
                    animateOn="view"
                    delay={0}
                  />
                </span>
                <span className="flex items-center gap-3 font-light text-slate-100">
                  <span>
                    <DecryptedText 
                      text="Before It" 
                      speed={85} 
                      maxIterations={12}
                      sequential={true} 
                      className="font-sans font-light text-slate-100"
                      encryptedClassName="text-[#ec4899] font-mono font-bold"
                      animateOn="view"
                      delay={320}
                    />
                  </span>
                  <span className="inline-flex items-center text-[#ec4899] font-normal text-3xl sm:text-5xl">
                    ~ ✦
                  </span>
                </span>
                <span className="block font-display font-extrabold text-white">
                  <DecryptedText 
                    text="Becomes Loss." 
                    speed={90} 
                    maxIterations={14}
                    sequential={true}
                    className="font-display font-extrabold text-white"
                    encryptedClassName="text-[#0091F5] font-display font-extrabold"
                    animateOn="view"
                    delay={650}
                  />
                </span>
              </h1>
            </div>

            {/* Supporting Copy with ScrollReveal */}
            <div className="mb-8 max-w-xl">
              <ScrollReveal
                text="Autonomous payment risk intelligence powered by deep machine learning and real-time behavioral anomaly detection. Decode fraud vectors, explain decisions with granular attribution, and safeguard merchant margins at sub-15ms latency."
                textClassName="text-base sm:text-lg text-slate-300 leading-relaxed"
                baseOpacity={0.25}
              />
            </div>

            {/* CTAs matching reference screenshot */}
            <div className="mb-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenInvestigator}
                className="group flex items-center gap-3 rounded-full bg-[#0091F5] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,145,245,0.45)] transition-all hover:bg-[#0080da] hover:shadow-[0_0_35px_rgba(0,145,245,0.65)] active:scale-95"
              >
                <span>Try Live Demo</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0091F5] shadow-sm transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>

              <button
                onClick={onOpenDashboard}
                className="rounded-full border border-white/20 bg-white/[0.05] px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/[0.1] active:scale-95"
              >
                Live Monitor Queue
              </button>
            </div>

            {/* Social Proof matching screenshot avatars + count */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex -space-x-2.5">
                <img
                  className="inline-block h-10 w-10 rounded-full border-2 border-[#020202] object-cover ring-2 ring-[#0091F5]/40"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Risk Analyst"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full border-2 border-[#020202] object-cover ring-2 ring-[#8b5cf6]/40"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Risk Analyst"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full border-2 border-[#020202] object-cover ring-2 ring-[#ec4899]/40"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                  alt="Risk Analyst"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold text-white text-base">
                  <span>14.2k+</span>
                  <span className="text-sm font-normal text-slate-400">Risk Specialists</span>
                </div>
                <span className="text-sm text-slate-400">Protecting ₹40,000Cr+ Indian UPI payment volume</span>
              </div>
            </div>

          </div>

          {/* Right Column: Abstract AI / Risk Visualization with Floating Cards */}
          <div className="relative lg:col-span-6 xl:col-span-5 flex justify-center items-center py-6">
            <HeroPaymentCard />
          </div>

        </div>

        {/* Bottom Proof Stats Row (matching screenshot's 16y / 250+ / 10.2k+ row) with Scroll Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-24 border-t border-white/[0.08] pt-10"
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            
            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">99.8%</span>
              <span className="text-sm font-medium text-slate-400 mt-1">Detection Precision Rate</span>
              <span className="text-xs text-slate-400">Trained on 480M+ global transactions</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 font-display text-3xl sm:text-4xl font-extrabold text-[#0091F5]">
                <span>&lt;12</span>
                <span className="text-xl font-normal text-slate-400">ms</span>
              </div>
              <span className="text-sm font-medium text-slate-400 mt-1">Decision Latency</span>
              <span className="text-xs text-slate-400">Real-time edge neural inference</span>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">250+</span>
              <span className="text-sm font-medium text-slate-400 mt-1">Fintech & Merchant Networks</span>
              <span className="text-xs text-slate-400">Integrated with Stripe, Adyen & Visa</span>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">0.01%</span>
              <span className="text-sm font-medium text-slate-400 mt-1">False Positive Ceiling</span>
              <span className="text-xs text-slate-400">Maximizing genuine customer conversion</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
