
import { Solar, Lunar, LunarUtil } from 'lunar-typescript';
import SunCalc from 'suncalc';
import * as Astronomy from 'astronomy-engine';
import { DayanDateInfo, Hexagram, SunState, DailyGua, AstronomicalReport, PlanetStatus, EclipseForecast, NineRoadsStatus, BaZiFull, PillarInfo } from '../types';

// Chang'an (Xi'an) Coordinates - The heart of Dayan Li observations
const CHANG_AN_LAT = 34.2667;
const CHANG_AN_LNG = 108.9333;

// Constants defined in Dayan Li (Tang Dynasty)
const TONG_FA = 3040; // The Common Denominator (One Day)
const CE_SHI = 1110343; // Tropical Year in Fen (Numerator) -> 365.2444 days
const SHUO_SHI = 89773; // Synodic Month in Fen (Numerator) -> 29.53059 days
const QI_CE = 46264; // Solar Term in Fen

// GUA QI CONSTANTS
const GUA_DURATION = 18493; 
const YAO_DURATION = 3082;

// DAYAN LI ASTRONOMICAL CONSTANTS
// The "Heavenly Circumference" (Zhou Tian) in Dayan Li is 365.25 Du.
const CIRCLE_DU = 365.25;

// Winter Solstice (Dong Zhi) Anchor in Dayan Li:
// "The Sun resides in Dou Xiu (Dipper), 9 Du." (冬至日在斗九度)
const DONG_ZHI_DOU_OFFSET = 9; 

// --- 28 MANSIONS DATA (Tang Dynasty / Kaiyuan Zhanjing) ---
// Widths are in Chinese Du (Degrees). Sum is 365.25 approx in reality, but historically integers often sum to 365.
// Dayan Li uses 365.25 circumference.
const MANSIONS = [
  // EAST (Blue Dragon)
  { name: '角', width: 12 }, 
  { name: '亢', width: 9 }, 
  { name: '氐', width: 15 }, 
  { name: '房', width: 5 }, 
  { name: '心', width: 5 }, 
  { name: '尾', width: 18 }, 
  { name: '箕', width: 11 },
  // NORTH (Black Tortoise)
  { name: '斗', width: 26 }, // Winter Solstice at 9th Du
  { name: '牛', width: 8 }, 
  { name: '女', width: 12 }, 
  { name: '虚', width: 10 }, 
  { name: '危', width: 17 }, 
  { name: '室', width: 16 }, 
  { name: '壁', width: 9 },
  // WEST (White Tiger)
  { name: '奎', width: 16 }, 
  { name: '娄', width: 12 }, 
  { name: '胃', width: 14 }, 
  { name: '昴', width: 11 }, 
  { name: '毕', width: 17 }, 
  { name: '觜', width: 1 }, 
  { name: '参', width: 10 },
  // SOUTH (Vermilion Bird)
  { name: '井', width: 33 }, 
  { name: '鬼', width: 3 }, 
  { name: '柳', width: 15 }, 
  { name: '星', width: 7 }, 
  { name: '张', width: 18 }, 
  { name: '翼', width: 18 }, 
  { name: '轸', width: 17 }
];

// Calculate absolute starting positions on the ring (0 to 365.25)
// We need to map the 365 integer sum to 365.25 scale?
// Actually, in Dayan Li, the degrees were "Du".
// We will simply sum them up.
let MANSION_STARTS: number[] = [];
let cursor = 0;
MANSIONS.forEach(m => {
  MANSION_STARTS.push(cursor);
  cursor += m.width;
});
// Dou is the 8th mansion (index 7).
const DOU_START_POS = MANSION_STARTS[7]; // 75

// Winter Solstice Anchor on Dayan Ring:
// Dou Start (75) + 9 = 84.
const DONG_ZHI_RING_POS = DOU_START_POS + DONG_ZHI_DOU_OFFSET;

// --- HEXAGRAM DATA ---
const MONTH_HEXAGRAMS: Record<number, string> = {
  11: 'fu', 12: 'lin', 1: 'tai', 2: 'dazhuang', 
  3: 'guai', 4: 'qian', 5: 'gou', 6: 'dun', 
  7: 'pi', 8: 'guan', 9: 'bo', 10: 'kun'
};

