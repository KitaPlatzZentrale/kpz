import { extendTheme } from "@mui/joy";

const theme = extendTheme({
  fontFamily: {
    body: "Nunito, sans-serif",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "50": "#FDE9E8",
          "100": "#FACFC9",
          "200": "#F7B4A9",
          "300": "#F49A89",
          "400": "#F18069",
          "500": "#F46E44",
          "600": "#F05834",
          "700": "#EC4325",
          "800": "#D44518",
          "900": "#BB3B10",
        },
        success: {
          50: "#F1FAF5",
          100: "#E3F6E9",
          200: "#D8F4DC",
          300: "#C0ECBE",
          400: "#A8E49F",
          500: "#90DB81",
          600: "#78D263",
          700: "#60C944",
          800: "#198444",
          900: "#146630",
        },
        info: {
          "50": "#ECF6F8",
          "100": "#D9EDEF",
          "200": "#C6E3E6",
          "300": "#B3D9DD",
          "400": "#A0CFD4",
          "500": "#4DA9B7",
          "600": "#3D98A6",
          "700": "#2C8795",
          "800": "#318DB5",
          "900": "#1F6F80",
        },
        neutral: {
          50: "#F2F5F7",
          100: "#E5EAF0",
          200: "#ABB8BF",
          300: "#92A3A9",
          400: "#798E93",
          500: "#6A8088",
          600: "#5B727D",
          700: "#4C646D",
          800: "#2B3B44",
          900: "#1C2A32",
        },
      },
    },
  },
  components: {
    JoyButton: {
      defaultProps: {
        variant: "solid",
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: "8px",
          padding: "14px 32px",
          fontSize: "14px",
          fontWeight: 800,
          ...(ownerState.size === "lg" && {
            padding: "16px 32px",
            fontSize: "16px",
            "--Button-paddingInline": "1rem",
          }),
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontSize: "16px",
          padding: "11px 16px",
        }),
      },
    },
  },
});

export default theme;
