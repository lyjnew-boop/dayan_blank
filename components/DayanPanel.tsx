
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

      {/* FOUR PILLARS (BAZI) */}
      <div className="md:col-span-12">
        <div className={Theme.dayan.card}>
           <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500 transform scale-150">
             <Database size={20} />
           </div>
          <SectionHeader title="四柱八字" subtitle="命理基础 · 造化元钥" icon={<Database size={20} />} />
          <BaZiChart bazi={info.baZi} />
        </div>
      </div>

      {/* TAI SHI JIAN LOGBOOK + CIVIL ENTRY */}
      <div className="md:col-span-12">
        <TaiShiJianLog info={info} />
        {/* Note: TaiShiJianLog style container logic might be split but here we stack or compose them. 
            Refactoring note: Ideally CivilCalendarEntry is inside the logbook visual container in the original design.
            The TaiShiJianLog component handles the top part, and we can render CivilCalendarEntry right below it 
            if we passed children, or simply render it inside TaiShiJianLog. 
            However, based on the previous structure, CivilCalendarEntry was INSIDE the border of the logbook.
            To allow composition, we modified TaiShiJianLog to accept children or we place it inside TaiShiJianLog directly.
            For this refactor, I moved CivilCalendarEntry inside TaiShiJianLog component code for cleaner composition, 
            so we just render TaiShiJianLog here and it includes the Civil Entry. 
            
            WAIT: In my file definitions above, TaiShiJianLog DOES NOT include CivilCalendarEntry. 
            Let's fix the composition in this file.
        */}
        <div className={`mt-6 ${Theme.dayan.bgPanel} border ${Theme.colors.borderHighlight} p-1 rounded`}>
           {/* If we want them visually unified like before, we can put them in a wrapper. 
               The original design had them sharing a large container. 
               Let's re-compose properly.
           */}
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

      {/* MATH CORE */}
      <MathCoreCard math={info.math} />
    </div>
  );
};
