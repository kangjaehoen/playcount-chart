"use client";

import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const sidebarWidth = 282;
const miniRailWidth = 72;
const navigationWidth = sidebarWidth - miniRailWidth;
const miniRailBottomHeight = 92;
const navigationInk = "#020617";
const navigationMuted = "#334155";
const navigationBorder = "#e2e8f0";
const navigationSoftBg = "#f8fafc";
const miniRailUtilityMarginTop = 280;

const chartNavItems = [
  { label: "일간", href: "/charts/daily" },
  { label: "주간", href: "/charts/weekly" },
  { label: "월간", href: "/charts/monthly" },
  { label: "분기별", href: "/charts/quarterly" },
];

function PlaycountMark({ size = 18 }: { size?: number }) {
  return (
    <Box
      component="img"
      src="/logos/soundat.svg"
      alt=""
      aria-hidden
      sx={{ width: size, height: size, display: "block", flex: `0 0 ${size}px` }}
    />
  );
}

const primaryNavItems = [
  { label: "홈", icon: <HomeOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Artist", icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Music", icon: <MusicNoteRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Marketing", icon: <CampaignOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Charts", icon: <ShowChartRoundedIcon sx={{ fontSize: 18 }} />, active: true },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", minWidth: 1280, bgcolor: "#ffffff" }}>
      <Box
        component="aside"
        sx={{
          width: sidebarWidth,
          flex: `0 0 ${sidebarWidth}px`,
          bgcolor: "#ffffff",
          display: "flex",
          position: "sticky",
          top: 0,
          height: "100vh",
          minHeight: 720,
        }}
      >
        <Box
          sx={{
            width: miniRailWidth,
            flex: `0 0 ${miniRailWidth}px`,
            borderRight: `1px solid ${navigationBorder}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: miniRailWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              py: "24px",
            }}
          >
            <MiniRailItem>
              <MiniRailButton active label="Playcount 홈">
                <PlaycountMark size={24} />
              </MiniRailButton>
            </MiniRailItem>
            <MiniRailItem>
              <MiniRailButton selected label="차트">
                <Typography
                  component="span"
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: "18px",
                    letterSpacing: 0,
                  }}
                >
                  C
                </Typography>
              </MiniRailButton>
            </MiniRailItem>
            <MiniRailItem>
              <MiniRailButton label="마이페이지">
                <Typography
                  component="span"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "14px",
                    letterSpacing: 0,
                  }}
                >
                  My
                </Typography>
              </MiniRailButton>
            </MiniRailItem>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: miniRailBottomHeight,
              mt: `${miniRailUtilityMarginTop}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 1.5,
              px: 2,
              pb: 5,
              borderTop: `1px solid ${navigationBorder}`,
            }}
          >
            <MiniRailButton label="테마 전환" soft>
              <WbSunnyRoundedIcon sx={{ fontSize: 18 }} />
            </MiniRailButton>
          </Box>
        </Box>

        <Box
          sx={{
            width: navigationWidth,
            flex: `0 0 ${navigationWidth}px`,
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${navigationBorder}`,
            minWidth: 0,
          }}
        >
          <Box sx={{ px: "16px", pt: "28px", pb: 0, overflow: "hidden" }}>
            <Stack direction="row" spacing="7px" sx={{ alignItems: "center", mb: "34px" }}>
              <PlaycountMark size={18} />
              <Typography
                sx={{
                  color: navigationInk,
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: "18px",
                  letterSpacing: 0,
                }}
              >
                PLAYCOUNT
              </Typography>
            </Stack>

            <Stack spacing="12px">
              <NavItem label={primaryNavItems[0].label} icon={primaryNavItems[0].icon} />
              <Box sx={{ height: 1, bgcolor: navigationBorder }} />
              {primaryNavItems.slice(1).map((item) => (
                <NavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                />
              ))}
            </Stack>

            <Box
              sx={{
                mt: "8px",
                ml: "24px",
                position: "relative",
                color: navigationMuted,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  bgcolor: navigationBorder,
                },
              }}
            >
              <SubNavHeader label="곡 차트" />
              <Stack spacing={0}>
                {chartNavItems.map((item) => {
                  const selected = pathname === item.href;

                  return (
                    <SubNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      selected={selected}
                    />
                  );
                })}
              </Stack>
              <SubNavHeader label="아티스트 차트" collapsed sx={{ mt: "12px" }} />
            </Box>

            <NavItem
              label="Ticket"
              icon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{ mt: "24px" }}
            />
          </Box>

          <Box
            sx={{
              flex: "0 0 auto",
              mt: "64px",
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ px: "16px", pt: "16px", pb: "12px" }}>
              <NavItem
                label="Settings"
                icon={<SettingsRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{ px: "12px" }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: "16px" }}>
                <ModeChip tone="blue">증감량 기준</ModeChip>
                <ModeChip tone="violet">전체 숫자</ModeChip>
              </Stack>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center", mt: "16px", color: "#64748b" }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 12,
                    height: 12,
                    border: "1px solid #94a3b8",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 8,
                    lineHeight: 1,
                    flex: "0 0 12px",
                  }}
                >
                  i
                </Box>
                <Typography
                  noWrap
                  sx={{
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: "16px",
                    letterSpacing: 0,
                  }}
                >
                  업데이트일: 26년 01월 22일
                </Typography>
              </Stack>
            </Box>

            <Stack
              direction="row"
              sx={{
                height: 66,
                px: "16px",
                py: "12px",
                alignItems: "center",
                gap: "10px",
                borderTop: `1px solid ${navigationBorder}`,
                bgcolor: navigationSoftBg,
                minWidth: 0,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#e2e8f0",
                  background:
                    "linear-gradient(135deg, #d9c8a5 0%, #f8fafc 46%, #94a3b8 100%)",
                  border: "1px solid #ffffff",
                  boxShadow: "0 0 0 1px #e2e8f0",
                  flex: "0 0 32px",
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    color: navigationInk,
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: "16px",
                    letterSpacing: 0,
                  }}
                >
                  사용자 이름
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: "16px",
                    letterSpacing: 0,
                  }}
                >
                  soundat@gmail.com
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: "#ffffff" }}>
        {children}
      </Box>
    </Box>
  );
}

type MiniRailButtonProps = {
  active?: boolean;
  children: ReactNode;
  label: string;
  selected?: boolean;
  soft?: boolean;
};

function MiniRailItem({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: miniRailWidth,
        height: 40,
        px: "16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flex: "0 0 40px",
      }}
    >
      {children}
    </Box>
  );
}

function MiniRailButton({
  active = false,
  children,
  label,
  selected = false,
  soft = false,
}: MiniRailButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      sx={{
        width: 40,
        height: 40,
        p: 0,
        border: soft ? "none" : `1px solid ${active || selected ? navigationInk : navigationBorder}`,
        borderRadius: "2px",
        bgcolor: selected ? navigationInk : soft ? navigationSoftBg : "#ffffff",
        color: selected ? "#ffffff" : "#0f172a",
        display: "grid",
        placeItems: "center",
        flex: "0 0 40px",
        cursor: "pointer",
        transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
        "&:hover": {
          borderColor: soft ? "transparent" : navigationInk,
          bgcolor: selected ? navigationInk : navigationSoftBg,
        },
        "&:focus-visible": {
          outline: "2px solid #2563eb",
          outlineOffset: 2,
        },
      }}
    >
      {children}
    </Box>
  );
}

function NavItem({
  active = false,
  icon,
  label,
  sx,
}: {
  active?: boolean;
  icon: ReactNode;
  label: string;
  sx?: Record<string, unknown>;
}) {
  return (
    <Box
      sx={{
        height: 40,
        px: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "2px",
        color: active ? navigationInk : navigationMuted,
        bgcolor: active ? navigationSoftBg : "transparent",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        lineHeight: "14px",
        letterSpacing: 0,
        transition: "background-color 120ms ease, color 120ms ease",
        ...sx,
        "&:hover": {
          bgcolor: active ? navigationSoftBg : "#f8fafc",
          color: navigationInk,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <Box
          sx={{ width: 18, height: 18, display: "grid", placeItems: "center", flex: "0 0 18px" }}
        >
          {icon}
        </Box>
        <Box component="span" sx={{ minWidth: 0 }}>
          {label}
        </Box>
      </Box>
      <KeyboardArrowDownRoundedIcon sx={{ color: "#94a3b8", fontSize: 16, flex: "0 0 16px" }} />
    </Box>
  );
}

function ModeChip({ children, tone }: { children: ReactNode; tone: "blue" | "violet" }) {
  const palette =
    tone === "blue"
      ? { bg: "#eff6ff", fg: "#2563eb", border: "#dbeafe" }
      : { bg: "#f5f3ff", fg: "#6d4aff", border: "#ede9fe" };

  return (
    <Box
      component="span"
      sx={{
        height: 24,
        px: "8px",
        borderRadius: "2px",
        border: `1px solid ${palette.border}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: palette.bg,
        color: palette.fg,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: "11px",
        letterSpacing: 0,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function SubNavHeader({
  collapsed = false,
  label,
  sx,
}: {
  collapsed?: boolean;
  label: string;
  sx?: Record<string, unknown>;
}) {
  return (
    <Box
      sx={{
        height: 40,
        pl: "20px",
        pr: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: navigationMuted,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: "14px",
        letterSpacing: 0,
        ...sx,
      }}
    >
      <Box component="span">{label}</Box>
      <KeyboardArrowDownRoundedIcon
        sx={{
          color: "#94a3b8",
          fontSize: 16,
          transform: collapsed ? "none" : "none",
        }}
      />
    </Box>
  );
}

function SubNavItem({ href, label, selected }: { href: string; label: string; selected: boolean }) {
  return (
    <Box
      component={NextLink}
      href={href}
      sx={{
        position: "relative",
        ml: "24px",
        width: "calc(100% - 24px)",
        height: 36,
        px: "12px",
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        color: selected ? navigationInk : navigationMuted,
        bgcolor: selected ? navigationBorder : "transparent",
        fontSize: 14,
        fontWeight: selected ? 600 : 500,
        lineHeight: "14px",
        letterSpacing: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          left: "-24px",
          top: "50%",
          width: "12px",
          height: 1,
          bgcolor: navigationBorder,
        },
        "&:hover": {
          bgcolor: selected ? navigationBorder : "#f8fafc",
        },
      }}
    >
      {label}
    </Box>
  );
}
