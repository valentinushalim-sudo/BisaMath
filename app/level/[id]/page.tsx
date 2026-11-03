'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Heart, Star, Award, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { mockLevels } from '@/lib/mockData';
import { usePlayerStore } from '@/lib/store';

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = Number(params.id);
  const levelData = mockLevels[levelId];

  const { addXp, addCoins } = usePlayerStore();

  const [gameState, setGameState] = useState<'material' | 'quiz' | 'completed' | 'failed'>('material');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  if (!levelData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-black text-slate-800">Level tidak ditemukan!</h2>
        <button onClick={() => router.push('/')} className="mt-4 bg-blue-500 text-white font-bold px-6 py-2 rounded-full">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = levelData.questions[currentQuestionIdx];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (lives <= (selectedAnswer !== currentQuestion.correctAnswer ? 1 : 0)) {
      setGameState('failed');
      return;
    }

    if (currentQuestionIdx + 1 < levelData.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Selesai semua soal
      const earnedXp = (score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)) * 50;
      const earnedCoins = 20;
      addXp(earnedXp);
      addCoins(earnedCoins);
      setGameState('completed');
    }
  };

  const handleRestart = () => {
    setGameState('material');
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
  };

  return (
    <div className="min-h-[85vh] p-6 lg:p-10 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Header Navigasi */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-2xl transition-colors"
        >
          <ArrowLeft size={20} /> Keluar
        </button>
        <h1 className="text-xl font-black text-slate-800">Level {levelData.id}: {levelData.title}</h1>
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-2xl border-2 border-red-100">
          <Heart size={20} className="text-red-500 fill-red-500" />
          <span className="font-black text-red-600">{lives}</span>
        </div>
      </div>

      {/* FASE 1: MATERI TUTORIAL */}
      {gameState === 'material' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 my-auto">
          <div className="bg-blue-50 border-4 border-blue-100 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Materi Pembelajaran</h2>
            <p className="text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">{levelData.material}</p>
          </div>
          <button
            onClick={() => setGameState('quiz')}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            Mulai Kuis! <ArrowRight size={24} />
          </button>
        </motion.div>
      )}

      {/* FASE 2: KUIS SOAL */}
      {gameState === 'quiz' && (
        <div className="space-y-6 my-auto">
          {/* Progress Bar Soal */}
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestionIdx + 1) / levelData.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Kartu Pertanyaan */}
          <div className="bg-slate-50 border-2 border-slate-100 p-6 md:p-8 rounded-3xl text-center shadow-sm">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase">
              Soal {currentQuestionIdx + 1} dari {levelData.questions.length}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-4">{currentQuestion.question}</h2>
          </div>

          {/* Opsi Jawaban */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-blue-400';
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                  btnStyle = 'bg-green-500 border-green-600 text-white';
                } else if (idx === selectedAnswer) {
                  btnStyle = 'bg-red-500 border-red-600 text-white';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-4 rounded-2xl font-black text-lg border-4 transition-all shadow-sm flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle size={24} />}
                  {isAnswered && idx === selectedAnswer && idx !== currentQuestion.correctAnswer && <XCircle size={24} />}
                </button>
              );
            })}
          </div>

          {/* Penjelasan Jawaban & Tombol Lanjut */}
          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
              <p className="text-sm font-bold text-blue-900 mb-3">💡 {currentQuestion.explanation}</p>
              <button
                onClick={handleNextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Lanjut <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* FASE 3: MENANG / HASIL */}
      {gameState === 'completed' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center my-auto space-y-6">
          <div className="bg-amber-50 border-4 border-amber-200 p-8 rounded-3xl max-w-md mx-auto shadow-xl">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-slate-800">LEVEL SELESAI!</h2>
            <p className="text-slate-600 font-bold mt-1">Kamu luar biasa!</p>

            <div className="flex justify-center gap-2 my-6">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={40} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border-2 border-amber-100 font-black">
              <div className="text-blue-600">
                <span className="text-xs text-slate-400 block">XP Didapat</span>
                +150 XP
              </div>
              <div className="text-amber-500">
                <span className="text-xs text-slate-400 block">Koin Didapat</span>
                +20 Koin
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full max-w-md bg-green-500 hover:bg-green-400 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-transform active:scale-95 mx-auto"
          >
            Kembali ke Peta
          </button>
        </motion.div>
      )}

      {/* FASE 4: GAGAL */}
      {gameState === 'failed' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center my-auto space-y-6">
          <div className="bg-red-50 border-4 border-red-200 p-8 rounded-3xl max-w-md mx-auto shadow-xl">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-3xl font-black text-slate-800">NYAWA HABIS!</h2>
            <p className="text-slate-600 font-bold mt-1">Jangan menyerah, ayo coba lagi!</p>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={handleRestart}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-lg py-3 rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Coba Lagi
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-lg py-3 rounded-2xl shadow-md"
            >
              Kembali
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