const HEXAGRAM_DATA: Record<string, Hexagram> = {
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
  'weiji': { name: '未济', symbol: '䷿', binary: '010101', nature: '火水', description: '亨，小狐汔济，濡其尾。' },
  'meng': { name: '蒙', symbol: '䷃', binary: '100001', nature: '山水', description: '亨。匪我求童蒙，童蒙求我。' },
  'xu': { name: '需', symbol: '䷄', binary: '010111', nature: '水天', description: '有孚，光亨，贞吉。' },
  'song': { name: '讼', symbol: '䷅', binary: '010111', nature: '天水', description: '有孚，窒。惕中吉。' },
  'shi': { name: '师', symbol: '䷆', binary: '000010', nature: '地水', description: '贞，丈人，吉无咎。' },
  'default': { name: '未济', symbol: '䷿', binary: '010101', nature: '火水', description: '亨，小狐汔济，濡其尾。' }
};

const TERMS_ORDER = [
  '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
  '春分', '清明', '谷雨', '立夏', '小满', '芒种',
  '夏至', '小暑', '大暑', '立秋', '处暑', '白露',
  '秋分', '寒露', '霜降', '立冬', '小雪', '大雪'
];

const YAO_EXPLANATIONS: Record<string, string[]> = {
  'qian': [
    '初九：潜龙勿用。', '九二：见龙在田，利见大人。', '九三：君子终日乾乾，夕惕若厉，无咎。',
    '九四：或跃在渊，无咎。', '九五：飞龙在天，利见大人。', '上九：亢龙有悔。'
  ],
  'kun': [
    '初六：履霜，坚冰至。', '六二：直方大，不习无不利。', '六三：含章可贞。',
    '六四：括囊，无咎无誉。', '六五：黄裳，元吉。', '上六：龙战于野，其血玄黄。'
  ],
  'zhongfu': [
    '初九：虞吉，有它不燕。', '九二：鸣鹤在阴，其子和之。', '六三：得敌，或鼓或罢。',
    '六四：月几望，马匹亡。', '九五：有孚挛如，无咎。', '上九：翰音登于天，贞凶。'
  ],
  'fu': [
    '初九：不远复，无祗悔。', '六二：休复，吉。', '六三：频复，厉，无咎。',
    '六四：中行独复。', '六五：敦复，无悔。', '上六：迷复，凶。'
  ]
};

const getLineInterpretation = (guaKey: string, yaoIndex: number, isYong: boolean, isYang: boolean): { text: string, significance: string } => {
  if (isYong) {
    const desc = isYang 
        ? "天德不可为首。阳极变动，群龙无首，吉。" 
        : "地德守正。阴极利贞，顺承天道。";
    return { text: desc, significance: isYang ? "吉/变" : "利/贞" };
  }
  if (YAO_EXPLANATIONS[guaKey] && YAO_EXPLANATIONS[guaKey][yaoIndex]) {
    return { text: YAO_EXPLANATIONS[guaKey][yaoIndex], significance: "爻辞" };
  }
  return { text: "时运变迁，居安思危。", significance: "运势" };
};

const GUA_SEQUENCE: string[] = [
  'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', 'meng', 'xu', 'song', 'shi',
  'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', 'zhongfu', 'fu', 'zhun', 'yi', 'zhen', 'shike', 'sui', 'wuwang', 'mingyi', 'bi', 'jiji', 'jiaren', 'feng', 'ge', 'tongren',
  'lin', 'sun', 'jie', 'zhongfu', 'fu', 'zhun', 'yi'
];

