"use client";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType, ReactNode } from "react";

const drawerWidth = 260;

const chartNavItems = [
  { label: "일간", href: "/charts/daily", icon: <ShowChartOutlinedIcon /> },
  { label: "주간", href: "/charts/weekly", icon: <CalendarMonthOutlinedIcon /> },
  { label: "월간", href: "/charts/monthly", icon: <AssessmentOutlinedIcon /> },
  { label: "분기별", href: "/charts/quarterly", icon: <AssessmentOutlinedIcon /> },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", minWidth: 1280 }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "#ffffff",
          },
        }}
      >
        <Stack spacing={3} sx={{ px: 3, py: 3 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box
              aria-hidden
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "grid",
                placeItems: "center",
              }}
            >
              <LibraryMusicOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h2" sx={{ fontSize: 20 }}>
                Playcount
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Soundat chart console
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
                곡 차트
              </Typography>
              <Chip label="Daily" size="small" color="primary" variant="outlined" />
            </Stack>
            <List disablePadding>
              {chartNavItems.map((item) => {
                const selected = pathname === item.href;

                return (
                  <ListItemButton
                    key={item.href}
                    component={NextLink as ElementType}
                    href={item.href}
                    selected={selected}
                    sx={{
                      minHeight: 44,
                      borderRadius: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        bgcolor: "rgba(31, 111, 235, 0.1)",
                        color: "primary.main",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: selected ? "primary.main" : "text.secondary",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: { fontWeight: selected ? 800 : 600 },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Stack>
      </Drawer>

      <Box component="main" sx={{ flex: 1, px: 4, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
