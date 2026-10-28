import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Compass,
  BookOpen,
  HelpCircle,
  Bot,
  Bookmark,
  Sparkles,
  Layers,
  Shield,
  Activity,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  Crosshair
} from 'lucide-react';
import { INITIAL_NEWS } from './data/newsData';
import { RESEARCH_ARTICLES } from './data/researchData';
import { NewsSection } from './components/news/NewsSection';
import { ResearchSection } from './components/research/ResearchSection';
import { FactsAndQuizSection } from './components/quiz/FactsAndQuizSection';
import { KinematicsSimulator } from './components/simulations/KinematicsSimulator';
import { VisionAISimulator } from './components/simulations/VisionAISimulator';
import { SlamRoverSimulator } from './components/simulations/SlamRoverSimulator';
import { BipedalBalanceSimulator } from './components/simulations/BipedalBalanceSimulator';
import { AIAnalystModal } from './components/ai/AIAnalystModal';

type NavTab = 'news' | 'simulations' | 'research' | 'facts-quiz';
type SimulationType = 'kinematics' | 'vision' | 'slam' | 'pid-balance';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('news');
  const [activeSim, setActiveSim] = useState<SimulationType>('kinematics');
  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState<string[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiPaperContext, setAiPaperContext] = useState<{ title?: string; context?: string }>({});

  // Load bookmarks from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roboai_bookmarks');
      if (saved) {
        setBookmarkedNewsIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save bookmarks
  const handleToggleBookmark = (id: string) => {
    setBookmarkedNewsIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('roboai_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return next;
    });
  };

  const handleOpenAIAnalyst = (title?: string, context?: string) => {
    setAiPaperContext({ title, context });
    setIsAIModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Ambient Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('news')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  RoboAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Nexus</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40 hidden sm:inline-block">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Portal Robotika, Mekatronika & AI Berbasis Riset
              </p>
            </div>
          </div>

          {/* Primary Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'news'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Berita Harian</span>
            </button>

            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'simulations'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Lab Simulasi</span>
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'research'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Artikel Riset</span>
            </button>

            <button
              onClick={() => setActiveTab('facts-quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'facts-quiz'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Fakta & Kuis</span>
            </button>
          </nav>

          {/* Right Action: AI Research Assistant */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAIAnalyst()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Asisten Riset AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2 text-xs">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
              activeTab === 'news' ? 'text-cyan-400 bg-cyan-950/60 font-semibold' : 'text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Berita</span>
          </button>
          <button
            onClick={() => setActiveTab('simulations')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
              activeTab === 'simulations' ? 'text-cyan-400 bg-cyan-950/60 font-semibold' : 'text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulasi</span>
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
              activeTab === 'research' ? 'text-purple-400 bg-purple-950/60 font-semibold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Riset</span>
          </button>
          <button
            onClick={() => setActiveTab('facts-quiz')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
              activeTab === 'facts-quiz' ? 'text-yellow-400 bg-yellow-950/60 font-semibold' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kuis</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section if on news/home */}
        {activeTab === 'news' && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-10 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Laporan Perkembangan Teknologi Terkini
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Menavigasi Era Baru <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Embodied AI & Robotika Cerdas
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Jelajahi perpaduan antara model kecerdasan buatan berskala besar dengan dinamika perangkat keras mekatronika: dari aktuator fluks radial humanoid hingga persepsi neuromorfik berkecepatan mikrodetik.
              </p>

              {/* Quick Jump Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('simulations');
                    setActiveSim('kinematics');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>Coba Lab Kinematika Robot</span>
                </button>
                <button
                  onClick={() => setActiveTab('research')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Eksplorasi Jurnal Riset MIT & Stanford</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar inside Hero */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-2xl font-black text-cyan-400 font-mono block">85%</span>
                <span className="text-xs text-slate-400">Akselerasi Zero-Shot VLA</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 font-mono block">64-Beam</span>
                <span className="text-xs text-slate-400">LiDAR SLAM Point Cloud</span>
              </div>
              <div>
                <span className="text-2xl font-black text-purple-400 font-mono block">220 Nm/kg</span>
                <span className="text-xs text-slate-400">Densitas Torsi Aktuator Baru</span>
              </div>
              <div>
                <span className="text-2xl font-black text-yellow-400 font-mono block">100% Peer-Reviewed</span>
                <span className="text-xs text-slate-400">Sumber Jurnal Tervalidasi</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: News */}
        {activeTab === 'news' && (
          <NewsSection
            newsList={INITIAL_NEWS}
            bookmarkedIds={bookmarkedNewsIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* TAB 2: Simulations */}
        {activeTab === 'simulations' && (
          <div className="space-y-6">
            {/* Simulation Sub-Navigation Cards */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4 text-cyan-400" /> Laboratorium Fisika & Algoritma Interaktif
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Simulasi Pembelajaran Robotika & AI
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Pahami konsep matematika kinematika terbalik, persepsi konvolusi visual neural network, navigasi laser SLAM, dan kontrol stabilitas inverted pendulum secara langsung.
                </p>
              </div>

              {/* Simulator Switcher Pills */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveSim('kinematics')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSim === 'kinematics'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>1. Kinematika 3-DOF</span>
                </button>

                <button
                  onClick={() => setActiveSim('vision')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSim === 'vision'
                      ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>2. Visi AI & YOLO</span>
                </button>

                <button
                  onClick={() => setActiveSim('slam')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSim === 'slam'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>3. SLAM LiDAR Rover</span>
                </button>

                <button
                  onClick={() => setActiveSim('pid-balance')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSim === 'pid-balance'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>4. Keseimbangan PID</span>
                </button>
              </div>
            </div>

            {/* Active Simulation View */}
            <div>
              {activeSim === 'kinematics' && <KinematicsSimulator />}
              {activeSim === 'vision' && <VisionAISimulator />}
              {activeSim === 'slam' && <SlamRoverSimulator />}
              {activeSim === 'pid-balance' && <BipedalBalanceSimulator />}
            </div>
          </div>
        )}

        {/* TAB 3: Research Articles */}
        {activeTab === 'research' && (
          <ResearchSection
            articles={RESEARCH_ARTICLES}
            onOpenAIAnalyst={handleOpenAIAnalyst}
          />
        )}

        {/* TAB 4: Facts & Quiz */}
        {activeTab === 'facts-quiz' && <FactsAndQuizSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070b12] py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">RoboAI Nexus</span>
                <p className="text-xs text-slate-500">
                  Platform eksplorasi riset robotik, mekatronika, dan kecerdasan buatan.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="hover:text-slate-300">Sumber Referensi: MIT CSAIL</span>
              <span className="hover:text-slate-300">Stanford HAI</span>
              <span className="hover:text-slate-300">Google DeepMind</span>
              <span className="hover:text-slate-300">IEEE Robotics</span>
              <span className="hover:text-slate-300">Science Robotics</span>
            </div>

            <p className="text-xs text-slate-500">
              © 2026 RoboAI Nexus. Analisis berbasis literatur ilmiah.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Analyst Modal */}
      <AIAnalystModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialPaperTitle={aiPaperContext.title}
        initialContext={aiPaperContext.context}
      />
    </div>
  );
}
