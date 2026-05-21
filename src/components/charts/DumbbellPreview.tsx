import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import type { ChartType } from "@/lib/api/types";
import { CHART_TYPE_META } from "@/lib/api/types";

type DumbbellPreviewProps = {
  chartTypes: ChartType[];
};

export function DumbbellPreview({ chartTypes }: DumbbellPreviewProps) {
  const points = chartTypes.map((chartType, index) => ({
    chartType,
    x: 24 + index * 46,
    y: 18 + index * 10,
  }));

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return (
    <Box
      component="svg"
      role="img"
      aria-label="선택 차트 순위 비교 미리보기"
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
      {points.map((point) => {
        const chart = CHART_TYPE_META[point.chartType];

        return (
          <Tooltip key={point.chartType} title={chart.label} placement="top" arrow>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={chart.color}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
