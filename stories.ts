// Stories for the Wednesday 18 November 2026 poster.
// Every story below was first reported on 18 November 2026 (any time
// zone), verified against the sources listed in README.md. Headlines
// are written in-house, in the poster's own words, and kept short so
// one line fits a 242 px index column at the 5x7 bitmap font's scale 1.
// ASCII capitals only: the font has no lowercase, no euro sign, no
// em dash. Counts: 6 hero stories + 104 index stories = 110 total.

export interface Hero {
  tag: string;
  color: [number, number, number];
  headline: string;
  summary: string;
  icon: 'drone' | 'bridge' | 'summit' | 'voyager' | 'chip' | 'cyclone';
}

export const HEROES: Hero[] = [
  {
    tag: 'MIDDLE EAST',
    color: [176, 58, 46],
    headline: 'IRAN DRONES HIT US BASES IN KUWAIT AND BAHRAIN',
    summary: "TEHRAN HITS A US BASE IN KUWAIT; BAHRAIN INTERCEPTS MORE DRONE RAIDS",
    icon: 'drone',
  },
  {
    tag: 'UKRAINE WAR',
    color: [46, 94, 140],
    headline: 'KERCH BRIDGE ROAD ARCH FALLS INTO THE SEA',
    summary: "UKRAINE'S STRIKES DROP A 227M ROAD SPAN; RAIL STANDS, ROAD CLOSED",
    icon: 'bridge',
  },
  {
    tag: 'SUMMIT EVE',
    color: [15, 118, 110],
    headline: 'XI MEETS PUTIN IN SHENZHEN AS TRUMP FLIES IN',
    summary: 'THE THREE LEADERS MEET THURSDAY; TRADE, UKRAINE AND ARMS ON THE TABLE',
    icon: 'summit',
  },
  {
    tag: 'SPACE',
    color: [109, 40, 217],
    headline: 'VOYAGER 1 REACHES ONE LIGHT-DAY FROM EARTH',
    summary: 'SIGNALS NOW TAKE 24 HOURS EACH WAY; THE FARTHEST HUMAN OBJECT EVER',
    icon: 'voyager',
  },
  {
    tag: 'BUSINESS',
    color: [180, 83, 9],
    headline: 'NVIDIA POSTS A RECORD $115.8BN QUARTER',
    summary: 'REVENUE DOUBLES TO $115.8BN AND GUIDES $130BN; BOARD BARS HUANG',
    icon: 'chip',
  },
  {
    tag: 'WEATHER',
    color: [3, 105, 161],
    headline: "CYCLONE AKVAN BEARS DOWN ON INDIA'S COAST",
    summary: 'SEVERE STORM, WINDS TO 110 KMPH, HEADS FOR ANDHRA PRADESH AND ODISHA',
    icon: 'cyclone',
  },
];

export interface Section {
  title: string;
  color: [number, number, number];
  items: string[];
}

