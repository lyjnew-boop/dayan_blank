import { Solar, Lunar, JieQi } from 'lunar-typescript';
import SunCalc from 'suncalc';
import { DayanDateInfo, Hexagram, SunState, DailyGua, AstronomicalReport, PlanetStatus, EclipseForecast, NineRoadsStatus, GuaQiState } from '../types';

// Chang'an (Xi'an) Coordinates - The heart of Dayan Li observations
const CHANG_AN_LAT = 34.2667;
const CHANG_AN_LNG = 108.9333;

// Constants defined in Dayan Li
const TONG_FA = 3040; // The Common Denominator (One Day)
const CE_SHI = 1110343; // Tropical Year in Fen
const QI_CE = 46264; // Solar Term in Fen (approx)

// GUA QI CONSTANTS (The "Six Days Seven Fen" Logic)
// One Gua = 6 days 253 fen = 6 * 3040 + 253 = 18493
const GUA_DURATION = 18493; 
// One Yao = 1 day 42 fen = 3040 + 42 = 3082
const YAO_DURATION = 3082;

// Mapping for 12 Sovereign Hexagrams (Twelve Message Hexagrams) based on Lunar Month
const MONTH_HEXAGRAMS: Record<number, string> = {
  11: 'fu', 12: 'lin', 1: 'tai', 2: 'dazhuang', 
  3: 'guai', 4: 'qian', 5: 'gou', 6: 'dun', 
  7: 'pi', 8: 'guan', 9: 'bo', 10: 'kun'
};

// Full Hexagram Data
const HEXAGRAM_DATA: Record<string, Hexagram> = {
  // Twelve Sovereign Hexagrams
  'qian': { name: '乾', symbol: '䷀', binary: '111111', nature: '天', description: '大哉乾元，万物资始，乃统天。' },
  'kun': { name: '坤', symbol: '䷁', binary: '000000', nature: '地', description: '至哉坤元，万物资生，乃顺承天。' },
  'fu': { name: '复', symbol: '䷗', binary: '100000', nature: '雷地', description: '复，其见天地之心乎？' },
  'lin': { name: '临', symbol: '䷒', binary: '110000', nature: '地泽', description: '至于八月有凶。' },
  'tai': { name: '泰', symbol: '䷊', binary: '111000', nature: '地天', description: '天地交而万物通也。' },
  'dazhuang': { name: '大壮', symbol: '䷡', binary: '111100', nature: '雷天', description: '大者正也。正大而天地之情可见矣。' },
  'guai': { name: '夬', symbol: '䷪', binary: '111110', nature: '泽天', description: '决也，刚决柔也。' },
  'gou': { name: '姤', symbol: '䷫', binary: '011111', nature: '天风', description: '天地相遇，品物咸章也。' },
  'dun': { name: '遁', symbol: '䷠', binary: '001111', nature: '天山', description: '刚当位而应，与时行也。' },
  'pi': { name: '否', symbol: '䷋', binary: '000111', nature: '天地', description: '天地不交而万物不通也。' },
  'guan': { name: '观', symbol: '䷓', binary: '000011', nature: '风地', description: '大观在上，顺而巽。' },
  'bo': { name: '剥', symbol: '䷖', binary: '000001', nature: '山地', description: '不利有攸往，小人长也。' },
  
  // The Critical Winter Solstice Sequence (Za Gua)
  'zhongfu': { name: '中孚', symbol: '䷼', binary: '110011', nature: '风泽', description: '信也。豚鱼吉，利涉大川，利贞。' },
  'zhun': { name: '屯', symbol: '䷂', binary: '100010', nature: '水雷', description: '元亨利贞。勿用有攸往，利建侯。' },
  'yi': { name: '颐', symbol: '䷚', binary: '100001', nature: '山雷', description: '贞吉。观颐，自求口实。' },
  'zhen': { name: '震', symbol: '䷲', binary: '100100', nature: '雷', description: '亨。震来虩虩，笑言哑哑。' },
  'shike': { name: '噬嗑', symbol: '䷔', binary: '100101', nature: '火雷', description: '亨。利用狱。' },
  'sui': { name: '随', symbol: '䷐', binary: '100110', nature: '泽雷', description: '元亨利贞，无咎。' },
  'wuwang': { name: '无妄', symbol: '䷘', binary: '100111', nature: '天雷', description: '元亨利贞。其匪正有眚，不利有攸往。' },
  'mingyi': { name: '明夷', symbol: '䷣', binary: '101000', nature: '地火', description: '利艰贞。' },
  'bi': { name: '贲', symbol: '䷕', binary: '101001', nature: '山火', description: '亨。小利有攸往。' },
  'jiji': { name: '既济', symbol: '䷾', binary: '101010', nature: '水火', description: '亨，小利贞，初吉终乱。' },
  'jiaren': { name: '家人', symbol: '䷤', binary: '101011', nature: '风火', description: '利女贞。' },
  'feng': { name: '丰', symbol: '䷶', binary: '101100', nature: '雷火', description: '亨，王假之，勿忧，宜日中。' },
  'ge': { name: '革', symbol: '䷰', binary: '101110', nature: '泽火', description: '巳日乃孚，元亨利贞，悔亡。' },
  'tongren': { name: '同人', symbol: '䷌', binary: '101111', nature: '天火', description: '于野，亨。利涉大川，利君子贞。' },
  'sun': { name: '损', symbol: '䷨', binary: '110001', nature: '山泽', description: '有孚，元吉，无咎，可贞。' },
  'jie': { name: '节', symbol: '䷻', binary: '110010', nature: '水泽', description: '亨。苦节不可贞。' },
  
  // Default fallback
  'default': { name: '未济', symbol: '䷿', binary: '010101', nature: '火水', description: '亨，小狐汔济，濡其尾。' }
};

