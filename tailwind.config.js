/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */

const sansFont = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  '"Noto Sans"',
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
]

module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "320px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--azo-sans)", sansFont],
        heading: ["var(--guardian-snowing)", sansFont],
      },
      colors: {
        contentColor: "#222",
        bgColor: "rgb(222, 227, 237)",
        black: {
          DEFAULT: "rgba(0, 0, 0, 1)",
          alpha50: "rgba(0, 0, 0, 0.5)",
        },
        brand: {
          DEFAULT: "hsl(208deg, 41%, 60%)",
        },
      },
      keyframes: {
        pulseScale: {
          "0%": { transform: "scale(0)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 0 },
        },
      },
      animation: {
        pulseScale: "pulseScale 1s ease-in-out infinite",
      },
    },
  },
}
