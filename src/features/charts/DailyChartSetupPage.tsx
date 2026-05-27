"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { type MouseEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { DumbbellPreview } from "@/components/charts/DumbbellPreview";
import {
  CHART_TYPES,
  CHART_TYPE_META,
  type ChartType,
  type DailyChartTableRow,
  type DisplayMode,
  type RankChange,
} from "@/lib/api/types";
import { buildDailyChartRows } from "@/lib/charts/dailyChartRows";
import { useChartStore } from "@/store/chartStore";

const dateOptions = ["2026-03-01", "2026-02-28", "2026-02-27", "2026-02-26"];
const paginationButtonCount = 4;
const skeletonRows = Array.from({ length: 10 }, (_, index) => index);
const loadingDelayMs = 240;
const chartTableWidth = 1080;
const chartTableRowHeight = 88;
const paginationHeight = 28;
const paginationGap = 6;
const paginationInk = "#020617";
const paginationDisabled = "#cbd5e1";
const chartTableColumns = {
  rank: 60,
  rankChange: 40,
  songInfo: 288,
  soundat: 280,
  engagement: 116,
  playCount: 116,
  genie: 90,
  melon: 90,
} as const;
const chartHeaderTypography = {
  fontFamily: "Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "17px",
  letterSpacing: 0,
} as const;
const chartRankCellSx = {
  width: chartTableColumns.rank,
  height: chartTableRowHeight,
  p: "20px 8px 20px 20px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
} as const;
const chartRankNumberSx = {
  width: "fit-content",
  minWidth: 8,
  height: 22,
  flex: "0 0 auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#020617",
  textAlign: "center",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "22px",
  letterSpacing: 0,
} as const;
const chartRankChangeCellSx = {
  width: chartTableColumns.rankChange,
  height: chartTableRowHeight,
  p: "20px 0",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "2px",
} as const;
const chartRankChangeCenteredCellSx = {
  ...chartRankChangeCellSx,
  p: 0,
  justifyContent: "center",
  gap: 0,
} as const;
const chartRankChangeTrendSx = {
  width: chartTableColumns.rankChange,
  height: 20,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
} as const;
const chartRankChangeNumberSx = {
  width: "fit-content",
  minWidth: 9,
  height: 20,
  flex: "0 0 auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: 0,
} as const;
const chartRankChangeDashSx = {
  width: "fit-content",
  minWidth: 7,
  height: 20,
  flex: "0 0 auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: 0,
} as const;
const chartRankChangeNewSx = {
  width: "fit-content",
  minWidth: 24,
  height: 11,
  flex: "0 0 auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#dc2626",
  fontSize: 10,
  fontWeight: 500,
  lineHeight: "11px",
  letterSpacing: 0,
} as const;
const songInfoFrameSx = {
  width: "100%",
  minWidth: 0,
  height: 48,
  display: "flex",
  alignItems: "center",
  gap: "16px",
} as const;
const songAlbumImageSx = {
  width: 48,
  height: 48,
  flex: "0 0 48px",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  objectFit: "cover",
} as const;
const songTextFrameSx = {
  width: 184,
  minWidth: 0,
  height: 42,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "8px",
} as const;
const songTitleSx = {
  maxWidth: 160,
  height: 16,
  color: "#020617",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "16px",
  letterSpacing: 0,
} as const;
const songMetaRowSx = {
  maxWidth: 184,
  height: 18,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: "4px",
  overflow: "hidden",
} as const;
const songMetaChipSx = {
  height: 18,
  minWidth: 0,
  px: "6px",
  borderRadius: "2px",
  bgcolor: "#f1f5f9",
  color: "#1e293b",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 1 auto",
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "11px",
  letterSpacing: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;
const songMetaArtistChipSx = {
  ...songMetaChipSx,
  maxWidth: 86,
  letterSpacing: "-0.03em",
} as const;
const songMetaDateChipSx = {
  ...songMetaChipSx,
  flex: "0 0 auto",
} as const;
const songMetaMvChipSx = {
  ...songMetaChipSx,
  flex: "0 0 auto",
  bgcolor: "#ede9fe",
  color: "#7c3aed",
  letterSpacing: "-0.03em",
} as const;
const chartMetricCellSx = {
  width: "100%",
  height: chartTableRowHeight,
  p: "12px 18px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "5px",
} as const;
const engagementCellSx = {
  ...chartMetricCellSx,
  alignItems: "flex-end",
  textAlign: "right",
} as const;
const engagementValueSx = {
  width: "fit-content",
  minWidth: 33,
  color: "#2563eb",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "13px",
  letterSpacing: 0,
} as const;
const playCountCellSx = {
  ...chartMetricCellSx,
  alignItems: "flex-end",
  textAlign: "right",
} as const;
const playCountValueSx = {
  color: "#010614",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "18px",
  letterSpacing: 0,
  whiteSpace: "nowrap",
} as const;
const playCountTrendBadgeSx = {
  height: 17,
  px: "6px",
  borderRadius: "2px",
  fontSize: 10,
  fontWeight: 500,
  lineHeight: "17px",
  letterSpacing: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
} as const;
const platformRankCellSx = {
  ...chartMetricCellSx,
  alignItems: "flex-end",
  textAlign: "right",
} as const;
const platformRankValueSx = {
  color: "#a3a8b3",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "17px",
  letterSpacing: 0,
  whiteSpace: "nowrap",
} as const;

const numberFormatter = new Intl.NumberFormat("ko-KR");

const chartChipLabels: Record<ChartType, string> = {
  soundat: "사운드엣 일간 차트 TOP 100",
  ytmusic: "유튜브 뮤직 TOP 30",
  melon: "멜론 TOP 100",
  melon_hot: "멜론 HOT 100",
  spotify: "스포티파이 차트",
};

const CHECKBOX_ACTIVE_COLOR = "#4f46e5";
const CHECKBOX_INACTIVE_COLOR = "#e2e8f0";
const chartLogoSrc: Record<ChartType, string> = {
  soundat: "/logos/soundat.svg",
  ytmusic: "/logos/youtube.svg",
  melon: "/logos/melon.svg",
  melon_hot: "/logos/melon.svg",
  spotify: "/logos/spotify.svg",
};
const chartFilterLogoSrc: Partial<Record<ChartType, string>> = {
  soundat: "/logos/soundat2.svg",
  ytmusic: "/logos/youtube2.svg",
};

function ChartLogo({
  chartType,
  muted = false,
  size = 22,
  src,
}: {
  chartType: ChartType;
  muted?: boolean;
  size?: number;
  src?: string;
}) {
  return (
    <Box
      component="img"
      src={src ?? chartLogoSrc[chartType]}
      alt=""
      aria-hidden
      sx={{
        width: size,
        height: size,
        display: "block",
        flex: `0 0 ${size}px`,
        filter: muted ? "grayscale(1)" : "none",
        opacity: muted ? 0.42 : 1,
      }}
    />
  );
}

function SvgIconImage({ src, size = 12 }: { src: string; size?: number }) {
  return (
    <Box
      component="img"
      src={src}
      alt=""
      aria-hidden
      sx={{
        width: size,
        height: size,
        display: "block",
        flex: `0 0 ${size}px`,
      }}
    />
  );
}

function RankChangeTriangle({ direction, color }: { direction: "up" | "down"; color: string }) {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 8 8"
      sx={{
        width: 8,
        height: 8,
        display: "block",
        flex: "0 0 8px",
      }}
    >
      <polygon points={direction === "up" ? "4 1 7 6 1 6" : "1 2 7 2 4 7"} fill={color} />
    </Box>
  );
}

