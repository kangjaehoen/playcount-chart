"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
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
const pageButtons = [1, 2, 3, 4];
const skeletonRows = Array.from({ length: 10 }, (_, index) => index);
const loadingDelayMs = 240;
const chartTableWidth = 1080;
const chartTableRowHeight = 88;
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
  return rank ? `${rank}위` : "-";
}

function getRankChangeView(rankChange: RankChange) {
  if (rankChange.type === "new") {
    return {
      color: "#00a76f",
      firstLine: "NEW",
      secondLine: "",
    };
  }

  if (rankChange.type === "same") {
    return {
      color: "#a7b0bf",
      firstLine: "-",
      secondLine: "",
    };
  }

  const isUp = rankChange.type === "up";

  return {
    color: isUp ? "#00a76f" : "#ff315c",
    firstLine: `${isUp ? "▲" : "▼"} ${rankChange.value}`,
    secondLine: "",
  };
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
  const visibleRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [page, pageSize, rows],
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

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
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
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
              borderBottom: "1px solid #e8edf4",
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
              px: "18px",
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(6)": {
              width: chartTableColumns.playCount,
              px: "18px",
            },
            "& .MuiTableBody-root .MuiTableCell-root:nth-of-type(7), & .MuiTableBody-root .MuiTableCell-root:nth-of-type(8)":
              {
                px: "12px",
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
                      <Skeleton width={18} height={20} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={28} height={24} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                        <Skeleton variant="rectangular" width={38} height={38} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="48%" />
                          <Skeleton width="62%" />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={220} height={38} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={48} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={92} sx={{ mx: "auto" }} />
                      <Skeleton width={36} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={28} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={28} sx={{ mx: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))
              : visibleRows.map((row, rowIndex) => {
                  const rankChange = getRankChangeView(row.rankChange);
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
                        <Typography
                          sx={{
                            color: "#010614",
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: "17px",
                          }}
                        >
                          {row.rank}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
                          <Typography
                            sx={{
                              color: rankChange.color,
                              fontSize: 9,
                              fontWeight: 500,
                              lineHeight: "11px",
                            }}
                          >
                            {rankChange.firstLine}
                          </Typography>
                          {rankChange.secondLine ? (
                            <Typography
                              sx={{
                                color: "#ff315c",
                                fontSize: 9,
                                fontWeight: 500,
                                lineHeight: "11px",
                              }}
                            >
                              {rankChange.secondLine}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          sx={{ alignItems: "center", minWidth: 0 }}
                        >
                          <Box
                            component="img"
                            src={row.albumImageUrl}
                            alt={row.albumName}
                            sx={{
                              width: 38,
                              height: 38,
                              flex: "0 0 auto",
                              border: "1px solid #e5ebf2",
                              objectFit: "cover",
                            }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Stack
                              direction="row"
                              spacing={0.55}
                              sx={{ alignItems: "center", minWidth: 0 }}
                            >
                              <Typography
                                noWrap
                                sx={{
                                  maxWidth: 126,
                                  color: "#111827",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  lineHeight: "17px",
                                }}
                              >
                                {row.songName}
                              </Typography>
                              {row.hasMv ? (
                                <Box
                                  component="span"
                                  sx={{
                                    height: 14,
                                    px: "4px",
                                    bgcolor: "#eee7ff",
                                    color: "#6d52ff",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontSize: 9,
                                    lineHeight: "14px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  MV
                                </Box>
                              ) : null}
                            </Stack>
                            <Typography
                              noWrap
                              sx={{
                                maxWidth: 190,
                                mt: 0.45,
                                color: "#6b7483",
                                fontSize: 9.5,
                              }}
                            >
                              {row.artistNames} · {formatDate(row.issueDate)} · {row.albumType}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <DumbbellPreview points={row.dumbbellPoints} />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ color: "#0066ff", fontSize: 11, lineHeight: "17px" }}>
                          {row.engagement.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            color: "#010614",
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: "17px",
                          }}
                        >
                          {playCountValue}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            mt: 0.35,
                            mx: "auto",
                            height: 14,
                            px: "4px",
                            borderRadius: "2px",
                            bgcolor: getTrendBackground(row.playCountChangeRate),
                            color: getTrendColor(row.playCountChangeRate),
                            fontSize: 9,
                            lineHeight: "14px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {playCountTrendIcon} {formatPercent(row.playCountChangeRate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ color: "#8a94a6", fontSize: 11 }}>
                          {formatRank(row.genieRank)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ color: "#8a94a6", fontSize: 11 }}>
                          {formatRank(row.melonRank)}
                        </Typography>
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
          justifyContent: "space-between",
          mt: 3.2,
        }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={displayMode}
          onChange={handleDisplayModeChange}
          sx={{
            "& .MuiToggleButton-root": {
              height: 28,
              px: 1.25,
              borderColor: "#dce4ef",
              color: "#7a8596",
              fontSize: 10,
            },
            "& .Mui-selected": {
              color: "#111827 !important",
              bgcolor: "#f4f7fb !important",
            },
          }}
        >
          <ToggleButton value="total">전체 숫자</ToggleButton>
          <ToggleButton value="delta">증감량 기준</ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <FormControl size="small">
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              IconComponent={KeyboardArrowDownRoundedIcon}
              sx={{
                width: 106,
                height: 28,
                borderRadius: 1,
                color: "#5e6878",
                fontSize: 10,
                ".MuiSelect-select": {
                  py: 0,
                  pl: 1,
                  pr: "24px !important",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cfd8e3",
                },
              }}
            >
              {[10, 30, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  페이지당 {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton
              aria-label="이전 페이지"
              disabled={page === 0}
              onClick={() => setPage(Math.max(0, page - 1))}
              size="small"
              sx={{ width: 22, height: 22, color: "#6b7483" }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            {pageButtons.map((pageNumber) => {
              const pageIndex = pageNumber - 1;
              const selected = page === pageIndex;

              return (
                <Button
                  key={pageNumber}
                  onClick={() => setPage(Math.min(pageIndex, pageCount - 1))}
                  disabled={pageIndex >= pageCount}
                  sx={{
                    minWidth: 22,
                    width: 22,
                    height: 22,
                    p: 0,
                    borderRadius: 0.5,
                    bgcolor: selected ? "#0b1020" : "transparent",
                    color: selected ? "#ffffff" : "#6b7483",
                    fontSize: 10,
                    "&:hover": {
                      bgcolor: selected ? "#0b1020" : "#f4f7fb",
                    },
                  }}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Typography sx={{ color: "#8a94a6", fontSize: 10 }}>...</Typography>
            <IconButton
              aria-label="다음 페이지"
              disabled={page >= pageCount - 1}
              onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
              size="small"
              sx={{ width: 22, height: 22, color: "#6b7483" }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
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