const getDailyGuaAdvanced = (date: Date, calculation: { accumulatedYearFen: number }): DailyGua => {
  const totalFen = calculation.accumulatedYearFen;
  const guaIndex = Math.floor(totalFen / GUA_DURATION) % 60;
  const guaKey = GUA_SEQUENCE[guaIndex] || 'default';
  
  const fenIntoGua = totalFen % GUA_DURATION;
  const daysIntoGua = Math.floor(fenIntoGua / TONG_FA);
  
  let yaoIndex = Math.floor(fenIntoGua / YAO_DURATION);
  let isYong = false;
  let currentFenInYao = fenIntoGua % YAO_DURATION;

  if (fenIntoGua >= 6 * YAO_DURATION) {
     yaoIndex = 6;
     isYong = true;
     currentFenInYao = fenIntoGua - (6 * YAO_DURATION);
  }

  const hexData = HEXAGRAM_DATA[guaKey] || HEXAGRAM_DATA['default'];
  const binary = hexData.binary;
  
  const yangCount = binary.split('1').length - 1;
  const isYang = isYong ? (yangCount >= 3) : (binary[yaoIndex] === '1');

  let yaoName = "";
  const positionNames = ["初", "二", "三", "四", "五", "上"];
  
  if (isYong) {
    yaoName = isYang ? "用九" : "用六";
  } else {
    const valName = isYang ? "九" : "六";
    if (yaoIndex === 0) yaoName = `初${valName}`;
    else if (yaoIndex === 5) yaoName = `上${valName}`;
    else yaoName = `${valName}${positionNames[yaoIndex]}`;
  }

  const interpretation = getLineInterpretation(guaKey, yaoIndex, isYong, isYang);

  return {
    ...hexData,
    isDutyGua: true,
    guaQi: {
      guaIndex,
      daysIntoGua,
      fenIntoGua,
      yaoIndex: yaoIndex + 1,
      yaoName,
      yaoText: interpretation.text,
      significance: interpretation.significance,
      isYong,
      currentFenInYao,
      totalFenInYao: isYong ? (GUA_DURATION - 6 * YAO_DURATION) : YAO_DURATION
    },
    yao: yaoName,
    yaoIndex: yaoIndex + 1
  };
};

const calculateSunState = (jieQiName: string): SunState => {
  const index = TERMS_ORDER.indexOf(jieQiName);
  if (index >= 0 && index <= 5) {
    return { stage: '盈初', description: '冬至后，阳气渐长，日行渐速（近日点）。积盈日增。', solarLongitude: index * 15 + 270 };
  } else if (index >= 6 && index <= 11) {
    return { stage: '盈末', description: '春分后，日行仍速，但积盈增长减缓。', solarLongitude: (index - 6) * 15 };
  } else if (index >= 12 && index <= 17) {
    return { stage: '缩初', description: '夏至后，阴气始生，日行渐迟（远日点）。积缩日增。', solarLongitude: (index - 12) * 15 + 90 };
  } else {
    return { stage: '缩末', description: '秋分后，日行仍迟，但积缩增长减缓。', solarLongitude: (index - 18) * 15 + 180 };
  }
};

