import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Zap, 
  Settings, 
  Activity, 
  Timer,
  UserCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShellProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function Shell({ children, activeView, onNavigate }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 px-6 md:px-16 py-4 flex justify-between items-center">
        <div 
          className="font-display text-2xl text-primary font-bold tracking-tighter uppercase cursor-pointer"
          onClick={() => onNavigate('HOME')}
        >
          HAND-QUIZ
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          <button 
            onClick={() => onNavigate('TRAINING')}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              activeView === 'TRAINING' ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
            )}
          >
            Luyện tập
          </button>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Bảng xếp hạng
          </button>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Lưu trữ
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono font-bold text-primary">00:00</span>
          </div>
          <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-container/80 transition-colors">
            Kết thúc phiên
          </button>
          <UserCircle className="w-6 h-6 text-on-surface-variant cursor-pointer hover:text-on-surface" />
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 z-40 bg-surface-container-low border-r border-outline-variant/30 hidden lg:flex flex-col p-6 pt-24 gap-8">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Cử chỉ</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Trạng thái: <span className="text-primary font-bold">Hoạt động</span>
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem 
              icon={<BrainCircuit className="w-5 h-5" />} 
              label="Nhận diện" 
              active={activeView === 'CALIBRATION' || activeView === 'TRAINING'} 
            />
          </nav>

          <button 
            onClick={() => onNavigate('CALIBRATION')}
            className="mt-auto bg-surface-container-highest text-primary border border-primary/20 py-3 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all"
          >
            Hiệu chỉnh
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 md:p-16">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
      active 
        ? "bg-primary-container text-on-primary-container font-bold" 
        : "text-on-surface-variant hover:bg-surface-variant/50"
    )}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