function RankChangeIndicator({ rankChange }: { rankChange: RankChange }) {
  if (rankChange.type === "new") {
    return (
      <Box sx={chartRankChangeCenteredCellSx}>
        <Typography component="span" sx={chartRankChangeNewSx}>
          NEW
        </Typography>
      </Box>
    );
  }

  if (rankChange.type === "same") {
    return (
      <Box sx={chartRankChangeCenteredCellSx}>
        <Typography component="span" sx={chartRankChangeDashSx}>
          -
        </Typography>
      </Box>
    );
  }

  const direction = rankChange.type;
  const color = direction === "up" ? "#16a34a" : "#dc2626";
  const showNewBadge = Boolean(rankChange.showNewBadge);

  return (
    <Box sx={showNewBadge ? chartRankChangeCellSx : chartRankChangeCenteredCellSx}>
      <Box sx={chartRankChangeTrendSx}>
        <RankChangeTriangle direction={direction} color={color} />
        <Typography component="span" sx={{ ...chartRankChangeNumberSx, color }}>
          {rankChange.value}
        </Typography>
      </Box>
      {showNewBadge ? (
        <Typography component="span" sx={chartRankChangeNewSx}>
          NEW
        </Typography>
      ) : null}
    </Box>
  );
}

function ChartHeaderText({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        ...chartHeaderTypography,
        color: "#334155",
        display: "inline-flex",
        alignItems: "center",
        height: 17,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function ChartHeaderFrame({
  children,
  gap = 0,
  justifyContent = "flex-start",
}: {
  children: ReactNode;
  gap?: number | string;
  justifyContent?: "center" | "flex-start" | "flex-end";
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent,
        gap,
      }}
    >
      {children}
    </Box>
  );
}

