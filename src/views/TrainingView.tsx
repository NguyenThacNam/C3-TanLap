import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Video, Fingerprint, XCircle, Activity, Maximize2, Minimize2, BrainCircuit, ArrowRight, RefreshCcw, Hourglass } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { questions } from '../data/questions.ts';
import { audio } from '../lib/audio.ts';

interface TrainingViewProps {
  onComplete: (score: number, userAnswers: Record<number, string>) => void;
}

export default function TrainingView({ onComplete }: TrainingViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [camStatus, setCamStatus] = useState<'loading' | 'active' | 'error'>('loading');
  const [isCooldown, setIsCooldown] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const holdTimerRef = useRef<any>(null);
  const isSubmittingRef = useRef(false);
  
  const feedbackRef = useRef(feedback);
  const cooldownRef = useRef(isCooldown);

  useEffect(() => {
    feedbackRef.current = feedback;
    cooldownRef.current = isCooldown;
  }, [feedback, isCooldown]);

  const currentQuestion = questions[currentIndex];

  const initCamera = async () => {
    setCamStatus('loading');
    const Hands = (window as any).Hands;
    const Camera = (window as any).Camera;
    const drawConnectors = (window as any).drawConnectors;
    const drawLandmarks = (window as any).drawLandmarks;
    const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

    if (!Hands || !Camera) {
      setCamStatus('error');
      return;
    }

    if (cameraRef.current) try { cameraRef.current.stop(); } catch(e) {}
    if (handsRef.current) try { handsRef.current.close(); } catch(e) {}

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results: any) => {
      setCamStatus('active');
      if (!canvasRef.current || !videoRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const W = canvasRef.current.width;
      const H = canvasRef.current.height;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, W, H);

      let detectedLabel: string | null = null;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        if (drawConnectors && HAND_CONNECTIONS) {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#576500', lineWidth: 4 });
        }
        if (drawLandmarks) {
          drawLandmarks(ctx, landmarks, { color: '#dfff00', lineWidth: 1, radius: 4 });
        }

        let fingersUp = 0;
        if (landmarks[8].y < landmarks[6].y) fingersUp++;   // Index
        if (landmarks[12].y < landmarks[10].y) fingersUp++; // Middle
        if (landmarks[16].y < landmarks[14].y) fingersUp++; // Ring
        if (landmarks[20].y < landmarks[18].y) fingersUp++; // Pinky

        if (fingersUp === 1) detectedLabel = 'A';
        else if (fingersUp === 2) detectedLabel = 'B';
        else if (fingersUp === 3) detectedLabel = 'C';
        else if (fingersUp === 4) detectedLabel = 'D';
      }
      ctx.restore();
      
      // Only update selection if not in feedback, not submitting, and NOT in cooldown
      if (!feedbackRef.current && !isSubmittingRef.current && !cooldownRef.current) {
        setSelectedLabel(prev => {
          if (prev !== detectedLabel) {
            setHoldProgress(0);
            if (detectedLabel) try { audio.playSelect(); } catch(e) {}
          }
          return detectedLabel;
        });
      } else if (cooldownRef.current) {
        // Force clear label during cooldown
        setSelectedLabel(null);
      }
    });

    handsRef.current = hands;

    if (videoRef.current) {
      try {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720
        });
        await camera.start();
        cameraRef.current = camera;
      } catch (e) {
        setCamStatus('error');
      }
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (cameraRef.current) try { cameraRef.current.stop(); } catch(e) {}
      if (handsRef.current) try { handsRef.current.close(); } catch(e) {}
    };
  }, []);

  useEffect(() => {
    if (!selectedLabel || feedback || isSubmittingRef.current || isCooldown) {
      setHoldProgress(0);
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      return;
    }

    holdTimerRef.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          if (holdTimerRef.current) clearInterval(holdTimerRef.current);
          handleSubmit();
          return 100;
        }
        return p + 4;
      });
    }, 50);

    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, [selectedLabel, feedback, currentIndex, isCooldown]);

  const handleSubmit = () => {
    if (!selectedLabel || feedback || isSubmittingRef.current || isCooldown) return;
    isSubmittingRef.current = true;
    const isCorrect = selectedLabel === currentQuestion.correctAnswer;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedLabel! }));
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      try { audio.playSuccess(); } catch(e) {}
    } else {
      setFeedback('wrong');
      try { audio.playError(); } catch(e) {}
    }
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setIsCooldown(true); // Start cooldown
      setCurrentIndex(i => i + 1);
      setSelectedLabel(null);
      setFeedback(null);
      setHoldProgress(0);
      setShowNextButton(false);
      isSubmittingRef.current = false;
      
      // Clear cooldown after 1.5s to let user change hand position
      setTimeout(() => {
        setIsCooldown(false);
      }, 1500);
    } else {
      try { audio.playComplete(); } catch(e) {}
      onComplete(score, userAnswers);
    }
  };

  if (!currentQuestion) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col transition-all duration-500",
        isFullScreen 
          ? "fixed inset-0 z-[100] bg-white p-4 md:p-6 h-screen overflow-hidden" 
          : "max-w-7xl mx-auto gap-6"
      )}
    >
      <div className={cn("w-full", isFullScreen ? "mb-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm" : "")}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
               <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">CSDL QUAN HỆ</p>
              <h2 className="text-sm font-bold text-on-surface">Câu {currentIndex + 1}/{questions.length}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-on-surface-variant uppercase">Điểm số</span>
               <span className="text-xl font-black text-primary font-display">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={initCamera} className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 text-primary transition-all">
                <RefreshCcw className={cn("w-5 h-5", camStatus === 'loading' && "animate-spin")} />
              </button>
              <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 bg-white hover:bg-primary/5 rounded-xl border border-outline-variant transition-all shadow-sm">
                {isFullScreen ? <Minimize2 className="w-5 h-5 text-on-surface" /> : <Maximize2 className="w-5 h-5 text-on-surface" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "grid grid-cols-1 gap-6 min-h-0 flex-1 mb-2",
        isFullScreen ? "lg:grid-cols-12" : "lg:grid-cols-2"
      )}>
        <div className={cn(
          "bg-white rounded-[2rem] p-8 flex flex-col border border-outline-variant/40 shadow-md relative overflow-hidden",
          isFullScreen ? "lg:col-span-8" : "p-10"
        )}>
          <div className="mb-6 relative z-10">
            <h1 className={cn(
              "font-black text-on-surface leading-tight tracking-tight font-display transition-all",
              isFullScreen ? "text-2xl md:text-3xl" : "text-2xl"
            )}>
              {currentQuestion.question}
            </h1>
          </div>

          <div className={cn(
            "grid gap-4 mt-auto relative z-10",
            isFullScreen ? "grid-cols-2" : "grid-cols-1"
          )}>
            {currentQuestion.options.map((opt) => (
              <QuizOption 
                key={opt.label}
                label={opt.label} 
                title={opt.text} 
                active={selectedLabel === opt.label}
                feedback={feedback}
                isCorrect={opt.label === currentQuestion.correctAnswer}
                onClick={() => !feedback && !isSubmittingRef.current && !isCooldown && setSelectedLabel(opt.label)}
                isFullScreen={isFullScreen}
              />
            ))}
          </div>

          <div className={cn("flex items-center justify-between border-t border-outline-variant/20 pt-6 mt-6 min-h-[60px]")}>
            {isCooldown ? (
              <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-widest animate-pulse">
                <Hourglass className="w-4 h-4" />
                Đang chuẩn bị câu hỏi mới...
              </div>
            ) : !showNextButton ? (
               <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Hệ thống đang quét cử chỉ...
               </div>
            ) : (
               <div className="flex items-center gap-4 w-full">
                  <div className={cn(
                    "px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex-1 text-center",
                    feedback === 'correct' ? "bg-primary text-white shadow-primary/20" : "bg-red-600 text-white shadow-red-600/20"
                  )}>
                     {feedback === 'correct' ? 'CHÍNH XÁC' : 'CHƯA ĐÚNG'}
                  </div>
                  <button onClick={handleNext} className="bg-on-surface text-white px-8 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
                    {currentIndex < questions.length - 1 ? 'CÂU TIẾP' : 'KẾT QUẢ'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            )}
          </div>
        </div>

        <div className={cn(
          "relative rounded-[2rem] overflow-hidden border border-outline-variant shadow-2xl bg-black group flex flex-col",
          isFullScreen ? "lg:col-span-4" : "min-h-[500px]"
        )}>
          <video ref={videoRef} className="hidden" playsInline autoPlay />
          <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full object-cover opacity-80 flex-1" />

          {camStatus !== 'active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
              {camStatus === 'loading' ? (
                <RefreshCcw className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <button onClick={initCamera} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Thử lại Cam</button>
              )}
            </div>
          )}

          <div className="absolute inset-0 bg-black/10 scanline pointer-events-none"></div>

          <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="hud-glass p-3 rounded-xl border-l-2 border-primary">
                <p className="text-[8px] text-primary font-black mb-0.5 uppercase">Vision System</p>
                <p className="text-[10px] font-bold text-white font-display uppercase tracking-widest">Neural Link</p>
              </div>
              {isCooldown && (
                <div className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  Cooldown
                </div>
              )}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
              <div className={cn(
                "relative border border-dashed border-white/20 rounded-full flex items-center justify-center transition-all",
                isFullScreen ? "h-48 w-48" : "h-56 w-56"
              )}>
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-0 border border-dashed border-primary/30 rounded-full" />
                <div className={cn(
                  "border-2 border-primary/20 rounded-full flex items-center justify-center relative bg-primary/5 backdrop-blur-[2px] transition-all",
                  isFullScreen ? "h-40 w-40" : "h-48 w-48"
                )}>
                   <AnimatePresence mode="wait">
                     {isCooldown ? (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                          <Hourglass className="w-8 h-8 text-primary animate-spin" />
                       </motion.div>
                     ) : selectedLabel ? (
                       <motion.div key={selectedLabel} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className={cn("font-black text-white font-display drop-shadow-[0_0_20px_rgba(223,255,0,0.5)]", isFullScreen ? "text-6xl" : "text-7xl")}>
                          {selectedLabel}
                       </motion.div>
                     ) : (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1 opacity-20">
                          <Fingerprint className="w-8 h-8 text-white" />
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-center">
              <AnimatePresence>
                {selectedLabel && !feedback && !isCooldown && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full hud-glass p-4 rounded-[1.2rem] border border-primary/40">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Fingerprint className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase font-mono text-white">Xác nhận phương án {selectedLabel}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary" style={{ width: `${holdProgress}%` }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface QuizOptionProps {
  label: string;
  title: string;
  active?: boolean;
  feedback: 'correct' | 'wrong' | null;
  isCorrect: boolean;
  onClick: () => void;
  isFullScreen?: boolean;
}

const QuizOption: React.FC<QuizOptionProps> = ({ label, title, active = false, feedback, isCorrect, onClick, isFullScreen }) => {
  let statusClasses = "bg-surface-container-low border-outline-variant hover:border-primary/50 cursor-pointer";
  if (feedback) {
    if (isCorrect) statusClasses = "bg-primary text-white border-primary shadow-md scale-[1.02]";
    else if (active) statusClasses = "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]";
    else statusClasses = "opacity-30 grayscale border-outline-variant/10";
  } else if (active) statusClasses = "bg-primary-container border-primary shadow-lg scale-[1.03] z-10";

  return (
    <div onClick={onClick} className={cn("group relative flex items-center gap-4 rounded-2xl text-left transition-all duration-300 border", isFullScreen ? "p-3.5 gap-4" : "p-4", statusClasses)}>
      <div className={cn("rounded-xl flex items-center justify-center font-black font-display transition-all", isFullScreen ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl", active || (feedback && isCorrect) ? "bg-white text-primary shadow-sm" : "bg-surface-container-highest text-on-surface-variant opacity-40")}>
        {label}
      </div>
      <div className="flex-1">
        <h3 className={cn("font-bold leading-tight transition-colors", isFullScreen ? "text-sm" : "text-base", (feedback && (isCorrect || active)) ? "text-white" : "text-on-surface")}>{title}</h3>
      </div>
      {(active || (feedback && isCorrect)) && (
        <div className={cn("rounded-full flex items-center justify-center shadow-sm transition-transform", isFullScreen ? "w-7 h-7" : "w-8 h-8", feedback === 'wrong' && active && !isCorrect ? "bg-white text-red-600" : "bg-white text-primary")}>
          {feedback === 'wrong' && active && !isCorrect ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </div>
      )}
    </div>
  );
}
