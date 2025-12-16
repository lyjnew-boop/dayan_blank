import React, { useState, useEffect, useMemo } from 'react';
import { getDayanInfo } from './services/lunarService';
import { DayanPanel } from './components/DayanPanel';
import { AstronomicalPanel } from './components/AstronomicalPanel';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, BookOpen, Star } from 'lucide-react';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'civil' | 'royal'>('civil');
  
  // Calculate info based on current date
  const dayanInfo = useMemo(() => getDayanInfo(currentDate), [currentDate]);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.valueAsDate) {
      // Need to adjust for timezone offset to prevent date jumping
      const date = new Date(e.target.valueAsDate.getUTCFullYear(), e.target.valueAsDate.getUTCMonth(), e.target.valueAsDate.getUTCDate());
      setCurrentDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-amber-900 selection:text-white flex flex-col">
      
      {/* Top Navigation Bar */}
      <nav className="border-b border-stone-800 bg-stone-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-700 text-stone-900 flex items-center justify-center font-bold rounded shadow-lg shadow-amber-900/20 text-lg">
              衍
            </div>
            <span className="font-serif text-2xl tracking-wider font-bold text-stone-200 hidden sm:block">
              大衍历 <span className="text-amber-600 text-lg align-middle">Dayan Li</span>
            </span>
          </div>

          <div className="flex items-center gap-3 bg-stone-800 p-1.5 rounded-lg border border-stone-700">
            <button 
              onClick={handlePrevDay}
              className="p-2 hover:bg-stone-700 rounded text-stone-400 hover:text-amber-400 transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-1 cursor-pointer">
                <CalendarIcon size={20} className="text-amber-600" />
                <span className="font-mono text-base">{currentDate.toISOString().split('T')[0]}</span>
              </div>
              <input 
                type="date" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleDateChange}
              />
            </div>

            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-stone-700 rounded text-stone-400 hover:text-amber-400 transition-colors"
              aria-label="Next Day"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <button 
            onClick={handleToday}
            className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-amber-500 transition-colors"
          >
            <RotateCcw size={16} />
            今日
          </button>
        </div>
      </nav>

      {/* View Switcher Tabs */}
      <div className="border-b border-stone-800 bg-stone-950">
        <div className="max-w-7xl mx-auto flex justify-center">
           <button 
             onClick={() => setViewMode('civil')}
             className={`px-8 py-4 flex items-center gap-3 text-base uppercase tracking-widest font-serif transition-all border-b-2 ${
               viewMode === 'civil' 
                 ? 'border-amber-600 text-amber-500 bg-stone-900' 
                 : 'border-transparent text-stone-500 hover:text-stone-300'
             }`}
           >
             <BookOpen size={20} />
             具注历 (民用)
           </button>
           <button 
             onClick={() => setViewMode('royal')}
             className={`px-8 py-4 flex items-center gap-3 text-base uppercase tracking-widest font-serif transition-all border-b-2 ${
               viewMode === 'royal' 
                 ? 'border-amber-600 text-amber-500 bg-stone-900' 
                 : 'border-transparent text-stone-500 hover:text-stone-300'
             }`}
           >
             <Star size={20} />
             天象奏单 (御用)
           </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="py-8 px-4">
           {viewMode === 'civil' ? (
             <DayanPanel info={dayanInfo} />
           ) : (
             <AstronomicalPanel info={dayanInfo} />
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-10 text-center text-stone-600 text-sm">
        <p className="font-serif italic opacity-60 text-base">
          基于唐代僧一行《大衍历》算法复原 (公元729年)
        </p>
        <p className="mt-3 text-xs font-mono">
          Powered by React 18 & Lunar-TypeScript
        </p>
      </footer>
    </div>
  );
};

export default App;