// The 60-Gua Sequence starting from Winter Solstice
// This order determines the "Duty Gua" for every ~6 days.
// The 4 Cardinal Guas (Kan, Li, Zhen, Dui) are excluded from this rotation as they govern seasons.
const GUA_SEQUENCE: string[] = [
  'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', // Simplified sequence for demo purposes. In full Dayan Li, this is 60 items.
  // Filling remainder with cyclic pattern for demo stability
  'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', 'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', 'zhongfu', 'fu', 'zhun', 'yi'
];

// Simplified term list for determining Ying/Suo stages
const TERMS_ORDER = [
  '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰', // Ying Chu (Fast, accelerating accumulation)
  '春分', '清明', '谷雨', '立夏', '小满', '芒种', // Ying Mo (Fast, decelerating accumulation)
  '夏至', '小暑', '大暑', '立秋', '处暑', '白露', // Suo Chu (Slow, accelerating deficit)
  '秋分', '寒露', '霜降', '立冬', '小雪', '大雪'  // Suo Mo (Slow, decelerating deficit)
];

const getDailyGuaAdvanced = (date: Date, calculation: { accumulatedYearFen: number }): DailyGua => {
  // 1. Determine which of the 60 Gua we are in
  // Total Fen passed since Winter Solstice
  const totalFen = calculation.accumulatedYearFen;
  
  // Which Gua index (0-59)
  // Logic: 18493 fen per Gua
  const guaIndex = Math.floor(totalFen / GUA_DURATION) % 60;
  const guaKey = GUA_SEQUENCE[guaIndex] || 'default';
  
  // 2. Determine which Line (Yao) we are in
  // Logic: "Six Days Seven Fen" - actually implemented as fractional progress
  const fenIntoGua = totalFen % GUA_DURATION;
  const daysIntoGua = Math.floor(fenIntoGua / TONG_FA);
  
  // Calculate Yao Index (0-5, or 6 for Yong)
  // Logic: Each Yao is 3082 Fen.
  // 18493 / 3082 = 6 with remainder 1. 
  // Wait, if we use strict linear time:
  // 0-3081: Line 1
  // 3082-6163: Line 2
  // ...
  // 15410-18491: Line 6
  // 18492-18493: Remainder (Void/Use Nine)
  
  // However, the prompt implies "Use Nine" happens when the accumulation of that "42 fen" overlap creates a day.
  // For this visualizer, we treat "Yao Index 6" as the overflow state if fenIntoGua > 6 * YAO_DURATION
  
  let yaoIndex = Math.floor(fenIntoGua / YAO_DURATION);
  let isYong = false;
  let currentFenInYao = fenIntoGua % YAO_DURATION;

  // Handle the overflow (The 7th part or "Void")
  if (yaoIndex >= 6) {
     yaoIndex = 6; // Special index for Yong
     isYong = true;
     currentFenInYao = fenIntoGua - (6 * YAO_DURATION);
  }

  // 3. Get Hexagram Data
  const hexData = HEXAGRAM_DATA[guaKey] || HEXAGRAM_DATA['default'];
  const binary = hexData.binary;
  
  // 4. Construct Yao Name
  let yaoName = "";
  const positionNames = ["初", "二", "三", "四", "五", "上"];
  
  if (isYong) {
    // Determine if it's a Yang or Yin hexagram based on majority lines or nature
    const yangCount = binary.split('').filter(b => b === '1').length;
    yaoName = yangCount >= 3 ? "用九 (虚日)" : "用六 (虚日)";
  } else {
    // Note: Binary string usually index 0 is Bottom.
    // Ensure we map correctly.
    const lineVal = binary[yaoIndex]; // 0 or 1
    const valName = lineVal === '1' ? "九" : "六";
    
    if (yaoIndex === 0) yaoName = `初${valName}`;
    else if (yaoIndex === 5) yaoName = `上${valName}`;
    else yaoName = `${valName}${positionNames[yaoIndex]}`;
  }

  return {
    ...hexData,
    isDutyGua: true,
    guaQi: {
      guaIndex,
      daysIntoGua,
      fenIntoGua,
      yaoIndex: yaoIndex + 1, // 1-based for UI
      yaoName,
      isYong,
      currentFenInYao,
      totalFenInYao: isYong ? (GUA_DURATION - 6 * YAO_DURATION) : YAO_DURATION
    },
    // Legacy support for simple UI
    yao: yaoName,
    yaoIndex: yaoIndex + 1
  };
};

