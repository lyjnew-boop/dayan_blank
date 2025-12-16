import React from 'react';
import { BaZiFull, PillarInfo } from '../types';

interface BaZiChartProps {
  bazi: BaZiFull;
}

const PillarColumn: React.FC<{ 
  title: string; 
  info: PillarInfo; 
  isDay?: boolean; 
}> = ({ title, info, isDay }) => {
  return (
    <div className={`flex flex-col border-r border-stone-800 last:border-0 ${isDay ? 'bg-stone-800/20' : ''}`}>
      {/* Header */}
      <div className="p-3 text-center border-b border-stone-800 bg-stone-900/40">
        <span className="text-xs text-stone-500 uppercase tracking-widest block mb-1">{title}</span>
        <span className="text-sm font-bold text-amber-700">{info.naYin}</span>
      </div>

      {/* Shi Shen (Stem) */}
      <div className="p-2 text-center h-10 flex items-center justify-center border-b border-stone-800/50">
         <span className="text-xs text-stone-500">{info.shiShenGan}</span>
      </div>

      {/* Stem (Gan) */}
      <div className="p-4 text-center border-b border-stone-800">
        <span className={`text-2xl font-serif font-bold ${isDay ? 'text-amber-500' : 'text-stone-300'}`}>
          {info.gan}
        </span>
        <span className="text-[10px] block mt-1 text-stone-600 font-mono">{info.wuXing[0]}</span>
      </div>

      {/* Branch (Zhi) */}
      <div className="p-4 text-center border-b border-stone-800">
        <span className="text-2xl font-serif font-bold text-stone-300">
          {info.zhi}
        </span>
        <span className="text-[10px] block mt-1 text-stone-600 font-mono">{info.wuXing[1]}</span>
      </div>

      {/* Hidden Stems (Cang Gan) */}
      <div className="flex-1 p-3 text-center border-b border-stone-800/50 bg-stone-900/20">
        <div className="flex flex-col gap-1">
          {info.cangGan.map((gan, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
               <span className="text-stone-400 font-bold">{gan}</span>
               <span className="text-stone-600 scale-90">{info.shiShenZhi[idx]}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Void (Xun Kong) */}
      <div className="p-2 text-center text-xs text-stone-500">
        {info.xunKong} (空)
      </div>
    </div>
  );
};

export const BaZiChart: React.FC<BaZiChartProps> = ({ bazi }) => {
  return (
    <div className="border border-stone-800 rounded bg-[#1c1917] overflow-hidden shadow-lg">
      <div className="grid grid-cols-4">
        <PillarColumn title="年柱" info={bazi.year} />
        <PillarColumn title="月柱" info={bazi.month} />
        <PillarColumn title="日柱" info={bazi.day} isDay={true} />
        <PillarColumn title="时柱" info={bazi.hour} />
      </div>
      
      {/* Footer Info */}
      <div className="bg-stone-900/50 p-4 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
         <div className="flex gap-4">
            <span>胎元: <b className="text-stone-300">{bazi.taiYuan}</b></span>
            <span>命宫: <b className="text-stone-300">{bazi.mingGong}</b></span>
         </div>
         <div className="font-mono">
            {bazi.wuXingCount}
         </div>
      </div>
    </div>
  );
};