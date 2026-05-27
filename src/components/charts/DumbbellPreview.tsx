import Box from "@mui/material/Box";
import type { ChartRankPoint, ChartType } from "@/lib/api/types";
import { CHART_TYPE_META } from "@/lib/api/types";

type DumbbellPreviewProps = {
  points?: ChartRankPoint[];
  chartTypes?: ChartType[];
};

const width = 280;
const height = 88;
const centerY = 44;
const leftBandX = 12;
const leftBandWidth = 51;
const plotStartX = leftBandX + leftBandWidth;
const rightBandX = width - leftBandX;
const plotMinX = leftBandX;
const plotMaxX = rightBandX;
const guideLineXs = [0.5, leftBandX, plotStartX, 117, 171, 225, rightBandX, width - 0.5];
const anchorColor = "#0078e7";
const comparisonColor = "#df108a";
const lineColor = "#475569";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRankX(point: ChartRankPoint) {
  const chart = CHART_TYPE_META[point.chartType];
  const rank = clamp(point.rank ?? chart.maxRank, 1, chart.maxRank);
  const ratio = chart.maxRank > 1 ? (rank - 1) / (chart.maxRank - 1) : 0;

  return plotMinX + ratio * (plotMaxX - plotMinX);
}

function getRankTitle(point: ChartRankPoint) {
  const chart = CHART_TYPE_META[point.chartType];

  return `${chart.shortLabel} ${point.rank ? `rank ${point.rank}` : "not ranked"}`;
}

function getTrianglePath(x: number, y: number, pointsRight: boolean) {
  const baseX = pointsRight ? x - 12 : x + 12;

  return `M ${x} ${y} L ${baseX} ${y - 7} L ${baseX} ${y + 7} Z`;
}

export function DumbbellPreview({ points, chartTypes = [] }: DumbbellPreviewProps) {
  const rankPoints =
    points ??
    chartTypes.map((chartType) => ({
      chartType,
      rank: null,
    }));
  const anchorPoint = rankPoints[0];
  const comparisonPoint = rankPoints[1];
  const plottedPoints =
    anchorPoint?.rank && comparisonPoint
      ? [anchorPoint, comparisonPoint].map((point) => ({
          ...point,
          x: getRankX(point),
          y: centerY,
        }))
      : [];
  const [anchorPlot, comparisonPlot] = plottedPoints;
  const lineStartX =
    anchorPlot && comparisonPlot ? Math.min(anchorPlot.x, comparisonPlot.x) : plotMinX;
  const lineEndX =
    anchorPlot && comparisonPlot ? Math.max(anchorPlot.x, comparisonPlot.x) : plotMinX;
  const trianglePointsRight =
    anchorPlot && comparisonPlot ? anchorPlot.x <= comparisonPlot.x : true;
  const lineTitle =
    anchorPlot && comparisonPlot ? plottedPoints.map(getRankTitle).join(" / ") : "No comparison";

  return (
    <Box
      component="svg"
      role="img"
      aria-label="Selected chart rank comparison"
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
      {anchorPlot && comparisonPlot ? (
        <g>
          <title>{lineTitle}</title>
          <line
            x1={lineStartX}
            y1={centerY}
            x2={lineEndX}
            y2={centerY}
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx={comparisonPlot.x}
            cy={comparisonPlot.y}
            r="4"
            fill={comparisonColor}
            stroke="#ffffff"
            strokeWidth="1.4"
          />
          <path
            d={getTrianglePath(anchorPlot.x, anchorPlot.y, trianglePointsRight)}
            fill={anchorColor}
          />
        </g>
      ) : null}
    </Box>
  );
}
