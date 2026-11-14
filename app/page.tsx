'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Rocket,
  ShieldAlert,
  Search,
  DollarSign,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  Info,
  Layers,
  ArrowRight,
  RefreshCw,
  Award,
} from 'lucide-react';
import { StartupInput, CrewAnalysisResponse } from '@/lib/types';

// Preset sample ideas for fast testing
const PRESET_IDEAS: Array<{ label: string; data: StartupInput }> = [
  {
    label: '🧠 StudySprint AI (EdTech)',
    data: {
      name: 'StudySprint AI',
      idea: 'An AI-driven spaced repetition flashcard platform that automatically converts lecture recordings and PDF textbooks into active recall quizzes for high-stress STEM & medical students.',
      industry: 'EdTech & Artificial Intelligence',
      audience: 'College undergraduates and medical students preparing for competitive exams',
      budget: '$500 (Lean MVP)',
    },
  },
  {
    label: '🍕 CampusCrave (Peer Delivery)',
    data: {
      name: 'CampusCrave',
      idea: 'A hyper-local peer-to-peer late-night food and snack delivery network connecting dorm students with student couriers already on campus when traditional delivery apps charge high surge fees.',
      industry: 'Hyperlocal Logistics / Food Delivery',
      audience: 'University dorm residents studying late night (10 PM - 3 AM)',
      budget: '$750 (Flyers + Web App MVP)',
    },
  },
  {
    label: '👗 EcoThreads (Circular Marketplace)',
    data: {
      name: 'EcoThreads',
      idea: 'A verified campus-specific thrifting and textbook exchange marketplace where students can buy, sell, or rent semester textbooks and vintage clothing with zero shipping fees through on-campus dropboxes.',
      industry: 'E-commerce / Circular Economy',
      audience: 'Budget-conscious and eco-conscious college students',
      budget: '$400 (Student Club Seed)',
    },
  },
];

