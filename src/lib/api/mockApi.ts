import {
  CHART_TYPE_META,
  type AlbumInfoResponse,
  type ChartType,
  type DailyChartResponse,
  type SongInfoResponse,
  type SongStatsItem,
  type SongStatsRequestPlatform,
} from "./types";

export async function getDailyChart({
  date,
  chartType,
}: {
  date: string;
  chartType: ChartType;
}): Promise<DailyChartResponse> {
  const chart = CHART_TYPE_META[chartType];

  return {
    chart_type: chartType,
    chart_name: chart.label,
    date,
    song_ids: Array.from({ length: chart.maxRank }, (_, index) => 1001 + index),
  };
}

export async function getSongInfo(songIds: number[]): Promise<SongInfoResponse> {
  return {
    songs: songIds.map((songId, index) => ({
      song_id: songId,
      song_name: `Demo Track ${index + 1}`,
      artist_names: index % 2 === 0 ? "Soundat Crew" : "Blue Signal",
      album_id: 5000 + songId,
      issue_date: "2026-03-01",
      has_mv: index % 3 !== 0,
    })),
  };
}

export async function getAlbumInfo(albumIds: number[]): Promise<AlbumInfoResponse> {
  return {
    albums: albumIds.map((albumId, index) => ({
      album_id: albumId,
      name: `Chart Album ${index + 1}`,
      img_url: `https://picsum.photos/seed/playcount-${albumId}/96/96`,
      album_type: index % 2 === 0 ? "싱글" : "EP",
      sellcnpy: "Soundat",
      plancnpy: "Playcount Lab",
    })),
  };
}

export async function getSongStats({
  songIds,
  platform,
  date,
}: {
  songIds: number[];
  platform: SongStatsRequestPlatform;
  date: string;
}): Promise<SongStatsItem[]> {
  const platforms =
    platform === "all"
      ? ([
          "melon_playcnt",
          "genie_playcnt",
          "ytmusic_playcnt",
          "spotify_playcnt",
          "melon_cmt",
          "ytmusic_cmt",
        ] as const)
      : [platform];

  return songIds.flatMap((songId, songIndex) =>
    platforms.map((platformName, platformIndex) => ({
      date,
      songId,
      platform: platformName,
      data: Math.round((songIndex + 1) * 1200 + (platformIndex + 1) * 7800),
    })),
  );
}
