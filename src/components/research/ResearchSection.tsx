import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Bot, BarChart2, Building, Calendar, Sparkles } from 'lucide-react';
import { ResearchArticle, CategoryType } from '../../types';
import { ResearchDetailModal } from './ResearchDetailModal';

interface ResearchSectionProps {
  articles: ResearchArticle[];
  onOpenAIAnalyst: (paperTitle?: string, context?: string) => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  articles,
  onOpenAIAnalyst,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<string>('Semua');
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  // Collect unique organizations
  const organizations = ['Semua', ...Array.from(new Set(articles.map((a) => a.organization.split(' & ')[0])))];

  const filteredArticles = articles.filter((item) => {
    const matchesOrg = selectedOrg === 'Semua' || item.organization.includes(selectedOrg);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesOrg && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-purple-400" /> Publikasi & Hasil Riset Organisasi Global
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Artikel Analisis Mendalam & Jurnal Ilmiah
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Tinjauan komprehensif makalah penelitian dari MIT, Stanford HAI, Google DeepMind, IEEE, dan Science Robotics lengkap dengan data eksperimental dan grafik interaktif.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari riset, penulis, DOI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Organization Filter Bar & AI Research Assistant CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {organizations.map((org) => (
            <button
              key={org}
              onClick={() => setSelectedOrg(org)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedOrg === org
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {org}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenAIAnalyst()}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>Buka Asisten Riset AI</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="group bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 backdrop-blur-sm"
          >
            <div>
              {/* Organization and Journal */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {article.organization}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {article.publicationDate}
                </span>
              </div>

              {/* Title */}
              <h3
                onClick={() => setSelectedArticle(article)}
                className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer leading-snug line-clamp-2"
              >
                {article.title}
              </h3>

              {/* Authors */}
              <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                Penulis: {article.authors.join(', ')}
              </p>

              {/* Summary */}
              <p className="text-slate-300 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                {article.executiveSummary}
              </p>

              {/* Key Metrics row */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {article.dataPoints.slice(0, 2).map((dp, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block truncate">
                      {dp.label}
                    </span>
                    <span className="text-base font-bold text-purple-400 font-mono">
                      {dp.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px] truncate max-w-[200px]">
                {article.journal}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAIAnalyst(article.title, article.executiveSummary)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 font-medium flex items-center gap-1 transition-colors"
                  title="Analisis Paper dengan AI"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Analisis AI</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(article)}
                  className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Buka Makalah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedArticle && (
        <ResearchDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onAskAI={(title, context) => {
            setSelectedArticle(null);
            onOpenAIAnalyst(title, context);
          }}
        />
      )}
    </div>
  );
};
