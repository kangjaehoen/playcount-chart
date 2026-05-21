import Box from "@mui/material/Box";
import type { ChartRankPoint, ChartType } from "@/lib/api/types";
import { CHART_TYPE_META } from "@/lib/api/types";

type DumbbellPreviewProps = {
  points?: ChartRankPoint[];
  chartTypes?: ChartType[];
};

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
  const plottedPoints = rankPoints.map((point, index) => ({
    ...point,
    x: 24 + index * 46,
    y: point.rank ? 10 + ((point.rank - 1) / (maxRank - 1)) * 28 : 42,
  }));
  const visiblePoints = plottedPoints.filter((point) => point.rank !== null);

  const firstPoint = visiblePoints[0];
  const lastPoint = visiblePoints[visiblePoints.length - 1];

  return (
    <Box
      component="svg"
      role="img"
      aria-label="선택 차트 순위 비교"
      viewBox="0 0 160 54"
      sx={{ display: "block", width: 160, height: 54 }}
    >
      {firstPoint && lastPoint ? (
        <line
          x1={firstPoint.x}
          y1={firstPoint.y}
          x2={lastPoint.x}
          y2={lastPoint.y}
          stroke="#b6c0ce"
          strokeWidth="3"
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
              r={point.rank ? 6 : 4}
              fill={point.rank ? chart.color : "#dce3eb"}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y="52"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill={point.rank ? "#6a7280" : "#a6afba"}
            >
              {chart.shortLabel.slice(0, 3)}
            </text>
          </g>
        );
      })}
    </Box>
  );
}
