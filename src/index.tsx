// src/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  useTheme,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import {
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
} from "@mui/icons-material";

import reportWebVitals from "./reportWebVitals";
import { routes } from "./routes";
import baseTheme from "./utils/theme/mui";

import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function App() {
  return useRoutes(routes);
}

function DarkModeToggle({
                          mode,
                          setMode,
                        }: {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
}) {
  const theme = useTheme();
  const isDark = mode === "dark";

  return (
    <IconButton
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label="toggle dark mode"
      size="large"
      sx={{
        position: "fixed",
        top: "50%",
        right: 16,
        transform: "translateY(-50%)",
        zIndex: 1300,
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: isDark
          ? theme.palette.grey[800]
          : theme.palette.grey[200],
        color: isDark ? "#fff" : theme.palette.text.primary,
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: isDark
            ? theme.palette.grey[700]
            : theme.palette.grey[300],
        },
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}

function Root() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", mode === "dark");
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DarkModeToggle mode={mode} setMode={setMode} />
      <BrowserRouter>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
