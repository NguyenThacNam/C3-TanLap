import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Hand, Waves, Move, Info, Video, CheckCircle2, Fingerprint, Activity, XCircle, Maximize2, Minimize2, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface CalibrationViewProps {
  onComplete: () => void;
}

export default function CalibrationView({ onComplete }: CalibrationViewProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [camStatus, setCamStatus] = useState<'loading' | 'active' | 'error'>('loading');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

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

    // Cleanup old instances if any
    if (cameraRef.current) {
      try { cameraRef.current.stop(); } catch(e) {}
    }
    if (handsRef.current) {
      try { handsRef.current.close(); } catch(e) {}
    }

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

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        if (drawConnectors && HAND_CONNECTIONS) {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#576500', lineWidth: 4 });
        }
        if (drawLandmarks) {
          drawLandmarks(ctx, landmarks, { color: '#dfff00', lineWidth: 1, radius: 4 });
        }
      }
      ctx.restore();
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
        console.error("Camera init error:", e);
        setCamStatus('error');
      }
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (cameraRef.current) {
        try { cameraRef.current.stop(); } catch(e) {}
        cameraRef.current = null;
      }
      if (handsRef.current) {
        try { handsRef.current.close(); } catch(e) {}
        handsRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "transition-all duration-500 flex flex-col",
        isFullScreen ? "fixed inset-0 z-[100] bg-white p-4 md:p-6 h-screen overflow-hidden" : "max-w-7xl mx-auto"
      )}
    >
      <div className={cn("flex justify-between items-center", isFullScreen ? "mb-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm" : "mb-10")}>
        <div className="flex items-center gap-4">
           <div className={cn("bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", isFullScreen ? "w-10 h-10" : "w-12 h-12")}>
              <Activity className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">NEURAL SCAN</p>
              <h1 className={cn(
                "font-black text-on-surface leading-tight tracking-tight font-display uppercase transition-all",
                isFullScreen ? "text-xl md:text-2xl" : "text-4xl"
              )}>
                KÍCH HOẠT HỆ THỐNG
              </h1>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={initCamera}
             className="p-2.5 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 text-primary transition-all flex items-center gap-2"
             title="Thử lại Camera"
           >
              <RefreshCcw className={cn("w-5 h-5", camStatus === 'loading' && "animate-spin")} />
              <span className="text-[10px] font-bold uppercase hidden md:inline">Thử lại Cam</span>
           </button>
           <button 
             onClick={() => setIsFullScreen(!isFullScreen)}
             className="p-2.5 bg-white hover:bg-primary/5 rounded-xl border border-outline-variant shadow-sm transition-all"
           >
              {isFullScreen ? <Minimize2 className="w-5 h-5 text-on-surface" /> : <Maximize2 className="w-5 h-5 text-on-surface" />}
           </button>
        </div>
      </div>

      <div className={cn(
        "grid grid-cols-12 gap-6 min-h-0 flex-1",
        isFullScreen ? "" : ""
      )}>
        <div className={cn(
          "flex flex-col gap-6",
          isFullScreen ? "col-span-12 xl:col-span-8 h-full" : "col-span-12 xl:col-span-8"
        )}>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 bg-black flex-1">
            <video ref={videoRef} className="hidden" playsInline autoPlay />
            <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full object-cover opacity-80" />
            
            {camStatus !== 'active' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
                {camStatus === 'loading' ? (
                  <>
                    <RefreshCcw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-white font-bold animate-pulse">Đang kết nối Camera...</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-white font-bold mb-2">Không thể khởi động Camera</p>
                    <button onClick={initCamera} className="px-6 py-2 bg-primary text-white rounded-lg font-bold">Thử lại ngay</button>
                  </>
                )}
              </div>
            )}

            <div className="absolute inset-0 bg-black/10 scanline z-10 pointer-events-none"></div>
            
            <div className="absolute top-4 left-4 z-20">
              <div className="hud-glass px-3 py-1.5 rounded-full flex items-center gap-3 border border-primary/30">
                <div className={cn("w-2 h-2 rounded-full", camStatus === 'active' ? "bg-primary animate-pulse" : "bg-red-500")}></div>
                <span className="text-[9px] text-white font-bold uppercase tracking-widest">{camStatus === 'active' ? 'LIVE' : 'OFFLINE'}</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border border-dashed border-primary/20 rounded-full flex items-center justify-center relative">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0 border-t-2 border-primary/40 rounded-full" />
              </div>
            </div>
          </div>

          <div className={cn(
            "bg-white rounded-2xl flex items-center justify-between border border-outline-variant shadow-lg transition-all",
            isFullScreen ? "p-5" : "p-8"
          )}>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Cảm biến</span>
                <span className={cn("text-sm font-black font-display", camStatus === 'active' ? "text-primary" : "text-red-500")}>
                  {camStatus === 'active' ? '60 FPS // OK' : 'NO SIGNAL'}
                </span>
              </div>
              <div className="h-10 w-px bg-outline-variant/30"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Tracking</span>
                <span className="text-sm font-black text-on-surface font-display">{camStatus === 'active' ? 'STABLE' : 'WAITING'}</span>
              </div>
            </div>
            <button 
              onClick={onComplete}
              disabled={camStatus !== 'active'}
              className={cn(
                "px-10 py-4 rounded-xl font-black text-xs shadow-lg transition-all flex items-center gap-4",
                camStatus === 'active' ? "bg-primary text-white shadow-primary/20 hover:scale-[1.05]" : "bg-surface-container text-on-surface-variant/30 cursor-not-allowed"
              )}
            >
              VÀO LUYỆN TẬP
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={cn(
          "flex flex-col gap-4",
          isFullScreen ? "col-span-12 xl:col-span-4 h-full" : "col-span-12 xl:col-span-4"
        )}>
          <div className={cn(
            "bg-white rounded-2xl border border-outline-variant shadow-lg border-t-4 border-t-primary flex flex-col min-h-0",
            isFullScreen ? "p-6 flex-1" : "p-8"
          )}>
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Quy ước cử chỉ</h3>
            <div className={cn(
              "grid gap-3",
              isFullScreen ? "grid-cols-1" : "grid-cols-1"
            )}>
              <GestureCard num="1" label="Đáp án A" sub="1 ngón tay" icon={<Hand className="w-4 h-4" />} />
              <GestureCard num="2" label="Đáp án B" sub="2 ngón tay" icon={<Move className="w-4 h-4" />} />
              <GestureCard num="3" label="Đáp án C" sub="3 ngón tay" icon={<Waves className="w-4 h-4" />} />
              <GestureCard num="4" label="Đáp án D" sub="4 ngón tay" icon={<Hand className="w-4 h-4" />} />
            </div>
            
            <div className="mt-auto pt-6 border-t border-outline-variant/20">
               <div className="flex items-center gap-3 text-on-surface-variant/60">
                  <Info className="w-4 h-4" />
                  <p className="text-[10px] leading-relaxed font-medium">
                    Giữ cử chỉ 1.5s để hệ thống xác nhận lựa chọn.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface GestureCardProps {
  num: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}

const GestureCard: React.FC<GestureCardProps> = ({ num, label, sub, icon }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all group cursor-default">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-outline-variant shadow-sm text-on-surface group-hover:bg-primary group-hover:text-white transition-all duration-300 text-base font-black font-display">
        {num}
      </div>
      <div>
        <div className="text-sm font-black text-on-surface leading-none mb-1">{label}</div>
        <div className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">{sub}</div>
      </div>
      <div className="ml-auto text-on-surface-variant/30 group-hover:text-primary">
        {icon}
      </div>
    </div>
  );
}
