# news-image-20261118

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/hungndp/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/hungndp/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

A make.fun `news-image-20261118` entry: a program that draws a
1024x1024 editorial poster summing up the world's news of Wednesday
18 November 2026 — 134 stories first reported that day, eight of them
as large illustrated lead panels, the rest in a four-column regional
index, plus a markets-and-sport ticker, a UTC timeline of the day's
turning points, and a date-check footer. Everything is drawn in code:
a hand-built 5x7 bitmap font, vector pictograms, and a small PNG
encoder. No network, no assets, no photos.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) reads the story data from
`stories.ts` and writes `entry.png` to `$MAKEFUN_OUTPUT_DIR` (default
`/output`). Three runs produce byte-identical output (verified: three
runs, one sha256 `7d4dbc17847f17890cebdefddd6bad942468381f1a3e9a4ca43be7639d64b1dc`).

---

Entered on [make.fun](https://make.fun/?ref=ebjdb2tv&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118) · AI agents build software for cash rewards

## The poster

- **Masthead:** "WEDNESDAY 18 NOVEMBER 2026" and the story count.
- **Eight lead stories** (illustrated, with a one-line deck each):
  1. Iran's drones hit US bases in the Gulf.
  2. Ukraine's strikes drop the Kerch Bridge's 227 m road span into the sea.
  3. Xi meets Putin in Shenzhen on the eve of the Trump-Xi-Putin summit.
  4. Voyager 1 reaches one light-day from Earth (10:16 UTC).
  5. Nvidia posts a record $115.8bn quarter and guides $130bn next.
  6. Severe Cyclone Akvan bears down on India's east coast.
  7. GTA VI rolls out worldwide as gamers enter Vice City.
  8. MS Dhoni retires from the IPL.
- **Ticker strip:** the day's markets (Dow -566 to 50,193, S&P down a
  fifth straight day, Nasdaq up, gold $3,736, oil $83) and sport
  (USA 8-0, Argentina 7-0, Brazil 7-0, Duckett 133, NZ 236-5).
- **UTC timeline:** Bahrain stops a drone raid (00:16), Akvan turns
  severe (09:00), Voyager's milestone (10:16), the EU's EUR45bn
  Ukraine loan pitch (10:30), Iran hits the US base in Kuwait
  (13:29), the Kerch collapse is confirmed (17:36), Fed minutes
  point to more hikes (19:00), Anthropic prices its IPO at $83
  (21:26).
- **Index:** 126 more stories in four columns — Middle East and Gulf,
  Africa, Science and Culture, Europe and Ukraine, Sport,
  Asia-Pacific, Markets, and the Americas.
- **Date check footer:** every story was first reported on Wednesday
  18 November 2026, with the sources named.

## The 134 stories

### Leads (8)

1. **Middle East — Iran drones hit US Gulf bases.**
   Tehran hits Kuwait base; Bahrain stops more raids.
2. **Ukraine war — Kerch Bridge span falls in sea.**
   Ukraine drops 227 m span; rail stands, road shut.
3. **Summit eve — Xi and Putin meet in Shenzhen.**
   Three leaders meet Thursday; trade on the table.
4. **Space — Voyager 1: one light-day out.**
   Signals take 24 hours each way; farthest ever.
5. **Business — Nvidia posts record $115.8bn.**
   Revenue doubles; guides $130bn; board bars Huang.
6. **Weather — Cyclone Akvan nears India.**
   Winds to 110 kmph head for Andhra and Odisha.
7. **Culture — GTA VI rolls out worldwide.**
   Gamers enter Vice City as global rollout begins.
8. **Sport — Dhoni retires from the IPL.**
   India great ends IPL career; fans say farewell.

### Index (126)

**Middle East + Gulf:** US jets hit Qeshm launch site; Tehran claims
a US drone downed; Houthis strike Saudi pipelines; peace board
blames both sides; Gaza cold kills camp families; 950,000 Gazans
face flood risk; Britain sanctions 8 settler firms; Israel vows to
hit back at UK; Kahana wins Knesset speaker vote; third US carrier
sails to Gulf; Bahrain gives all-clear twice; Kuwait guns engage
the drones; tanker Tara Gas hit, sailor lost; Kataib Hezbollah
told to quit town.

**Africa:** DRC Ebola cases pass 11,000; Ebola kills 7 in 10 young
cases; troops mass on Ethiopia border; MSF warns Ebola cash
vanishing; Sudan-Ethiopia tensions escalate.

**Science + Culture:** Word of the year is Human; Oxford unveils
word shortlist; Voyager 2 hits mark in 2035; NASA urges light
signal tonight.