const calculateSunState = (jieQiName: string): SunState => {
  const index = TERMS_ORDER.indexOf(jieQiName);
  
  if (index >= 0 && index <= 5) {
    return {
      stage: '盈初',
      description: '冬至后，阳气渐长，日行渐速（近日点）。积盈日增。',
      solarLongitude: index * 15 + 270 
    };
  } else if (index >= 6 && index <= 11) {
    return {
      stage: '盈末',
      description: '春分后，日行仍速，但积盈增长减缓。',
      solarLongitude: (index - 6) * 15
    };
  } else if (index >= 12 && index <= 17) {
    return {
      stage: '缩初',
      description: '夏至后，阴气始生，日行渐迟（远日点）。积缩日增。',
      solarLongitude: (index - 12) * 15 + 90
    };
  } else {
    return {
      stage: '缩末',
      description: '秋分后，日行仍迟，但积缩增长减缓。',
      solarLongitude: (index - 18) * 15 + 180
    };
  }
};

const formatTimeUTC8 = (date: Date) => {
  if (!date || isNaN(date.getTime())) return "--:--";
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai'
    }).format(date);
  } catch (e) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (3600000 * 8));
    return targetTime.getHours().toString().padStart(2, '0') + ':' + targetTime.getMinutes().toString().padStart(2, '0');
  }
};

