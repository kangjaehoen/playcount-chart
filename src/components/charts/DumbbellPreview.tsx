import Box from "@mui/material/Box";
import type { ChartRankPoint, ChartType } from "@/lib/api/types";
import { CHART_TYPE_META } from "@/lib/api/types";

type DumbbellPreviewProps = {
  points?: ChartRankPoint[];
  chartTypes?: ChartType[];
};

const width = 280;
const height = 88;
const paddingX = 34;
const centerY = 44;
const leftBandX = 12;
const leftBandWidth = 51;
const plotStartX = leftBandX + leftBandWidth;
const rightBandX = width - leftBandX;
const guideLineXs = [0.5, leftBandX, plotStartX, 117, 171, 225, rightBandX, width - 0.5];

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
      <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
      <rect x={leftBandX} y="0" width={leftBandWidth} height={height} fill="#f8fafc" />
      {guideLineXs.map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2={height}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="2 2"
          shapeRendering="crispEdges"
        />
      ))}
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
