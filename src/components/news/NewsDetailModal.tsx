import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Bookmark, Share2, Check, Sparkles, Building, Calendar, Clock, BarChart2 } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Stop speech when modal closes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!news) return null;

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Peramban Anda tidak mendukung fitur Text-to-Speech Web Speech API.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const fullText = `${news.title}. ${news.summary}. ${news.content.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {news.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
              news.impactLevel === 'Revolusioner'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              Dampak: {news.impactLevel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Reader */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                isSpeaking
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Berita (Text to Speech)'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Berhenti' : 'Dengarkan'}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(news.id)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isBookmarked ? 'Hapus Markah' : 'Simpan ke Markah'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Salin Tautan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {news.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> {news.organization}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {news.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {news.readTime}
              </span>
              <span>Penulis: {news.author}</span>
            </div>
          </div>

          {/* Key Metric Highlights if available */}
          {news.stats && news.stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {news.stats.map((s, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    {s.metric}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {s.value}
                    </span>
                    {s.change && (
                      <span className="text-[11px] text-emerald-400 font-medium">
                        {s.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Executive Summary Callout */}
          <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Intisari Berita
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {news.summary}
            </p>
          </div>

          {/* Full Paragraphs */}
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            {news.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Facts List */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" /> Poin Kunci & Data Ilmiah
            </h4>
            <ul className="space-y-2">
              {news.keyFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-500">Topik Terkait:</span>
            {news.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
