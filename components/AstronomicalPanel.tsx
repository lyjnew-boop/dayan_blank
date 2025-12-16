import React from 'react';
import { DayanDateInfo, PlanetStatus } from '../types';
import { Scroll, Eye, Info, AlertTriangle, Compass, Activity } from 'lucide-react';

interface Props {
  info: DayanDateInfo;
}

const ReportSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8 border-b-2 border-amber-900/30 pb-6 last:border-0">
    <h3 className="text-amber-600 font-serif font-bold uppercase tracking-widest text-base mb-4 flex items-center gap-3">
      <span className="w-2 h-2 bg-amber-600 rotate-45"></span>
      {title}
    </h3>
    <div className="pl-6">
      {children}
    </div>
  </div>
);

const DataField: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-stone-500 font-serif text-sm">{label}</span>
    <span className={`font-mono text-base ${highlight ? 'text-amber-500 font-bold' : 'text-stone-300'}`}>{value}</span>
  </div>
);

export const AstronomicalPanel: React.FC<Props> = ({ info }) => {
  const { astroReport } = info;

  return (
    <div className="max-w-4xl mx-auto p-1 bg-[#1c1917] border-2 border-amber-800/40 rounded-sm shadow-2xl">
      {/* Imperial Header */}
      <div className="bg-[#2c241b] p-8 text-center border-b-4 border-amber-900 relative overflow-hidden">
        <div className="absolute top-3 left-3 text-xs text-amber-900/40 border border-amber-900/40 p-1.5 font-serif writing-vertical-rl">
          太史监
        </div>
        <div className="text-amber-500/20 absolute -right-8 -top-8">
           <Scroll size={140} />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-amber-500 font-bold tracking-widest mb-2">
          天象预奏单
        </h2>
        <p className="text-stone-500 text-sm uppercase tracking-[0.2em] mb-5">
          皇室御用 · 开元盛世
        </p>
        <div className="inline-block bg-amber-900/20 px-6 py-1.5 rounded-full border border-amber-900/40 text-amber-600 text-sm font-mono">
           {info.lunarDateStr} • {info.ganZhiDay}
        </div>
      </div>

      <div className="p-8 md:p-12 bg-[#161412] text-stone-300 font-serif leading-relaxed">
        
        {/* Section 1: Basic Fix Points */}
        <ReportSection title="一、 基础定点 (入历)">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3">
              <DataField label="入历积日" value={`${info.calculation.daysSinceDongZhi} 日`} />
              <DataField label="日躔宿度" value={astroReport.solarPosition + " 宿"} />
              <DataField label="定朔推演" value={info.calculation.daysSinceShuo === 0 ? "今日" : `朔后 ${info.calculation.daysSinceShuo} 日`} />
              <DataField label="当前节气" value={info.solarTerm.name} />
           </div>
        </ReportSection>

        {/* Section 2: Nine Roads & Eclipse (Bu Jiao Hui) */}
        <ReportSection title="二、 步交会 (九道术)">
           <div className="flex items-start gap-5 mb-5 bg-stone-900/50 p-5 rounded border border-stone-800">
              <Compass className="text-amber-700 mt-1 shrink-0" size={24} />
              <div>
                 <div className="text-base font-bold text-amber-600 mb-1">月行九道</div>
                 <div className="text-stone-300 text-xl mb-2">{astroReport.nineRoads.currentRoad}</div>
                 <div className="text-sm text-stone-500 italic">{astroReport.nineRoads.description}</div>
              </div>
           </div>

           {astroReport.eclipse.willOccur ? (
             <div className="bg-red-900/10 border border-red-900/30 p-5 rounded">
                <div className="flex items-center gap-3 text-red-500 font-bold mb-4 text-base">
                   <AlertTriangle size={20} />
                   预警：天狗食日/月 ({astroReport.eclipse.type})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                   <DataField label="初亏 (起)" value={astroReport.eclipse.timeStart} />
                   <DataField label="食甚 (极)" value={astroReport.eclipse.maxEclipse} />
                   <DataField label="食分" value={astroReport.eclipse.magnitude} highlight />
                   <DataField label="可见概率" value={astroReport.eclipse.probability} />
                </div>
                <div className="mt-4 pt-4 border-t border-red-900/20">
                   <div className="text-xs text-red-400/60 uppercase mb-2">大衍修正术</div>
                   <div className="flex gap-6 text-xs text-stone-400 font-mono">
                      <span>气差: {astroReport.eclipse.corrections.qiCha}</span>
                      <span>刻差: {astroReport.eclipse.corrections.keCha}</span>
                      <span>南北差: {astroReport.eclipse.corrections.geoCha}</span>
                   </div>
                </div>
             </div>
           ) : (
             <div className="text-stone-500 text-base flex items-center gap-3">
                <Activity size={18} />
                入交度未达限（15度），日月安行，无食。
             </div>
           )}
        </ReportSection>

        {/* Section 3: Five Planets (Bu Wu Xing) */}
        <ReportSection title="三、 步五星 (五星行度)">
           <div className="space-y-4">
              {astroReport.planets.map((planet) => (
                 <div key={planet.nameEn} className="flex justify-between items-center p-3 hover:bg-stone-800/50 rounded transition-colors border-b border-stone-800/50 last:border-0">
                    <div>
                       <div className="flex items-center gap-3">
                          <span className="text-amber-600 font-bold text-base">{planet.nameCn}</span>
                          {/* <span className="text-stone-600 text-xs">({planet.nameEn})</span> */}
                       </div>
                       <div className="text-xs text-stone-500 mt-0.5">{planet.description}</div>
                    </div>
                    <div className="text-right">
                       <span className={`text-sm font-mono block mb-1 ${
                          planet.motion.includes('逆行') ? 'text-red-500 font-bold' : 
                          planet.motion.includes('留') ? 'text-amber-400' : 'text-stone-400'
                       }`}>
                          {planet.motion}
                       </span>
                       <span className="text-xs text-stone-600 bg-stone-900 px-2 py-0.5 rounded">
                          {planet.position}
                       </span>
                    </div>
                 </div>
              ))}
           </div>
        </ReportSection>

        {/* Section 4: Final Conclusion */}
        <div className="mt-10 border-t border-amber-900/50 pt-8">
           <h3 className="text-center text-amber-600 font-serif text-base font-bold uppercase mb-6">
              太史令 · 结奏
           </h3>
           <div className="bg-[#241f1b] p-8 border-l-4 border-amber-700 text-base leading-8 text-stone-300 font-serif italic">
              "据大衍历推步： 
              今 {info.ganZhiDay} 日，月行 {astroReport.nineRoads.currentRoad}。
              {astroReport.eclipse.willOccur 
                 ? `警示：测算有 ${astroReport.eclipse.type} 。请有司依礼备仪。` 
                 : "日月光华，无亏无蚀。"} 
              五星行度之中，{astroReport.planets.filter(p => p.motion.includes('逆行')).length > 0 
                 ? `需留意 ${astroReport.planets.filter(p => p.motion.includes('逆行')).map(p => p.nameCn.split(' ')[0]).join(' 与 ')} 呈逆行之象。` 
                 : "五星皆顺行安常。"}
              天道有序，皇猷允塞。"
           </div>
        </div>
        
      </div>
      
      {/* Footer Stamp */}
      <div className="bg-[#2c241b] p-6 text-center border-t border-amber-900/30">
          <span className="text-xs text-amber-900/60 uppercase tracking-widest font-mono">
             沙门一行 撰 • 唐 · 开元十七年 (公元729)
          </span>
      </div>
    </div>
  );
};