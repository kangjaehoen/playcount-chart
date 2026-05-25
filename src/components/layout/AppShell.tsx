"use client";

import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const sidebarWidth = 168;

const chartNavItems = [
  { label: "일간", href: "/charts/daily" },
  { label: "주간", href: "/charts/weekly" },
  { label: "월간", href: "/charts/monthly" },
  { label: "분기별", href: "/charts/quarterly" },
];

function SoundatBrandMark() {
  return (
    <Box
      component="img"
      src="/logos/soundat.svg"
      alt=""
      aria-hidden
      sx={{ width: 26, height: 26, display: "block" }}
    />
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", minWidth: 1280, bgcolor: "#ffffff" }}>
      <Box
        component="aside"
        sx={{
          width: sidebarWidth,
          flex: `0 0 ${sidebarWidth}px`,
          borderRight: "1px solid #edf1f6",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: 2,
          py: 2.25,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 3.25 }}>
            <SoundatBrandMark />
            <Typography sx={{ color: "#0b1020", fontSize: 12 }}>PLAYCOUNT</Typography>
          </Stack>

          <Stack spacing={0.45}>
            {[
              { label: "홈", icon: <HomeRoundedIcon sx={{ fontSize: 16 }} /> },
              { label: "아티스트", icon: <LibraryMusicRoundedIcon sx={{ fontSize: 16 }} /> },
              { label: "차트", icon: <BarChartRoundedIcon sx={{ fontSize: 16 }} />, active: true },
              { label: "캘린더", icon: <CalendarMonthRoundedIcon sx={{ fontSize: 16 }} /> },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  height: 30,
                  px: 1,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.9,
                  color: item.active ? "#0b1020" : "#8c97a8",
                  bgcolor: item.active ? "#f3f6fa" : "transparent",
                  fontSize: 11,
                }}
              >
                {item.icon}
                {item.label}
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 2.1, pl: 3.4 }}>
            <Typography sx={{ mb: 0.6, color: "#9aa7b7", fontSize: 10 }}>곡 차트</Typography>
            <Stack spacing={0.25}>
              {chartNavItems.map((item) => {
                const selected = pathname === item.href;

                return (
                  <Box
                    key={item.href}
                    component={NextLink}
                    href={item.href}
                    sx={{
                      height: 26,
                      px: 1,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: selected ? "#1f6feb" : "#6f7b8c",
                      bgcolor: selected ? "#edf4ff" : "transparent",
                      fontSize: 10,
                    }}
                  >
                    {item.label}
                    {selected ? <ChevronRightRoundedIcon sx={{ fontSize: 14 }} /> : null}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>

        <Stack spacing={1.5}>
          <Box
            sx={{
              height: 30,
              px: 1,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.9,
              color: "#8c97a8",
              fontSize: 11,
            }}
          >
            <SettingsRoundedIcon sx={{ fontSize: 16 }} />
            설정
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", px: 0.6 }}>
            <Box
              aria-hidden
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "#eef2f7",
                display: "grid",
                placeItems: "center",
                color: "#687386",
                fontSize: 10,
              }}
            >
              K
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ color: "#2b3445", fontSize: 10 }}>
                kjh
              </Typography>
              <Typography noWrap sx={{ color: "#9aa7b7", fontSize: 9 }}>
                assignment
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: "#ffffff" }}>
        {children}
      </Box>
    </Box>
  );
}