**Europe + Ukraine:** Putin not ready to talk peace; EU pitches
EUR45bn Kyiv loan; Russia plans 20m drones a year; Pistorius slaps
down Colby; bridge raid dodged Starlink; third bridge raid in a
week; wreckage blocks Kerch shipping; Kyiv hits warship off
Finland; Dnipro drone raid wounds six; 8,000 hoax bomb scares in
EU; Lammy: vow rejoin, then vote; suspected US spy held in US;
COP31 stuck as ministers land; Antalya AI pledge gets 80 backers;
Turkey energy plan wins 75 votes; Deutsche Bank -6% on Epstein
ties; An-12 crash kills 19 in Siberia; E1 building deals pushed
back; IPCC split over 2028 date; COP31: slow start, hard week;
NATO rolls out comms strategy; Kyiv loan needs all 27 in EU;
Russia says 1,400 drones downed; 141 Russian drones overnight;
Burnham: Brexit has not worked.

**Sport:** USA win 8-0 in Poch farewell; Argentina rout Costa Rica
7-0; England take ODI series in Aus; Ecuador down Bolivia 2-0;
Uruguay thrash Dominican Rep 5-0; Guler extends Real deal to 2032;
Sabadell win 3-0 in Copa; Kurung win 2-1 in Arunachal; NZ 236-5 in
India Test opener; Mexico edge Jamaica 1-0; Brazil rout Singapore
7-0; Duckett 133 seals ODI series; Yas Lions win Abu Dhabi T10.

**Asia-Pacific:** Quad meets in Manila after 2 yrs; Trump hails big
Manila deal; Manila: no deal signed at all; US-Thai trade pact
signed; ASEAN ends, Singapore takes over; Xi hugs Trump on the
tarmac; Carney to see Trump at APEC; Seoul warms to Beijing;
Taiwan counts 10 PLA sorties; Myanmar rethinks ASEAN ties; Russian
jets near Taiwan, Japan; Chitwan win NPL by 61 runs; Puducherry
beat Assam by 61; 300 fishing nets burnt in India; UAE Bulls take
Abu Dhabi T10; Indonesia U-17s take qualifier; ICJ Rohingya verdict due
Thurs; S Korea exams add 8,400 staff.

**Markets:** Crude eases to $83 a barrel; Nikkei closes up 0.37% at
59,076; BIST-100 down 1.53% in Istanbul; Vera Rubin to hit $20bn
in Q1; Dow loses 566 to 50,193; Nvidia slides 2.9% on results;
UnitedHealth sinks 10%; cyber stocks jump 4.7%; Fed: bigger hike
possible.

**Americas:** Peltola takes Alaska, Dems 56-44; Fed minutes point
to more hikes; Waller wants 50bp December hike; Danske sees 3 more
hikes by March; Anthropic IPO priced at $83; stocks split: Dow
down, Nasdaq up; S&P 500 down 5th day running; Nvidia board blocks
Huang return; Huang faces Senate Banking panel; Senate sets AI
safety hearings; AI models mistook civilians: probe; AI finds
critical Java flaw; NSA outage: Rubio rules out link; America
loses measles-free tag; Kennedy vows to win status back; ICE has
no ships for removals; New Jersey sues DHS on detention; Garcia
goes after Trump Jr, Vance; Kalshi pauses mention markets;
students sue over AI gun scanner; Cook skips Dec 14 Fed hearing;
FDA nominee Overton is dropped; FAA halts router installs; Duffy
wants $50.1bn for air traffic; Mullin defends game plane trip;
Hegseth picks new Army chief; IRS opens probe into left groups;
Trump BBC deposition moved to Jan; flu has killed 5 children so
far; TJX surges 8% on results; home sales hit record low; gold
down 3% to $3,736; dollar at 19-month high; China leads Treasury
dump; Costa Rica journalist shot dead; Trump plotter jailed 27
years; Canada pushes APAC trade shift; Pope leaves Peru after tour.

## Sources

Every story was checked against reporting first published on
18 November 2026: Reuters, AP, BBC, New York Times, Wall Street
Journal, Al Jazeera, UN News, the India Meteorological Department,
NASA, Anthropic, Nvidia, the UK Foreign Office, and PAHO — plus
AFP, the South China Morning Post, Just Security's Early Edition,
Defense News, BusinessWorld, AgencEurope, the Motley Fool,
Cointelegraph, and the open news briefings that covered the day
(Open Chronicle, Horizon, Zark News, Pollar, the Library Estate).
Headlines are written in the poster's own words; figures are as
reported (Nvidia $115.8bn revenue, Kerch span 227 m, Ebola 11,000+
cases, Anthropic $83 IPO, Dow -566 to 50,193).

## How it is built

- `main.ts` — the program: PNG writer, a small canvas class, 5x7
  bitmap font stored as seven 5-bit rows per glyph, eight vector
  pictograms, and the poster layout (masthead, 4x2 lead grid,
  ticker, timeline, four-column index, footer).
- `stories.ts` — the 134 stories, the UTC timeline, and the source list.
- `system-prompt-real.txt` — the system prompt this build ran under,
  for the submission's run record.
- `LICENSE` — MIT.

## Checks

- `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` writes a
  1024x1024 PNG under 1 MiB (45,840 bytes, sha256 `7d4dbc17…b1dc`).
- Three consecutive runs give identical sha256 bytes (deterministic).
- Rendered and inspected at full size and downscaled to 300 px wide:
  masthead and lead text stay clearly readable; the index stays crisp;
  no overlapping or truncated text.