const formatTimeUTC8 = (date: Date) => {
  if (!date || isNaN(date.getTime())) return "--:--";
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai'
    }).format(date);
  } catch (e) {
    return "00:00";
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

// --- BA ZI CALCULATION ---
const getBaZiFull = (lunar: Lunar): BaZiFull => {
  const eightChar = lunar.getEightChar();
  eightChar.setSect(1);
  
  const getPillar = (gan: string, zhi: string, naYin: string, xunKong: string, shiShenGan: string, shiShenZhi: string[], cangGan: string[]): PillarInfo => ({
    ganZhi: `${gan}${zhi}`, gan, zhi, naYin,
    wuXing: `${LunarUtil.WU_XING_GAN[gan]}${LunarUtil.WU_XING_ZHI[zhi]}`,
    xunKong, shenSha: [], shiShenGan, shiShenZhi, cangGan
  });

  const yearPillar = getPillar(eightChar.getYearGan(), eightChar.getYearZhi(), eightChar.getYearNaYin(), eightChar.getYearXunKong(), eightChar.getYearShiShenGan(), eightChar.getYearShiShenZhi(), eightChar.getYearHideGan());
  const monthPillar = getPillar(eightChar.getMonthGan(), eightChar.getMonthZhi(), eightChar.getMonthNaYin(), eightChar.getMonthXunKong(), eightChar.getMonthShiShenGan(), eightChar.getMonthShiShenZhi(), eightChar.getMonthHideGan());
  const dayPillar = getPillar(eightChar.getDayGan(), eightChar.getDayZhi(), eightChar.getDayNaYin(), eightChar.getDayXunKong(), "日主", eightChar.getDayShiShenZhi(), eightChar.getDayHideGan());
  const hourPillar = getPillar(eightChar.getTimeGan(), eightChar.getTimeZhi(), eightChar.getTimeNaYin(), eightChar.getTimeXunKong(), eightChar.getTimeShiShenGan(), eightChar.getTimeShiShenZhi(), eightChar.getTimeHideGan());

  const wuXingMap: Record<string, number> = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  const addWx = (wx: string) => { if (wuXingMap.hasOwnProperty(wx)) wuXingMap[wx]++; };
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
     addWx(LunarUtil.WU_XING_GAN[p.gan]);
     addWx(LunarUtil.WU_XING_ZHI[p.zhi]);
  });
  
  return {
    year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar,
    dayMaster: eightChar.getDayGan(),
    wuXingCount: Object.entries(wuXingMap).filter(([_, c]) => c > 0).map(([k, v]) => `${v}${k}`).join(" "),
    mingGong: eightChar.getMingGong(), taiYuan: eightChar.getTaiYuan()
  };
};

// --- ASTRONOMICAL CALCULATIONS (HIGH PRECISION - ASTRONOMY ENGINE) ---

/**
 * Maps a Tropical Ecliptic Longitude (0-360) to the Dayan Li Mansion Grid.
 * The Dayan Li grid is anchored at Winter Solstice = Dou 9 Du.
 * In Tropical Zodiac, Winter Solstice is exactly 270 degrees.
 * 
 * Algorithm:
 * 1. Calculate offset from Winter Solstice (270).
 * 2. Apply this offset to the Dayan Anchor (Dou 9).
 * 3. Find the Mansion.
 * 
 * Note: We scale 360 geometric degrees to 365.25 Chinese Du for historical flavor
 * if we want strictly "Du", or we just use geometric degrees for the "Position" string.
 * Let's use 365.25 scaling for the "Du" display to be consistent with the 28 mansions sum.
 */
const getMansionFromEcliptic = (eclipticLong: number): string => {
  // Normalize to 0-360
  let long = (eclipticLong % 360 + 360) % 360;
  
  // Calculate offset from Winter Solstice (270)
  // Distance from 270. (e.g. 271 is +1 degree)
  let offsetFromWS = long - 270;
  if (offsetFromWS < 0) offsetFromWS += 360;

  // Scale: 360 degrees = 365.25 Du
  const scaleFactor = 365.25 / 360;
  const offsetDu = offsetFromWS * scaleFactor;

  // Apply to Dayan Anchor (Winter Solstice is at 84 Du on the ring)
  // Ring: Jiao=0 ... Dou=75 ... Dou9=84
  let targetDu = (DONG_ZHI_RING_POS + offsetDu) % CIRCLE_DU;

  // Find Mansion
  let foundMansion = MANSIONS[0];
  let relativeDu = targetDu;

  for (let i = 0; i < MANSIONS.length; i++) {
    const start = MANSION_STARTS[i];
    const width = MANSIONS[i].width;
    
    if (targetDu >= start && targetDu < (start + width)) {
       foundMansion = MANSIONS[i];
       relativeDu = targetDu - start;
       break;
    }
  }

  // Edge case for end of ring
  if (targetDu >= 365) {
     foundMansion = MANSIONS[MANSIONS.length - 1]; 
     relativeDu = targetDu - MANSION_STARTS[MANSION_STARTS.length - 1];
  }

  return `${foundMansion.name}宿 ${relativeDu.toFixed(1)} 度`;
};