// Four index columns, each a list of sections. Column totals:
// 24 + 30 + 20 + 30 = 104 index stories.
export const COLUMNS: Section[][] = [
  [
    {
      title: 'MIDDLE EAST + GULF',
      color: [176, 58, 46],
      items: [
        'US STRIKES QESHM MISSILE SITE',
        'IRAN SAYS IT DOWNED A US DRONE',
        'HOUTHIS HIT SAUDI PIPELINE SITES',
        'BOARD OF PEACE FAULTS BOTH SIDES',
        'GAZA COLD KILLS IN TENTS',
        '950,000 GAZANS ON FLOOD GROUND',
        'UK SANCTIONS 8 SETTLEMENT FIRMS',
        'ISRAEL VOWS UK RETALIATION',
        'KAHANA ELECTED KNESSET SPEAKER',
        '3RD US CARRIER JOINS THE GULF',
        'BAHRAIN SOUNDS ALL-CLEAR TWICE',
        'KUWAIT AIR DEFENCE ENGAGES DRONES',
      ],
    },
    {
      title: 'AFRICA',
      color: [120, 90, 20],
      items: [
        'EBOLA IN DRC TOPS 11,000 CASES',
        '7 IN 10 YOUNG EBOLA PATIENTS DIE',
        'ETHIOPIA-ERITREA TROOPS MASS',
        'MSF: EBOLA FUNDS GOING MISSING',
      ],
    },
    {
      title: 'SCIENCE + CULTURE',
      color: [109, 40, 217],
      items: [
        'WORD OF THE YEAR: HUMAN',
        'OXFORD WORD SHORTLIST REVEALED',
        'VOYAGER 2 DUE ONE LIGHT-DAY 2035',
        'NASA: SEND A LIGHT SIGNAL TONIGHT',
      ],
    },
  ],
  [
    {
      title: 'EUROPE + UKRAINE',
      color: [46, 94, 140],
      items: [
        'PUTIN NOT READY FOR PEACE TALKS',
        'EU PROPOSES EUR45BN UKRAINE LOAN',
        'RUSSIA TO DOUBLE DRONES TO 20M',
        'PISTORIUS REBUKES COLBY ON STRIKES',
        'BRIDGE STRIKE BYPASSED STARLINK',
        'THIRD BRIDGE ATTACK THIS WEEK',
        'BRIDGE DEBRIS BLOCKS SHIPPING',
        'UKRAINE HITS WARSHIP OFF FINLAND',
        'DNIPRO DRONE RAID INJURES SIX',
        '8,000 HOAX BOMB THREATS IN EUROPE',
        'LAMMY: PLEDGE EU REJOIN, THEN VOTE',
        'US SPY SUSPECT IN US CUSTODY',
        'COP31 DEADLOCK AS MINISTERS ARRIVE',
        'ANTALYA AI PLEDGE WINS 80 BACKERS',
        'TURKEY POWER PLAN BACKED BY 75',
        'DEUTSCHE BANK -6% ON EPSTEIN LINKS',
        'AN-12 CRASH IN SIBERIA KILLS 19',
        'E1 BUILDING DEALS DELAYED',
        'IPCC DATE SPLIT: 2028 PUSH',
        'COP31: SLOW FIRST HALF, TOUGH WEEK',
        'NATO UNVEILS NEW COMMS STRATEGY',
        'EU LOAN NEEDS ALL 27 TO AGREE',
      ],
    },
    {
      title: 'SPORT',
      color: [15, 118, 110],
      items: [
        'USA 8-0 IN POCHETTINO FAREWELL',
        'ARGENTINA THRASH COSTA RICA 7-0',
        'ENGLAND WIN ODI SERIES IN AUSTRALIA',
        'ECUADOR BEAT BOLIVIA 2-0',
        'URUGUAY ROUT DOMINICAN REP 5-0',
        'GULER SIGNS REAL DEAL TO 2032',
        'SABADELL WIN 3-0 IN COPA DEL REY',
        'UNITED KURUNG WIN 2-1 IN ARUNACHAL',
      ],
    },
  ],
  [
    {
      title: 'ASIA-PACIFIC',
      color: [15, 118, 110],
      items: [
        'QUAD MEETS IN MANILA, FIRST IN 2 YRS',
        'TRUMP CLAIMS BIG PHILIPPINES DEAL',
        'MANILA: NO DEAL SIGNED, NO TERMS',
        'US-THAI TRADE STATEMENT SIGNED',
        'ASEAN ENDS; SINGAPORE TAKES CHAIR',
        'XI GREETS TRUMP ON THE TARMAC',
        'CARNEY TO MEET TRUMP AT APEC',
        'SEOUL WARMS TIES WITH BEIJING',
        'TAIWAN LOGS 10 PLA SORTIES',
        'MYANMAR REVIEWS ASEAN TIES',
        'RUSSIAN JETS OFF TAIWAN, JAPAN',
        'CHITWAN RHINOS WIN NPL BY 61 RUNS',
        'PUDUCHERRY BEAT ASSAM BY 61 RUNS',
        '300 FISHING NETS BURNT IN PRAKASAM',
        'UAE BULLS WIN ABU DHABI T10',
        'INDONESIA U-17S WIN QUALIFIER',
      ],
    },
    {
      title: 'MARKETS',
      color: [180, 83, 9],
      items: [
        'OIL EASES TO $83 A BARREL',
        'NIKKEI ENDS UP 0.37% AT 59,076',
        'BIST-100 SLIDES 1.53%',
        'VERA RUBIN RAMP: $20BN IN Q1',
      ],
    },
  ],
  [
    {
      title: 'AMERICAS',
      color: [176, 58, 46],
      items: [
        'PELTOLA FLIPS ALASKA; DEMS 56-44',
        'FED MINUTES: MORE HIKES LIKELY',
        'WALLER URGES 50BP DECEMBER HIKE',
        'DANSKE: 3 MORE HIKES BY MARCH',
        'ANTHROPIC IPO PRICES AT $83',
        'STOCKS SPLIT: DOW -1.1%, NASDAQ UP',
        'S&P 500 FALLS 5TH STRAIGHT DAY',
        'NVIDIA BOARD REJECTS HUANG RETURN',
        'HUANG TO FACE SENATE BANKING PANEL',
        'SENATE PLANS AI SAFETY HEARINGS',
        'AI MODELS MISTOOK CIVILIANS',
        'CRITICAL JAVA FLAW FOUND BY AI',
        'NSA OUTAGE: RUBIO SEES NO LINK',
        'US LOSES MEASLES-FREE STATUS',
        'KENNEDY VOWS TO REGAIN STATUS',
        'ICE: NO SHIPS FOR DEPORTATIONS',
        'NEW JERSEY SUES DHS OVER DETENTION',
        'GARCIA TARGETS TRUMP JR, VANCE',
        'KALSHI HALTS MENTION MARKETS',
        'STUDENTS SUE OVER AI GUN DETECTOR',
        'COOK SNUBS DEC 14 FED HEARING',
        'FDA NOMINEE OVERTON DROPPED',
        'FAA HALTS ROUTER INSTALLATIONS',
        'DUFFY SEEKS $50.1BN FOR AIR TRAFFIC',
        'MULLIN DEFENDS PLANE TRIP TO GAME',
        'HEGSETH NAMES NEW ARMY CHIEF',
        'IRS PROBES LEFT-WING GROUPS',
        'TRUMP BBC DEPOSITION MOVED TO JAN 22',
        'FLU KILLS 5 CHILDREN THIS SEASON',
        'TJX JUMPS 8% ON RESULTS',
        'HOME SALES FALL TO RECORD LOW',
        'GOLD SLIDES 3% TO $3,736',
        'DOLLAR HITS 19-MONTH HIGH',
        'CHINA LEADS TREASURY SELL-OFF',
      ],
    },
  ],
];

export interface TimelineEvent {
  time: string;
  label: string;
}

// All times UTC, Wednesday 18 November 2026.
export const TIMELINE: TimelineEvent[] = [
  { time: '00:16', label: 'BAHRAIN INTERCEPTS DRONES' },
  { time: '09:00', label: 'AKVAN NOW SEVERE STORM' },
  { time: '10:16', label: 'VOYAGER 1: ONE LIGHT-DAY' },
  { time: '10:30', label: 'EU PROPOSES EUR45BN LOAN' },
  { time: '13:29', label: 'IRAN HITS US BASE IN KUWAIT' },
  { time: '17:36', label: 'KERCH COLLAPSE CONFIRMED' },
  { time: '19:00', label: 'FED MINUTES: MORE HIKES' },
  { time: '21:26', label: 'ANTHROPIC IPO PRICES $83' },
];

export const STORY_COUNT = 110;

export const SOURCES =
  'REUTERS AP BBC NYT WSJ AL JAZEERA UN NEWS IMD NASA ANTHROPIC NVIDIA FCDO PAHO';
