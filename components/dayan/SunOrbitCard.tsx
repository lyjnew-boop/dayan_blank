
import React from 'react';
import { Sun } from 'lucide-react';
import { Theme } from '../../styles/theme';
import { SunState } from '../../types';
import { SectionHeader } from '../common/SectionHeader';

interface Props {
  sunState: SunState;
}

export const SunOrbitCard: React.FC<Props> = ({ sunState }) => {
  return (
    <div className={Theme.dayan.card + " h-full"}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500 transform scale-150">
          <Sun size={20} />
        </div>
        <SectionHeader title="步日躔术" subtitle="第三篇：日躔与盈缩" icon={<Sun size={20} />} />
        <div className="flex flex-col gap-5 h-full">
            <div className="p-4 bg-stone-950/50 border border-stone-800 rounded flex items-center justify-between">
                <div>
                    <span className={Theme.typography.label + " block mb-1"}>盈缩分期</span>
                    <span className={`text-2xl font-bold ${sunState.stage.includes('盈') ? 'text-amber-200' : 'text-stone-400'}`}>
                    {sunState.stage}
                    </span>
                </div>
                <div className="text-right">
                     <span className={Theme.typography.caption + " block"}>
                        {sunState.stage.includes('盈') ? '近日点 (加速)' : '远日点 (减速)'}
                    </span>
                </div>
            </div>
            <div className="bg-[#1c1917] p-4 border-l-2 border-stone-700">
                <p className={Theme.typography.bodySm}>
                    {sunState.description}
                </p>
            </div>
        </div>
    </div>
  );
};
