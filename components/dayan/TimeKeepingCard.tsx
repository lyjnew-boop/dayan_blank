
import React from 'react';
import { Clock, Hourglass } from 'lucide-react';
import { Theme } from '../../styles/theme';
import { TimeKeeping } from '../../types';
import { SectionHeader } from '../common/SectionHeader';

interface Props {
  timeKeeping: TimeKeeping;
}

export const TimeKeepingCard: React.FC<Props> = ({ timeKeeping }) => {
  return (
    <div className={Theme.dayan.card + " h-full"}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500 transform scale-150">
          <Clock size={20} />
        </div>
        <SectionHeader title="步轨漏术" subtitle="第五篇：轨漏与晷影" icon={<Clock size={20} />} />
        
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={Theme.dayan.valueBox}>
                <span className={Theme.typography.label + " block mb-1"}>日出</span>
                <span className={Theme.typography.monoLg}>{timeKeeping.sunrise}</span>
            </div>
            <div className={Theme.dayan.valueBox}>
                <span className={Theme.typography.label + " block mb-1"}>日落</span>
                <span className={Theme.typography.monoLg}>{timeKeeping.sunset}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-stone-950 p-3 rounded text-center border border-stone-800/50">
                <span className={Theme.typography.label + " block mb-1"}>昼漏刻</span>
                <span className="text-amber-200 font-bold text-base">{timeKeeping.dayFen} 分</span>
                <div className={Theme.typography.bodyXs + " mt-1"}>{timeKeeping.dayKe} 刻</div>
            </div>
            <div className="bg-stone-950 p-3 rounded text-center border border-stone-800/50">
                <span className={Theme.typography.label + " block mb-1"}>夜漏刻</span>
                <span className="text-stone-400 font-bold text-base">{timeKeeping.nightFen} 分</span>
                <div className={Theme.typography.bodyXs + " mt-1"}>{timeKeeping.nightKe} 刻</div>
            </div>
        </div>

        <div className={`flex flex-col gap-1 text-xs text-stone-500 ${Theme.dayan.bgTranslucent} p-3 rounded`}>
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-2 text-stone-400"><Hourglass size={12} /> 一更 (甲夜)</span>
               <span className={Theme.typography.monoSm}>{timeKeeping.oneGengFen} 分</span>
             </div>
        </div>
    </div>
  );
};
