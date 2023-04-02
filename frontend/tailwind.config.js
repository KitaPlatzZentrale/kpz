/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#F46E44",
          dark: "#D44518",
        },
        green: {
          dark: "#198444",
          light: "#D8F4DC",
          DEFAULT: "#2ECC40",
        },
        gray: {
          primary: "#2B3B44",
          secondary: "#6A8088",
          tertiary: "#ABB8BF",
        },
        sunny: {
          DEFAULT: "#FDC534",
          light: "#FFF3D6",
        },
        cream: {
          DEFAULT: "#FFFEF8",
        },
        "happy-blue": {
          DEFAULT: "#318DB5",
        },
        "sea-blue": {
          DEFAULT: "#4DA9B7",
        },
      },
    },
  },
  plugins: [],
};