function DateDropdownCaret() {
  return (
    <Box
      aria-hidden
      sx={{
        width: 20,
        height: 18,
        borderRadius: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 20px",
        transform: "rotate(180deg)",
      }}
    >
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "10px solid #020617",
        }}
      />
    </Box>
  );
}

function ChartCheckboxIcon({ checked = false }: { checked?: boolean }) {
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "2px",
        border: checked ? "none" : "1px solid #cbd5e1",
        bgcolor: checked ? CHECKBOX_ACTIVE_COLOR : CHECKBOX_INACTIVE_COLOR,
        color: "#ffffff",
        display: "grid",
        placeItems: "center",
        boxShadow: "none",
      }}
    >
      {checked ? <CheckRoundedIcon sx={{ fontSize: 14, strokeWidth: 2 }} /> : null}
    </Box>
  );
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${year.slice(2)}.${month}.${day}`;
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatSignedNumber(value: number) {
  if (value === 0) {
    return "0";
  }

  return `${value > 0 ? "+" : "-"}${formatNumber(Math.abs(value))}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0.0%";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatRank(rank: number | null) {
  return rank ? `${rank} 위` : "-";
}

function getTrendColor(value: number) {
  if (value < 0) {
    return "#1976f3";
  }

  if (value > 0) {
    return "#ff315c";
  }

  return "#64748b";
}

function getTrendBackground(value: number) {
  if (value < 0) {
    return "#edf5ff";
  }

  if (value > 0) {
    return "#fff1f4";
  }

  return "#eef2f7";
}

function getSelectedChartSummary(selectedCharts: ChartType[]) {
  const [firstChart] = selectedCharts;
  if (!firstChart) {
    return "차트 선택";
  }

  const firstLabel =
    firstChart === "soundat" ? "사운드엣 차트" : CHART_TYPE_META[firstChart].shortLabel;

  if (selectedCharts.length <= 1) {
    return firstLabel;
  }

  return `${firstLabel} 외 ${selectedCharts.length - 1}개`;
}

type ChartFilterPillProps = {
  chartType: ChartType;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
};

function ChartFilterPill({ chartType, selected, disabled, onClick }: ChartFilterPillProps) {
  const selectedDark = selected && chartType === "soundat";
  const selectedLight = selected && !selectedDark;

  return (
    <Button
      disableElevation
      onClick={onClick}
      variant="outlined"
      sx={{
        minWidth: 0,
        height: 26,
        px: 1.35,
        borderRadius: 13,
        borderColor: disabled ? "#e6ebf2" : selectedLight ? "#0b1020" : "#dce4ef",
        bgcolor: disabled ? "#f2f5f9" : selectedDark ? "#0b1020" : "#ffffff",
        color: disabled ? "#a6afba" : selectedDark ? "#ffffff" : "#111827",
        fontSize: 11,
        lineHeight: 1,
        gap: 0.65,
        boxShadow: "none",
        "&.MuiButton-outlined": {
          borderWidth: 1,
        },
        "&:hover": {
          borderColor: disabled ? "#e6ebf2" : selectedLight ? "#0b1020" : "#ccd6e3",
          bgcolor: disabled ? "#f2f5f9" : selectedDark ? "#0b1020" : "#f8fafc",
          boxShadow: "none",
        },
      }}
    >
      <ChartLogo
        chartType={chartType}
        muted={disabled}
        size={16}
        src={chartFilterLogoSrc[chartType]}
      />
      {chartChipLabels[chartType]}
    </Button>
  );
}

function SmallIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      size="small"
      sx={{
        width: 36,
        height: 36,
        p: "12px",
        border: "none",
        borderRadius: "2px",
        color: "#334155",
        bgcolor: "#f1f5f9",
        gap: "10px",
        "&:hover": {
          bgcolor: "#e2e8f0",
        },
      }}
    >
      {children}
    </IconButton>
  );
}

function PageSizeSelectIcon({ className }: { className?: string }) {
  return (
    <Box
      component="span"
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        "&::before": {
          content: '""',
          width: 0,
          height: 0,
          borderLeft: "3.5px solid transparent",
          borderRight: "3.5px solid transparent",
          borderTop: "6px solid currentColor",
        },
      }}
    />
  );
}

