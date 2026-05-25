import Box from "@mui/material/Box";
import type { ChartRankPoint, ChartType } from "@/lib/api/types";
import { CHART_TYPE_META } from "@/lib/api/types";

type DumbbellPreviewProps = {
  points?: ChartRankPoint[];
  chartTypes?: ChartType[];
};

const width = 220;
const height = 34;
const paddingX = 18;
const centerY = 17;

export function DumbbellPreview({ points, chartTypes = [] }: DumbbellPreviewProps) {
  const rankPoints =
    points ??
    chartTypes.map((chartType) => ({
      chartType,
      rank: null,
    }));
  const maxRank = Math.max(
    ...rankPoints.map((point) => CHART_TYPE_META[point.chartType].maxRank),
    100,
  );
  const plottedPoints = rankPoints.map((point) => ({
    ...point,
    x: point.rank
      ? paddingX + ((point.rank - 1) / (maxRank - 1)) * (width - paddingX * 2)
      : width - paddingX,
    y: centerY,
  }));
  const visiblePoints = plottedPoints.filter((point) => point.rank !== null);
  const minX = Math.min(...visiblePoints.map((point) => point.x));
  const maxX = Math.max(...visiblePoints.map((point) => point.x));

  return (
    <Box
      component="svg"
      role="img"
      aria-label="선택 차트 순위 비교"
      viewBox={`0 0 ${width} ${height}`}
      sx={{ display: "block", width, height }}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const x = paddingX + ratio * (width - paddingX * 2);

        return (
          <line key={ratio} x1={x} y1="0" x2={x} y2={height} stroke="#eef2f7" strokeWidth="1" />
        );
      })}
      {visiblePoints.length > 1 ? (
        <line
          x1={minX}
          y1={centerY}
          x2={maxX}
          y2={centerY}
          stroke="#95a3b6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : null}
      {plottedPoints.map((point) => {
        const chart = CHART_TYPE_META[point.chartType];
        const label = `${chart.shortLabel} ${point.rank ? `${point.rank}위` : "순위 없음"}`;

        return (
          <g key={point.chartType}>
            <title>{label}</title>
            <circle
              cx={point.x}
              cy={point.y}
              r={point.rank ? 3.6 : 3}
              fill={point.rank ? chart.color : "#d5dde8"}
              stroke="#ffffff"
              strokeWidth="1.4"
            />
          </g>
        );
      })}
    </Box>
  );
}
