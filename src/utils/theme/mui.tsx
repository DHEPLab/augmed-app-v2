import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A8E3BD",
    },
    secondary: {
      main: "#D6F5F4",
    },
  },
  typography: {
    fontFamily: [
      "Lato",
      "serif",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
  },
  components: {},
});

export default theme;
