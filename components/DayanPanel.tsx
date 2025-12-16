import React from 'react';
import { DayanDateInfo } from '../types';
import { HexagramSymbol } from './HexagramSymbol';
import { Sun, Clock, Divide, MapPin, Calculator, Scroll, Hourglass, Calendar, Activity } from 'lucide-react';

interface Props {
  info: DayanDateInfo;
}

const ChapterCard: React.FC<{ 
  title: string; 
  subtitle?: string;
  children: React.ReactNode; 
  icon?: React.ReactNode; 
  className?: string 
}> = ({ title, subtitle, children, icon, className = "" }) => (
  <div className={`bg-stone-900/80 border border-stone-800 p-6 rounded-sm shadow-md relative overflow-hidden group hover:border-amber-900/50 transition-colors ${className}`}>
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500 transform scale-150">
      {icon}
    </div>
    <div className="flex items-center gap-3 mb-5 border-b border-stone-800 pb-3">
      <span className="text-amber-600/80 scale-110">{icon}</span>
      <div>
        <h3 className="text-amber-500 text-base font-bold uppercase tracking-widest">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500 font-serif italic mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="text-stone-300">
      {children}
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

const SimulationRow: React.FC<{ label: string, val1: string, val2: string }> = ({label, val1, val2}) => (
  <div className="flex justify-between items-center py-2 border-b border-stone-800/50 last:border-0">
    <span className="text-sm text-stone-500 font-serif">{label}</span>
    <div className="flex gap-4">
       <span className="text-sm font-mono text-amber-600">{val1}</span>
       <span className="text-sm font-mono text-stone-300">{val2}</span>
    </div>
  </div>
);

export const DayanPanel: React.FC<Props> = ({ info }) => {
  const { guaQi } = info.dailyGua;
  // Calculate percentage of Fen passed in the current Yao
  // Avoid division by zero if something goes wrong, though logic prevents it.
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

      {/* TAI SHI JIAN LOGBOOK (Core Feature) */}
      <div className="md:col-span-12 bg-[#1a1816] border border-amber-900/20 p-8 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-600">
           <Calendar size={140} />
        </div>
        <div className="flex items-center gap-3 mb-6 border-b border-amber-900/20 pb-3">
           <Scroll size={20} className="text-amber-700" />
           <h3 className="text-amber-600 text-base font-bold uppercase tracking-widest">太史监 · 具注历</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Solar Track Simulation */}
           <div className="bg-stone-900/30 p-5 rounded border border-stone-800/30">
              <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第一篇 步中朔 (日)</span>
              <div className="space-y-1">
                 <SimulationRow 
                    label="入历积日 (冬至起)" 
                    val1={`第 ${info.calculation.daysSinceDongZhi} 日`} 
                    val2={`${info.calculation.accumulatedYearFen} 分`} 
                 />
                 <SimulationRow 
                    label="当前节气" 
                    val1={info.calculation.currentTermName} 
                    val2="值令" 
                 />
                 <SimulationRow 
                    label="七十二候" 
                    val1={info.calculation.currentHou} 
                    val2={info.pentad.name} 
                 />
              </div>
           </div>

           {/* Lunar Track Simulation */}
           <div className="bg-stone-900/30 p-5 rounded border border-stone-800/30">
              <span className="text-xs uppercase text-amber-700 font-bold block mb-4 tracking-wider">第二篇 步中朔 (月)</span>
              <div className="space-y-1">
                 <SimulationRow 
                    label="入月积日 (朔日起)" 
                    val1={`第 ${info.calculation.daysSinceShuo} 日`} 
                    val2={`${info.calculation.accumulatedMonthFen} 分`} 
                 />
                 <SimulationRow 
                    label="月相性质" 
                    val1={info.calculation.isBigMonth ? "大月 (30)" : "小月 (29)"} 
                    val2={info.calculation.leapInfo} 
                 />
                 <SimulationRow 
                    label="今日月相" 
                    val1={info.moonPhase} 
                    val2={info.calculation.daysSinceShuo === 0 ? "朔" : info.calculation.daysSinceShuo === 15 ? "望" : "..."} 
                 />
              </div>
           </div>
        </div>
        
        {/* Civil Calendar Entry (Ju Zhu Li) */}
        <div className="mt-8 border-t border-amber-900/20 pt-6">
           <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-amber-700"></div>
              <span className="text-stone-300 font-serif font-bold text-lg">民用具注历 (卦气物候)</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-stone-800 bg-[#24211f]">
               {/* Day Column */}
               <div className="md:col-span-2 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center text-center">
                   <span className="text-4xl font-serif text-amber-500 font-bold mb-1">{info.ganZhiDay}</span>
                   <span className="text-xs text-stone-500 uppercase tracking-widest">值日干支</span>
               </div>
               
               {/* Term/Phenomena Column */}
               <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-2">
                      <span className="text-stone-300 font-bold text-lg">[{info.calculation.currentTermName}]</span>
                      <span className="text-sm text-stone-500">{info.calculation.currentHou}</span>
                   </div>
                   <div className="text-base text-amber-700/80 italic font-serif">
                       “{info.pentad.name}”
                   </div>
               </div>

               {/* Gua Column (The Oracle) */}
               <div className="md:col-span-7 p-6 flex items-center justify-between bg-stone-900/20">
                   <div className="flex items-center gap-6">
                       <HexagramSymbol binary={info.dailyGua.symbol || "000000"} size={56} color="#b45309" />
                       <div className="flex flex-col gap-1 w-full">
                           <div className="flex items-baseline justify-between w-full">
                               <div className="flex items-baseline gap-3">
                                   <span className="text-xs text-stone-500 uppercase tracking-wider">值日公卦</span>
                                   <span className="text-2xl font-bold text-stone-200">{info.dailyGua.name}</span>
                               </div>
                               {/* New Gua Qi Progress Visualization */}
                               <div className="hidden sm:flex flex-col items-end gap-1">
                                   <span className={`text-xs uppercase tracking-wider ${guaQi.isYong ? 'text-amber-500 font-bold' : 'text-stone-500'}`}>
                                      {guaQi.isYong ? '用九/六 (虚日)' : `爻位: ${guaQi.yaoIndex} / 6`}
                                   </span>
                                   <div className="w-24 h-1 bg-stone-800 rounded-full overflow-hidden relative">
                                      <div className="h-full bg-amber-700 transition-all duration-500" style={{ width: `${Math.min(100, Math.floor(yaoProgress))}%` }}></div>
                                   </div>
                               </div>
                           </div>
                           
                           <div className="text-sm text-stone-400 mt-2 flex items-center gap-2">
                               <Activity size={14} className="text-amber-800" />
                               <span>当前推演:</span> 
                               <span className={`font-bold text-lg ${guaQi.isYong ? 'text-amber-400' : 'text-amber-600'}`}>
                                 {guaQi.yaoName}
                               </span>
                               <span className="text-stone-600 font-mono text-xs">
                                 (本爻积 {Math.round(guaQi.currentFenInYao)}/{guaQi.totalFenInYao} 分)
                               </span>
                           </div>
                       </div>
                   </div>
                   <div className="text-right hidden md:block pl-6 border-l border-stone-800/50">
                       <span className="text-xs text-stone-600 uppercase block mb-1">本月辟卦</span>
                       <span className="text-sm text-stone-400 whitespace-nowrap">{info.hexagram.name} ({info.hexagram.nature})</span>
                   </div>
               </div>
           </div>
           
           <div className="mt-3 text-xs text-stone-600 text-center font-mono">
              算法流程：节气定日 → 六十杂卦轮值 (6日7分/卦) → 六爻定象 (1日42分/爻)
           </div>
        </div>
      </div>

      {/* CHAPTER 3: Bu Ri Chan (Sun) */}
      <ChapterCard 
        title="步日躔术" 
        subtitle="第三篇：日躔与盈缩"
        icon={<Sun size={20} />}
        className="md:col-span-6"
      >
        <div className="flex flex-col gap-5">
          <div className="p-4 bg-stone-950/50 border border-stone-800 rounded">
            <span className="text-xs text-stone-500 block mb-2">盈缩分期 (不等间距)</span>
            <div className="flex flex-col gap-1">
                <span className={`text-2xl font-bold ${info.sunState.stage.includes('盈') ? 'text-amber-200' : 'text-stone-400'}`}>
                {info.sunState.stage}
                </span>
                <span className="text-xs text-stone-600 italic">
                    {info.sunState.stage.includes('盈') ? '积盈 (近日加速)' : '积缩 (远日减速)'}
                </span>
            </div>
          </div>
          
          <div>
              <p className="text-sm text-stone-400 leading-relaxed border-l-2 border-stone-800 pl-4 py-1">
                {info.sunState.description}
              </p>
          </div>
        </div>
      </ChapterCard>

      {/* CHAPTER 5: Bu Gui Lou (Time) - Updated with Fen/Ke/Geng */}
      <ChapterCard 
        title="步轨漏术" 
        subtitle="第五篇：轨漏与晷影"
        icon={<Clock size={20} />}
        className="md:col-span-6"
      >
        <div className="space-y-5">
           {/* Modern Time */}
           <div className="flex justify-between items-center border-b border-stone-800 pb-3">
             <div className="flex flex-col gap-1">
               <span className="text-xs text-stone-500">日出</span>
               <span className="text-stone-200 font-mono text-base">{info.timeKeeping.sunrise}</span>
             </div>
             <div className="flex flex-col text-right gap-1">
               <span className="text-xs text-stone-500">日落</span>
               <span className="text-stone-200 font-mono text-base">{info.timeKeeping.sunset}</span>
             </div>
           </div>
           
           {/* Dayan Ancient Units */}
           <div className="grid grid-cols-2 gap-4 text-sm">
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

           {/* Dynamic Watch (Geng) */}
           <div className="flex flex-col gap-2 text-xs text-stone-500 mt-1 bg-stone-900/50 p-3 rounded">
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-2 text-stone-400"><Hourglass size={12} /> 一更 (甲夜)</span>
               <span className="text-stone-300 font-mono text-sm">{info.timeKeeping.oneGengFen} 分</span>
             </div>
             <div className="text-[10px] text-stone-600 text-right opacity-70">
               算法：夜刻五分
             </div>
           </div>
           
           <div className="flex items-center justify-center gap-2 text-xs text-stone-700 mt-2">
             <MapPin size={12} />
             京师（长安）测影
           </div>
        </div>
      </ChapterCard>

      {/* MATHEMATICAL CORE */}
      <div className="md:col-span-12 bg-stone-950/60 border border-stone-800 p-8 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500">
           <Calculator size={140} />
        </div>
        <div className="flex items-center gap-3 mb-8">
           <Divide size={20} className="text-amber-600" />
           <h3 className="text-amber-500 text-base font-bold uppercase tracking-widest">大衍核心 · 通法</h3>
        </div>
        
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