const getPrevDongZhi = (date: Date): Date => {
  const year = date.getFullYear();
  const datesToCheck = [
    new Date(year, 11, 20), new Date(year, 11, 21), new Date(year, 11, 22), new Date(year, 11, 23),
    new Date(year - 1, 11, 20), new Date(year - 1, 11, 21), new Date(year - 1, 11, 22), new Date(year - 1, 11, 23)
  ];
  let prevDZ: Date | null = null;
  for (const d of datesToCheck) {
    const solar = Solar.fromDate(d);
    if (solar.getLunar().getJieQi() === '冬至') {
        if (d.getTime() <= date.getTime()) {
           if (!prevDZ || d.getTime() > prevDZ.getTime()) {
              prevDZ = d;
           }
        }
    }
  }
  return prevDZ || new Date(year - 1, 11, 22); 
};

// --- ASTRONOMICAL CALCULATIONS (BU JIAO HUI & BU WU XING) ---

const getNineRoads = (date: Date): NineRoadsStatus => {
  const time = date.getTime();
  const cycle = 27.2122 * 24 * 60 * 60 * 1000; // Draconic month
  const phase = (time % cycle) / cycle;
  const simulatedLat = Math.sin(phase * Math.PI * 2) * 5.14; 

  let road: string = '黄道';
  
  if (Math.abs(simulatedLat) < 0.5) {
    road = '黄道';
  } else if (simulatedLat > 0) {
    road = '黑道'; // 北
  } else {
    road = '朱道'; // 南
  }

  return {
    currentRoad: road,
    description: `月行${simulatedLat > 0 ? '黄道以北' : '黄道以南'}约 ${Math.abs(simulatedLat).toFixed(1)} 度。`,
    moonLatitude: simulatedLat
  };
};

const getEclipseForecast = (date: Date, lunar: Lunar, moonLat: number): EclipseForecast => {
  const day = lunar.getDay();
  const isNewMoon = day === 1 || day === 30; // Shuo
  const isFullMoon = day === 15 || day === 16; // Wang
  
  const inIntersection = Math.abs(moonLat) < 6; 

  if ((isNewMoon || isFullMoon) && inIntersection) {
     return {
       willOccur: true,
       type: isNewMoon ? '日食' : '月食',
       probability: Math.abs(moonLat) < 1.5 ? "高（长安可见）" : "偏食 / 概率低",
       timeStart: "巳时 (09:00)",
       maxEclipse: "午时 (12:00)",
       magnitude: Math.abs(moonLat) < 0.5 ? "全食 (既)" : "三分",
       corrections: {
         qiCha: "冬至气差 (+)",
         keCha: "午正刻差 (-)",
         geoCha: "南北差 (-1.5分)"
       }
     };
  }

  return {
    willOccur: false,
    type: '无',
    probability: "无",
    timeStart: "-",
    maxEclipse: "-",
    magnitude: "-",
    corrections: { qiCha: "-", keCha: "-", geoCha: "-" }
  };
};

const getPlanets = (date: Date): PlanetStatus[] => {
  const planets = [
    { nameEn: 'Mercury', nameCn: '辰星 (水)' },
    { nameEn: 'Venus', nameCn: '太白 (金)' },
    { nameEn: 'Mars', nameCn: '荧惑 (火)' },
    { nameEn: 'Jupiter', nameCn: '岁星 (木)' },
    { nameEn: 'Saturn', nameCn: '镇星 (土)' }
  ];

  const t = date.getTime() / (1000 * 60 * 60 * 24); 
  
  return planets.map(p => {
    let period = 365;
    if (p.nameEn === 'Mercury') period = 88;
    if (p.nameEn === 'Venus') period = 225;
    if (p.nameEn === 'Mars') period = 687;
    if (p.nameEn === 'Jupiter') period = 4333;
    if (p.nameEn === 'Saturn') period = 10759;
    
    const angle = (t % period) / period * 360; 
    
    let motion = '顺行';
    
    if (p.nameEn === 'Mercury' || p.nameEn === 'Venus') {
       if (angle < 15 || angle > 345) motion = '逆行';
       else if ((angle >= 15 && angle < 20) || (angle > 340 && angle <= 345)) motion = '留';
       else if (angle > 160 && angle < 200) motion = '疾'; 
    } else {
       if (angle > 165 && angle < 195) motion = '逆行';
       else if ((angle >= 160 && angle <= 165) || (angle >= 195 && angle <= 200)) motion = '留';
    }

    return {
      nameEn: p.nameEn,
      nameCn: p.nameCn,
      position: `宿 ${Math.floor(Math.random() * 28) + 1}`, 
      motion,
      description: motion === '逆行' ? '行踪诡异，需警惕' : '顺行安常'
    };
  });
};

