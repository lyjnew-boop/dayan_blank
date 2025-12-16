
import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Theme } from '../../styles/theme';
import { DayanDateInfo } from '../../types';
import { HexagramSymbol } from '../HexagramSymbol';

interface Props {
  info: DayanDateInfo;
}

export const CivilCalendarEntry: React.FC<Props> = ({ info }) => {
  const { guaQi } = info.dailyGua;
  // Calculate progress percentage for the current line
  const yaoProgress = guaQi.totalFenInYao > 0 ? (guaQi.currentFenInYao / guaQi.totalFenInYao) * 100 : 0;

  return (
    <div className={`mt-8 border-t ${Theme.colors.borderHighlight} pt-6`}>
       <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-5 bg-amber-700"></div>
          <span className={Theme.typography.h4}>民用具注历 (卦气物候)</span>
       </div>
       
       <div className={`${Theme.dayan.bgPanel} border ${Theme.colors.border} grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-sm`}>
           
           {/* Left: Date Info */}
           <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center text-center bg-[#2a2624]">
               <span className={Theme.typography.serifLg}>{info.ganZhiDay}</span>
               <span className={Theme.typography.label + " mb-4"}>值日干支</span>
               <div className="w-full h-px bg-stone-800 mb-4"></div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-stone-300 font-bold text-base">{info.calculation.currentTermName}</span>
                  <span className="text-stone-500 text-sm">{info.calculation.currentHou}</span>
               </div>
               <div className="text-sm text-amber-700/80 italic font-serif">
                   “{info.pentad.name}”
               </div>
           </div>

           {/* Center: Hexagram Visual */}
           <div className={`md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center ${Theme.dayan.bgDark}/20 relative`}>
               {/* Background Character Watermark */}
               <span className="absolute text-9xl font-serif text-stone-800/20 select-none pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {info.dailyGua.symbol}
               </span>
               
               <HexagramSymbol 
                  binary={info.dailyGua.binary} 
                  size={100} 
                  color="#b45309"
                  activeLineIndex={guaQi.isYong ? undefined : guaQi.yaoIndex}
               />
               <div className="mt-4 text-center z-10">
                   <span className="text-2xl font-bold text-stone-200 block">{info.dailyGua.name}</span>
                   <span className={Theme.typography.label + " block mt-1"}>值日公卦</span>
               </div>
           </div>

           {/* Right: Interpretation */}
           <div className="md:col-span-6 p-6 flex flex-col justify-center relative">
               <div className="absolute top-0 right-0 p-4 text-amber-900/10">
                  <Activity size={80} />
               </div>
               
               {/* Header: Significance Badge */}
               <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                       <span className={Theme.dayan.badge}>
                          {guaQi.significance}
                       </span>
                       <span className="text-sm font-bold text-amber-600">{guaQi.yaoName}</span>
                   </div>
                   <span className={Theme.typography.monoXs}>
                       {(guaQi.currentFenInYao / 30.4).toFixed(1)}% 气运
                   </span>
               </div>

               {/* Interpretation Box */}
               <div className={Theme.dayan.interpretationBox}>
                   <span className="text-3xl font-serif text-amber-700/20 absolute -top-2 -left-1">“</span>
                   <p className={Theme.typography.body + " pl-2"}>
                      {guaQi.yaoText}
                   </p>
               </div>
               
               {/* Progress Bar */}
               <div className="space-y-1 relative z-10">
                   <div className="flex justify-between text-xs text-stone-600">
                      <span>本爻进程</span>
                      <span>{Math.round(guaQi.currentFenInYao)} / {guaQi.totalFenInYao} 分</span>
                   </div>
                   <div className={Theme.dayan.progressBarTrack}>
                      <div className={Theme.dayan.progressBarFill} style={{ width: `${Math.min(100, Math.floor(yaoProgress))}%` }}></div>
                   </div>
               </div>

               {/* Footer Link */}
               <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between relative z-10">
                   <div className={Theme.typography.bodyXs}>
                      本月辟卦: <span className="text-stone-300">{info.hexagram.name}</span>
                   </div>
                   <button className="text-xs text-stone-500 flex items-center gap-1 hover:text-amber-500 transition-colors">
                      查看卦解 <ChevronRight size={12} />
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};
