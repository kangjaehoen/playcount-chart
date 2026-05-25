import {
  CHART_TYPE_META,
  STATS_PLATFORMS,
  type AlbumInfoResponse,
  type ChartType,
  type DailyChartResponse,
  type SongInfoResponse,
  type SongStatsItem,
  type SongStatsRequestPlatform,
} from "./types";

const BASE_SONG_ID = 1001;
const MOCK_SONG_COUNT = 260;

const chartScoreOffsets: Record<ChartType, number> = {
  soundat: 11,
  ytmusic: 29,
  melon: 43,
  melon_hot: 61,
  spotify: 79,
};

const platformMultipliers: Record<Exclude<SongStatsRequestPlatform, "all">, number> = {
  melon_playcnt: 0.46,
  genie_playcnt: 0.22,
  ytmusic_playcnt: 0.67,
  spotify_playcnt: 0.82,
  melon_cmt: 0.108,
  ytmusic_cmt: 0.066,
};

const songTitles = [
  "서울탈출",
  "너에게 닿기를",
  "우리가 쓴 밤",
  "봄이 오면",
  "Midnight Signal",
  "처음의 온도",
  "Blue Archive",
  "After Rain",
  "Orbit Light",
  "작은 파도",
  "Neon Garden",
  "Slow Motion",
  "밤의 페이지",
  "Signal Bloom",
  "Paper Moon",
  "서랍 속 여름",
  "Zero Gravity",
  "City Runner",
  "하루의 끝",
  "Velvet Room",
];

const artistNames = [
  "윤하, JUNNY",
  "IVE",
  "aespa",
  "DAY6",
  "Luna Wave",
  "NOVA",
  "Kite",
  "유진",
  "Soundat Crew",
  "Blue Signal",
  "Mina",
  "The Low Keys",
  "서온",
  "Room 315",
  "Jade",
  "Night Shift",
];

const albumTypes = ["정규", "싱글", "EP", "옴니버스"] as const;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function dateToDayNumber(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function pickBySong<T>(items: readonly T[], songId: number, salt = 0) {
  return items[(songId + salt) % items.length];
}

function buildSongPool() {
  return Array.from({ length: MOCK_SONG_COUNT }, (_, index) => BASE_SONG_ID + index);
}

function getChartScore({
  songId,
  chartType,
  date,
  seed,
}: {
  songId: number;
  chartType: ChartType;
  date: string;
  seed: number;
}) {
  const dayNumber = dateToDayNumber(date);
  const agePenalty = (songId - BASE_SONG_ID) * 1850;
  const chartAffinity = hashString(`${chartType}:${songId}`) % 125_000;
  const dailyNoise = hashString(`${date}:${chartType}:${songId}:${seed}`) % 95_000;
  const wave =
    Math.sin((songId + dayNumber * 3 + chartScoreOffsets[chartType] + seed * 13) / 8) * 70_000;
  const entryBoost =
    hashString(`entry:${date}:${chartType}:${songId}:${seed}`) % 100 < 7 ? 210_000 : 0;

  return 900_000 - agePenalty + chartAffinity + dailyNoise + wave + entryBoost;
}

function getPlatformData({
  songId,
  platform,
  date,
  seed,
}: {
  songId: number;
  platform: Exclude<SongStatsRequestPlatform, "all">;
  date: string;
  seed: number;
}) {
  const dayNumber = dateToDayNumber(date);
  const popularity =
    2_900_000 - (songId - BASE_SONG_ID) * 8200 + (hashString(`popularity:${songId}`) % 260_000);
  const dailyFactor =
    0.9 +
    (hashString(`stats:${date}:${songId}:${platform}:${seed}`) % 2800) / 10_000 +
    Math.sin((songId + dayNumber + seed) / 11) * 0.045;
  const data = popularity * platformMultipliers[platform] * dailyFactor;

  return Math.max(platform.includes("_cmt") ? 20 : 1000, Math.round(data));
}

function getAlbumImageUrl(albumId: number) {
  const label = String(albumId).slice(-2);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#fff7ed"/>
      <rect x="10" y="9" width="76" height="78" rx="5" fill="#ff7a30"/>
      <rect x="17" y="16" width="62" height="16" rx="2" fill="#fff3e7"/>
      <rect x="17" y="38" width="29" height="29" rx="3" fill="#16c79a"/>
      <rect x="50" y="38" width="29" height="29" rx="3" fill="#ffd166"/>
      <path d="M20 76h56" stroke="#fff3e7" stroke-width="5" stroke-linecap="round"/>
      <text x="23" y="29" font-family="Arial, sans-serif" font-size="10" fill="#ff7a30">NEW SOUND</text>
      <text x="27" y="59" font-family="Arial, sans-serif" font-size="16" fill="white">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function getDailyChart({
  date,
  chartType,
  seed = 0,
}: {
  date: string;
  chartType: ChartType;
  seed?: number;
}): Promise<DailyChartResponse> {
  const chart = CHART_TYPE_META[chartType];
  const songIds = buildSongPool()
    .sort(
      (firstSongId, secondSongId) =>
        getChartScore({ songId: secondSongId, chartType, date, seed }) -
        getChartScore({ songId: firstSongId, chartType, date, seed }),
    )
    .slice(0, chart.maxRank);

  return {
    chart_type: chartType,
    chart_name: chart.label,
    date,
    song_ids: songIds,
  };
}

export async function getSongInfo(songIds: number[]): Promise<SongInfoResponse> {
  return {
    songs: songIds.map((songId, index) => ({
      song_id: songId,
      song_name: pickBySong(songTitles, songId, index),
      artist_names: pickBySong(artistNames, songId, index * 3),
      album_id: 5000 + songId,
      issue_date: `2026-${String((songId % 3) + 1).padStart(2, "0")}-${String(
        (songId % 24) + 1,
      ).padStart(2, "0")}`,
      has_mv: hashString(`mv:${songId}`) % 4 !== 0,
    })),
  };
}

export async function getAlbumInfo(albumIds: number[]): Promise<AlbumInfoResponse> {
  return {
    albums: albumIds.map((albumId, index) => ({
      album_id: albumId,
      name: `${pickBySong(songTitles, albumId, index)} Collection`,
      img_url: getAlbumImageUrl(albumId),
      album_type: pickBySong(albumTypes, albumId, index),
      sellcnpy: index % 2 === 0 ? "Soundat" : "Mono Music",
      plancnpy: index % 3 === 0 ? "Playcount Lab" : "Studio 26",
    })),
  };
}

export async function getSongStats({
  songIds,
  platform,
  date,
  seed = 0,
}: {
  songIds: number[];
  platform: SongStatsRequestPlatform;
  date: string;
  seed?: number;
}): Promise<SongStatsItem[]> {
  const platforms = platform === "all" ? STATS_PLATFORMS : [platform];

  return songIds.flatMap((songId) =>
    platforms.map((platformName) => ({
      date,
      songId,
      platform: platformName,
      data: getPlatformData({ songId, platform: platformName, date, seed }),
    })),
  );
}
