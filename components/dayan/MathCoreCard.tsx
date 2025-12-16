
import React from 'react';
import { Calculator, Divide } from 'lucide-react';
import { Theme } from '../../styles/theme';
import { DayanMath } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { MathDisplay } from '../common/MathDisplay';

interface Props {
  math: DayanMath;
}

export const MathCoreCard: React.FC<Props> = ({ math }) => {
  return (
    <div className={`md:col-span-12 ${Theme.dayan.bgDarker}/60 border ${Theme.colors.border} p-8 rounded relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500">
         <Calculator size={140} />
      </div>
      <SectionHeader title="大衍核心 · 通法" icon={<Divide size={20} />} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         <div className="space-y-4">
            <span className={Theme.typography.label + " block mb-1"}>通法 (Common Denominator)</span>
            <div className={Theme.typography.heroNumber}>3040</div>
            <div className={Theme.typography.monoSm + " text-amber-600/80 mt-1"}>
               = {math.derivation}
            </div>
            <div className={`${Theme.dayan.bgDark}/80 p-3 mt-3 border border-stone-800/50 rounded`}>
              <span className={Theme.typography.label + " block mb-1"}>基础法则:</span>
              <span className={Theme.typography.monoBase}>一日 = 3040 分</span>
            </div>
         </div>
         
         <div className={`col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 ${Theme.dayan.bgDark}/50 p-6 rounded border border-stone-800/50`}>
            <MathDisplay 
              label="步朔术 (朔实)" 
              dividend={math.shuoShi}
              divisor={math.tongFa}
              fraction={math.synodicMonthFraction}
              approx="29.530592 日"
            />
            <MathDisplay 
              label="步气术 (策实)" 
              dividend={math.ceShi}
              divisor={math.tongFa}
              fraction={math.tropicalYearFraction}
              approx="365.2444 日"
            />
            <MathDisplay 
              label="步发敛 (一卦六日七分)" 
              dividend={math.guaDuration} 
              divisor={math.tongFa}
              fraction="6 + 253/3040"
              approx="6.0832 日"
            />
            <MathDisplay 
              label="步发敛 (一爻一日四十二分)" 
              dividend={math.yaoDuration} 
              divisor={math.tongFa}
              fraction="1 + 42/3040"
              approx="1.0138 日"
            />
         </div>
      </div>
    </div>
  );
};
