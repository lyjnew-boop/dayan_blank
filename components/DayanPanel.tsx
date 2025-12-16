
import React from 'react';
import { DayanDateInfo } from '../types';
import { HexagramSymbol } from './HexagramSymbol';
import { BaZiChart } from './BaZiChart';
import { Sun, Clock, Divide, MapPin, Calculator, Scroll, Hourglass, Calendar, Activity, Database, ChevronRight } from 'lucide-react';

// --- STYLING THEME & UI COMPONENTS ---
// Unified control for colors and common structures

const Theme = {
  colors: {
    primary: "text-amber-600",
    highlight: "text-amber-500",
    secondary: "text-stone-500",
    textMain: "text-stone-300",
    bgCard: "bg-[#1a1816]",
    border: "border-amber-900/20",
  },
  layout: {
    card: "bg-[#1a1816] border border-amber-900/20 p-6 rounded-sm relative overflow-hidden group hover:border-amber-900/40 transition-colors",
    header: "flex items-center gap-3 mb-5 border-b border-amber-900/20 pb-3",
  }
};

const Card: React.FC<{ children: React.ReactNode, className?: string, icon?: React.ReactNode }> = ({ children, className = "", icon }) => (
  <div className={`${Theme.layout.card} ${className}`}>
    {icon && (
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500 transform scale-150">
        {icon}
      </div>
    )}
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string, subtitle?: string, icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className={Theme.layout.header}>
    <span className={`${Theme.colors.primary} scale-110`}>{icon}</span>
    <div>
      <h3 className={`${Theme.colors.highlight} text-base font-bold uppercase tracking-widest`}>{title}</h3>
      {subtitle && <p className="text-xs text-stone-500 font-serif italic mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const DataRow: React.FC<{ label: string, value: React.ReactNode, subValue?: string }> = ({ label, value, subValue }) => (
  <div className="flex justify-between items-center py-2 border-b border-stone-800/50 last:border-0">
    <span className="text-sm text-stone-500 font-serif">{label}</span>
    <div className="flex flex-col items-end">
       <div className="text-sm font-mono text-amber-600">{value}</div>
       {subValue && <span className="text-xs font-mono text-stone-400">{subValue}</span>}
    </div>
  </div>
);

const MathDisplay: React.FC<{ label: string, dividend: number, divisor: number, fraction: string, approx: string }> = ({ label, dividend, divisor, fraction, approx }) => (
  <div className="flex flex-col border-l-2 border-amber-900/30 pl-4">
    <span className="text-xs text-stone-500 uppercase tracking-wide">{label}</span>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-sm font-mono text-stone-400">{dividend} ÷ {divisor} =</span>
      <span className="text-xl font-mono text-amber-100/90">{fraction}</span>
    </div>
    <span className="text-xs text-stone-600 font-serif italic mt-1">≈ {approx}</span>
  </div>
);

// --- MAIN COMPONENT ---

interface Props {
  info: DayanDateInfo;
}

export const DayanPanel: React.FC<Props> = ({ info }) => {
  const { guaQi } = info.dailyGua;
  const yaoProgress = guaQi.totalFenInYao > 0 ? (guaQi.currentFenInYao / guaQi.totalFenInYao) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="md:col-span-12 bg-stone-900 border-t-2 border-b-2 border-amber-900/30 py-12 text-center relative">
         <div className="absolute top-3 left-5 text-xs text-stone-600 font-mono tracking-widest flex items-center gap-2">
            大衍历经 (公元729) <span className="w-1.5 h-1.5 bg-amber-700 rounded-full"></span> 唐 · 开元
         </div>
         <h1 className="text-6xl md:text-7xl font-serif font-bold text-stone-100 mb-3 tracking-tight">
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

      {/* NEW: BA ZI CHART (Four Pillars) */}
      <div className="md:col-span-12">
        <Card icon={<Database size={20} />} className="h-full">
          <SectionHeader title="四柱八字" subtitle="命理基础 · 造化元钥" icon={<Database size={20} />} />
          <BaZiChart bazi={info.baZi} />
        </Card>
      </div>

      {/* TAI SHI JIAN LOGBOOK (Core Feature) */}
      <div className="md:col-span-12 bg-[#1a1816] border border-amber-900/20 p-8 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-600">
           <Calendar size={140} />
        </div>
        
        <SectionHeader title="太史监 · 具注历" icon={<Scroll size={20} />} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Solar Track Simulation */}
           <div className="bg-stone-900/30 p-5 rounded border border-stone-800/30">
              <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第一篇 步中朔 (日)</span>
              <div className="space-y-1">
                 <DataRow label="入历积日 (冬至起)" value={`第 ${info.calculation.daysSinceDongZhi} 日`} subValue={`${info.calculation.accumulatedYearFen} 分`} />
                 <DataRow label="当前节气" value={info.calculation.currentTermName} subValue="值令" />
                 <DataRow label="七十二候" value={info.calculation.currentHou} subValue={info.pentad.name} />
              </div>
           </div>

           {/* Lunar Track Simulation */}
           <div className="bg-stone-900/30 p-5 rounded border border-stone-800/30">
              <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第二篇 步中朔 (月)</span>
              <div className="space-y-1">
                 <DataRow label="入月积日 (朔日起)" value={`第 ${info.calculation.daysSinceShuo} 日`} subValue={`${info.calculation.accumulatedMonthFen} 分`} />
                 <DataRow label="月相性质" value={info.calculation.isBigMonth ? "大月 (30)" : "小月 (29)"} subValue={info.calculation.leapInfo} />
                 <DataRow label="今日月相" value={info.moonPhase} subValue={info.calculation.daysSinceShuo === 0 ? "朔" : info.calculation.daysSinceShuo === 15 ? "望" : "..."} />
              </div>
           </div>
        </div>
        
        {/* Civil Calendar Entry (Ju Zhu Li) - REDESIGNED */}
        <div className="mt-8 border-t border-amber-900/20 pt-6">
           <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-amber-700"></div>
              <span className="text-stone-300 font-serif font-bold text-lg">民用具注历 (卦气物候)</span>
           </div>
           
           <div className="bg-[#24211f] border border-stone-800 grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-sm">
               
               {/* Column 1: Date & Term */}
               <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center text-center bg-[#2a2624]">
                   <span className="text-5xl font-serif text-amber-500 font-bold mb-2">{info.ganZhiDay}</span>
                   <span className="text-xs text-stone-500 uppercase tracking-widest mb-4">值日干支</span>
                   
                   <div className="w-full h-px bg-stone-800 mb-4"></div>
                   
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-stone-300 font-bold text-base">{info.calculation.currentTermName}</span>
                      <span className="text-stone-500 text-sm">{info.calculation.currentHou}</span>
                   </div>
                   <div className="text-sm text-amber-700/80 italic font-serif">
                       “{info.pentad.name}”
                   </div>
               </div>

               {/* Column 2: Hexagram Visual */}
               <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center bg-stone-900/20">
                   <HexagramSymbol 
                      binary={info.dailyGua.symbol || "000000"} 
                      size={100} 
                      color="#b45309"
                      activeLineIndex={guaQi.isYong ? undefined : guaQi.yaoIndex}
                   />
                   <div className="mt-4 text-center">
                       <span className="text-2xl font-bold text-stone-200 block">{info.dailyGua.name}</span>
                       <span className="text-xs text-stone-500 uppercase tracking-widest block mt-1">值日公卦</span>
                   </div>
               </div>

               {/* Column 3: Interpretation & Line Text */}
               <div className="md:col-span-6 p-6 flex flex-col justify-center relative">
                   <div className="absolute top-0 right-0 p-4 text-amber-900/10">
                      <Activity size={80} />
                   </div>
                   
                   {/* Line Progress Header */}
                   <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-amber-900/30 text-amber-500 text-xs rounded font-bold uppercase tracking-wider border border-amber-900/30">
                              {guaQi.significance}
                           </span>
                           <span className="text-sm font-bold text-amber-600">{guaQi.yaoName}</span>
                       </div>
                       <span className="text-xs text-stone-600 font-mono">
                           {(guaQi.currentFenInYao / 30.4).toFixed(1)}% 气运
                       </span>
                   </div>

                   {/* Line Text Box */}
                   <div className="bg-[#1c1917] p-4 border-l-2 border-amber-600 mb-4 shadow-inner">
                       <p className="text-stone-300 font-serif text-lg leading-relaxed">
                          {guaQi.yaoText}
                       </p>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="space-y-1">
                       <div className="flex justify-between text-xs text-stone-600">
                          <span>本爻进程</span>
                          <span>{Math.round(guaQi.currentFenInYao)} / {guaQi.totalFenInYao} 分</span>
                       </div>
                       <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-700 transition-all duration-500" style={{ width: `${Math.min(100, Math.floor(yaoProgress))}%` }}></div>
                       </div>
                   </div>

                   <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
                       <div className="text-xs text-stone-500">
                          本月辟卦: <span className="text-stone-300">{info.hexagram.name}</span>
                       </div>
                       <div className="text-xs text-stone-500 flex items-center gap-1">
                          查看卦解 <ChevronRight size={12} />
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </div>

      {/* CHAPTER 3: Bu Ri Chan (Sun) */}
      <div className="md:col-span-6">
        <Card icon={<Sun size={20} />} className="h-full">
            <SectionHeader title="步日躔术" subtitle="第三篇：日躔与盈缩" icon={<Sun size={20} />} />
            <div className="flex flex-col gap-5 h-full">
                <div className="p-4 bg-stone-950/50 border border-stone-800 rounded flex items-center justify-between">
                    <div>
                        <span className="text-xs text-stone-500 block mb-1">盈缩分期</span>
                        <span className={`text-2xl font-bold ${info.sunState.stage.includes('盈') ? 'text-amber-200' : 'text-stone-400'}`}>
                        {info.sunState.stage}
                        </span>
                    </div>
                    <div className="text-right">
                         <span className="text-xs text-stone-600 italic block">
                            {info.sunState.stage.includes('盈') ? '近日点 (加速)' : '远日点 (减速)'}
                        </span>
                    </div>
                </div>
                <div className="bg-[#1c1917] p-4 border-l-2 border-stone-700">
                    <p className="text-sm text-stone-400 leading-relaxed font-serif">
                        {info.sunState.description}
                    </p>
                </div>
            </div>
        </Card>
      </div>

      {/* CHAPTER 5: Bu Gui Lou (Time) */}
      <div className="md:col-span-6">
        <Card icon={<Clock size={20} />} className="h-full">
            <SectionHeader title="步轨漏术" subtitle="第五篇：轨漏与晷影" icon={<Clock size={20} />} />
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-stone-900/40 rounded border border-stone-800/50 text-center">
                    <span className="text-xs text-stone-500 block mb-1">日出</span>
                    <span className="text-xl font-mono text-stone-200">{info.timeKeeping.sunrise}</span>
                </div>
                <div className="p-3 bg-stone-900/40 rounded border border-stone-800/50 text-center">
                    <span className="text-xs text-stone-500 block mb-1">日落</span>
                    <span className="text-xl font-mono text-stone-200">{info.timeKeeping.sunset}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-stone-950 p-3 rounded text-center border border-stone-800/50">
                    <span className="block text-stone-500 mb-1 text-xs">昼漏刻</span>
                    <span className="text-amber-200 font-bold text-base">{info.timeKeeping.dayFen} 分</span>
                    <div className="text-xs text-stone-600 mt-1">{info.timeKeeping.dayKe} 刻</div>
                </div>
                <div className="bg-stone-950 p-3 rounded text-center border border-stone-800/50">
                    <span className="block text-stone-500 mb-1 text-xs">夜漏刻</span>
                    <span className="text-stone-400 font-bold text-base">{info.timeKeeping.nightFen} 分</span>
                    <div className="text-xs text-stone-600 mt-1">{info.timeKeeping.nightKe} 刻</div>
                </div>
            </div>

            <div className="flex flex-col gap-1 text-xs text-stone-500 bg-stone-900/50 p-3 rounded">
                 <div className="flex justify-between items-center">
                   <span className="flex items-center gap-2 text-stone-400"><Hourglass size={12} /> 一更 (甲夜)</span>
                   <span className="text-stone-300 font-mono text-sm">{info.timeKeeping.oneGengFen} 分</span>
                 </div>
            </div>
        </Card>
      </div>

      {/* MATHEMATICAL CORE */}
      <div className="md:col-span-12 bg-stone-950/60 border border-stone-800 p-8 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500">
           <Calculator size={140} />
        </div>
        <SectionHeader title="大衍核心 · 通法" icon={<Divide size={20} />} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           <div className="space-y-4">
              <span className="text-xs text-stone-400 block mb-1">通法 (Common Denominator)</span>
              <div className="text-5xl font-serif text-white">3040</div>
              <div className="text-sm font-mono text-amber-600/80 mt-1">
                 = {info.math.derivation}
              </div>
              <div className="bg-stone-900/80 p-3 mt-3 border border-stone-800/50 rounded">
                <span className="text-xs text-stone-500 block mb-1">基础法则:</span>
                <span className="text-sm text-stone-300 font-mono">一日 = 3040 分</span>
              </div>
           </div>
           
           <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-900/50 p-6 rounded border border-stone-800/50">
              <MathDisplay 
                label="步朔术 (朔实)" 
                dividend={info.math.shuoShi}
                divisor={info.math.tongFa}
                fraction={info.math.synodicMonthFraction}
                approx="29.530592 日"
              />
              <MathDisplay 
                label="步气术 (策实)" 
                dividend={info.math.ceShi}
                divisor={info.math.tongFa}
                fraction={info.math.tropicalYearFraction}
                approx="365.2444 日"
              />
              <MathDisplay 
                label="步发敛 (一卦六日七分)" 
                dividend={info.math.guaDuration} 
                divisor={info.math.tongFa}
                fraction="6 + 253/3040"
                approx="6.0832 日"
              />
              <MathDisplay 
                label="步发敛 (一爻一日四十二分)" 
                dividend={info.math.yaoDuration} 
                divisor={info.math.tongFa}
                fraction="1 + 42/3040"
                approx="1.0138 日"
              />
           </div>
        </div>
      </div>
    </div>
  );
};
