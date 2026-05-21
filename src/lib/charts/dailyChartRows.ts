import { getAlbumInfo, getDailyChart, getSongInfo, getSongStats } from "@/lib/api/mockApi";
import {
  CHART_TYPES,
  COMMENT_PLATFORMS,
  PLAY_COUNT_PLATFORMS,
  STATS_PLATFORMS,
  type AlbumInfo,
  type ChartType,
  type DailyChartResponse,
  type DailyChartTableRow,
  type NormalizedSongStats,
  type RankChange,
  type SongInfo,
  type SongStatsItem,
  type StatsPlatform,
} from "@/lib/api/types";

type BuildDailyChartRowsParams = {
  date: string;
  chartTypes: ChartType[];
  seed: number;
};

function createEmptyStats(): Record<StatsPlatform, number> {
  return STATS_PLATFORMS.reduce(
    (acc, platform) => {
      acc[platform] = 0;
      return acc;
    },
    {} as Record<StatsPlatform, number>,
  );
}

function withCalculatedStats(stats: Record<StatsPlatform, number>): NormalizedSongStats {
  const totalPlayCount = PLAY_COUNT_PLATFORMS.reduce((sum, platform) => sum + stats[platform], 0);
  const totalCommentCount = COMMENT_PLATFORMS.reduce((sum, platform) => sum + stats[platform], 0);

  return {
    ...stats,
    totalPlayCount,
    totalCommentCount,
    engagement: totalCommentCount > 0 ? totalPlayCount / totalCommentCount : 0,
  };
}

export function normalizeSongStats(statsItems: SongStatsItem[]) {
  const statsBySongId = new Map<number, Record<StatsPlatform, number>>();

  statsItems.forEach((item) => {
    const currentStats = statsBySongId.get(item.songId) ?? createEmptyStats();
    currentStats[item.platform] = item.data;
    statsBySongId.set(item.songId, currentStats);
  });

  return new Map(
    [...statsBySongId.entries()].map(([songId, stats]) => [songId, withCalculatedStats(stats)]),
  );
}

function getStats(statsBySongId: Map<number, NormalizedSongStats>, songId: number) {
  return statsBySongId.get(songId) ?? withCalculatedStats(createEmptyStats());
}

function getPreviousDate(date: string) {
  const previousDate = new Date(`${date}T00:00:00.000Z`);
  previousDate.setUTCDate(previousDate.getUTCDate() - 1);

  return previousDate.toISOString().slice(0, 10);
}

function createRankMap(songIds: number[]) {
  return new Map(songIds.map((songId, index) => [songId, index + 1]));
}

function calculateRankChange(currentRank: number, previousRank?: number): RankChange {
  if (!previousRank) {
    return { type: "new", value: null };
  }

  if (previousRank > currentRank) {
    return { type: "up", value: previousRank - currentRank };
  }

  if (previousRank < currentRank) {
    return { type: "down", value: currentRank - previousRank };
  }

  return { type: "same", value: 0 };
}

function rankByPlatform(
  songIds: number[],
  statsBySongId: Map<number, NormalizedSongStats>,
  platform: StatsPlatform,
) {
  return createRankMap(
    [...songIds].sort((firstSongId, secondSongId) => {
      const firstStats = getStats(statsBySongId, firstSongId);
      const secondStats = getStats(statsBySongId, secondSongId);

      return secondStats[platform] - firstStats[platform];
    }),
  );
}

function toMapById<T>(items: T[], getId: (item: T) => number) {
  return new Map(items.map((item) => [getId(item), item]));
}

function createChartRankRecord(
  selectedChartTypes: ChartType[],
  chartRankMaps: Map<ChartType, Map<number, number>>,
  songId: number,
) {
  return CHART_TYPES.reduce(
    (acc, chart) => {
      acc[chart.value] = selectedChartTypes.includes(chart.value)
        ? (chartRankMaps.get(chart.value)?.get(songId) ?? null)
        : null;
      return acc;
    },
    {} as Record<ChartType, number | null>,
  );
}

