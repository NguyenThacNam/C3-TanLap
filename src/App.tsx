import { useState } from 'react';
import Shell from './components/layout/Shell.tsx';
import HomeView from './views/HomeView.tsx';
import CalibrationView from './views/CalibrationView.tsx';
import TrainingView from './views/TrainingView.tsx';
import ResultsView from './views/ResultsView.tsx';

type ViewState = 'HOME' | 'CALIBRATION' | 'TRAINING' | 'RESULTS';

export interface QuizResults {
  score: number;
  userAnswers: Record<number, string>;
  playerName: string;
}

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [results, setResults] = useState<QuizResults | null>(null);
  const [playerName, setPlayerName] = useState('');

  const handleComplete = (score: number, userAnswers: Record<number, string>) => {
    setResults({ score, userAnswers, playerName });
    setView('RESULTS');
  };

  const renderView = () => {
    switch (view) {
      case 'HOME':
        return <HomeView 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
          onStart={() => setView('CALIBRATION')} 
        />;
      case 'CALIBRATION':
        return <CalibrationView onComplete={() => setView('TRAINING')} />;
      case 'TRAINING':
        return <TrainingView onComplete={handleComplete} />;
      case 'RESULTS':
        return <ResultsView results={results} onRestart={() => {
          setResults(null);
          setPlayerName('');
          setView('HOME');
        }} />;
      default:
        return <HomeView 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
          onStart={() => setView('CALIBRATION')} 
        />;
    }
  };

  return (
    <Shell activeView={view} onNavigate={(v) => setView(v as ViewState)}>
      {renderView()}
    </Shell>
  );
}
