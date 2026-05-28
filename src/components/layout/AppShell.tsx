"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useChartStore } from "@/store/chartStore";

type AppShellProps = {
  children: ReactNode;
};

type PrimaryNavItem = {
  label: string;
  iconSrc: string;
  active?: boolean;
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
const sidebarAssetPath = "/sidebar";

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

function SidebarLogo() {
  return (
    <Box
      component="img"
      src={`${sidebarAssetPath}/sidebar-logo.svg`}
      alt="PLAYCOUNT"
      sx={{ width: 140, height: 15, display: "block" }}
    />
  );
}

function SidebarIcon({ src }: { src: string }) {
  return (
    <Box
      component="img"
      src={src}
      alt=""
      aria-hidden
      sx={{ width: 18, height: 18, display: "block" }}
    />
  );
}

const primaryNavItems: PrimaryNavItem[] = [
  { label: "홈", iconSrc: `${sidebarAssetPath}/home.svg` },
  { label: "Artist", iconSrc: `${sidebarAssetPath}/artist.svg` },
  { label: "Music", iconSrc: `${sidebarAssetPath}/music.svg` },
  { label: "Marketing", iconSrc: `${sidebarAssetPath}/marketing.svg` },
  { label: "Charts", iconSrc: `${sidebarAssetPath}/charts.svg`, active: true },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const displayMode = useChartStore((state) => state.displayMode);
  const setDisplayMode = useChartStore((state) => state.setDisplayMode);

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
            <Box sx={{ mb: "34px" }}>
              <SidebarLogo />
            </Box>

            <Stack spacing="12px">
              <NavItem label={primaryNavItems[0].label} iconSrc={primaryNavItems[0].iconSrc} />
              <Box sx={{ height: "1px", bgcolor: navigationBorder }} />
              {primaryNavItems.slice(1).map((item) => (
                <NavItem
                  key={item.label}
                  label={item.label}
                  iconSrc={item.iconSrc}
                  active={item.active}
                />
              ))}
            </Stack>

            <Box
              sx={{
                mt: "4px",
                ml: "24px",
                position: "relative",
                color: navigationMuted,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 4,
                  bottom: 4,
                  width: "1px",
                  bgcolor: navigationBorder,
                },
              }}
            >
              <SubNavHeader label="곡 차트" />
              <Box
                sx={{
                  ml: "20px",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    bgcolor: navigationBorder,
                  },
                }}
              >
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
              </Box>
              <SubNavHeader label="아티스트 차트" collapsed sx={{ mt: "12px" }} />
            </Box>

            <NavItem
              label="Ticket"
              iconSrc={`${sidebarAssetPath}/ticket.svg`}
              sx={{ mt: "24px" }}
            />
          </Box>

          <Box
            sx={{
              flex: "0 0 auto",
              mt: "auto",
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ px: "16px", pt: "16px", pb: "12px" }}>
              <NavItem
                label="Settings"
                iconSrc={`${sidebarAssetPath}/setting.svg`}
                sx={{ px: "12px" }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: "16px" }}>
                <ModeChip
                  label="증감량 기준"
                  onClick={() => setDisplayMode("delta")}
                  selected={displayMode === "delta"}
                  tone="blue"
                />
                <ModeChip
                  label="전체 숫자"
                  onClick={() => setDisplayMode("total")}
                  selected={displayMode === "total"}
                  tone="violet"
                />
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
                  background: "linear-gradient(135deg, #d9c8a5 0%, #f8fafc 46%, #94a3b8 100%)",
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
        border: soft
          ? "none"
          : `1px solid ${active || selected ? navigationInk : navigationBorder}`,
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
  iconSrc,
  label,
  sx,
}: {
  active?: boolean;
  iconSrc: string;
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
        bgcolor: "transparent",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        lineHeight: "14px",
        letterSpacing: 0,
        transition: "background-color 120ms ease, color 120ms ease",
        ...sx,
        "&:hover": {
          bgcolor: navigationSoftBg,
          color: navigationInk,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <Box
          sx={{ width: 18, height: 18, display: "grid", placeItems: "center", flex: "0 0 18px" }}
        >
          <SidebarIcon src={iconSrc} />
        </Box>
        <Box component="span" sx={{ minWidth: 0 }}>
          {label}
        </Box>
      </Box>
      <KeyboardArrowDownRoundedIcon sx={{ color: "#94a3b8", fontSize: 16, flex: "0 0 16px" }} />
    </Box>
  );
}

function ModeChip({
  label,
  onClick,
  selected,
  tone,
}: {
  label: string;
  onClick: () => void;
  selected: boolean;
  tone: "blue" | "violet";
}) {
  const palette =
    tone === "blue"
      ? { bg: "#eff6ff", fg: "#2563eb", border: "#dbeafe", selectedBg: "#2563eb" }
      : { bg: "#f5f3ff", fg: "#6d4aff", border: "#ede9fe", selectedBg: "#6d4aff" };

  return (
    <Box
      component="button"
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      sx={{
        height: 24,
        px: "8px",
        py: 0,
        m: 0,
        borderRadius: "2px",
        border: `1px solid ${selected ? palette.selectedBg : palette.border}`,
        appearance: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: selected ? palette.selectedBg : palette.bg,
        color: selected ? "#ffffff" : palette.fg,
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 600,
        lineHeight: "11px",
        letterSpacing: 0,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
        "&:hover": {
          borderColor: palette.selectedBg,
          bgcolor: selected ? palette.selectedBg : "#ffffff",
        },
        "&:focus-visible": {
          outline: "2px solid #2563eb",
          outlineOffset: 2,
        },
      }}
    >
      {label}
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
        height: 34,
        pl: "20px",
        pr: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: navigationMuted,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "16px",
        letterSpacing: 0,
        ...sx,
      }}
    >
      <Box component="span">{label}</Box>
      <KeyboardArrowDownRoundedIcon
        sx={{
          color: "#94a3b8",
          fontSize: 14,
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
        ml: "20px",
        width: "calc(100% - 28px)",
        height: 34,
        px: "12px",
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        color: selected ? navigationInk : navigationMuted,
        bgcolor: selected ? navigationBorder : "transparent",
        fontSize: 12,
        fontWeight: selected ? 600 : 500,
        lineHeight: "16px",
        letterSpacing: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          left: "-20px",
          top: "50%",
          width: "12px",
          height: "1px",
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
