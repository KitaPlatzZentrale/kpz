import { extendTheme } from "@mui/joy";

const theme = extendTheme({
  fontFamily: {
    body: "Nunito, sans-serif",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#FDE9E8",
          100: "#FACFC9",
          200: "#F7B4A9",
          300: "#F49A89",
          400: "#F18069",
          500: "#F46E44",
          600: "#F05834",
          700: "#EC4325",
          800: "#D44518",
          900: "#BB3B10",
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
          50: "#ECF6F8",
          100: "#D9EDEF",
          200: "#C6E3E6",
          300: "#B3D9DD",
          400: "#A0CFD4",
          500: "#4DA9B7",
          600: "#3D98A6",
          700: "#2C8795",
          800: "#318DB5",
          900: "#1F6F80",
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
        danger: {
          50: "#FEF3F2",
          100: "#FEE4E2",
          200: "#FECDCA",
          300: "#FDA29B",
          400: "#F97066",
          500: "#F04438",
          600: "#D92D20",
          700: "#B42318",
          800: "#912018",
          900: "#7A271A",
        },
        warning: {
          50: "#FFFAEB",
          100: "#FEF0C7",
          200: "#FEDF89",
          300: "#FEC84B",
          400: "#FDB022",
          500: "#F79009",
          600: "#DC6803",
          700: "#B54708",
          800: "#93370D",
          900: "#7A2E0E",
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
            fontSize: "16px",
            "--Button-paddingInline": "1rem",
          }),
          whiteSpace: "nowrap",
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === "sm" && {
            padding: "11px 16px",
          }),

          padding: "15px 16px",
          fontSize: "16px",
          ...(ownerState.size === "lg" && {
            padding: "15px 16px",
          }),
        }),
        input: ({ ownerState, theme }) => ({
          "&::placeholder": {
            color: theme.vars.palette.neutral[900],
            fontWeight: 600,
          },
        }),
        startDecorator: ({ ownerState, theme }) => ({
          color: theme.vars.palette.info[600],
          "& > svg": { fontSize: "20px" },
        }),
      },
    },
    JoyAutocomplete: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          fontSize: "16px",
          padding: "11px 16px",
        }),
        input: ({ ownerState, theme }) => ({
          "&::placeholder": {
            color: theme.vars.palette.neutral[900],
            fontWeight: 600,
            fontSize: "16px",
          },
        }),
        startDecorator: ({ ownerState, theme }) => ({
          color: theme.vars.palette.info[600],
          "& > svg": { fontSize: "20px" },
        }),
        clearIndicator: ({ ownerState, theme }) => ({
          color: theme.vars.palette.neutral[600],
          padding: 4,
        }),
      },
    },

    JoyModalDialog: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: "20px",
        }),
      },
    },
    JoyModal: {
      styleOverrides: {
        backdrop: {
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(1px)",
        },
      },
    },
    JoyFormLabel: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          fontWeight: 600,
          marginBottom: "4px",
          fontSize: "14px",
          color: theme.vars.palette.neutral[500],
        }),
      },
    },
  },
});

export default theme;
