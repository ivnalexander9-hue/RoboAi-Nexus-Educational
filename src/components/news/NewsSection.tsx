import React, { useState } from 'react';
import { Search, Flame, Bookmark, ArrowRight, Zap, Filter, Sparkles, Building, Calendar, Clock } from 'lucide-react';
import { NewsItem, CategoryType } from '../../types';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsSectionProps {
  newsList: NewsItem[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

const CATEGORIES: CategoryType[] = [
  'Semua',
  'Humanoid & Mekatronika',
  'Model AI & LLM',
  'Sistem Otonom & Navigasi',
  'AI Medis & Bio-Robotika',
  'Otomasi Industri',
  'Komputasi Neuromorfik',
];

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsList,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState<boolean>(false);

  // Filtered news items
  const filteredNews = newsList.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = !filterBookmarkedOnly || bookmarkedIds.includes(item.id);

    return matchesCategory && matchesSearch && matchesBookmark;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-cyan-400" /> Warta Harian Terkini
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Perkembangan Robotika & AI Global
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Laporan terverifikasi mengenai terobosan aktuator mekatronika, model Vision-Language-Action, dan sistem otonom dari laboratorium riset terkemuka.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berita, teknologi, instansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Chips & Bookmarked Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors shrink-0 ${
            filterBookmarkedOnly
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${filterBookmarkedOnly ? 'fill-amber-400' : ''}`} />
          <span>Tersimpan ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Tidak ada berita yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Coba gunakan kata kunci pencarian lain atau pilih kategori &quot;Semua&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item) => {
            const isSaved = bookmarkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="group bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm"
              >
                <div>
                  {/* Card badges row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.badge === 'Terkini'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.badge === 'Trending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {item.badge}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(item.id);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={isSaved ? 'Hapus Simpanan' : 'Simpan Berita'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedNews(item)}
                    className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </h3>

                  {/* Organization & Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.organization}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-300 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Quick Stat Highlight if exists */}
                  {item.stats && item.stats.length > 0 && (
                    <div className="mt-3 py-2 px-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{item.stats[0].metric}:</span>
                      <span className="text-cyan-400 font-bold font-mono">{item.stats[0].value}</span>
                    </div>
                  )}
                </div>

                {/* Footer of Card */}
                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.readTime}</span>
                  </div>

                  <button
                    onClick={() => setSelectedNews(item)}
                    className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Baca Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* News Detail Reader Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          isBookmarked={bookmarkedIds.includes(selectedNews.id)}
          onToggleBookmark={onToggleBookmark}
        />
      )}
    </div>
  );
};
