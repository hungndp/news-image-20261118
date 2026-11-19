// Stories for the Wednesday 18 November 2026 poster, v2.1.
// Every story below happened, or was first reported, on 18 November
// 2026 (any time zone), checked against the sources listed in
// README.md. Headlines are the poster's own wording, kept short so a
// numbered line fits a 242 px index column in the 5x7 font at scale 1.
// ASCII capitals only: the font has no lowercase and no em dash.
// Counts: 8 lead stories + 126 index stories = 134 in all.

export type Glyph =
  | 'drone'
  | 'bridge'
  | 'summit'
  | 'voyager'
  | 'chip'
  | 'storm'
  | 'pad'
  | 'bat';

export interface Lead {
  kicker: string;
  hue: [number, number, number];
  head: string;
  deck: string;
  glyph: Glyph;
}

export const LEADS: Lead[] = [
  {
    kicker: 'MIDDLE EAST',
    hue: [176, 58, 46],
    head: 'IRAN DRONES HIT US GULF BASES',
    deck: 'TEHRAN HITS KUWAIT BASE; BAHRAIN STOPS MORE RAIDS',
    glyph: 'drone',
  },
  {
    kicker: 'UKRAINE WAR',
    hue: [46, 94, 140],
    head: 'KERCH BRIDGE SPAN FALLS IN SEA',
    deck: 'UKRAINE DROPS 227M SPAN; RAIL STANDS, ROAD SHUT',
    glyph: 'bridge',
  },
  {
    kicker: 'SUMMIT EVE',
    hue: [15, 118, 110],
    head: 'XI AND PUTIN MEET IN SHENZHEN',
    deck: 'THREE LEADERS MEET THURSDAY; TRADE ON THE TABLE',
    glyph: 'summit',
  },
  {
    kicker: 'SPACE',
    hue: [109, 40, 217],
    head: 'VOYAGER 1: ONE LIGHT-DAY OUT',
    deck: 'SIGNALS TAKE 24 HOURS EACH WAY; FARTHEST EVER',
    glyph: 'voyager',
  },
  {
    kicker: 'BUSINESS',
    hue: [180, 83, 9],
    head: 'NVIDIA POSTS RECORD $115.8BN',
    deck: 'REVENUE DOUBLES; GUIDES $130BN; BOARD BARS HUANG',
    glyph: 'chip',
  },
  {
    kicker: 'WEATHER',
    hue: [3, 105, 161],
    head: 'CYCLONE AKVAN NEARS INDIA',
    deck: 'WINDS TO 110 KMPH HEAD FOR ANDHRA AND ODISHA',
    glyph: 'storm',
  },
  {
    kicker: 'CULTURE',
    hue: [190, 40, 90],
    head: 'GTA VI ROLLS OUT WORLDWIDE',
    deck: 'GAMERS ENTER VICE CITY AS GLOBAL ROLLOUT BEGINS',
    glyph: 'pad',
  },
  {
    kicker: 'SPORT',
    hue: [34, 120, 60],
    head: 'DHONI RETIRES FROM THE IPL',
    deck: 'INDIA GREAT ENDS IPL CAREER; FANS SAY FAREWELL',
    glyph: 'bat',
  },
];

export interface Block {
  name: string;
  hue: [number, number, number];
  lines: string[];
}