const getPreciseCelestialPositions = (date: Date) => {
  const astroTime = Astronomy.MakeTime(date);
  
  // Sun Position (Geocentric Ecliptic)
  // Astronomy.SunPosition returns Equatorial. Use GeoVector + Ecliptic for Zodiac.
  const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, true);
  const sunEcl = Astronomy.Ecliptic(sunVec);
  
  // Moon Position
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true);
  const moonEcl = Astronomy.Ecliptic(moonVec);
  
  return {
    sunEcLong: sunEcl.elon,
    moonEcLong: moonEcl.elon,
    moonLat: moonEcl.elat,
    sunMansion: getMansionFromEcliptic(sunEcl.elon),
    moonMansion: getMansionFromEcliptic(moonEcl.elon)
  };
};

const getNineRoads = (moonLat: number): NineRoadsStatus => {
  // Moon Latitude determines the "Road"
  // Positive = Yin (In), Negative = Yang (Out) relative to ecliptic? 
  // In Chinese astronomy:
  // North of Ecliptic = Yin Dao (Inner/Black?)
  // South of Ecliptic = Yang Dao (Outer/Red?)
  // Actually:
  // Green (Qing) = East, White = West, Red = South, Black = North.
  // The "Nine Roads" are intersections.
  // Simplified logic for display:
  
  let road = '黄道';
  const lat = moonLat;
  
  if (Math.abs(lat) < 0.5) road = '黄道';
  else if (lat > 0) road = '黑道 (北)'; // North of Ecliptic
  else road = '朱道 (南)'; // South of Ecliptic

  return {
    currentRoad: road,
    description: `月行${lat > 0 ? '黄道以北' : '黄道以南'}约 ${Math.abs(lat).toFixed(2)} 度。`,
    moonLatitude: lat
  };
};

const getPlanetsPrecise = (date: Date): PlanetStatus[] => {
  const astroTime = Astronomy.MakeTime(date);
  
  const bodies = [
    { body: Astronomy.Body.Mercury, nameEn: 'Mercury', nameCn: '辰星 (水)' },
    { body: Astronomy.Body.Venus, nameEn: 'Venus', nameCn: '太白 (金)' },
    { body: Astronomy.Body.Mars, nameEn: 'Mars', nameCn: '荧惑 (火)' },
    { body: Astronomy.Body.Jupiter, nameEn: 'Jupiter', nameCn: '岁星 (木)' },
    { body: Astronomy.Body.Saturn, nameEn: 'Saturn', nameCn: '镇星 (土)' },
  ];

  return bodies.map(p => {
    // Geocentric Ecliptic Coordinates
    // Astronomy Engine doesn't have a direct "PlanetPosition" that returns Ecliptic for all.
    // We use Illum or specialized functions. 
    // Actually, Astronomy.Ecliptic(Vector) works.
    
    // Get Heliocentric Vector
    // const helio = Astronomy.HelioVector(p.body, astroTime);
    // We need Geocentric.
    const geoVec = Astronomy.GeoVector(p.body, astroTime, true); // true for aberration correction?
    
    // Convert to Ecliptic
    const eclipticState = Astronomy.Ecliptic(geoVec);
    const long = eclipticState.elon; // 0-360
    
    // Determine Retrograde
    // Compare with position 1 hour later
    // Astronomy.AddDays may not be available on namespace directly in some builds, use Date arithmetic for safety.
    const nextDate = new Date(date.getTime() + 3600000); // 1 hour later
    const timeNext = Astronomy.MakeTime(nextDate);
    const vecNext = Astronomy.GeoVector(p.body, timeNext, true);
    const nextState = Astronomy.Ecliptic(vecNext);
    
    const diff = nextState.elon - long;
    // Handle 360 wrap
    let dLon = diff;
    if (dLon < -180) dLon += 360;
    if (dLon > 180) dLon -= 360;

    let motion = '顺行';
    if (dLon < 0) motion = '逆行';
    if (Math.abs(dLon) < 0.0001) motion = '留'; // Threshold for stationary

    const mansionStr = getMansionFromEcliptic(long);

    return {
      nameEn: p.nameEn,
      nameCn: p.nameCn,
      position: mansionStr,
      ecLong: long,
      motion: motion,
      description: motion === '逆行' ? '退行' : '顺行'
    };
  });
};

