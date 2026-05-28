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
const thirdPointColor = "#16c79a";
const lineColor = "#475569";
const pointColors = [anchorColor, comparisonColor, thirdPointColor] as const;
const triangleSize = 10;
const pointSize = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function snapPixel(value: number) {
  return Math.round(value);
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
  const baseX = pointsRight ? x - triangleSize : x + triangleSize;
  const halfSize = triangleSize / 2;

  return `M ${x} ${y} L ${baseX} ${y - halfSize} L ${baseX} ${y + halfSize} Z`;
}

export function DumbbellPreview({ points, chartTypes = [] }: DumbbellPreviewProps) {
  const rankPoints =
    points ??
    chartTypes.map((chartType) => ({
      chartType,
      rank: null,
    }));
  const plottedPoints = rankPoints.slice(0, 3).map((point, index) => ({
    ...point,
    x: snapPixel(getRankX(point)),
    y: centerY,
    pointIndex: index,
    muted: point.rank === null,
  }));
  const anchorPlot = plottedPoints[0];
  const lineStartX =
    plottedPoints.length >= 2 ? Math.min(...plottedPoints.map((point) => point.x)) : plotMinX;
  const lineEndX =
    plottedPoints.length >= 2 ? Math.max(...plottedPoints.map((point) => point.x)) : plotMinX;
  const trianglePointsRight = anchorPlot ? anchorPlot.x <= lineEndX : true;
  const lineTitle =
    plottedPoints.length >= 2 ? plottedPoints.map(getRankTitle).join(" / ") : "No comparison";

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
      {plottedPoints.length >= 2 ? (
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
          {plottedPoints.slice(1).map((point) => (
            <circle
              key={`${point.chartType}-${point.pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={pointSize / 2}
              fill={pointColors[point.pointIndex] ?? comparisonColor}
              opacity={point.muted ? 0.38 : 1}
            />
          ))}
          {anchorPlot ? (
            <path
              d={getTrianglePath(anchorPlot.x, anchorPlot.y, trianglePointsRight)}
              fill={anchorColor}
              opacity={anchorPlot.muted ? 0.38 : 1}
            />
          ) : null}
        </g>
      ) : null}
    </Box>
  );
}
