import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onSelectDate, onClose }) => {
  // View state (which month we are looking at)
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  // Sync view if selectedDate changes externally
  useEffect(() => {
    setViewDate(new Date(selectedDate));
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val < 9999) {
      setViewDate(new Date(val, month, 1));
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setViewDate(new Date(year, val, 1));
  };

  const handleTodayClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const today = new Date();
      onSelectDate(today);
      onClose();
  };

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate grid
  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  
  // Padding for prev month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const d = new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + 1 + i);
    days.push({ date: d, isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }

  // Padding for next month to fill 6 rows (42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
     days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  // Weekday headers (CN)
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  return (
    <div 
      className="bg-[#1c1917] border border-amber-900/60 rounded-md shadow-2xl p-4 w-72 font-serif text-stone-200 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-800 gap-1">
        <button 
            onClick={handlePrevMonth} 
            className="p-1 hover:text-amber-500 hover:bg-stone-800 rounded transition-colors shrink-0"
            title="上个月"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center justify-center gap-2 font-bold text-base tracking-widest text-amber-500 flex-1">
           {/* Year Input */}
           <div className="flex items-center group">
             <input 
               type="number" 
               value={year}
               onChange={handleYearChange}
               className="w-14 bg-transparent text-right border-b border-transparent group-hover:border-stone-700 focus:border-amber-500 outline-none appearance-none m-0 p-0 hover:text-amber-400 focus:text-amber-400 transition-colors"
             />
             <span className="ml-1 text-sm">年</span>
           </div>
           
           {/* Month Select */}
           <div className="flex items-center group">
             <select 
               value={month} 
               onChange={handleMonthChange}
               className="bg-[#1c1917] text-right border-b border-transparent group-hover:border-stone-700 focus:border-amber-500 outline-none appearance-none cursor-pointer pr-1 hover:text-amber-400 focus:text-amber-400 transition-colors"
             >
               {Array.from({length: 12}, (_, i) => (
                 <option key={i} value={i}>{i + 1}</option>
               ))}
             </select>
             <span className="ml-1 text-sm">月</span>
           </div>
        </div>

        <button 
            onClick={handleNextMonth} 
            className="p-1 hover:text-amber-500 hover:bg-stone-800 rounded transition-colors shrink-0"
            title="下个月"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-xs text-stone-500 font-bold">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, idx) => {
          const d = item.date;
          const isSelected = isSameDay(d, selectedDate);
          const isDayToday = isToday(d);
          const isCurrent = item.isCurrentMonth;

          return (
            <button
              key={idx}
              onClick={() => {
                onSelectDate(d);
                onClose();
              }}
              className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
                ${!isCurrent ? 'opacity-30 text-stone-500' : ''}
                ${isSelected 
                  ? 'bg-amber-700 text-white font-bold shadow-lg shadow-amber-900/50 scale-110 z-10' 
                  : isCurrent ? 'hover:bg-stone-800 hover:text-amber-400' : 'hover:bg-stone-900'
                }
                ${isDayToday && !isSelected ? 'border border-amber-700/50 text-amber-500' : ''}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
         <button onClick={onClose} className="text-stone-500 hover:text-stone-300 px-2 py-1">
            关闭
         </button>
         <button onClick={handleTodayClick} className="text-amber-600 hover:text-amber-400 font-bold px-2 py-1">
            回到今日
         </button>
      </div>
    </div>
  );
};