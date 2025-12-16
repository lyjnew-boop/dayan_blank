
import React from 'react';
import { DayanDateInfo } from '../types';
import { Scroll, AlertTriangle, Compass } from 'lucide-react';
import { Theme } from '../styles/theme';

interface Props {
  info: DayanDateInfo;
}

const ReportSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className={Theme.astro.section}>
    <h3 className={Theme.astro.sectionTitle}>
      <span className="w-2 h-2 bg-amber-600 rotate-45"></span>
      {title}
    </h3>
    <div className="pl-6">
      {children}
    </div>
  </div>
);

const DataField: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={Theme.astro.dataField}>
    <span className={Theme.astro.dataLabel}>{label}</span>
    <span className={`${Theme.astro.dataValue} ${highlight ? Theme.astro.highlightValue : Theme.astro.normalValue}`}>{value}</span>
  </div>
);

export const AstronomicalPanel: React.FC<Props> = ({ info }) => {
  const { astroReport } = info;

  return (
    <div className={Theme.astro.container}>
      {/* Imperial Header */}
      <div className={Theme.astro.header}>
        <div className={Theme.astro.headerStamp}>
          太史监
        </div>
        <div className={Theme.astro.headerIcon}>
           <Scroll size={140} />
        </div>
        <h2 className={Theme.astro.headerTitle}>
          天象预奏单
        </h2>
        <p className={Theme.astro.headerSubtitle}>
          皇室御用 · 开元盛世
        </p>
        <div className={Theme.astro.headerDate}>
           {info.lunarDateStr} • {info.ganZhiDay}
        </div>
      </div>

      <div className={Theme.astro.content}>
        
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
           <div className={Theme.astro.infoBox}>
              <Compass className="text-amber-700 mt-1 shrink-0" size={24} />
              <div>
                 <div className="text-base font-bold text-amber-600 mb-1">月行九道</div>
                 <div className="text-stone-300 text-xl mb-2">{astroReport.nineRoads.currentRoad}</div>
                 <div className="text-sm text-stone-500 italic">{astroReport.nineRoads.description}</div>
              </div>
           </div>

           {astroReport.eclipse.willOccur ? (
             <div className={Theme.astro.alertBox}>
                <div className={Theme.astro.alertTitle}>
                   <AlertTriangle size={20} />
                   预警：天狗食日/月 ({astroReport.eclipse.type})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                   <DataField label="初亏 (起)" value={astroReport.eclipse.timeStart} />
                   <DataField label="食甚 (极)" value={astroReport.eclipse.maxEclipse} />
                   <DataField label="食分" value={astroReport.eclipse.magnitude} highlight />
                   <DataField label="可见概率" value={astroReport.eclipse.probability} />
                </div>
                <div className={Theme.astro.alertFooter}>
                   <div className="text-xs text-stone-500">
                      修正参数：气差 {astroReport.eclipse.corrections.qiCha} | 刻差 {astroReport.eclipse.corrections.keCha}
                   </div>
                </div>
             </div>
           ) : (
             <div className="text-stone-600 text-sm italic pl-2 border-l-2 border-stone-800">
               本候内无日食或月食预警。
             </div>
           )}
        </ReportSection>

        {/* Section 3: Five Planets (Bu Wu Xing) */}
        <ReportSection title="三、 步五星 (五纬)">
           <div className="space-y-1">
             {astroReport.planets.map((planet, idx) => (
                <div key={idx} className={Theme.astro.planetRow}>
                   <div className="flex items-center gap-3 w-32">
                      <span className="text-amber-600 font-bold">{planet.nameCn}</span>
                   </div>
                   <div className="flex-1 font-mono text-sm text-stone-400">
                      {planet.position}
                   </div>
                   <div className="text-right">
                       <span className={`text-xs px-2 py-0.5 rounded ${
                         planet.motion === '逆行' ? 'bg-red-900/30 text-red-500' : 
                         planet.motion === '留' ? 'bg-amber-900/30 text-amber-500' : 
                         'bg-green-900/30 text-green-500'
                       }`}>
                         {planet.motion}
                       </span>
                   </div>
                </div>
             ))}
           </div>
        </ReportSection>

        {/* Section 4: Conclusion */}
        <div className="mt-8 mb-6">
           <div className={Theme.astro.conclusionBox}>
              “观象授时，乃圣王之务。今日五星运行大致安常，{info.calculation.currentTermName}之气正盛。
              {astroReport.eclipse.willOccur ? "然需警惕交会之变，宜修德省身。" : "阴阳调和，宜行正事。"}”
           </div>
        </div>

      </div>

      <div className={Theme.astro.footer}>
         <span className="text-amber-900/50 text-xs font-mono tracking-[0.3em]">
            DAYAN EPHEMERIS SYSTEM 729AD
         </span>
      </div>
    </div>
  );
};
