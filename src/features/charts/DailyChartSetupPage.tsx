"use client";

import AddchartOutlinedIcon from "@mui/icons-material/AddchartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { DumbbellPreview } from "@/components/charts/DumbbellPreview";
import { CHART_TYPES, CHART_TYPE_META, type ChartType, type DisplayMode } from "@/lib/api/types";
import { useChartStore } from "@/store/chartStore";

const dateOptions = ["2026-03-01", "2026-02-28", "2026-02-27", "2026-02-26"];

const previewRows = [
  { rank: 1, change: "▲ 4", song: "Midnight Signal", artist: "Luna Wave", growth: "+12.4%" },
  { rank: 2, change: "NEW", song: "처음의 온도", artist: "NOVA", growth: "+8.1%" },
  { rank: 3, change: "▼ 1", song: "Blue Archive", artist: "Kite", growth: "-2.7%" },
  { rank: 4, change: "▲ 8", song: "After Rain", artist: "유진", growth: "+5.9%" },
];

export function DailyChartSetupPage() {
  const selectedDate = useChartStore((state) => state.selectedDate);
  const selectedCharts = useChartStore((state) => state.selectedCharts);
  const displayMode = useChartStore((state) => state.displayMode);
  const page = useChartStore((state) => state.page);
  const pageSize = useChartStore((state) => state.pageSize);
  const setDate = useChartStore((state) => state.setDate);
  const toggleChart = useChartStore((state) => state.toggleChart);
  const setDisplayMode = useChartStore((state) => state.setDisplayMode);
  const setPage = useChartStore((state) => state.setPage);
  const setPageSize = useChartStore((state) => state.setPageSize);
  const refreshMockData = useChartStore((state) => state.refreshMockData);
  const [chartAnchorEl, setChartAnchorEl] = useState<null | HTMLElement>(null);

  const chartMenuOpen = Boolean(chartAnchorEl);
  const selectedChartNames = useMemo(
    () => selectedCharts.map((chartType) => CHART_TYPE_META[chartType].shortLabel).join(", "),
    [selectedCharts],
  );

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setDate(event.target.value);
  };

  const handleDisplayModeChange = (_: unknown, mode: DisplayMode | null) => {
    if (mode) {
      setDisplayMode(mode);
    }
  };

  return (
    <Box sx={{ position: "relative", pb: 10 }}>
      <Stack
        direction="row"
        sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography variant="h1">곡 차트 일간</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            API 응답 조합, 계산, 차트 비교를 분리해서 구현할 페이지입니다.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <FormControl size="small">
            <Select value={selectedDate} onChange={handleDateChange} sx={{ minWidth: 150 }}>
              {dateOptions.map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(event) => setChartAnchorEl(event.currentTarget)}
          >
            차트 {selectedCharts.length}
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip icon={<AddchartOutlinedIcon />} label={selectedChartNames} color="primary" />
            <Typography variant="body2" color="text.secondary">
              최대 3개 차트까지 비교합니다.
            </Typography>
          </Stack>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={displayMode}
            onChange={handleDisplayModeChange}
          >
            <ToggleButton value="total">전체 숫자</ToggleButton>
            <ToggleButton value="delta">증감량 기준</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table size="medium" aria-label="일간 곡 차트 세팅 미리보기 테이블">
          <TableHead>
            <TableRow>
              <TableCell width={96}>순위</TableCell>
              <TableCell>곡 정보</TableCell>
              <TableCell width={190}>Dumbbell 차트</TableCell>
              <TableCell align="right" width={140}>
                인게이지먼트
              </TableCell>
              <TableCell align="right" width={170}>
                재생수
              </TableCell>
              <TableCell align="center" width={120}>
                G / M
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {previewRows.map((row, index) => (
              <TableRow key={row.song} hover>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 800 }}>{row.rank}</Typography>
                    <Typography
                      variant="caption"
                      color={row.change.includes("▼") ? "error.main" : "success.main"}
                      sx={{ fontWeight: 800 }}
                    >
                      {row.change}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 1 }} />
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 800 }}>{row.song}</Typography>
                        <Chip
                          icon={<VideoLibraryOutlinedIcon />}
                          label="MV"
                          size="small"
                          variant={index % 3 === 0 ? "outlined" : "filled"}
                          color={index % 3 === 0 ? "default" : "primary"}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {row.artist} · 26.03.01
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <DumbbellPreview chartTypes={selectedCharts} />
                </TableCell>
                <TableCell align="right">27.84</TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: 800 }}>
                    {displayMode === "total" ? "2,428,310" : "+268,400"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={row.growth.startsWith("-") ? "error.main" : "success.main"}
                    sx={{ fontWeight: 800 }}
                  >
                    {row.growth}
                  </Typography>
                </TableCell>
                <TableCell align="center">12 / 4</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={100}
          page={page}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 30, 50, 100]}
          labelRowsPerPage="페이지당"
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
        />
      </TableContainer>

      <Menu
        anchorEl={chartAnchorEl}
        open={chartMenuOpen}
        onClose={() => setChartAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { width: 280, mt: 1 },
          },
        }}
      >
        {CHART_TYPES.map((chart) => {
          const checked = selectedCharts.includes(chart.value);
          const disabled = !checked && selectedCharts.length >= 3;

          return (
            <MenuItem
              key={chart.value}
              disabled={disabled}
              onClick={() => toggleChart(chart.value as ChartType)}
            >
              <Checkbox checked={checked} disabled={disabled} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }}>{chart.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  최대 {chart.maxRank}위
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      <Fab
        color="primary"
        aria-label="랜덤 데이터 갱신"
        onClick={refreshMockData}
        sx={{ position: "fixed", right: 32, bottom: 32 }}
      >
        <RefreshOutlinedIcon />
      </Fab>
    </Box>
  );
}
