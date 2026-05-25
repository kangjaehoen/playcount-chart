"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
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

const numberFormatter = new Intl.NumberFormat("ko-KR");

const chartChipLabels: Record<ChartType, string> = {
  soundat: "사운드엣 일간 차트 TOP 100",
  ytmusic: "유튜브 뮤직 TOP 30",
  melon: "멜론 TOP 100",
  melon_hot: "멜론 HOT 100",
  spotify: "스포티파이 차트",
};

const CHECKBOX_ACTIVE_COLOR = "#5b4af4";
const CHECKBOX_INACTIVE_COLOR = "#dfe7f0";
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

function ChartCheckboxIcon({ checked = false }: { checked?: boolean }) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: 0.5,
        border: checked ? "none" : "1px solid #cbd5e1",
        bgcolor: checked ? CHECKBOX_ACTIVE_COLOR : CHECKBOX_INACTIVE_COLOR,
        color: "#ffffff",
        display: "grid",
        placeItems: "center",
        boxShadow: checked ? "0 1px 2px rgba(91, 74, 244, 0.18)" : "none",
      }}
    >
      {checked ? <CheckRoundedIcon sx={{ fontSize: 16, strokeWidth: 2 }} /> : null}
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
    return "#ff315c";
  }

  if (value > 0) {
    return "#00a76f";
  }

  return "#a7b0bf";
}

function getSelectedChartSummary(selectedCharts: ChartType[]) {
  const [firstChart] = selectedCharts;
  if (!firstChart) {
    return "차트 선택";
  }

  const firstLabel =
    firstChart === "soundat" ? "사운드엣차트" : CHART_TYPE_META[firstChart].shortLabel;

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

function InfoDot({ dark = false }: { dark?: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: dark ? "#0b1020" : "#e8edf4",
        color: dark ? "#ffffff" : "#738095",
        fontSize: 10,
        ml: 0.5,
      }}
    >
      i
    </Box>
  );
}

