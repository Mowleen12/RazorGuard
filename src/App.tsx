// The project currently does not include React's type declarations. Suppress
// type checking for this JSX entry point until those dependencies are added.
// @ts-nocheck

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DashboardView } from './components/DashboardView';
import { InvestigatorWorkspace } from './components/InvestigatorWorkspace';
import { UserProfileView } from './components/UserProfileView';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/InteractiveBackground';
import { ScrollToTopButton } from './components/ScrollToTopButton';

import {
  INITIAL_TRANSACTIONS,
  INITIAL_KPIS,
  INITIAL_DISTRIBUTION,
  RISK_TREND_DATA,
  LEADING_RISK_FACTORS,
  MODEL_PERFORMANCE_METRICS,
} from './data/mockTransactions';
import { Transaction, DashboardKPIs, RiskDistribution, RiskTrendPoint, RiskFactorItem } from './types';
import {
  loadTransactionsFromCsv,
  computeKpisFromTransactions,
  computeDistributionFromTransactions,
  computeRiskTrendFromTransactions,
  computeRiskFactorsFromTransactions,
} from './data/csvParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'investigator' | 'profile'>('landing');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<Transaction>(INITIAL_TRANSACTIONS[0]);
  const [kpis, setKpis] = useState<DashboardKPIs>(INITIAL_KPIS);
  const [distribution, setDistribution] = useState<RiskDistribution[]>(INITIAL_DISTRIBUTION);
  const [riskTrends, setRiskTrends] = useState<RiskTrendPoint[]>(RISK_TREND_DATA);
  const [riskFactors, setRiskFactors] = useState<RiskFactorItem[]>(LEADING_RISK_FACTORS);
  const [csvLoaded, setCsvLoaded] = useState(false);

  useEffect(() => {
    async function loadCsvData() {
      try {
        const csvTransactions = await loadTransactionsFromCsv(200);
        if (csvTransactions.length > 0) {
          setTransactions(csvTransactions);
          setSelectedTx(csvTransactions[0]);
          setKpis(computeKpisFromTransactions(csvTransactions));
          setDistribution(computeDistributionFromTransactions(csvTransactions));
          setRiskTrends(computeRiskTrendFromTransactions(csvTransactions));
          setRiskFactors(computeRiskFactorsFromTransactions(csvTransactions));
          setCsvLoaded(true);
        }
      } catch (error) {
        console.warn('Failed to load CSV data, using mock data:', error);
      }
    }
    loadCsvData();
  }, []);

  // Navigate to section
  const handleNavigateSection = (sectionId: string) => {
    setActiveTab('landing');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Select transaction and launch investigator workspace
  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setActiveTab('investigator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update transaction status from analyst actions
  const handleUpdateTransactionStatus = (
    txId: string,
    newStatus: 'HELD' | 'SAFE' | 'ESCALATED' | 'BLOCKED',
    analystNote: string,
    actionLabel: string
  ) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          const updatedNotes = [
            ...(t.analystNotes || []),
            {
              author: 'Senior Fraud Analyst (You)',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              note: analystNote,
              actionTaken: actionLabel,
            },
          ];
          const updatedTx: Transaction = {
            ...t,
            status: newStatus,
            analystNotes: updatedNotes,
          };
          if (selectedTx?.id === txId) {
            setSelectedTx(updatedTx);
          }
          return updatedTx;
        }
        return t;
      })
    );

    // Update KPIs dynamically
    setKpis((prev) => {
      let blockedAmt = prev.highRiskBlockedAmount;
      let blockedCnt = prev.highRiskBlockedCount;
      let reviewCnt = Math.max(0, prev.activeReviewQueueCount - 1);

      if (newStatus === 'BLOCKED') {
        blockedAmt += selectedTx.amount;
        blockedCnt += 1;
      }

      return {
        ...prev,
        highRiskBlockedAmount: Math.round(blockedAmt),
        highRiskBlockedCount: blockedCnt,
        activeReviewQueueCount: reviewCnt,
      };
    });
  };

  // Simulate a live inbound attack probe
  const handleSimulateNewAttack = () => {
    const randomId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      id: randomId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      amount: 181470.0,
      currency: 'INR',
      merchantName: 'Flipkart Electronics Gateway',
      merchantCategory: 'Consumer Electronics (MCC 5732)',
      customerName: 'Anonymous Actor',
      customerEmail: `proxy_attacker_${Math.floor(Math.random() * 100)}@torbox.i2p`,
      cardBrand: 'Visa',
      cardLast4: '9901',
      cardExp: '12/28',
      bin: '411111',
      issuingBank: 'Punjab National Bank',
      issuingCountry: 'India',
      ipAddress: '198.51.100.72',
      ipCountry: 'Seychelles (Bulletproof Hosting)',
      ipCity: 'Victoria',
      isProxyOrVpn: true,
      deviceType: 'Automated Bot - Python Requests / Selenium',
      deviceOs: 'Linux Headless',
      deviceHash: `dev_${Math.random().toString(36).substring(2, 12)}`,
      velocityLastHour: 24,
      threeDsStatus: 'NOT_ENROLLED',
      riskScore: 97,
      riskTier: 'CRITICAL',
      status: 'PENDING_REVIEW',
      primaryFlag: 'High Velocity Automated Botnet Probing Stolen UPI VPA',
      evidence: [
        {
          id: `ev-${Date.now()}-1`,
          factor: 'Automated Selenium Webdriver Detected',
          scoreDelta: 42,
          severity: 'critical',
          description: 'Client fingerprint contains automation flags and headless browser rendering traces.',
        },
        {
          id: `ev-${Date.now()}-2`,
          factor: 'Bulletproof Hosting Egress ASN',
          scoreDelta: 28,
          severity: 'critical',
          description: 'Traffic originates from a known bulletproof transit provider with 98% fraud correlation.',
        },
        {
          id: `ev-${Date.now()}-3`,
          factor: 'Extreme Velocity (24 attempts in 15 mins)',
          scoreDelta: 27,
          severity: 'high',
          description: 'Rapid card authorization probes across 4 merchant endpoints.',
        },
      ],
      shapExplanations: [
        { feature: 'Headless Automation Signature', weight: 0.42, impact: 'risk_increase', value: 'Selenium/Python' },
        { feature: 'Bulletproof ASN', weight: 0.28, impact: 'risk_increase', value: 'High Abuse ASN' },
        { feature: 'Temporal Velocity Burst', weight: 0.27, impact: 'risk_increase', value: '24 tx / 15m' },
      ],
      aiSummary: `Critical botnet probe intercepted on ${randomId}. Automated Selenium runner executing distributed UPI testing across merchant checkout APIs. Immediate hard block enforced.`,
      attackHypothesis: 'Distributed Botnet Card Testing Attack',
      recommendedAction: 'HARD_BLOCK',
      confidenceScore: 0.99,
      analystNotes: [
        {
          author: 'System Sentinel v4.2',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          note: 'Autonomous intercept. Assigned critical quarantine status.',
          actionTaken: 'Auto-Quarantine',
        },
      ],
    };

    setTransactions((prev) => [newTx, ...prev]);
    setSelectedTx(newTx);
    setKpis((prev) => ({
      ...prev,
      activeReviewQueueCount: prev.activeReviewQueueCount + 1,
      totalTransactionsCount: prev.totalTransactionsCount + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 selection:bg-[#0091F5]/30 selection:text-white">
      
      {/* Interactive Cybernetic Background (Consistent across Home, Dashboard, and Investigator) */}
      <InteractiveBackground />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main View Router */}
      <main className="relative z-10">
        {activeTab === 'landing' && (
          <>
            <Hero
              onOpenInvestigator={() => {
                setSelectedTx(transactions[0]);
                setActiveTab('investigator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDashboard={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CapabilitiesSection
              onOpenInvestigator={() => {
                setSelectedTx(transactions[0]);
                setActiveTab('investigator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDashboard={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <HowItWorksSection />
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="font-workspace">
            <DashboardView
              transactions={transactions}
              kpis={kpis}
              distribution={distribution}
              trends={riskTrends}
              riskFactors={riskFactors}
              modelMetrics={MODEL_PERFORMANCE_METRICS}
              onSelectTransaction={handleSelectTransaction}
              onSimulateNewAttack={handleSimulateNewAttack}
              onOpenProfile={() => setActiveTab('profile')}
            />
          </div>
        )}

        {activeTab === 'investigator' && (
          <div className="font-workspace">
            <InvestigatorWorkspace
              transaction={selectedTx}
              allTransactions={transactions}
              onSelectTransaction={setSelectedTx}
              onUpdateTransactionStatus={handleUpdateTransactionStatus}
              onBackToDashboard={() => setActiveTab('dashboard')}
              onOpenProfile={() => setActiveTab('profile')}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="font-workspace">
            <UserProfileView
              onBackToDashboard={() => setActiveTab('dashboard')}
              onOpenInvestigator={() => {
                setSelectedTx(transactions[0]);
                setActiveTab('investigator');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll-to-Top Up Arrow with fade animation */}
      <ScrollToTopButton />

    </div>
  );
}
