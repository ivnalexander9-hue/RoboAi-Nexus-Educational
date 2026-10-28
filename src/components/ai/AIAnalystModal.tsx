import React, { useState, useEffect } from 'react';
import { X, Bot, Send, Sparkles, Loader2, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

interface AIAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPaperTitle?: string;
  initialContext?: string;
}

export const AIAnalystModal: React.FC<AIAnalystModalProps> = ({
  isOpen,
  onClose,
  initialPaperTitle,
  initialContext,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [paperTitle, setPaperTitle] = useState<string>(initialPaperTitle || '');
  const [context, setContext] = useState<string>(initialContext || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialPaperTitle) {
      setPaperTitle(initialPaperTitle);
      setContext(initialContext || '');
      setQuestion(`Tolong berikan analisis teknis mendalam mengenai metodologi dan implikasi terobosan dari makalah "${initialPaperTitle}".`);
    }
  }, [initialPaperTitle, initialContext]);

  if (!isOpen) return null;

  const handleAsk = async (customPrompt?: string) => {
    const qToSend = customPrompt || question;
    if (!qToSend.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setAnswer(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qToSend,
          paperTitle: paperTitle || undefined,
          context: context || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSource(data.source || 'ai');
    } catch (err: any) {
      console.error('Error fetching AI analysis:', err);
      setErrorMsg('Gagal memproses analisis dengan asisten riset. Pastikan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Jelaskan cara kerja model Vision-Language-Action (VLA) memetakan teks ke trajektori fisik robot.',
    'Mengapa aktuator fluks-radial elektrik kini lebih disukai daripada sistem hidrolik pada robot humanoid?',
    'Bagaimana algoritma Sim-to-Real mengatasi celah ketidakpastian fisika (reality gap) di dunia nyata?',
    'Apa keunggulan kamera neuromorfik (event-based) untuk drone berkecepatan tinggi dibanding kamera CMOS standar?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Asisten Analis Riset AI & Robotika
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono">
                Engine: Gemini 3.8 Flash & Knowledge Graph
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {paperTitle && (
            <div className="bg-purple-950/20 border border-purple-800/40 p-3.5 rounded-xl flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-purple-300 font-semibold block">Menganalisis Makalah:</span>
                <span className="text-slate-300">{paperTitle}</span>
              </div>
            </div>
          )}

          {/* Quick Prompt Suggestions */}
          {!answer && !isLoading && (
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-2">
                Contoh Pertanyaan Riset Kunci:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleQuestions.map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(sq);
                      handleAsk(sq);
                    }}
                    className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all leading-snug"
                  >
                    💡 {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-200">
                Memproses Sintesis Ilmiah & Komputasi Riset...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Mengekstrak korelasi mekatronika, model matematika, dan implementasi industri.
              </p>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Answer display */}
          {answer && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <Sparkles className="w-4 h-4" /> Hasil Analisis Teknis
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Model: {source}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {answer}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan konsep robotik, persamaan kinematika, atau AI..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20 shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
