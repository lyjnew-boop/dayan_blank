import React from 'react';
import { DayanDateInfo } from '../types';
import { HexagramSymbol } from './HexagramSymbol';
import { Wind, Sun, Moon, Star, Clock, Compass, BookOpen, Divide, CircleDot, MapPin, Calculator, Scroll, Hourglass, Calendar } from 'lucide-react';

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
  <div className={`bg-stone-900/80 border border-stone-800 p-5 rounded-sm shadow-md relative overflow-hidden group hover:border-amber-900/50 transition-colors ${className}`}>
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500 transform scale-150">
      {icon}
    </div>
    <div className="flex items-center gap-2 mb-4 border-b border-stone-800 pb-2">
      <span className="text-amber-600/80">{icon}</span>
      <div>
        <h3 className="text-amber-500 text-sm font-bold uppercase tracking-widest">{title}</h3>
        {subtitle && <p className="text-[10px] text-stone-500 font-serif italic">{subtitle}</p>}
      </div>
    </div>
    <div className="text-stone-300">
      {children}
    </div>
  </div>
);

const MathDisplay: React.FC<{ label: string, dividend: number, divisor: number, fraction: string, approx: string }> = ({ label, dividend, divisor, fraction, approx }) => (
  <div className="flex flex-col border-l-2 border-amber-900/30 pl-3">
    <span className="text-[10px] text-stone-500 uppercase tracking-wide">{label}</span>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-xs font-mono text-stone-400">{dividend} ÷ {divisor} =</span>
      <span className="text-lg font-mono text-amber-100/90">{fraction}</span>
    </div>
    <span className="text-[10px] text-stone-600 font-serif italic mt-1">≈ {approx}</span>
  </div>
);

const SimulationRow: React.FC<{ label: string, val1: string, val2: string }> = ({label, val1, val2}) => (
  <div className="flex justify-between items-center py-1 border-b border-stone-800/50 last:border-0">
    <span className="text-xs text-stone-500 font-serif">{label}</span>
    <div className="flex gap-4">
       <span className="text-xs font-mono text-amber-600">{val1}</span>
       <span className="text-xs font-mono text-stone-300">{val2}</span>
    </div>
  </div>
);

