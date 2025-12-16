
import React from 'react';
import { Theme } from '../../styles/theme';
import { DayanDateInfo } from '../../types';

interface Props {
  info: DayanDateInfo;
}

export const DayanHeader: React.FC<Props> = ({ info }) => {
  return (
    <div className={`md:col-span-12 ${Theme.colors.bgDark} border-t-2 border-b-2 ${Theme.colors.borderHighlight} py-12 text-center relative`}>
      <div className={`absolute top-3 left-5 flex items-center gap-2 ${Theme.typography.subtext}`}>
        大衍历经 (公元729) <span className="w-1.5 h-1.5 bg-amber-700 rounded-full"></span> 唐 · 开元
      </div>
      <h1 className={Theme.typography.h1}>
        {info.lunarDateStr}
      </h1>
      <div className="flex justify-center items-center gap-6 text-amber-700/80 font-serif text-xl">
        <span>{info.ganZhiYear}年</span>
        <span>•</span>
        <span>{info.ganZhiMonth}月</span>
        <span>•</span>
        <span>{info.ganZhiDay}日</span>
        <span>•</span>
        <span>{info.ganZhiHour}时</span>
      </div>
      <div className="mt-5 text-stone-500 font-mono text-base uppercase">
        {info.gregorianDate.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};
