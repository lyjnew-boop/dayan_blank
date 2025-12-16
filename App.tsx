
import React, { useState, useMemo } from 'react';
import { getDayanInfo } from './services/lunarService';
import { DayanPanel } from './components/DayanPanel';
import { AstronomicalPanel } from './components/AstronomicalPanel';
import { MiniCalendar } from './components/MiniCalendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, BookOpen, Star } from 'lucide-react';
import { Theme } from './styles/theme';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'civil' | 'royal'>('civil');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
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
    if (e.target.value) {
      // datetime-local string format: YYYY-MM-DDTHH:mm:ss
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setCurrentDate(date);
      }
    }
  };

  const formatDateTimeValue = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className={Theme.layout.page}>
      
      {/* Top Navigation Bar */}
      <nav className={Theme.nav.container}>
        <div className={Theme.nav.inner}>
          <div className="flex items-center gap-4">
            <div className={Theme.nav.logoBox}>
              衍
            </div>
            <span className={Theme.nav.logoText}>
              大衍历 <span className="text-amber-600 text-lg align-middle">Dayan Li</span>
            </span>
          </div>

          {/* Date Controls */}
          <div className={Theme.nav.controlsContainer}>
            <button 
              onClick={handlePrevDay}
              className={Theme.nav.controlButton}
              aria-label="Previous Day"
            >
              <ChevronLeft size={24} />
            </button>
            
            {/* Calendar Toggle Button */}
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`${Theme.nav.controlButton} ${isCalendarOpen ? Theme.nav.activeControlButton : ''}`}
              title="打开日历视图"
            >
              <CalendarIcon size={20} />
            </button>

            {/* Native Date Input (Styled) */}
            <div className={Theme.nav.dateInputWrapper}>
              <input 
                type="datetime-local" 
                step="1"
                value={formatDateTimeValue(currentDate)}
                onChange={handleDateChange}
                className={Theme.nav.dateInput}
              />
            </div>

            <button 
              onClick={handleNextDay}
              className={Theme.nav.controlButton}
              aria-label="Next Day"
            >
              <ChevronRight size={24} />
            </button>

            {/* Popup Calendar */}
            {isCalendarOpen && (
              <div className={Theme.calendar.popupWrapper}>
                 <MiniCalendar 
                    selectedDate={currentDate} 
                    onSelectDate={setCurrentDate} 
                    onClose={() => setIsCalendarOpen(false)}
                 />
              </div>
            )}
          </div>

          <button 
            onClick={handleToday}
            className={Theme.nav.todayButton}
          >
            <RotateCcw size={16} />
            今日
          </button>
        </div>
      </nav>

      {/* Backdrop for Calendar */}
      {isCalendarOpen && (
         <div className={Theme.calendar.overlay} onClick={() => setIsCalendarOpen(false)}></div>
      )}

      {/* View Switcher Tabs */}
      <div className={Theme.nav.tabContainer}>
        <div className={Theme.nav.tabWrapper}>
           <button 
             onClick={() => setViewMode('civil')}
             className={`${Theme.nav.tabButton} ${
               viewMode === 'civil' 
                 ? Theme.nav.tabActive 
                 : Theme.nav.tabInactive
             }`}
           >
             <BookOpen size={20} />
             具注历 (民用)
           </button>
           <button 
             onClick={() => setViewMode('royal')}
             className={`${Theme.nav.tabButton} ${
               viewMode === 'royal' 
                 ? Theme.nav.tabActive 
                 : Theme.nav.tabInactive
             }`}
           >
             <Star size={20} />
             天象奏单 (御用)
           </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={Theme.layout.main}>
        <div className="py-8 px-4">
           {viewMode === 'civil' ? (
             <DayanPanel info={dayanInfo} />
           ) : (
             <AstronomicalPanel info={dayanInfo} />
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className={Theme.layout.footer}>
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
