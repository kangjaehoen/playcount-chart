export const CHART_TYPES = [
  {
    value: "soundat",
    label: "사운드엣 일간 차트",
    shortLabel: "Soundat",
    maxRank: 100,
    color: "#010614",
  },
  {
    value: "ytmusic",
    label: "유튜브 뮤직 TOP 30",
    shortLabel: "YT Music",
    maxRank: 30,
    color: "#ea0a36",
  },
  {
    value: "melon",
    label: "멜론 TOP 100",
    shortLabel: "Melon",
    maxRank: 100,
    color: "#05c128",
  },
  {
    value: "melon_hot",
    label: "멜론 HOT 100",
    shortLabel: "Melon HOT",
    maxRank: 100,
    color: "#05c128",
  },
  {
    value: "spotify",
    label: "스포티파이 차트",
    shortLabel: "Spotify",
    maxRank: 200,
    color: "#20d562",
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

export type RankChange =
  | {
      type: "new";
      value: null;
      showNewBadge?: boolean;
    }
  | {
      type: "up" | "down" | "same";
      value: number;
      showNewBadge?: boolean;
    };

export type NormalizedSongStats = Record<StatsPlatform, number> & {
  totalPlayCount: number;
  totalCommentCount: number;
  engagement: number;
};

export type ChartRankPoint = {
  chartType: ChartType;
  rank: number | null;
};

export type DailyChartTableRow = {
  songId: number;
  rank: number;
  rankChange: RankChange;
  songName: string;
  artistNames: string;
  albumName: string;
  albumImageUrl: string;
  albumType: AlbumInfo["album_type"];
  issueDate: string;
  hasMv: boolean;
  chartRanks: Record<ChartType, number | null>;
  dumbbellPoints: ChartRankPoint[];
  totalPlayCount: number;
  totalCommentCount: number;
  engagement: number;
  playCountDelta: number;
  playCountChangeRate: number;
  genieRank: number | null;
  melonRank: number | null;
};

export const STATS_PLATFORMS = [
  "melon_playcnt",
  "genie_playcnt",
  "ytmusic_playcnt",
  "spotify_playcnt",
  "melon_cmt",
  "ytmusic_cmt",
] as const satisfies readonly StatsPlatform[];

export const PLAY_COUNT_PLATFORMS = [
  "melon_playcnt",
  "genie_playcnt",
  "ytmusic_playcnt",
  "spotify_playcnt",
] as const satisfies readonly StatsPlatform[];

export const COMMENT_PLATFORMS = [
  "melon_cmt",
  "ytmusic_cmt",
] as const satisfies readonly StatsPlatform[];

export const CHART_TYPE_META = CHART_TYPES.reduce(
  (acc, chart) => {
    acc[chart.value] = chart;
    return acc;
  },
  {} as Record<ChartType, (typeof CHART_TYPES)[number]>,
);
