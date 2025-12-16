
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Theme } from '../styles/theme';

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

  const handleTimeChange = (field: 'h' | 'm' | 's', value: string) => {
    let num = parseInt(value);
    if (isNaN(num)) num = 0;
    
    const d = new Date(selectedDate);
    if (field === 'h') d.setHours(Math.max(0, Math.min(23, num)));
    if (field === 'm') d.setMinutes(Math.max(0, Math.min(59, num)));
    if (field === 's') d.setSeconds(Math.max(0, Math.min(59, num)));
    onSelectDate(d);
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
      className={Theme.calendar.container}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={Theme.calendar.header}>
        <button 
            onClick={handlePrevMonth} 
            className={Theme.calendar.navButton}
            title="上个月"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className={Theme.calendar.titleContainer}>
           {/* Year Input */}
           <div className={Theme.calendar.inputGroup}>
             <input 
               type="number" 
               value={year}
               onChange={handleYearChange}
               className={Theme.calendar.yearInput}
             />
             <span className="ml-1 text-sm">年</span>
           </div>
           
           {/* Month Select */}
           <div className={Theme.calendar.inputGroup}>
             <select 
               value={month} 
               onChange={handleMonthChange}
               className={Theme.calendar.monthSelect}
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
            className={Theme.calendar.navButton}
            title="下个月"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className={Theme.calendar.gridHeader}>
        {weekDays.map(d => (
          <div key={d} className="text-xs text-stone-500 font-bold">{d}</div>
        ))}
      </div>
      <div className={Theme.calendar.grid}>
        {days.map((item, idx) => {
          const d = item.date;
          const isSelected = isSameDay(d, selectedDate);
          const isDayToday = isToday(d);
          const isCurrent = item.isCurrentMonth;

          let cellClass = Theme.calendar.dayCell;
          if (!isCurrent) cellClass += ` ${Theme.calendar.dayCellInactive}`;
          
          if (isSelected) {
             cellClass += ` ${Theme.calendar.dayCellSelected}`;
          } else if (isCurrent) {
             cellClass += ` ${Theme.calendar.dayCellHover}`;
          } else {
             cellClass += ' hover:bg-stone-900';
          }

          if (isDayToday && !isSelected) {
             cellClass += ` ${Theme.calendar.dayCellToday}`;
          }

          return (
            <button
              key={idx}
              onClick={() => {
                // Construct new date but keep current selected time
                const newDate = new Date(d);
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
                newDate.setSeconds(selectedDate.getSeconds());
                newDate.setMilliseconds(selectedDate.getMilliseconds());
                onSelectDate(newDate);
                // We do NOT close immediately to allow time adjustment
              }}
              className={cellClass}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      
      {/* Time Controls */}
      <div className="border-t border-stone-800 mt-3 pt-2 mb-1">
        <div className="flex justify-center items-center gap-1 text-stone-400 text-xs">
            <Clock size={12} className="mr-1" />
            <input 
                type="number" 
                min="0" max="23"
                value={selectedDate.getHours()} 
                onChange={e => handleTimeChange('h', e.target.value)} 
                className={Theme.calendar.timeInput} 
            />
            <span>:</span>
            <input 
                type="number" 
                min="0" max="59"
                value={selectedDate.getMinutes()} 
                onChange={e => handleTimeChange('m', e.target.value)} 
                className={Theme.calendar.timeInput} 
            />
            <span>:</span>
            <input 
                type="number" 
                min="0" max="59"
                value={selectedDate.getSeconds()} 
                onChange={e => handleTimeChange('s', e.target.value)} 
                className={Theme.calendar.timeInput} 
            />
        </div>
      </div>

      {/* Footer */}
      <div className={Theme.calendar.footer}>
         <button onClick={onClose} className={Theme.calendar.footerButton}>
            确定
         </button>
         <button onClick={handleTodayClick} className={Theme.calendar.footerAction}>
            回到今日
         </button>
      </div>
    </div>
  );
};
