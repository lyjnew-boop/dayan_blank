
import React from 'react';
import { DayanDateInfo } from '../types';
import { Database } from 'lucide-react';
import { Theme } from '../styles/theme';

// Sub Components
import { BaZiChart } from './BaZiChart';
import { DayanHeader } from './dayan/DayanHeader';
import { TaiShiJianLog } from './dayan/TaiShiJianLog';
import { CivilCalendarEntry } from './dayan/CivilCalendarEntry';
import { SunOrbitCard } from './dayan/SunOrbitCard';
import { TimeKeepingCard } from './dayan/TimeKeepingCard';
import { MathCoreCard } from './dayan/MathCoreCard';
import { SectionHeader } from './common/SectionHeader';

interface Props {
  info: DayanDateInfo;
}

export const DayanPanel: React.FC<Props> = ({ info }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <DayanHeader info={info} />

      {/* TAI SHI JIAN LOGBOOK + CIVIL ENTRY */}
      <div className="md:col-span-12">
        <TaiShiJianLog info={info} />
        {/* Note: CivilCalendarEntry is composed here */}
        <div className={`mt-6 ${Theme.dayan.bgPanel} border ${Theme.colors.borderHighlight} p-1 rounded`}>
           <CivilCalendarEntry info={info} />
        </div>
      </div>

      {/* SUN ORBIT (BU RI CHAN) */}
      <div className="md:col-span-6">
        <SunOrbitCard sunState={info.sunState} />
      </div>

      {/* TIME KEEPING (BU GUI LOU) */}
      <div className="md:col-span-6">
        <TimeKeepingCard timeKeeping={info.timeKeeping} />
      </div>

      {/* FOUR PILLARS (BAZI) - Moved Down */}
      <div className="md:col-span-12">
        <div className={Theme.dayan.card}>
           <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500 transform scale-150">
             <Database size={20} />
           </div>
          <SectionHeader title="四柱八字" subtitle="命理基础 · 造化元钥" icon={<Database size={20} />} />
          <BaZiChart bazi={info.baZi} />
        </div>
      </div>

      {/* MATH CORE */}
      <MathCoreCard math={info.math} />
    </div>
  );
};
