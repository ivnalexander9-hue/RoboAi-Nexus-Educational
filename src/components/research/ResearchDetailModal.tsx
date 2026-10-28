import React, { useState } from 'react';
import { X, ExternalLink, Bot, CheckCircle2, AlertTriangle, FileText, BarChart, BookOpen, Share2, Check, Sparkles } from 'lucide-react';
import { ResearchArticle } from '../../types';

interface ResearchDetailModalProps {
  article: ResearchArticle | null;
  onClose: () => void;
  onAskAI: (paperTitle: string, context: string) => void;
}

export const ResearchDetailModal: React.FC<ResearchDetailModalProps> = ({
  article,
  onClose,
  onAskAI,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeChartDataset, setActiveChartDataset] = useState<number>(0);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {article.organization}
            </span>
            <span className="text-xs text-slate-400">
              {article.journal} ({article.publicationDate})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ask AI button */}
            <button
              onClick={() => onAskAI(article.title, article.executiveSummary)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Tanya Analis AI</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Salin Tautan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7">
          {/* Paper Title & Authors */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {article.title}
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-cyan-400 font-medium">
              Peneliti: {article.authors.join(', ')}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>DOI: {article.doi}</span>
            </div>
          </div>

          {/* Key Data Points Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {article.dataPoints.map((dp, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  {dp.label}
                </span>
                <span className="text-2xl font-black text-cyan-400 font-mono block mt-1">
                  {dp.value}
                </span>
                {dp.comparison && (
                  <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
                    {dp.comparison}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Abstrak & Ringkasan Eksekutif
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {article.executiveSummary}
            </p>
          </div>

          {/* Methodology */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Metodologi & Arsitektur Eksperimen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Pendekatan / Teori:</span>
                <p className="text-slate-200">{article.methodology.approach}</p>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Perangkat Keras / Model:</span>
                <p className="text-slate-200">{article.methodology.hardwareOrModel}</p>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Sampel Data / Daya Komputasi:</span>
                <p className="text-slate-200">{article.methodology.sampleSizeOrCompute}</p>
              </div>
            </div>
          </div>

          {/* Interactive Scientific Chart if available */}
          {article.chartData && (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-cyan-400" /> {article.chartData.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{article.chartData.description}</p>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
                {article.chartData.series.map((s, sIdx) => {
                  const colors = ['bg-cyan-400', 'bg-amber-400', 'bg-emerald-400'];
                  return (
                    <div key={sIdx} className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-sm ${colors[sIdx % colors.length]}`} />
                      <span className="text-slate-300 font-medium">{s.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bar Chart Visualization */}
              <div className="space-y-4 pt-2">
                {article.chartData.labels.map((label, lIdx) => {
                  return (
                    <div key={lIdx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-slate-300">
                        <span>{label}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {article.chartData!.series.map((series, sIdx) => {
                          const val = series.data[lIdx];
                          const maxVal = Math.max(...article.chartData!.series.flatMap((s) => s.data));
                          const widthPct = Math.min(100, (val / (maxVal || 100)) * 100);
                          const bgColors = ['bg-cyan-500', 'bg-amber-500', 'bg-emerald-500'];

                          return (
                            <div key={sIdx} className="flex items-center gap-3">
                              <span className="text-[11px] text-slate-500 w-32 truncate hidden sm:inline">
                                {series.name}:
                              </span>
                              <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${bgColors[sIdx % bgColors.length]}`}
                                  style={{ width: `${Math.max(5, widthPct)}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-200 w-16 text-right">
                                {val} {series.unit}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Findings */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Temuan Ilmiah Utama
            </h4>
            <ul className="space-y-2.5">
              {article.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Analysis & Limitations */}
          <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Analisis Kritis & Batasan Riset
            </h4>
            <ul className="space-y-2">
              {article.criticalAnalysis.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Future Implications */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Implikasi Masa Depan & Industri
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {article.futureImplications}
            </p>
          </div>

          {/* Citations */}
          <div className="border-t border-slate-800 pt-5 text-xs text-slate-500">
            <span className="font-semibold text-slate-400 block mb-2">Referensi & Sitasi Ilmiah:</span>
            <ul className="space-y-1 font-mono">
              {article.citations.map((cite, idx) => (
                <li key={idx}>[{idx + 1}] {cite}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