export function DailyChartSetupPage() {
  const selectedDate = useChartStore((state) => state.selectedDate);
  const selectedCharts = useChartStore((state) => state.selectedCharts);
  const displayMode = useChartStore((state) => state.displayMode);
  const page = useChartStore((state) => state.page);
  const pageSize = useChartStore((state) => state.pageSize);
  const refreshSeed = useChartStore((state) => state.refreshSeed);
  const setDate = useChartStore((state) => state.setDate);
  const toggleChart = useChartStore((state) => state.toggleChart);
  const setDisplayMode = useChartStore((state) => state.setDisplayMode);
  const setPage = useChartStore((state) => state.setPage);
  const setPageSize = useChartStore((state) => state.setPageSize);
  const refreshMockData = useChartStore((state) => state.refreshMockData);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [chartAnchorEl, setChartAnchorEl] = useState<null | HTMLElement>(null);
  const [rows, setRows] = useState<DailyChartTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateMenuOpen = Boolean(dateAnchorEl);
  const chartMenuOpen = Boolean(chartAnchorEl);
  const selectedChartSummary = useMemo(
    () => getSelectedChartSummary(selectedCharts),
    [selectedCharts],
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, pageCount - 1);
  const visibleRows = useMemo(
    () => rows.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize),
    [clampedPage, pageSize, rows],
  );
  const visiblePageNumbers = useMemo(() => {
    const groupStart =
      Math.floor(clampedPage / paginationButtonCount) * paginationButtonCount + 1;
    const groupEnd = Math.min(pageCount, groupStart + paginationButtonCount - 1);

    return Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);
  }, [clampedPage, pageCount]);
  const lastVisiblePageNumber = visiblePageNumbers[visiblePageNumbers.length - 1] ?? 1;
  const showTrailingEllipsis = lastVisiblePageNumber < pageCount;

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(pageCount - 1);
    }
  }, [page, pageCount, setPage]);

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (!ignore) {
          setIsLoading(true);
        }

        return Promise.all([
          buildDailyChartRows({
            date: selectedDate,
            chartTypes: selectedCharts,
            seed: refreshSeed,
          }),
          new Promise((resolve) => {
            window.setTimeout(resolve, loadingDelayMs);
          }),
        ]);
      })
      .then(([nextRows]) => {
        if (!ignore) {
          setRows(nextRows);
        }
      })
      .catch(() => {
        if (!ignore) {
          setRows([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshSeed, selectedCharts, selectedDate]);

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
  };

  const handleDisplayModeChange = (_: unknown, mode: DisplayMode | null) => {
    if (mode) {
      setDisplayMode(mode);
    }
  };

  return (
    <Box sx={{ width: chartTableWidth, mx: "auto", pt: 3.25, pb: 7 }}>
      <Box
        sx={{
          borderBottom: "1px solid #edf1f6",
          pb: 1.7,
          mb: 3.8,
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.25 }}>
          <Typography
            component="span"
            sx={{
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Chart
          </Typography>
          <KeyboardArrowRightRoundedIcon
            sx={{
              width: 14,
              height: 14,
              color: "#94A3B8",
              fontSize: 14,
              flex: "0 0 14px",
            }}
          />
          <Typography
            component="span"
            sx={{
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            곡 차트
          </Typography>
          <KeyboardArrowRightRoundedIcon
            sx={{
              width: 14,
              height: 14,
              color: "#94A3B8",
              fontSize: 14,
              flex: "0 0 14px",
            }}
          />
          <Typography
            component="span"
            sx={{
              color: "#334155",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            일간
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" sx={{ alignItems: "center", mb: 7.1 }}>
        <Typography
          sx={{
            color: "#334155",
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            mr: 1.5,
          }}
        >
          곡 발매일
        </Typography>
        <Box
          aria-hidden
          sx={{
            width: 2,
            height: 28,
            bgcolor: "#E2E8F0",
            flex: "0 0 2px",
            mr: 1.5,
          }}
        />
        <Button
          disableRipple
          endIcon={<DateDropdownCaret />}
          onClick={(event) => setDateAnchorEl(event.currentTarget)}
          sx={{
            height: 32,
            minWidth: 0,
            p: 0,
            color: "#020617",
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            "&:hover": {
              bgcolor: "transparent",
            },
            ".MuiButton-endIcon": {
              ml: 0.35,
              mr: 0,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              width: 123,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            {formatDate(selectedDate)}
          </Box>
        </Button>
      </Stack>

      <Stack spacing={4.5} sx={{ mb: 1.4 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
            <SmallIconButton label="데이터 갱신" onClick={refreshMockData}>
              <SvgIconImage src="/icons/reset.svg" />
            </SmallIconButton>
            <SmallIconButton
              label="차트 선택 필터"
              onClick={(event) => setChartAnchorEl(event.currentTarget)}
            >
              <SvgIconImage src="/icons/filter.svg" />
            </SmallIconButton>
            <Button
              variant="outlined"
              endIcon={<SvgIconImage src="/icons/chevron-down.svg" />}
              onClick={(event) => setChartAnchorEl(event.currentTarget)}
              sx={{
                height: 36,
                minWidth: 0,
                py: 0,
                pl: "12px",
                pr: "8px",
                borderRadius: "2px",
                borderColor: "#334155",
                color: "#334155",
                bgcolor: "#ffffff",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: 0,
                gap: "10px",
                "&.MuiButton-outlined": {
                  borderWidth: 1,
                },
                "&:hover": {
                  bgcolor: "#ffffff",
                  borderColor: "#334155",
                },
                ".MuiButton-endIcon": {
                  ml: "10px",
                  mr: 0,
                },
              }}
            >
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
                <ChartLogo chartType={selectedCharts[0] ?? "soundat"} size={18} />
                <Box component="span" sx={{ minWidth: 0 }}>
                  {selectedChartSummary}
                </Box>
              </Stack>
            </Button>
          </Stack>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={displayMode}
            onChange={handleDisplayModeChange}
            sx={{
              flex: "0 0 auto",
              "& .MuiToggleButton-root": {
                height: 32,
                px: 1.5,
                borderColor: "#dce4ef",
                color: "#64748b",
                fontSize: 11,
                fontWeight: 500,
                lineHeight: 1,
              },
              "& .Mui-selected": {
                color: "#020617 !important",
                bgcolor: "#f8fafc !important",
              },
            }}
          >
            <ToggleButton value="total">전체 숫자</ToggleButton>
            <ToggleButton value="delta">증감량 기준</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {CHART_TYPES.map((chart) => {
            const selected = selectedCharts.includes(chart.value);
            const disabled = !selected && selectedCharts.length >= 3;

            return (
              <ChartFilterPill
                key={chart.value}
                chartType={chart.value}
                disabled={disabled}
                selected={selected}
                onClick={() => toggleChart(chart.value)}
              />
            );
          })}
        </Stack>
      </Stack>

      <TableContainer
        sx={{
          borderTop: "1px solid #e5ebf2",
          borderBottom: "1px solid #e5ebf2",
          overflow: "visible",
        }}
      >
        <Table
          aria-label="곡 차트 일간 기본 테이블"
          size="small"
          sx={{
            width: chartTableWidth,
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              boxSizing: "border-box",
              borderBottom: "1px solid #f1f5f9",
              letterSpacing: 0,
            },
            "& .MuiTableHead-root .MuiTableRow-root": {
              height: 38,
            },
            "& .MuiTableCell-head": {
              height: 38,
              py: 0,
              bgcolor: "#f1f5f9",
              color: "#334155",
              ...chartHeaderTypography,
              whiteSpace: "nowrap",
              verticalAlign: "middle",
            },
            "& .MuiTableCell-head > *": {
              ...chartHeaderTypography,
            },
            "& .MuiTableCell-body": {
              height: chartTableRowHeight,
              py: 0,
              color: "#010614",
              fontSize: 12,
              lineHeight: "17px",
              verticalAlign: "middle",
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(1)": {
              width: chartTableColumns.rank,
              px: 0,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(2)": {
              width: chartTableColumns.rankChange,
              px: 0,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(3)": {
              width: chartTableColumns.songInfo,
              px: "20px",
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(4)": {
              width: chartTableColumns.soundat,
              px: 0,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(5)": {
              width: chartTableColumns.engagement,
              p: 0,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(6)": {
              width: chartTableColumns.playCount,
              p: 0,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(7), & .MuiTableBody-root .MuiTableCell-root:nth-of-type(8)":
              {
                p: 0,
              },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(7)": {
              width: chartTableColumns.genie,
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(8)": {
              width: chartTableColumns.melon,
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(1)": {
              p: "10px 20px",
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(2)": {
              width: chartTableColumns.songInfo,
              p: "10px 20px",
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(3)": {
              width: chartTableColumns.soundat,
              p: "10px 12px",
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(4)": {
              width: chartTableColumns.engagement,
              p: "10px 18px",
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(5)": {
              width: chartTableColumns.playCount,
              p: "10px 18px",
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(6), & .MuiTableHead-root .MuiTableCell-root:nth-of-type(7)":
              {
                p: "10px 12px",
              },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(6)": {
              width: chartTableColumns.genie,
            },
            "& .MuiTableHead-root .MuiTableCell-root:nth-of-type(7)": {
              width: chartTableColumns.melon,
            },
            "& .MuiTableCell-body:nth-of-type(7), & .MuiTableCell-body:nth-of-type(8)": {
              bgcolor: "#f8fafc",
            },
            "& .MuiTableCell-root:nth-of-type(5), & .MuiTableCell-root:nth-of-type(6), & .MuiTableCell-root:nth-of-type(7), & .MuiTableCell-root:nth-of-type(8)":
              {
                textAlign: "center",
              },
            "& .MuiTableCell-head:nth-of-type(5) > .MuiBox-root, & .MuiTableCell-head:nth-of-type(6) > .MuiBox-root, & .MuiTableCell-head:nth-of-type(7) > .MuiBox-root":
              {
                width: "100%",
                height: 18,
                justifyContent: "flex-end",
              },
            "& .MuiTableCell-head:nth-of-type(6) img, & .MuiTableCell-head:nth-of-type(7) img": {
              width: 18,
              height: 18,
              flex: "0 0 18px",
            },
          }}
        >
          <colgroup>
            <col style={{ width: chartTableColumns.rank }} />
            <col style={{ width: chartTableColumns.rankChange }} />
            <col style={{ width: chartTableColumns.songInfo }} />
            <col style={{ width: chartTableColumns.soundat }} />
            <col style={{ width: chartTableColumns.engagement }} />
            <col style={{ width: chartTableColumns.playCount }} />
            <col style={{ width: chartTableColumns.genie }} />
            <col style={{ width: chartTableColumns.melon }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} width={chartTableColumns.rank + chartTableColumns.rankChange}>
                <ChartHeaderText>순위 / 변화량</ChartHeaderText>
              </TableCell>
              <TableCell width={chartTableColumns.songInfo}>
                <ChartHeaderText>곡 정보</ChartHeaderText>
              </TableCell>
              <TableCell width={chartTableColumns.soundat}>
                <ChartHeaderFrame gap="8px">
                  <ChartLogo chartType="soundat" size={18} />
                  <ChartHeaderText>사운드엣 일간 차트</ChartHeaderText>
                </ChartHeaderFrame>
              </TableCell>
              <TableCell align="center" width={chartTableColumns.engagement}>
                <ChartHeaderFrame gap="4px" justifyContent="center">
                  <ChartHeaderText>인게이지먼트</ChartHeaderText>
                  <SvgIconImage src="/icons/circle-help.svg" size={12} />
                </ChartHeaderFrame>
              </TableCell>
              <TableCell align="center" width={chartTableColumns.playCount}>
                <ChartHeaderFrame justifyContent="flex-end">
                  <ChartHeaderText>재생수</ChartHeaderText>
                </ChartHeaderFrame>
              </TableCell>
              <TableCell align="center" width={chartTableColumns.genie}>
                <ChartHeaderFrame justifyContent="flex-end">
                  <ChartLogo chartType="melon" size={18} />
                </ChartHeaderFrame>
              </TableCell>
              <TableCell align="center" width={chartTableColumns.melon}>
                <ChartHeaderFrame justifyContent="flex-end">
                  <ChartLogo chartType="ytmusic" size={18} src="/logos/youtube2.svg" />
                </ChartHeaderFrame>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? skeletonRows.map((row) => (
                  <TableRow key={row}>
                    <TableCell align="center">
                      <Box sx={chartRankCellSx}>
                        <Skeleton width={12} height={22} />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={chartRankChangeCellSx}>
                        <Skeleton width={24} height={20} />
                        <Skeleton width={24} height={11} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={songInfoFrameSx}>
                        <Skeleton variant="rectangular" width={48} height={48} />
                        <Box sx={songTextFrameSx}>
                          <Skeleton width={112} height={16} />
                          <Box sx={songMetaRowSx}>
                            <Skeleton variant="rounded" width={50} height={18} />
                            <Skeleton variant="rounded" width={53} height={18} />
                            <Skeleton variant="rounded" width={29} height={18} />
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={220} height={38} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={engagementCellSx}>
                        <Skeleton width={33} height={13} />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={playCountCellSx}>
                        <Skeleton width={68} height={18} />
                        <Skeleton variant="rounded" width={46} height={17} />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={platformRankCellSx}>
                        <Skeleton width={42} height={17} />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={platformRankCellSx}>
                        <Skeleton width={42} height={17} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              : visibleRows.map((row, rowIndex) => {
                  const playCountValue =
                    displayMode === "total"
                      ? formatNumber(row.totalPlayCount)
                      : formatSignedNumber(row.playCountDelta);
                  const playCountTrendIcon =
                    row.playCountChangeRate > 0
                      ? "\u2191"
                      : row.playCountChangeRate < 0
                        ? "\u2193"
                        : "\u2013";
                  const isFocusedRow = rowIndex === 1;

                  return (
                    <TableRow
                      key={row.songId}
                      hover
                      sx={{
                        "&:hover td": {
                          bgcolor: "#fbfdff",
                        },
                        "&:hover td:nth-of-type(7), &:hover td:nth-of-type(8)": {
                          bgcolor: "#f3f7fb",
                        },
                        ...(isFocusedRow
                          ? {
                              "& td": {
                                borderTop: "1px solid #2f80ed",
                                borderBottom: "1px solid #2f80ed",
                              },
                              "& td:first-of-type": {
                                borderLeft: "1px solid #2f80ed",
                              },
                              "& td:last-of-type": {
                                borderRight: "1px solid #2f80ed",
                              },
                            }
                          : {}),
                      }}
                    >
                      <TableCell align="center">
                        <Box sx={chartRankCellSx}>
                          <Typography component="span" sx={chartRankNumberSx}>
                            {row.rank}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <RankChangeIndicator rankChange={row.rankChange} />
                      </TableCell>
                      <TableCell>
                        <Box sx={songInfoFrameSx}>
                          <Box
                            component="img"
                            src={row.albumImageUrl}
                            alt={row.albumName}
                            sx={songAlbumImageSx}
                          />
                          <Box sx={songTextFrameSx}>
                            <Typography noWrap sx={songTitleSx}>
                              {row.songName}
                            </Typography>
                            <Box sx={songMetaRowSx}>
                              <Box component="span" sx={songMetaArtistChipSx}>
                                {row.artistNames}
                              </Box>
                              <Box component="span" sx={songMetaDateChipSx}>
                                {formatDate(row.issueDate)}
                              </Box>
                              {row.hasMv ? (
                                <Box component="span" sx={songMetaMvChipSx}>
                                  MV
                                </Box>
                              ) : null}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <DumbbellPreview points={row.dumbbellPoints} />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={engagementCellSx}>
                          <Typography sx={engagementValueSx}>
                            {row.engagement.toFixed(2)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={playCountCellSx}>
                          <Typography sx={playCountValueSx}>{playCountValue}</Typography>
                          <Typography
                            component="span"
                            sx={{
                              ...playCountTrendBadgeSx,
                              bgcolor: getTrendBackground(row.playCountChangeRate),
                              color: getTrendColor(row.playCountChangeRate),
                            }}
                          >
                            {playCountTrendIcon} {formatPercent(row.playCountChangeRate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={platformRankCellSx}>
                          <Typography sx={platformRankValueSx}>
                            {formatRank(row.genieRank)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={platformRankCellSx}>
                          <Typography sx={platformRankValueSx}>
                            {formatRank(row.melonRank)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            {!isLoading && visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography sx={{ color: "#7a8596", py: 4, fontSize: 12 }}>
                    표시할 차트 데이터가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "24px",
          width: chartTableWidth,
          mt: "24px",
          height: paginationHeight,
        }}
      >
        <FormControl size="small" variant="outlined">
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            IconComponent={PageSizeSelectIcon}
            renderValue={(value) => (
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: "11px",
                    letterSpacing: 0,
                    whiteSpace: "nowrap",
                    flex: "0 0 auto",
                  }}
                >
                  페이지 당 행 수
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: paginationInk,
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: "12px",
                    letterSpacing: 0,
                    mr: "11px",
                    flex: "0 0 auto",
                  }}
                >
                  {value}
                </Typography>
              </Stack>
            )}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    mt: 0.75,
                    minWidth: "111px !important",
                    border: "1px solid #e2e8f0",
                    borderRadius: "2px",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
                    "& .MuiMenuItem-root": {
                      minHeight: 28,
                      px: "10px",
                      color: paginationInk,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "12px",
                      letterSpacing: 0,
                    },
                  },
                },
                list: {
                  sx: {
                    py: 0.5,
                  },
                },
              },
            }}
            sx={{
              width: 111,
              height: paginationHeight,
              borderRadius: "2px",
              color: paginationInk,
              bgcolor: "#ffffff",
              fontFamily: "Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "12px",
              letterSpacing: 0,
              "& .MuiSelect-select": {
                width: "100%",
                height: paginationHeight,
                minHeight: "0 !important",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                py: 0,
                pl: "10px",
                pr: "8px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: paginationInk,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: paginationInk,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderWidth: 1,
                borderColor: paginationInk,
              },
              "& .MuiSelect-icon": {
                top: "50%",
                right: 8,
                width: 7,
                height: 6,
                color: paginationInk,
                transform: "translateY(-50%)",
              },
              "& .MuiSelect-iconOpen": {
                transform: "translateY(-50%) rotate(180deg)",
              },
            }}
          >
            {[10, 30, 50, 100].map((size) => (
              <MenuItem key={size} value={size}>
                페이지 당 행 수 {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: `${paginationGap}px`,
            height: paginationHeight,
          }}
        >
          <IconButton
            aria-label="이전 페이지"
            disabled={clampedPage === 0}
            onClick={() => setPage(Math.max(0, clampedPage - 1))}
            size="small"
            sx={{
              width: paginationHeight,
              height: paginationHeight,
              p: 0,
              borderRadius: "2px",
              color: paginationInk,
              "&.Mui-disabled": {
                color: paginationDisabled,
              },
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          {visiblePageNumbers.map((pageNumber) => {
            const pageIndex = pageNumber - 1;
            const selected = clampedPage === pageIndex;

            return (
              <Button
                key={pageNumber}
                onClick={() => setPage(pageIndex)}
                aria-current={selected ? "page" : undefined}
                disableElevation
                sx={{
                  minWidth: paginationHeight,
                  width: paginationHeight,
                  height: paginationHeight,
                  p: 0,
                  borderRadius: "2px",
                  bgcolor: selected ? paginationInk : "transparent",
                  color: selected ? "#ffffff" : paginationInk,
                  fontFamily:
                    "Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "12px",
                  letterSpacing: 0,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: selected ? paginationInk : "#f8fafc",
                  },
                  "&.Mui-disabled": {
                    color: paginationDisabled,
                    bgcolor: "transparent",
                  },
                }}
              >
                {pageNumber}
              </Button>
            );
          })}
          {showTrailingEllipsis ? (
            <Typography
              component="span"
              sx={{
                width: paginationHeight,
                height: paginationHeight,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: paginationInk,
                fontFamily:
                  "Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "12px",
                letterSpacing: 0,
              }}
            >
              ...
            </Typography>
          ) : null}
          <IconButton
            aria-label="다음 페이지"
            disabled={clampedPage >= pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, clampedPage + 1))}
            size="small"
            sx={{
              width: paginationHeight,
              height: paginationHeight,
              p: 0,
              borderRadius: "2px",
              color: paginationInk,
              "&.Mui-disabled": {
                color: paginationDisabled,
              },
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            <KeyboardArrowRightRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Fab
        aria-label="랜덤 데이터 갱신"
        onClick={refreshMockData}
        size="medium"
        sx={{
          position: "fixed",
          right: 28,
          bottom: 28,
          width: 44,
          height: 44,
          bgcolor: "#0b1020",
          color: "#ffffff",
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.24)",
          "&:hover": {
            bgcolor: "#172033",
          },
        }}
      >
        <RefreshRoundedIcon sx={{ fontSize: 20 }} />
      </Fab>

      <Menu
        anchorEl={dateAnchorEl}
        open={dateMenuOpen}
        onClose={() => setDateAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { mt: 1, width: 160 },
          },
        }}
      >
        {dateOptions.map((date) => (
          <MenuItem
            key={date}
            selected={date === selectedDate}
            onClick={() => {
              setDate(date);
              setDateAnchorEl(null);
            }}
          >
            {formatDate(date)}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={chartAnchorEl}
        open={chartMenuOpen}
        onClose={() => setChartAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 260,
              borderRadius: "4px",
              bgcolor: "#ffffff",
              boxShadow: "0 0 25px 5px rgba(0, 0, 0, 0.2)",
              "& .MuiList-root": {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                p: "12px 8px",
              },
            },
          },
        }}
      >
        {CHART_TYPES.map((chart) => {
          const checked = selectedCharts.includes(chart.value);
          const disabled = !checked && selectedCharts.length >= 3;

          return (
            <MenuItem
              key={chart.value}
              aria-disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  toggleChart(chart.value);
                }
              }}
              sx={{
                width: "100%",
                minHeight: 38,
                px: "10px",
                py: "10px",
                gap: "12px",
                borderRadius: "2px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: 1,
                "&:hover": {
                  bgcolor: "#f8fafc",
                },
              }}
            >
              <Checkbox
                checked={checked}
                size="small"
                icon={<ChartCheckboxIcon />}
                checkedIcon={<ChartCheckboxIcon checked />}
                sx={{
                  p: 0,
                  width: 16,
                  height: 16,
                  flex: "0 0 16px",
                  color: CHECKBOX_INACTIVE_COLOR,
                  "&.Mui-checked": { color: CHECKBOX_ACTIVE_COLOR },
                }}
              />
              <ChartLogo chartType={chart.value} size={18} />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#020617",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "14px",
                    letterSpacing: 0,
                  }}
                >
                  {chartChipLabels[chart.value]}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