export async function buildDailyChartRows({
  date,
  chartTypes,
  seed,
}: BuildDailyChartRowsParams): Promise<DailyChartTableRow[]> {
  const mainChartType = chartTypes[0] ?? "soundat";
  const previousDate = getPreviousDate(date);
  const selectedChartTypes = chartTypes.length ? chartTypes : [mainChartType];

  const [currentCharts, previousMainChart] = await Promise.all([
    Promise.all(selectedChartTypes.map((chartType) => getDailyChart({ date, chartType, seed }))),
    getDailyChart({ date: previousDate, chartType: mainChartType, seed }),
  ]);

  const mainChart =
    currentCharts.find((chart) => chart.chart_type === mainChartType) ??
    ({
      chart_type: mainChartType,
      chart_name: "",
      date,
      song_ids: [],
    } satisfies DailyChartResponse);
  const mainSongIds = mainChart.song_ids;

  const [songInfoResponse, currentStatsItems, previousStatsItems] = await Promise.all([
    getSongInfo(mainSongIds),
    getSongStats({ songIds: mainSongIds, platform: "all", date, seed }),
    getSongStats({ songIds: mainSongIds, platform: "all", date: previousDate, seed }),
  ]);

  const albumIds = [...new Set(songInfoResponse.songs.map((song) => song.album_id))];
  const albumInfoResponse = await getAlbumInfo(albumIds);

  const songInfoById = toMapById<SongInfo>(songInfoResponse.songs, (song) => song.song_id);
  const albumInfoById = toMapById<AlbumInfo>(albumInfoResponse.albums, (album) => album.album_id);
  const currentStatsBySongId = normalizeSongStats(currentStatsItems);
  const previousStatsBySongId = normalizeSongStats(previousStatsItems);
  const previousRankMap = createRankMap(previousMainChart.song_ids);
  const chartRankMaps = new Map(
    currentCharts.map((chart) => [chart.chart_type, createRankMap(chart.song_ids)]),
  );
  const genieRankMap = rankByPlatform(mainSongIds, currentStatsBySongId, "genie_playcnt");
  const melonRankMap = rankByPlatform(mainSongIds, currentStatsBySongId, "melon_playcnt");

  return mainSongIds.map((songId, index) => {
    const rank = index + 1;
    const song = songInfoById.get(songId);
    const album = song ? albumInfoById.get(song.album_id) : undefined;
    const currentStats = getStats(currentStatsBySongId, songId);
    const previousStats = getStats(previousStatsBySongId, songId);
    const playCountDelta = currentStats.totalPlayCount - previousStats.totalPlayCount;
    const playCountChangeRate =
      previousStats.totalPlayCount > 0 ? (playCountDelta / previousStats.totalPlayCount) * 100 : 0;
    const chartRanks = createChartRankRecord(selectedChartTypes, chartRankMaps, songId);

    return {
      songId,
      rank,
      rankChange: calculateRankChange(rank, previousRankMap.get(songId)),
      songName: song?.song_name ?? `Track ${songId}`,
      artistNames: song?.artist_names ?? "-",
      albumName: album?.name ?? "-",
      albumImageUrl: album?.img_url ?? "",
      albumType: album?.album_type ?? "싱글",
      issueDate: song?.issue_date ?? date,
      hasMv: song?.has_mv ?? false,
      chartRanks,
      dumbbellPoints: selectedChartTypes.map((chartType) => ({
        chartType,
        rank: chartRanks[chartType],
      })),
      totalPlayCount: currentStats.totalPlayCount,
      totalCommentCount: currentStats.totalCommentCount,
      engagement: currentStats.engagement,
      playCountDelta,
      playCountChangeRate,
      genieRank: genieRankMap.get(songId) ?? null,
      melonRank: melonRankMap.get(songId) ?? null,
    };
  });
}
