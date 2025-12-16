
import React from 'react';
import { Scroll, Calendar } from 'lucide-react';
import { Theme } from '../../styles/theme';
import { DayanDateInfo } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { DataRow } from '../common/DataRow';

interface Props {
  info: DayanDateInfo;
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const TaiShiJianLog: React.FC<Props> = ({ info }) => {
  return (
    <div className={`md:col-span-12 ${Theme.dayan.bgPanel} border ${Theme.colors.borderHighlight} p-8 rounded relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-600">
         <Calendar size={140} />
      </div>
      
      <SectionHeader title="太史监 · 具注历" icon={<Scroll size={20} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {/* Solar Track */}
         <div className={`${Theme.dayan.bgDark}/30 p-5 rounded border ${Theme.colors.border}/30`}>
            <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第一篇 步中朔 (日)</span>
            
            <div className="space-y-4">
               {/* Basic Calculations */}
               <div className="space-y-1">
                 <DataRow label="入历积日 (冬至起)" value={`第 ${info.calculation.daysSinceDongZhi} 日`} subValue={`${info.calculation.accumulatedYearFen} 分`} />
                 <DataRow label="七十二候" value={info.calculation.currentHou} subValue={info.pentad.name} />
               </div>

               {/* Detailed Solar Terms Timeline */}
               <div className="pt-3 border-t border-stone-800/50 flex flex-col gap-2">
                 <span className={Theme.typography.label}>节气交接时刻 (精确推演)</span>
                 
                 {/* Previous Term */}
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-stone-500 text-sm gap-1">
                    <span className="text-xs">上节: {info.prevSolarTerm.name}</span>
                    <span className="font-mono text-xs opacity-70">{formatDate(info.prevSolarTerm.date)}</span>
                 </div>
                 
                 {/* Current Term (Highlighted) */}
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-amber-900/10 p-2 rounded border border-amber-900/30">
                    <span className="text-sm font-bold text-amber-500">本节: {info.solarTerm.name}</span>
                    <span className="font-mono text-sm text-amber-100">{formatDate(info.solarTerm.date)}</span>
                 </div>

                 {/* Next Term */}
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-stone-400 text-sm gap-1">
                    <span className="text-xs">下节: {info.nextSolarTerm.name}</span>
                    <span className="font-mono text-xs opacity-70">{formatDate(info.nextSolarTerm.date)}</span>
                 </div>
               </div>
            </div>
         </div>

         {/* Lunar Track */}
         <div className={`${Theme.dayan.bgDark}/30 p-5 rounded border ${Theme.colors.border}/30`}>
            <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第二篇 步中朔 (月)</span>
            <div className="space-y-1">
               <DataRow label="入月积日 (朔日起)" value={`第 ${info.calculation.daysSinceShuo} 日`} subValue={`${info.calculation.accumulatedMonthFen} 分`} />
               <DataRow label="月相性质" value={info.calculation.isBigMonth ? "大月 (30)" : "小月 (29)"} subValue={info.calculation.leapInfo} />
               <DataRow label="今日月相" value={info.moonPhase} subValue={info.calculation.daysSinceShuo === 0 ? "朔" : info.calculation.daysSinceShuo === 15 ? "望" : "..."} />
            </div>
         </div>
      </div>
    </div>
  );
};