const getEclipseForecast = (date: Date, lunar: Lunar, moonLat: number): EclipseForecast => {
    // Placeholder implementation for eclipse forecast
    // A full implementation would require scanning forward in time for solar/lunar eclipses.
    return {
        willOccur: false,
        type: "",
        probability: "无",
        timeStart: "--",
        maxEclipse: "--",
        magnitude: "--",
        corrections: {
            qiCha: "无",
            keCha: "无",
            geoCha: "无"
        }
    };
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
          displayTermDate = new Date(table[displayTermName].toYmdHms().replace(' ', 'T'));
      }
  } else {
      displayTermName = prevJieQiObj.getName();
      displayTermDate = new Date(prevJieQiObj.getSolar().toYmdHms().replace(' ', 'T'));
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
  
  // Gua Qi Calculations
  const daysSinceDongZhi = Math.floor((date.getTime() - prevDongZhi.getTime()) / msPerDay);
  const accumulatedYearFen = (daysSinceDongZhi * TONG_FA) + currentDayFen;
  
  const nextTermFen = (Math.floor(accumulatedYearFen / QI_CE) + 1) * QI_CE;
  const fenToNextTerm = nextTermFen - accumulatedYearFen;

  const calculationState = {
      daysSinceDongZhi,
      accumulatedYearFen,
      daysSinceShuo: 0, 
      accumulatedMonthFen: 0,
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
  
  const daysIntoTerm = Math.floor((date.getTime() - displayTermDate.getTime()) / msPerDay);
  let currentHou = "初候";
  if (daysIntoTerm >= 5 && daysIntoTerm < 10) currentHou = "次候";
  else if (daysIntoTerm >= 10) currentHou = "末候";
  calculationState.currentHou = currentHou;

  // New High Precision Calculations
  const preciseCelestial = getPreciseCelestialPositions(date);
  const nineRoads = getNineRoads(preciseCelestial.moonLat);
  const planets = getPlanetsPrecise(date);
  const eclipse = getEclipseForecast(date, lunar, preciseCelestial.moonLat);
  
  const baZi = getBaZiFull(lunar);

  return {
    gregorianDate: date,
    lunarDateStr: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhiYear, ganZhiMonth, ganZhiDay, ganZhiHour, baZi,
    solarTerm: { name: displayTermName, date: displayTermDate, description: `Solar Term` },
    prevSolarTerm: { name: prevJieQiObj.getName(), date: new Date(prevJieQiObj.getSolar().toYmdHms().replace(' ', 'T')), description: '' },
    nextSolarTerm: { name: nextJieQiObj.getName(), date: new Date(nextJieQiObj.getSolar().toYmdHms().replace(' ', 'T')), description: '' },
    pentad: { name: wuHou, description: "物候", index: 1 },
    hexagram: sovereignHexagram,
    dailyGua,
    sunState,
    moonPhase: lunar.getYueXiang(),
    constellation: preciseCelestial.moonMansion.split(' ')[0], 
    zodiac: lunar.getYearShengXiao(),
    timeKeeping: {
      sunrise: sunriseStr, sunset: sunsetStr, dayLength: `${dayHours}小时 ${dayMins}分`, nightLength: `${nightHours}小时 ${nightMins}分`,
      dayFen, nightFen, dayKe, nightKe, oneGengFen
    },
    math: {
      dayanNumber: 50, tongFa: TONG_FA, derivation: "19(章) × 5(五行) × 4(四象) × 8(八卦)",
      shuoShi: SHUO_SHI, synodicMonthFraction: "29 + 1613/3040",
      ceShi: CE_SHI, tropicalYearFraction: "365 + 743/3040",
      guaDuration: GUA_DURATION, yaoDuration: YAO_DURATION
    },
    calculation: calculationState,
    astroReport: {
      nineRoads,
      planets,
      eclipse,
      sunLocation: preciseCelestial.sunMansion,
      sunEcLong: preciseCelestial.sunEcLong,
      moonLocation: preciseCelestial.moonMansion,
      moonEcLong: preciseCelestial.moonEcLong
    }
  };
};
