import { motion } from 'motion/react';
import { Rocket, User, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onStart: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
}

export default function HomeView({ onStart, playerName, setPlayerName }: HomeViewProps) {
  const handleStart = () => {
    if (playerName.trim()) {
      onStart();
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh] relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface-container border border-primary/20 self-start">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Đồng bộ v2.4 Đang hoạt động</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tighter leading-tight font-display">
            LÀM CHỦ <br/>
            <span className="text-primary italic font-light">LOGIC</span> ĐỘNG LỰC.
          </h1>

          <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
            Tương tác sư phạm bằng cử chỉ tay. HAND-QUIZ biến việc học thành trải nghiệm kỹ thuật số xúc giác, nơi mỗi cử chỉ là một câu trả lời.
          </p>

          <div className="flex flex-col gap-6 max-w-sm">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text"
                placeholder="Nhập họ tên của bạn..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold placeholder:font-medium placeholder:text-on-surface-variant/40"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button 
                onClick={handleStart}
                disabled={!playerName.trim()}
                className="px-8 py-5 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
              >
                Bắt đầu ngay
                <Rocket className="w-5 h-5" />
              </button>
              <button className="px-8 py-5 bg-white border border-outline-variant shadow-sm text-on-surface font-bold rounded-2xl hover:bg-surface-container transition-all">
                THPT Tân Lập
              </button>
            </div>
          </div>

          <div className="flex items-center gap-12 mt-8 border-l-2 border-primary/20 pl-8">
            <div>
              <div className="text-3xl font-bold text-on-surface">0.02ms</div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant mt-1">Độ trễ phản hồi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface">99.8%</div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant mt-1">Độ chính xác</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[4/3] rounded-3xl border border-outline-variant/30 bg-white overflow-hidden shadow-2xl"
        >
          <img 
            className="w-full h-full object-cover opacity-90"
            alt="Futuristic hand tracking"
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="w-48 h-48 border-2 border-dashed border-primary rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
              <div className="w-32 h-32 border border-primary/30 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/30 shadow-lg">
               <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {playerName ? `Target: ${playerName}` : 'Đang chờ định danh...'}
               </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
