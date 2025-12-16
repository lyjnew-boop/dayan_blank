
import React from 'react';
import { BaZiFull, PillarInfo } from '../types';
import { Theme } from '../styles/theme';

interface BaZiChartProps {
  bazi: BaZiFull;
}

const PillarColumn: React.FC<{ 
  title: string; 
  info: PillarInfo; 
  isDay?: boolean; 
}> = ({ title, info, isDay }) => {
  return (
    <div className={`${Theme.bazi.column} ${isDay ? Theme.bazi.columnDay : ''}`}>
      {/* Header */}
      <div className={Theme.bazi.header}>
        <span className={Theme.bazi.headerTitle}>{title}</span>
        <span className={Theme.bazi.headerValue}>{info.naYin}</span>
      </div>

      {/* Shi Shen (Stem) */}
      <div className={Theme.bazi.shiShenBox}>
         <span className="text-xs text-stone-500">{info.shiShenGan}</span>
      </div>

      {/* Stem (Gan) */}
      <div className={Theme.bazi.mainCharBox}>
        <span className={`${Theme.bazi.ganText} ${isDay ? Theme.bazi.ganTextDay : Theme.bazi.ganTextNormal}`}>
          {info.gan}
        </span>
        <span className={Theme.bazi.subText}>{info.wuXing[0]}</span>
      </div>

      {/* Branch (Zhi) */}
      <div className={Theme.bazi.mainCharBox}>
        <span className={Theme.bazi.zhiText}>
          {info.zhi}
        </span>
        <span className={Theme.bazi.subText}>{info.wuXing[1]}</span>
      </div>

      {/* Hidden Stems (Cang Gan) */}
      <div className={Theme.bazi.hiddenStemsBox}>
        <div className="flex flex-col gap-1">
          {info.cangGan.map((gan, idx) => (
            <div key={idx} className={Theme.bazi.hiddenStemRow}>
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
    <div className={Theme.bazi.container}>
      <div className={Theme.bazi.grid}>
        <PillarColumn title="年柱" info={bazi.year} />
        <PillarColumn title="月柱" info={bazi.month} />
        <PillarColumn title="日柱" info={bazi.day} isDay={true} />
        <PillarColumn title="时柱" info={bazi.hour} />
      </div>
      
      {/* Footer Info */}
      <div className={Theme.bazi.footer}>
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