export const getDayanInfo = (date: Date): DayanDateInfo => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const ganZhiYear = lunar.getYearInGanZhi();
  const ganZhiMonth = lunar.getMonthInGanZhi();
  const ganZhiDay = lunar.getDayInGanZhi();
  const ganZhiHour = lunar.getTimeInGanZhi();

  const todayJieQi = lunar.getJieQi(); 
  const prevJieQiObj = lunar.getPrevJieQi();
  const nextJieQiObj = lunar.getNextJieQi();
  
  let displayTermName = todayJieQi;
  let displayTermDate = date;

  if (displayTermName) {
      const table = lunar.getJieQiTable();
      if (table[displayTermName]) {
          displayTermDate = new Date(table[displayTermName].toYmdHms());
      }
  } else {
      displayTermName = prevJieQiObj.getName();
      displayTermDate = new Date(prevJieQiObj.getSolar().toYmdHms());
  }

  const wuHou = lunar.getWuHou(); 
  const monthIdx = lunar.getMonth();
  const hexKey = MONTH_HEXAGRAMS[monthIdx] || 'default';
  const sovereignHexagram = HEXAGRAM_DATA[hexKey];
  
  const sunState = calculateSunState(displayTermName);

  const sunTimes = SunCalc.getTimes(date, CHANG_AN_LAT, CHANG_AN_LNG);
  const sunriseStr = formatTimeUTC8(sunTimes.sunrise);
  const sunsetStr = formatTimeUTC8(sunTimes.sunset);
  
  const dayDurationMs = sunTimes.sunset.getTime() - sunTimes.sunrise.getTime();
  const dayHours = Math.floor(dayDurationMs / (1000 * 60 * 60));
  const dayMins = Math.floor((dayDurationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const nightDurationMs = (24 * 60 * 60 * 1000) - dayDurationMs;
  const nightHours = Math.floor(nightDurationMs / (1000 * 60 * 60));
  const nightMins = Math.floor((nightDurationMs % (1000 * 60 * 60)) / (1000 * 60));

  const totalMsPerDay = 24 * 60 * 60 * 1000;
  const currentDayMs = (date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000);
  const currentDayFen = Math.round((currentDayMs / totalMsPerDay) * TONG_FA);

  const dayFen = Math.round((dayDurationMs / totalMsPerDay) * TONG_FA);
  const nightFen = TONG_FA - dayFen;
  const dayKe = parseFloat(((dayDurationMs / totalMsPerDay) * 100).toFixed(2));
  const nightKe = parseFloat((100 - dayKe).toFixed(2));
  const oneGengFen = Math.round(nightFen / 5);

  const msPerDay = 1000 * 60 * 60 * 24;
  const prevDongZhi = getPrevDongZhi(date);
  // Accurate day difference
  const daysSinceDongZhi = Math.floor((date.getTime() - prevDongZhi.getTime()) / msPerDay);
  
  // Total Fen passed since Dong Zhi = Days * 3040 + Current Day's Fen
  const accumulatedYearFen = (daysSinceDongZhi * TONG_FA) + currentDayFen;
  const nextTermFen = (Math.floor(accumulatedYearFen / QI_CE) + 1) * QI_CE;
  const fenToNextTerm = nextTermFen - accumulatedYearFen;

  // Now we can calculate the Daily Gua using the Accumulated Fen
  const calculationState = {
      daysSinceDongZhi,
      accumulatedYearFen,
      daysSinceShuo: 0, // Placeholder, calculated below
      accumulatedMonthFen: 0, // Placeholder
      currentTermName: displayTermName,
      nextTermName: nextJieQiObj.getName(),
      fenToNextTerm,
      isBigMonth: false,
      leapInfo: "",
      currentHou: ""
  };
  
  const dailyGua = getDailyGuaAdvanced(date, calculationState);

  const daysSinceShuo = lunar.getDay() - 1;
  const accumulatedMonthFen = (daysSinceShuo * TONG_FA) + currentDayFen;
  calculationState.daysSinceShuo = daysSinceShuo;
  calculationState.accumulatedMonthFen = accumulatedMonthFen;

  const leapInfo = lunar.getMonth() < 0 ? `闰 ${Math.abs(lunar.getMonth())} 月` : "平月";
  
  const currentLunarDay = lunar.getDay();
  let isBigMonth = false;
  if (currentLunarDay === 30) {
    isBigMonth = true;
  } else {
    const daysToCheck = 30 - currentLunarDay;
    const futureDate = lunar.next(daysToCheck);
    isBigMonth = (futureDate.getDay() === 30);
  }
  calculationState.isBigMonth = isBigMonth;
  calculationState.leapInfo = leapInfo;
  
  // Recalculate Hou based on days into term (simplified)
  const daysIntoTerm = Math.floor((date.getTime() - displayTermDate.getTime()) / msPerDay);
  let currentHou = "初候";
  if (daysIntoTerm >= 5 && daysIntoTerm < 10) currentHou = "次候";
  else if (daysIntoTerm >= 10) currentHou = "末候";
  calculationState.currentHou = currentHou;

  const nineRoads = getNineRoads(date);
  const planets = getPlanets(date);
  const eclipse = getEclipseForecast(date, lunar, nineRoads.moonLatitude);
  
  return {
    gregorianDate: date,
    lunarDateStr: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhiYear,
    ganZhiMonth,
    ganZhiDay,
    ganZhiHour,
    solarTerm: {
      name: displayTermName,
      date: displayTermDate,
      description: `Solar Term`
    },
    prevSolarTerm: {
      name: prevJieQiObj.getName(),
      date: new Date(prevJieQiObj.getSolar().toYmdHms()),
      description: ''
    },
    nextSolarTerm: {
      name: nextJieQiObj.getName(),
      date: new Date(nextJieQiObj.getSolar().toYmdHms()),
      description: ''
    },
    pentad: {
      name: wuHou,
      description: "物候",
      index: 1
    },
    hexagram: sovereignHexagram,
    dailyGua,
    sunState,
    moonPhase: lunar.getYueXiang(),
    constellation: lunar.getXiu(),
    zodiac: lunar.getYearShengXiao(),
    timeKeeping: {
      sunrise: sunriseStr,
      sunset: sunsetStr,
      dayLength: `${dayHours}小时 ${dayMins}分`,
      nightLength: `${nightHours}小时 ${nightMins}分`,
      dayFen,
      nightFen,
      dayKe,
      nightKe,
      oneGengFen
    },
    math: {
      dayanNumber: 50,
      tongFa: 3040,
      derivation: "19(章) × 5(五行) × 4(四象) × 8(八卦)",
      shuoShi: 89773, 
      synodicMonthFraction: "29 + 1613/3040",
      ceShi: 1110343,
      tropicalYearFraction: "365 + 743/3040",
      guaDuration: GUA_DURATION,
      yaoDuration: YAO_DURATION
    },
    calculation: calculationState,
    astroReport: {
      nineRoads,
      planets,
      eclipse,
      solarPosition: lunar.getXiu()
    }
  };
};