function PlatformHeader({ label, color }: { label: string; color: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        aria-label={label}
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          bgcolor: color,
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontSize: 10,
        }}
      >
        {label}
      </Box>
    </Box>
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
        width: 28,
        height: 28,
        border: "1px solid #dce4ef",
        borderRadius: 1,
        color: "#718096",
        bgcolor: "#ffffff",
        "&:hover": {
          bgcolor: "#f7f9fc",
          borderColor: "#cfd8e3",
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
    <Box sx={{ width: 1080, mx: "auto", pt: 3.25, pb: 7 }}>
      <Box
        sx={{
          borderBottom: "1px solid #edf1f6",
          pb: 1.7,
          mb: 3.8,
        }}
      >
        <Typography
          sx={{
            color: "#9aa7b7",
            fontSize: 10,
          }}
        >
          <Box component="span" sx={{ color: "#7ba5d7" }}>
            Chart
          </Box>{" "}
          &gt; 곡 차트 &gt; 일간
        </Typography>
      </Box>

      <Stack direction="row" sx={{ alignItems: "center", mb: 7.1 }}>
        <Typography sx={{ color: "#182033", fontSize: 24, mr: 1.5 }}>곡 발매일</Typography>
        <Button
          disableRipple
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={(event) => setDateAnchorEl(event.currentTarget)}
          sx={{
            minWidth: 0,
            p: 0,
            color: "#111827",
            fontSize: 20,
            lineHeight: 1,
            "&:hover": {
              bgcolor: "transparent",
            },
            ".MuiButton-endIcon": {
              ml: 0.35,
            },
          }}
        >
          {formatDate(selectedDate)}
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ mb: 1.4 }}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <SmallIconButton label="데이터 갱신" onClick={refreshMockData}>
            <RefreshRoundedIcon sx={{ fontSize: 16 }} />
          </SmallIconButton>
          <SmallIconButton
            label="차트 선택 필터"
            onClick={(event) => setChartAnchorEl(event.currentTarget)}
          >
            <FilterListRoundedIcon sx={{ fontSize: 16 }} />
          </SmallIconButton>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={(event) => setChartAnchorEl(event.currentTarget)}
            sx={{
              height: 28,
              minWidth: 160,
              px: 1.2,
              borderRadius: 1,
              borderColor: "#cfd8e3",
              color: "#344054",
              bgcolor: "#ffffff",
              justifyContent: "space-between",
              fontSize: 11,
              gap: 0.75,
              "&:hover": {
                bgcolor: "#f7f9fc",
                borderColor: "#c3cede",
              },
            }}
          >
            <Stack direction="row" spacing={0.7} sx={{ alignItems: "center", minWidth: 0 }}>
              <ChartLogo chartType={selectedCharts[0] ?? "soundat"} />
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
          borderTop: "1px solid #eef2f7",
          borderBottom: "1px solid #eef2f7",
          overflow: "visible",
        }}
      >
        <Table
          aria-label="곡 차트 일간 기본 테이블"
          size="small"
          sx={{
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #f1f4f8",
              px: 1.5,
            },
            "& .MuiTableCell-head": {
              height: 30,
              py: 0,
              bgcolor: "#f7f9fc",
              color: "#7a8596",
              fontSize: 10,
              lineHeight: 1,
            },
            "& .MuiTableCell-body": {
              height: 66,
              py: 0,
              color: "#202838",
              fontSize: 12,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell width={118}>순위 / 변화량</TableCell>
              <TableCell width={292}>곡 정보</TableCell>
              <TableCell width={260}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center" }}>
                  <InfoDot dark />
                  <Box component="span" sx={{ ml: 0.6 }}>
                    사운드엣 일간 차트
                  </Box>
                </Stack>
              </TableCell>
              <TableCell align="right" width={132}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end" }}>
                  인게이지먼트
                  <InfoDot />
                </Stack>
              </TableCell>
              <TableCell align="right" width={160}>
                재생수
              </TableCell>
              <TableCell align="center" width={58}>
                <PlatformHeader label="G" color="#00c267" />
              </TableCell>
              <TableCell align="center" width={60}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ChartLogo chartType="melon" size={16} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? skeletonRows.map((row) => (
                  <TableRow key={row}>
                    <TableCell>
                      <Skeleton width={68} height={20} />
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
                    <TableCell>
                      <Skeleton width={210} height={32} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={48} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={92} sx={{ ml: "auto" }} />
                      <Skeleton width={36} sx={{ ml: "auto" }} />
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
                  const isPlayCountUp = row.playCountChangeRate >= 0;
                  const isFocusedRow = rowIndex === 1;

                  return (
                    <TableRow
                      key={row.songId}
                      hover
                      sx={{
                        "&:hover td": {
                          bgcolor: "#fbfdff",
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
                      <TableCell>
                        <Stack direction="row" spacing={1.35} sx={{ alignItems: "center" }}>
                          <Typography sx={{ width: 24, textAlign: "right", fontSize: 12 }}>
                            {row.rank}
                          </Typography>
                          <Box sx={{ minWidth: 36 }}>
                            <Typography
                              sx={{
                                color: rankChange.color,
                                fontSize: 9,
                                lineHeight: 1.2,
                              }}
                            >
                              {rankChange.firstLine}
                            </Typography>
                            {rankChange.secondLine ? (
                              <Typography
                                sx={{
                                  color: "#ff315c",
                                  fontSize: 9,
                                  lineHeight: 1.2,
                                }}
                              >
                                {rankChange.secondLine}
                              </Typography>
                            ) : null}
                          </Box>
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
                                }}
                              >
                                {row.songName}
                              </Typography>
                              {row.hasMv ? (
                                <Box
                                  sx={{
                                    height: 14,
                                    px: 0.45,
                                    borderRadius: 0.5,
                                    bgcolor: "#f0e8ff",
                                    color: "#6d52ff",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.25,
                                    fontSize: 8,
                                    lineHeight: 1,
                                  }}
                                >
                                  <VideoLibraryRoundedIcon sx={{ fontSize: 9 }} />
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
                      <TableCell align="right">
                        <Typography sx={{ color: "#1976f3", fontSize: 11 }}>
                          {row.engagement.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ color: "#111827", fontSize: 12 }}>
                          {playCountValue}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.35,
                            color: getTrendColor(row.playCountChangeRate),
                            fontSize: 9,
                            lineHeight: 1,
                          }}
                        >
                          {isPlayCountUp ? "↑" : "↓"} {formatPercent(row.playCountChangeRate)}
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
                <TableCell colSpan={7} align="center">
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
              width: 330,
              borderRadius: 1.25,
              border: "1px solid #e1e7f0",
              boxShadow: "0 14px 34px rgba(15, 23, 42, 0.14)",
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
                minHeight: 52,
                px: 1.8,
                gap: 1.45,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              <Checkbox
                checked={checked}
                size="small"
                icon={<ChartCheckboxIcon />}
                checkedIcon={<ChartCheckboxIcon checked />}
                sx={{
                  p: 0,
                  color: CHECKBOX_INACTIVE_COLOR,
                  "&.Mui-checked": { color: CHECKBOX_ACTIVE_COLOR },
                }}
              />
              <ChartLogo chartType={chart.value} />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#101828",
                    fontSize: 17,
                    lineHeight: 1.15,
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
