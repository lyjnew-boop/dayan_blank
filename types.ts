export interface SolarTerm {
  name: string;
  date: Date;
  description: string;
}

export interface Pentad {
  name: string;
  description: string;
  index: number; // 1-72
}

export interface Hexagram {
  name: string;
  symbol: string; // The hexagram character
  binary: string; // "111111" for Qian
  nature: string; // "Heaven", "Earth", etc.
  description: string;
}

export interface GuaQiState {
  guaIndex: number; // 0-59 (Which of the 60 Za Gua)
  daysIntoGua: number; // For UI display of days passed
  fenIntoGua: number; // Current accumulated Fen inside this Gua duration
  yaoIndex: number; // 1-6 (The line), or 7 for "Yong"
  yaoName: string; // "初九", "九二", or "用九" etc.
  isYong: boolean; // Is it the "Extra Day/Void Day" (The remainder time)
  currentFenInYao: number; // Fen passed in current Yao
  totalFenInYao: number; // Total duration of current Yao (3082)
}

export interface DailyGua extends Hexagram {
  guaQi: GuaQiState;
  isDutyGua: boolean;
  yao: string; // Legacy field for compatibility
  yaoIndex: number; // Legacy field
}

export interface SunState {
  // The 4 stages of Solar Inequality defined in Dayan Li
  stage: string; // '盈初', '盈末', '缩初', '缩末'
  description: string;
  solarLongitude: number;
}

export interface TimeKeeping {
  sunrise: string;
  sunset: string;
  dayLength: string;
  nightLength: string;
  dayFen: number; // Out of 3040
  nightFen: number; // Out of 3040
  dayKe: number; // Out of 100
  nightKe: number; // Out of 100
  oneGengFen: number; // Length of one night watch in Fen
}

export interface DayanMath {
  dayanNumber: number;
  tongFa: number; // 3040
  derivation: string; // "19 x 5 x 4 x 8"
  
  // Month Algorithm
  shuoShi: number; // 89773 Dividend
  synodicMonthFraction: string; // "29 + 1613/3040"
  
  // Year Algorithm
  ceShi: number; // 1110343 Dividend
  tropicalYearFraction: string; // "365 + 743/3040"
  
  // Gua Qi Algorithm
  guaDuration: number; // 18493 Fen (6 days 253 fen)
  yaoDuration: number; // 3082 Fen (1 day 42 fen)
}

export interface CalculationState {
  accumulatedYearFen: number; // Total parts since Winter Solstice
  daysSinceDongZhi: number;
  
  accumulatedMonthFen: number; // Total parts since New Moon
  daysSinceShuo: number;
  
  currentTermName: string;
  nextTermName: string;
  fenToNextTerm: number; // Parts remaining until next term
  
  isBigMonth: boolean; // 30 days vs 29 days
  leapInfo: string; // e.g., "Normal", "Leap Month"
  
  currentHou: string; // Initial, Second, or Final Pentad
}

// --- ASTRONOMICAL TYPES ---

export interface PlanetStatus {
  nameEn: string;
  nameCn: string; // Jin, Mu, Shui, Huo, Tu
  position: string; // Approx constellation/direction
  motion: string; // '顺行', '逆行', '留', '疾'
  description: string;
}

export interface EclipseForecast {
  willOccur: boolean;
  type: string; // '日食', '月食'
  probability: string;
  timeStart: string; // Ke time
  maxEclipse: string; // Ke time
  magnitude: string; // "San Fen" (30%)
  corrections: {
    qiCha: string; // Season correction
    keCha: string; // Time correction
    geoCha: string; // Location correction
  }
}

export interface NineRoadsStatus {
  currentRoad: string; // '黄道', '青道', etc.
  description: string;
  moonLatitude: number; // Degrees from Ecliptic
}

export interface AstronomicalReport {
  nineRoads: NineRoadsStatus;
  planets: PlanetStatus[];
  eclipse: EclipseForecast;
  solarPosition: string; // Xiu (Mansion)
}

export interface DayanDateInfo {
  gregorianDate: Date;
  lunarDateStr: string;
  
  // GanZhi (Four Pillars)
  ganZhiYear: string;
  ganZhiMonth: string;
  ganZhiDay: string;
  ganZhiHour: string;

  // Chapter 1: Zhong Shuo (Terms)
  solarTerm: SolarTerm;
  prevSolarTerm: SolarTerm;
  nextSolarTerm: SolarTerm;

  // Chapter 2: Fa Lian (Phenomena & Gua)
  pentad: Pentad;
  hexagram: Hexagram; // The Monthly Sovereign Hexagram (Pi Gua)
  dailyGua: DailyGua; // The specific Day Hexagram (Za Gua)
  
  // Chapter 3: Ri Chan (Sun Orbit)
  sunState: SunState;

  // Chapter 4: Yue Li (Moon Orbit)
  moonPhase: string;
  constellation: string; // 28 Mansions
  zodiac: string;

  // Chapter 5: Gui Lou (Clepsydra/Time)
  timeKeeping: TimeKeeping;

  // Constants & Math
  math: DayanMath;
  
  // Simulation State
  calculation: CalculationState;

  // Royal Astronomical Report
  astroReport: AstronomicalReport;
}