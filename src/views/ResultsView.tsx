import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Star,
  Brain,
  User
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { questions } from '../data/questions.ts';
import { QuizResults } from '../App.tsx';

interface ResultsViewProps {
  results: QuizResults | null;
  onRestart: () => void;
}

export default function ResultsView({ results, onRestart }: ResultsViewProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const score = results?.score || 0;
  const totalQuestions = questions.length;
  const correctCount = score / 100;
  const isHighScorer = correctCount >= 8;
  const playerName = results?.playerName || 'Người chơi';

  useEffect(() => {
    if (isHighScorer) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isHighScorer]);

  if (!results) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20">
      {/* Celebration Layer */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: window.innerHeight + 100, 
                  x: (Math.random() - 0.5) * 400 + (Math.random() * window.innerWidth),
                  rotate: 360,
                  opacity: 0 
                }}
                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <Star className={cn(
                  "w-8 h-8", 
                  i % 3 === 0 ? "text-primary" : i % 3 === 1 ? "text-yellow-400" : "text-primary-container"
                )} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Hero Summary Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-[3rem] border border-outline-variant/30 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-8">
            {isHighScorer ? (
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20 shadow-xl shadow-primary/10">
                  <Trophy className="w-12 h-12 text-primary animate-bounce" />
               </div>
            ) : (
               <div className="w-24 h-24 bg-on-surface-variant/5 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-12 h-12 text-on-surface-variant" />
               </div>
            )}
            <div className="bg-surface-container px-6 py-2 rounded-full border border-outline-variant/50 flex items-center gap-3">
               <User className="w-4 h-4 text-primary" />
               <span className="text-sm font-black text-on-surface uppercase tracking-widest">{playerName}</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-on-surface mb-4 uppercase tracking-tighter font-display">
            {isHighScorer ? "XUẤT SẮC! CHÚC MỪNG" : "KẾT QUẢ CỦA BẠN"}
          </h1>
          <p className="text-on-surface-variant mb-12 text-lg max-w-2xl leading-relaxed">
            {isHighScorer 
              ? `Chúc mừng ${playerName}! Bạn đã chứng minh khả năng làm chủ kiến thức CSDL Quan hệ một cách tuyệt vời. Hệ thống đã ghi nhận điểm số ấn tượng của bạn.`
              : `Cảm ơn ${playerName} đã hoàn thành phiên học. Hãy xem lại các câu trả lời bên dưới để củng cố thêm kiến thức về Cơ sở dữ liệu quan hệ.`}
          </p>

          <div className="flex items-center gap-16 mb-12">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">Điểm số</span>
              <span className="text-7xl font-black text-primary font-display">{score}</span>
            </div>
            <div className="h-20 w-px bg-outline-variant/30"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">Độ chính xác</span>
              <span className="text-7xl font-black text-on-surface font-display">{correctCount}/{totalQuestions}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={onRestart}
              className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-sm flex items-center gap-4 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              THỬ LẠI PHIÊN MỚI
            </button>
            <button className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-[2rem] font-bold text-sm flex items-center gap-4 hover:bg-white hover:border-primary border border-transparent transition-all">
              <Share2 className="w-5 h-5" />
              CHIA SẺ KẾT QUẢ
            </button>
          </div>
        </div>
      </motion.section>

      {/* Detailed Breakdown */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-4 px-4">
           <div className="w-1.5 h-6 bg-primary rounded-full"></div>
           <h2 className="text-xl font-black text-on-surface uppercase tracking-wider font-display">Phân tích chi tiết từng câu</h2>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoice = results.userAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;
            const isExpanded = expandedId === q.id;

            return (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden",
                  isExpanded ? "border-primary shadow-xl" : "border-outline-variant/30 hover:border-primary/50 shadow-sm"
                )}
              >
                <div 
                  className="p-8 cursor-pointer flex items-center gap-6"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    isCorrect ? "bg-primary text-white" : "bg-red-600 text-white"
                  )}>
                    {isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Câu hỏi {idx + 1}</p>
                    <h3 className="text-lg font-bold text-on-surface leading-tight">{q.question}</h3>
                  </div>

                  <div className="text-on-surface-variant opacity-30">
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-outline-variant/10 bg-surface-container-lowest"
                    >
                      <div className="p-10 flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {q.options.map(opt => (
                              <div key={opt.label} className={cn(
                                "p-5 rounded-2xl border-2 flex items-center gap-4",
                                opt.label === q.correctAnswer 
                                  ? "bg-primary/5 border-primary text-on-surface" 
                                  : opt.label === userChoice 
                                    ? "bg-red-50 border-red-200 text-on-surface"
                                    : "bg-white border-outline-variant/20 text-on-surface-variant/60"
                              )}>
                                 <span className={cn(
                                   "w-8 h-8 rounded-lg flex items-center justify-center font-black",
                                   opt.label === q.correctAnswer ? "bg-primary text-white" : "bg-surface-container-highest"
                                 )}>{opt.label}</span>
                                 <span className="text-sm font-medium">{opt.text}</span>
                                 {opt.label === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                                 {opt.label === userChoice && opt.label !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
                              </div>
                           ))}
                        </div>

                        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                           <div className="flex items-center gap-3 mb-3 text-primary">
                              <Brain className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-widest">Tại sao đáp án này đúng?</span>
                           </div>
                           <p className="text-on-surface font-medium leading-relaxed">
                              {q.explanation}
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