export default function Home() {
  const [formData, setFormData] = useState<StartupInput>({
    name: '',
    idea: '',
    industry: '',
    audience: '',
    budget: '',
  });

  const [loading, setLoading] = useState(false);
  const [currentAgentStep, setCurrentAgentStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CrewAnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'business' | 'marketing' | 'markdown'>('overview');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: StartupInput) => {
    setFormData(preset);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.idea || !formData.industry || !formData.audience || !formData.budget) {
      setError('Please fill in all 5 fields or pick a sample preset.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setCurrentAgentStep(1);

    // Simulate progressive agent step indicator
    const stepInterval = setInterval(() => {
      setCurrentAgentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 5000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: CrewAnalysisResponse = await res.json();
      setCurrentAgentStep(4);
      setReport(data);
      setActiveTab('overview');
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Failed to generate startup report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const blob = new Blob([report.markdownReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">AI Startup Advisor Crew</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini 3.5 Flash
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              4 Agents Ready
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous 4-Agent Advisory Crew for Student Founders
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Turn Your Startup Idea Into an <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
            Actionable Strategic Report
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Our specialized AI agents validate feasibility, cross-examine real-world competitors with live verified data, design pricing models, and chart customer acquisition playbooks.
        </p>

        {/* Preset Quick Fill Pill Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Try a preset:
          </span>
          {PRESET_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="text-xs bg-white hover:bg-slate-50 text-slate-700 font-medium py-1.5 px-3 rounded-full border border-slate-200 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Form & Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
        {/* Startup Input Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Startup Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  1. Startup Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. StudySprint AI, QuickDorm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Target Industry */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  2. Target Industry <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. EdTech, Hyperlocal Logistics, FinTech, HealthTech"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Startup Idea */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                3. Startup Idea & Core Pitch <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Explain the problem you solve, the core solution, and how users will interact with it..."
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-slate-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  4. Target Audience <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. College freshmen, Remote workers, Medical students"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Estimated Initial Budget */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  5. Estimated Initial Budget <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. $200 (Bootstrapped), $1,000, $5,000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Competitors & statistics are verified via real-world market APIs.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Advisor Crew Working...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Advisor Crew & Generate Report</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Multi-Agent Crew Visualizer */}
        {(loading || report) && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Advisor Crew Execution Pipeline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Agent 1 */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentAgentStep >= 1
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Agent 1
                  </span>
                  {currentAgentStep > 1 || report ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : currentAgentStep === 1 && loading ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Idea Validator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluates feasibility, identifies root problems, and maps SWOT & risk factors.
                </p>
              </div>

              {/* Agent 2 */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentAgentStep >= 2
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Agent 2
                  </span>
                  {currentAgentStep > 2 || report ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : currentAgentStep === 2 && loading ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Market Research Agent</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Queries real competitor databases & separates verified API results from AI assumptions.
                </p>
              </div>

              {/* Agent 3 */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentAgentStep >= 3
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Agent 3
                  </span>
                  {currentAgentStep > 3 || report ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : currentAgentStep === 3 && loading ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Business Model Advisor</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Suggests pricing tiers, monetisation strategies, and maps lean operating budgets.
                </p>
              </div>

              {/* Agent 4 */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentAgentStep >= 4
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Agent 4
                  </span>
                  {report ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : currentAgentStep === 4 && loading ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Marketing Strategist</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Formulates scrappy GTM channels, promotional campaigns, and low-CAC acquisition loops.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generated Structured Startup Report */}
        {report && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Report Header Bar */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {report.startupName} — Planning Report
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Generated
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Target: {report.inputs.audience} • Industry: {report.inputs.industry} • Budget: {report.inputs.budget}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download startup_report.md</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy MD'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Idea & Feasibility
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('market')}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === 'market'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Market & Competitors (Verified)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === 'business'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Business Model & Pricing
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('marketing')}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === 'marketing'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                4. Marketing & Acquisition
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('markdown')}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === 'markdown'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                📄 Raw Markdown View
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              {/* TAB 1: OVERVIEW & IDEA VALIDATION */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Feasibility Score Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Feasibility Assessment
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                        {report.agent1_validator.feasibilityReasoning}
                      </h4>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-indigo-200 shadow-sm">
                      <Award className="w-6 h-6 text-indigo-600" />
                      <div>
                        <div className="text-2xl font-black text-slate-900 leading-none">
                          {report.agent1_validator.feasibilityScore}<span className="text-xs text-slate-400">/10</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase">Feasibility</div>
                      </div>
                    </div>
                  </div>

                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-slate-200 bg-white">
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-600" />
                        Root Problem Being Solved
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {report.agent1_validator.problemSolved}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-200 bg-white">
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Proposed Solution & Scope
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {report.inputs.idea}
                      </p>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/30">
                      <h4 className="font-bold text-emerald-900 text-sm mb-3">Key Strengths</h4>
                      <ul className="space-y-2">
                        {report.agent1_validator.strengths.map((s, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl border border-amber-100 bg-amber-50/30">
                      <h4 className="font-bold text-amber-900 text-sm mb-3">Identified Weaknesses</h4>
                      <ul className="space-y-2">
                        {report.agent1_validator.weaknesses.map((w, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Potential Risks */}
                  <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/30">
                    <h4 className="font-bold text-rose-900 text-sm mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Critical Execution & Market Risks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {report.agent1_validator.potentialRisks.map((risk, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-rose-200 text-xs text-slate-700">
                          <span className="font-bold text-rose-600 block mb-1">Risk #{idx + 1}</span>
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MARKET & VERIFIED COMPETITORS */}
              {activeTab === 'market' && (
                <div className="space-y-6">
                  {/* Verified Data Banner */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400">
                        Verified Market Research Guarantee
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Market research distinguishes verified open API results (Wikipedia & Hacker News Startup Archive) from AI-generated assumptions. Competitors and market statistics are strictly not invented.
                      </p>
                    </div>
                  </div>

                  {/* Verified Real-World Competitors */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Search className="w-4 h-4 text-indigo-600" />
                        Verified Real-World Competitors & Benchmarks
                      </h4>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ground Truth API Sourced
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.agent2_market.verifiedCompetitors.map((comp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 transition">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              Verified Entity
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {comp.description}
                          </p>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Source: {comp.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Market Observations vs AI Hypotheses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/20">
                      <h4 className="font-bold text-emerald-900 text-sm mb-3">
                        Verified Facts & Market Landscape
                      </h4>
                      <p className="text-xs text-slate-600 mb-3">{report.agent2_market.marketSummary}</p>
                      <ul className="space-y-2">
                        {report.agent2_market.verifiedStats.map((stat, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{stat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl border border-purple-100 bg-purple-50/20">
                      <h4 className="font-bold text-purple-900 text-sm mb-3">
                        AI Strategic Assumptions & Opportunities
                      </h4>
                      <div className="space-y-2 mb-3">
                        {report.agent2_market.marketOpportunities.map((op, idx) => (
                          <div key={idx} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-purple-200">
                            <span className="font-semibold text-purple-700">Opportunity: </span>
                            {op}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-purple-200/50">
                        {report.agent2_market.aiHypotheses.map((hyp, idx) => (
                          <p key={idx} className="text-[11px] text-slate-500 italic">
                            * {hyp}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Target Customer Segments */}
                  <div className="p-5 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">Detailed Target Customer Segments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {report.agent2_market.targetCustomerSegments.map((segment, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <span className="font-bold text-indigo-600 block mb-1">Segment {idx + 1}</span>
                          {segment}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BUSINESS MODEL & PRICING */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  {/* Revenue Models */}
                  <div className="p-5 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Recommended Revenue Models
                    </h4>
                    <ul className="space-y-1.5">
                      {report.agent3_business.revenueModels.map((model, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{model}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tiered Pricing Cards */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-600" />
                      Suggested Pricing Tiers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {report.agent3_business.pricingStrategies.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`p-5 rounded-xl border ${
                            idx === 1
                              ? 'border-indigo-400 bg-indigo-50/30 shadow-md ring-1 ring-indigo-400'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            {tier.tier}
                          </div>
                          <div className="text-2xl font-black text-slate-900 mt-2 mb-4">
                            {tier.price}
                          </div>
                          <ul className="space-y-2 text-xs text-slate-600">
                            {tier.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lean Operating Cost Breakdown */}
                  <div className="p-5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Operating Cost Breakdown (Within Initial Budget: {report.inputs.budget})
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">Lean Stack</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Estimated Cost</th>
                            <th className="py-2.5 px-3">Operating Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.agent3_business.operatingCosts.map((cost, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-semibold text-slate-800">{cost.category}</td>
                              <td className="py-2.5 px-3 text-indigo-600 font-bold">{cost.estimate}</td>
                              <td className="py-2.5 px-3 text-slate-500">{cost.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Revenue Generation Roadmap */}
                  <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/20">
                    <h4 className="font-bold text-indigo-950 text-sm mb-3">Milestone Revenue Roadmap</h4>
                    <div className="space-y-2">
                      {report.agent3_business.revenueGenerationRoadmap.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100 text-xs text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MARKETING & CUSTOMER ACQUISITION */}
              {activeTab === 'marketing' && (
                <div className="space-y-6">
                  {/* GTM Narrative */}
                  <div className="p-5 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-indigo-600" />
                      Core Go-To-Market Narrative
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {report.agent4_marketing.marketingStrategy}
                    </p>
                  </div>

                  {/* Recommended Social Media Platforms */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-3">
                      Recommended Social Media & Distribution Channels
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {report.agent4_marketing.recommendedPlatforms.map((plat, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            {plat.platform}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {plat.rationale}
                          </p>
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">Format: </span>
                            {plat.contentFormat}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promotional Campaigns */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-3">
                      Promotional Launch Campaigns
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.agent4_marketing.promotionalCampaigns.map((camp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-slate-900 text-sm">{camp.name}</span>
                            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                              {camp.budgetAllocation}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-indigo-600 mb-2">
                            Channel: {camp.channel}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {camp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Acquisition Funnel */}
                  <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/20">
                    <h4 className="font-bold text-indigo-950 text-sm mb-3">
                      Low-CAC Customer Acquisition Strategy
                    </h4>
                    <div className="space-y-2">
                      {report.agent4_marketing.customerAcquisitionStrategy.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100 text-xs text-slate-700">
                          <span className="text-indigo-600 font-bold mt-0.5">Step {idx + 1}:</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RAW MARKDOWN */}
              {activeTab === 'markdown' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      File: startup_report.md
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw Markdown'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono max-h-[600px] border border-slate-800">
                    {report.markdownReport}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