// Four index columns, each a list of blocks. Column totals:
// 23 + 38 + 27 + 38 = 126 index stories.
export const GRID: Block[][] = [
  [
    {
      name: 'MIDDLE EAST + GULF',
      hue: [176, 58, 46],
      lines: [
        'US JETS HIT QESHM LAUNCH SITE',
        'TEHRAN CLAIMS A US DRONE DOWNED',
        'HOUTHIS STRIKE SAUDI PIPELINES',
        'PEACE BOARD BLAMES BOTH SIDES',
        'GAZA COLD KILLS CAMP FAMILIES',
        '950,000 GAZANS FACE FLOOD RISK',
        'BRITAIN SANCTIONS 8 SETTLER FIRMS',
        'ISRAEL VOWS TO HIT BACK AT UK',
        'KAHANA WINS KNESSET SPEAKER VOTE',
        'THIRD US CARRIER SAILS TO GULF',
        'BAHRAIN GIVES ALL-CLEAR TWICE',
        'KUWAIT GUNS ENGAGE THE DRONES',
        'TANKER TARA GAS HIT, SAILOR LOST',
        'KATAIB HEZBOLLAH TOLD TO QUIT TOWN',
      ],
    },
    {
      name: 'AFRICA',
      hue: [120, 90, 20],
      lines: [
        'DRC EBOLA CASES PASS 11,000',
        'EBOLA KILLS 7 IN 10 YOUNG CASES',
        'TROOPS MASS ON ETHIOPIA BORDER',
        'MSF WARNS EBOLA CASH VANISHING',
        'SUDAN-ETHIOPIA TENSIONS ESCALATE',
      ],
    },
    {
      name: 'SCIENCE + CULTURE',
      hue: [109, 40, 217],
      lines: [
        'WORD OF THE YEAR IS HUMAN',
        'OXFORD UNVEILS WORD SHORTLIST',
        'VOYAGER 2 HITS MARK IN 2035',
        'NASA URGES LIGHT SIGNAL TONIGHT',
      ],
    },
  ],
  [
    {
      name: 'EUROPE + UKRAINE',
      hue: [46, 94, 140],
      lines: [
        'PUTIN NOT READY TO TALK PEACE',
        'EU PITCHES EUR45BN KYIV LOAN',
        'RUSSIA PLANS 20M DRONES A YEAR',
        'PISTORIUS SLAPS DOWN COLBY',
        'BRIDGE RAID DODGED STARLINK',
        'THIRD BRIDGE RAID IN A WEEK',
        'WRECKAGE BLOCKS KERCH SHIPPING',
        'KYIV HITS WARSHIP OFF FINLAND',
        'DNIPRO DRONE RAID WOUNDS SIX',
        '8,000 HOAX BOMB SCARES IN EU',
        'LAMMY: VOW REJOIN, THEN VOTE',
        'SUSPECTED US SPY HELD IN US',
        'COP31 STUCK AS MINISTERS LAND',
        'ANTALYA AI PLEDGE GETS 80 BACKERS',
        'TURKEY ENERGY PLAN WINS 75 VOTES',
        'DEUTSCHE BANK -6% ON EPSTEIN TIES',
        'AN-12 CRASH KILLS 19 IN SIBERIA',
        'E1 BUILDING DEALS PUSHED BACK',
        'IPCC SPLIT OVER 2028 DATE',
        'COP31: SLOW START, HARD WEEK',
        'NATO ROLLS OUT COMMS STRATEGY',
        'KYIV LOAN NEEDS ALL 27 IN EU',
        'RUSSIA SAYS 1,400 DRONES DOWNED',
        '141 RUSSIAN DRONES OVERNIGHT',
        'BURNHAM: BREXIT HAS NOT WORKED',
      ],
    },
    {
      name: 'SPORT',
      hue: [15, 118, 110],
      lines: [
        'USA WIN 8-0 IN POCH FAREWELL',
        'ARGENTINA ROUT COSTA RICA 7-0',
        'ENGLAND TAKE ODI SERIES IN AUS',
        'ECUADOR DOWN BOLIVIA 2-0',
        'URUGUAY THRASH DOMINICAN REP 5-0',
        'GULER EXTENDS REAL DEAL TO 2032',
        'SABADELL WIN 3-0 IN COPA',
        'KURUNG WIN 2-1 IN ARUNACHAL',
        'NZ 236-5 IN INDIA TEST OPENER',
        'MEXICO EDGE JAMAICA 1-0',
        'BRAZIL ROUT SINGAPORE 7-0',
        'DUCKETT 133 SEALS ODI SERIES',
        'YAS LIONS WIN ABU DHABI T10',
      ],
    },
  ],
  [
    {
      name: 'ASIA-PACIFIC',
      hue: [15, 118, 110],
      lines: [
        'QUAD MEETS IN MANILA AFTER 2 YRS',
        'TRUMP HAILS BIG MANILA DEAL',
        'MANILA: NO DEAL SIGNED AT ALL',
        'US-THAI TRADE PACT SIGNED',
        'ASEAN ENDS, SINGAPORE TAKES OVER',
        'XI HUGS TRUMP ON THE TARMAC',
        'CARNEY TO SEE TRUMP AT APEC',
        'SEOUL WARMS TO BEIJING',
        'TAIWAN COUNTS 10 PLA SORTIES',
        'MYANMAR RETHINKS ASEAN TIES',
        'RUSSIAN JETS NEAR TAIWAN, JAPAN',
        'CHITWAN WIN NPL BY 61 RUNS',
        'PUDUCHERRY BEAT ASSAM BY 61',
        '300 FISHING NETS BURNT IN INDIA',
        'UAE BULLS TAKE ABU DHABI T10',
        'INDONESIA U-17S TAKE QUALIFIER',
        'ICJ ROHINGYA VERDICT DUE THURS',
        'S KOREA EXAMS ADD 8,400 STAFF',
      ],
    },
    {
      name: 'MARKETS',
      hue: [180, 83, 9],
      lines: [
        'CRUDE EASES TO $83 A BARREL',
        'NIKKEI CLOSES UP 0.37% AT 59,076',
        'BIST-100 DOWN 1.53% IN ISTANBUL',
        'VERA RUBIN TO HIT $20BN IN Q1',
        'DOW LOSES 566 TO 50,193',
        'NVIDIA SLIDES 2.9% ON RESULTS',
        'UNITEDHEALTH SINKS 10%',
        'CYBER STOCKS JUMP 4.7%',
        'FED: BIGGER HIKE POSSIBLE',
      ],
    },
  ],
  [
    {
      name: 'AMERICAS',
      hue: [176, 58, 46],
      lines: [
        'PELTOLA TAKES ALASKA; DEMS 56-44',
        'FED MINUTES POINT TO MORE HIKES',
        'WALLER WANTS 50BP DECEMBER HIKE',
        'DANSKE SEES 3 MORE HIKES BY MARCH',
        'ANTHROPIC IPO PRICED AT $83',
        'STOCKS SPLIT: DOW DOWN, NASDAQ UP',
        'S&P 500 DOWN 5TH DAY RUNNING',
        'NVIDIA BOARD BLOCKS HUANG RETURN',
        'HUANG FACES SENATE BANKING PANEL',
        'SENATE SETS AI SAFETY HEARINGS',
        'AI MODELS MISTOOK CIVILIANS: PROBE',
        'AI FINDS CRITICAL JAVA FLAW',
        'NSA OUTAGE: RUBIO RULES OUT LINK',
        'AMERICA LOSES MEASLES-FREE TAG',
        'KENNEDY VOWS TO WIN STATUS BACK',
        'ICE HAS NO SHIPS FOR REMOVALS',
        'NEW JERSEY SUES DHS ON DETENTION',
        'GARCIA GOES AFTER TRUMP JR, VANCE',
        'KALSHI PAUSES MENTION MARKETS',
        'STUDENTS SUE OVER AI GUN SCANNER',
        'COOK SKIPS DEC 14 FED HEARING',
        'FDA NOMINEE OVERTON IS DROPPED',
        'FAA HALTS ROUTER INSTALLS',
        'DUFFY WANTS $50.1BN FOR AIR TRAFFIC',
        'MULLIN DEFENDS GAME PLANE TRIP',
        'HEGSETH PICKS NEW ARMY CHIEF',
        'IRS OPENS PROBE INTO LEFT GROUPS',
        'TRUMP BBC DEPOSITION MOVED TO JAN',
        'FLU HAS KILLED 5 CHILDREN SO FAR',
        'TJX SURGES 8% ON RESULTS',
        'HOME SALES HIT RECORD LOW',
        'GOLD DOWN 3% TO $3,736',
        'DOLLAR AT 19-MONTH HIGH',
        'CHINA LEADS TREASURY DUMP',
        'COSTA RICA JOURNALIST SHOT DEAD',
        'TRUMP PLOTTER JAILED 27 YEARS',
        'CANADA PUSHES APAC TRADE SHIFT',
        'POPE LEAVES PERU AFTER TOUR',
      ],
    },
  ],
];

export interface Mark {
  at: string;
  what: string;
}

// All times UTC, Wednesday 18 November 2026.
export const MARKS: Mark[] = [
  { at: '00:16', what: 'BAHRAIN STOPS DRONE RAID' },
  { at: '09:00', what: 'AKVAN TURNS SEVERE STORM' },
  { at: '10:16', what: 'VOYAGER 1 HITS ONE LIGHT-DAY' },
  { at: '10:30', what: 'EU PITCHES EUR45BN KYIV LOAN' },
  { at: '13:29', what: 'IRAN HITS US BASE IN KUWAIT' },
  { at: '17:36', what: 'KERCH COLLAPSE CONFIRMED' },
  { at: '19:00', what: 'FED MINUTES POINT TO HIKES' },
  { at: '21:26', what: 'ANTHROPIC IPO PRICED AT $83' },
];

export const TOTAL = 134;

export const SOURCE_LINE =
  'REUTERS AP BBC NYT WSJ AL JAZEERA UN NEWS IMD NASA ANTHROPIC NVIDIA FCDO PAHO AFP SCMP';
