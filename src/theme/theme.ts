import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6feb",
      dark: "#174ea6",
    },
    secondary: {
      main: "#14a38b",
    },
    success: {
      main: "#168a55",
    },
    error: {
      main: "#d64545",
    },
    warning: {
      main: "#d88a1f",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#172033",
      secondary: "#6a7280",
    },
    divider: "#dce3eb",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    h1: {
      fontSize: 28,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 22,
      letterSpacing: 0,
    },
    body1: {
      letterSpacing: 0,
    },
    body2: {
      letterSpacing: 0,
    },
    button: {
      letterSpacing: 0,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: "#6a7280",
        },
      },
    },
  },
});
