import React, { useState } from 'react';
import { Lightbulb, HelpCircle, CheckCircle, XCircle, Award, RotateCcw, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { TECH_FACTS } from '../../data/factsData';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { TechFact } from '../../types';

export const FactsAndQuizSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facts' | 'quiz'>('facts');

  // Facts card expand
  const [expandedFactId, setExpandedFactId] = useState<string | null>(TECH_FACTS[0].id);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
    const q = QUIZ_QUESTIONS[Number(qIdx)];
    return ansIdx === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-yellow-400" /> Fakta Ilmiah & Tantangan Uji Pengetahuan
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fakta vs Mitos & Kuis Interaktif
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Luruskan miskonsepsi umum seputar robotika & AI melalui data ilmiah tervalidasi, lalu uji pemahaman Anda melalui kuis bersertifikat.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('facts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'facts'
                ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Fakta vs Mitos ({TECH_FACTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'quiz'
                ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kuis Interaktif ({QUIZ_QUESTIONS.length} Soal)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Facts & Myths */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TECH_FACTS.map((fact) => {
              const isExpanded = expandedFactId === fact.id;

              return (
                <div
                  key={fact.id}
                  className={`bg-slate-900/80 border rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm ${
                    isExpanded ? 'border-yellow-500/60 shadow-xl shadow-yellow-500/5' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                      {fact.category}
                    </span>
                    {fact.dataMetric && (
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {fact.dataMetric.label}: {fact.dataMetric.val}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {fact.title}
                  </h3>

                  {/* Myth Card Box */}
                  <div className="mt-3.5 bg-red-950/20 border-l-4 border-red-500 p-3 rounded-r-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Mitos Umum:
                    </span>
                    <p className="text-xs text-slate-300 mt-1 italic">
                      &quot;{fact.myth}&quot;
                    </p>
                  </div>

                  {/* Fact Card Box */}
                  <div className="mt-2.5 bg-emerald-950/20 border-l-4 border-emerald-500 p-3 rounded-r-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Fakta Ilmiah:
                    </span>
                    <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                      {fact.fact}
                    </p>
                  </div>

                  {/* Expanded Scientific Explanation */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-2">
                      <span className="text-slate-400 font-semibold block">Penjelasan Mekanisme Sains:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {fact.scientificExplanation}
                      </p>
                      <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Sumber: {fact.verifiedSource}</span>
                        <span>Tahun {fact.year}</span>
                      </div>
                    </div>
                  )}

                  {/* Toggle expand button */}
                  <button
                    onClick={() => setExpandedFactId(isExpanded ? null : fact.id)}
                    className="w-full mt-4 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white transition-colors text-center font-medium"
                  >
                    {isExpanded ? 'Tutup Analisis Ilmiah' : 'Lihat Analisis Ilmiah & Sumber Riset ↓'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          {!quizFinished ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              {/* Question progress */}
              <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
                <span className="font-semibold text-yellow-400 uppercase tracking-wider">
                  Soal {currentQuestionIndex + 1} dari {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-mono">
                  Skor Sementara: {score} / {currentQuestionIndex}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 mb-6 border border-slate-800">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Category tag */}
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                {currentQ.category}
              </span>

              {/* Question text */}
              <h3 className="text-lg sm:text-xl font-bold text-white mt-3 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options list */}
              <div className="space-y-3 mt-6">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (isSelected) {
                      optionStyle = 'bg-red-950/40 border-red-500 text-red-300 line-through';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-yellow-500/10 border-yellow-400 text-yellow-300 font-medium';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation box after submit */}
              {isAnswerSubmitted && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    {selectedAnswers[currentQuestionIndex] === currentQ.correctIndex ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Jawaban Tepat!
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Kurang Tepat
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ref: {currentQ.scientificReference}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold disabled:opacity-50 transition-all shadow-md shadow-yellow-500/20"
                  >
                    Kunci Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <span>
                      {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Kuis'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-extrabold text-white">Selamat! Kuis Telah Selesai</h3>
              <p className="text-sm text-slate-400 mt-1">
                Hasil evaluasi pemahaman sains robotika dan kecerdasan buatan Anda:
              </p>

              {/* Final Score Badge */}
              <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 inline-block">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-mono block">
                  Skor Akurasi
                </span>
                <span className="text-5xl font-black text-yellow-400 font-mono mt-1 block">
                  {score} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-300 font-medium mt-2 block">
                  {score >= 5
                    ? '🏆 Tingkat Penguasaan: Ahli Riset Senior (Senior Specialist)'
                    : score >= 3
                    ? '🥈 Tingkat Penguasaan: Insinyur Praktisi (Competent Engineer)'
                    : '🌱 Tingkat Penguasaan: Penjelajah Antusias (Curious Explorer)'}
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
