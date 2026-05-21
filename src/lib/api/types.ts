export const CHART_TYPES = [
  {
    value: "soundat",
    label: "사운드엣 일간 차트",
    shortLabel: "Soundat",
    maxRank: 100,
    color: "#1f6feb",
  },
  {
    value: "ytmusic",
    label: "유튜브 뮤직 TOP 30",
    shortLabel: "YT Music",
    maxRank: 30,
    color: "#ef4d5a",
  },
  {
    value: "melon",
    label: "멜론 TOP 100",
    shortLabel: "Melon",
    maxRank: 100,
    color: "#14a38b",
  },
  {
    value: "melon_hot",
    label: "멜론 HOT 100",
    shortLabel: "Melon HOT",
    maxRank: 100,
    color: "#d88a1f",
  },
  {
    value: "spotify",
    label: "스포티파이 차트",
    shortLabel: "Spotify",
    maxRank: 200,
    color: "#6f56d9",
  },
] as const;

export type ChartType = (typeof CHART_TYPES)[number]["value"];

export type DisplayMode = "total" | "delta";

export type DailyChartResponse = {
  chart_type: ChartType;
  chart_name: string;
  date: string;
  song_ids: number[];
};

export type SongInfo = {
  song_id: number;
  song_name: string;
  artist_names: string;
  album_id: number;
  issue_date: string;
  has_mv: boolean;
};

export type SongInfoResponse = {
  songs: SongInfo[];
};

export type AlbumInfo = {
  album_id: number;
  name: string;
  img_url: string;
  album_type: "정규" | "싱글" | "EP" | "옴니버스";
  sellcnpy: string;
  plancnpy: string;
};

export type AlbumInfoResponse = {
  albums: AlbumInfo[];
};

export type StatsPlatform =
  | "melon_playcnt"
  | "genie_playcnt"
  | "ytmusic_playcnt"
  | "spotify_playcnt"
  | "melon_cmt"
  | "ytmusic_cmt";

export type SongStatsRequestPlatform = StatsPlatform | "all";

export type SongStatsItem = {
  date: string;
  songId: number;
  platform: StatsPlatform;
  data: number;
};

export const CHART_TYPE_META = CHART_TYPES.reduce(
  (acc, chart) => {
    acc[chart.value] = chart;
    return acc;
  },
  {} as Record<ChartType, (typeof CHART_TYPES)[number]>,
);