export const DayanPanel: React.FC<Props> = ({ info }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="md:col-span-12 bg-stone-900 border-t-2 border-b-2 border-amber-900/30 py-10 text-center relative">
         <div className="absolute top-2 left-4 text-[10px] text-stone-600 font-mono tracking-widest flex items-center gap-2">
            大衍历经 (公元729) <span className="w-1 h-1 bg-amber-700 rounded-full"></span> 唐 · 开元
         </div>
         <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-100 mb-2 tracking-tight">
           {info.lunarDateStr}
         </h1>
         <div className="flex justify-center items-center gap-4 text-amber-700/80 font-serif text-lg">
            <span>{info.ganZhiYear}年</span>
            <span>•</span>
            <span>{info.ganZhiMonth}月</span>
            <span>•</span>
            <span>{info.ganZhiDay}日</span>
            <span>•</span>
            <span>{info.ganZhiHour}时</span>
         </div>
         <div className="mt-4 text-stone-500 font-mono text-sm uppercase">
           {info.gregorianDate.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
         </div>
      </div>

      {/* TAI SHI JIAN LOGBOOK (Core Feature) */}
      <div className="md:col-span-12 bg-[#1a1816] border border-amber-900/20 p-6 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-amber-600">
           <Calendar size={120} />
        </div>
        <div className="flex items-center gap-2 mb-4 border-b border-amber-900/20 pb-2">
           <Scroll size={18} className="text-amber-700" />
           <h3 className="text-amber-600 text-sm font-bold uppercase tracking-widest">太史监 · 具注历</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Solar Track Simulation */}
           <div className="bg-stone-900/30 p-4 rounded">
              <span className="text-[10px] uppercase text-amber-700 font-bold block mb-3">第一篇 步中朔 (日)</span>
              <div className="space-y-2">
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
           <div className="bg-stone-900/30 p-4 rounded">
              <span className="text-[10px] uppercase text-amber-700 font-bold block mb-3">第二篇 步中朔 (月)</span>
              <div className="space-y-2">
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
        <div className="mt-6 border-t border-amber-900/20 pt-4">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-amber-700"></div>
              <span className="text-stone-300 font-serif font-bold">民用具注历 (卦气物候)</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-stone-800 bg-[#24211f]">
               {/* Day Column */}
               <div className="md:col-span-2 p-4 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center items-center text-center">
                   <span className="text-2xl font-serif text-amber-500 font-bold">{info.ganZhiDay}</span>
                   <span className="text-xs text-stone-500 uppercase mt-1">值日干支</span>
               </div>
               
               {/* Term/Phenomena Column */}
               <div className="md:col-span-3 p-4 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-stone-300 font-bold">[{info.calculation.currentTermName}]</span>
                      <span className="text-xs text-stone-500">{info.calculation.currentHou}</span>
                   </div>
                   <div className="text-sm text-amber-700/80 italic font-serif">
                       “{info.pentad.name}”
                   </div>
               </div>

               {/* Gua Column (The Oracle) */}
               <div className="md:col-span-7 p-4 flex items-center justify-between bg-stone-900/20">
                   <div className="flex items-center gap-4">
                       <HexagramSymbol binary={info.dailyGua.symbol || "000000"} size={40} color="#b45309" />
                       <div className="flex flex-col">
                           <div className="flex items-baseline gap-2">
                               <span className="text-xs text-stone-500 uppercase tracking-wider">值日公卦</span>
                               <span className="text-lg font-bold text-stone-200">{info.dailyGua.name}</span>
                           </div>
                           <div className="text-xs text-stone-500">
                               爻辞: <span className="text-amber-500 font-bold">{info.dailyGua.yao}</span> (第 {info.dailyGua.yaoIndex} 爻)
                           </div>
                       </div>
                   </div>
                   <div className="text-right hidden sm:block">
                       <span className="text-[10px] text-stone-600 uppercase block mb-1">本月辟卦</span>
                       <span className="text-xs text-stone-400">{info.hexagram.name} ({info.hexagram.nature})</span>
                   </div>
               </div>
           </div>
           
           <div className="mt-2 text-[10px] text-stone-600 text-center font-mono">
              算法流程：节气定日 → 六十杂卦轮值 → 六爻定象
           </div>
        </div>
      </div>

      {/* CHAPTER 3: Bu Ri Chan (Sun) */}
      <ChapterCard 
        title="步日躔术" 
        subtitle="第三篇：日躔与盈缩"
        icon={<Sun size={18} />}
        className="md:col-span-6"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-stone-950/50 border border-stone-800 rounded">
            <span className="text-xs text-stone-500 block mb-1">盈缩分期 (不等间距)</span>
            <div className="flex flex-col">
                <span className={`text-xl font-bold ${info.sunState.stage.includes('盈') ? 'text-amber-200' : 'text-stone-400'}`}>
                {info.sunState.stage}
                </span>
                <span className="text-[10px] text-stone-600 mt-1 italic">
                    {info.sunState.stage.includes('盈') ? '积盈 (近日加速)' : '积缩 (远日减速)'}
                </span>
            </div>
          </div>
          
          <div>
              <p className="text-xs text-stone-400 leading-relaxed border-l-2 border-stone-800 pl-2">
                {info.sunState.description}
              </p>
          </div>
        </div>
      </ChapterCard>

      {/* CHAPTER 5: Bu Gui Lou (Time) - Updated with Fen/Ke/Geng */}
      <ChapterCard 
        title="步轨漏术" 
        subtitle="第五篇：轨漏与晷影"
        icon={<Clock size={18} />}
        className="md:col-span-6"
      >
        <div className="space-y-4">
           {/* Modern Time */}
           <div className="flex justify-between items-center border-b border-stone-800 pb-2">
             <div className="flex flex-col">
               <span className="text-xs text-stone-500">日出</span>
               <span className="text-stone-200 font-mono">{info.timeKeeping.sunrise}</span>
             </div>
             <div className="flex flex-col text-right">
               <span className="text-xs text-stone-500">日落</span>
               <span className="text-stone-200 font-mono">{info.timeKeeping.sunset}</span>
             </div>
           </div>
           
           {/* Dayan Ancient Units */}
           <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-950 p-2 rounded text-center border border-stone-800/50">
                 <span className="block text-stone-500 mb-1">昼漏刻</span>
                 <span className="text-amber-200 font-bold">{info.timeKeeping.dayFen} 分</span>
                 <div className="text-[10px] text-stone-600 mt-1">{info.timeKeeping.dayKe} 刻</div>
              </div>
              <div className="bg-stone-950 p-2 rounded text-center border border-stone-800/50">
                 <span className="block text-stone-500 mb-1">夜漏刻</span>
                 <span className="text-stone-400 font-bold">{info.timeKeeping.nightFen} 分</span>
                 <div className="text-[10px] text-stone-600 mt-1">{info.timeKeeping.nightKe} 刻</div>
              </div>
           </div>

           {/* Dynamic Watch (Geng) */}
           <div className="flex flex-col gap-1 text-[10px] text-stone-600 mt-1 bg-stone-900/50 p-2 rounded">
             <div className="flex justify-between items-center">
               <span className="flex items-center gap-1"><Hourglass size={10} /> 一更 (甲夜)</span>
               <span className="text-stone-300 font-mono">{info.timeKeeping.oneGengFen} 分</span>
             </div>
             <div className="text-[9px] text-stone-500 text-right opacity-70">
               算法：夜刻五分
             </div>
           </div>
           
           <div className="flex items-center justify-center gap-1 text-[10px] text-stone-700 mt-2">
             <MapPin size={10} />
             京师（长安）测影
           </div>
        </div>
      </ChapterCard>

      {/* MATHEMATICAL CORE */}
      <div className="md:col-span-12 bg-stone-950/60 border border-stone-800 p-6 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-amber-500">
           <Calculator size={120} />
        </div>
        <div className="flex items-center gap-2 mb-6">
           <Divide size={18} className="text-amber-600" />
           <h3 className="text-amber-500 text-sm font-bold uppercase tracking-widest">大衍核心 · 通法</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
              <span className="text-xs text-stone-400 block mb-1">通法 (Common Denominator)</span>
              <div className="text-3xl font-serif text-white">3040</div>
              <div className="text-xs font-mono text-amber-600/80 mt-1">
                 = {info.math.derivation}
              </div>
              <div className="bg-stone-900/80 p-2 mt-2 border border-stone-800/50 rounded">
                <span className="text-[10px] text-stone-500 block">基础法则:</span>
                <span className="text-xs text-stone-300 font-mono">一日 = 3040 分</span>
              </div>
           </div>
           
           <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-900/50 p-4 rounded border border-stone-800/50">
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
           </div>
        </div>
      </div>
    </div>
  );
};