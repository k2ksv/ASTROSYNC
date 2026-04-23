import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#07110a",
          900: "#0d1710",
          800: "#132017",
          700: "#1c2c20",
          600: "#28402d",
          500: "#9cc9a8",
          400: "#c3dec8",
          300: "#e2efe4",
        },
        accent: {
          500: "#6eb48b",
          400: "#8ec8a4",
          300: "#b8dcc2",
        },
      },
      boxShadow: {
        soft: "0 24px 60px rgba(0, 0, 0, 0.28)",
        glow: "0 0 45px rgba(110, 180, 139, 0.28)",
        "glow-strong": "0 0 75px rgba(142, 200, 164, 0.32)",
      },
      backgroundImage: {
        "forest-glow":
          "radial-gradient(circle at top, rgba(110, 180, 139, 0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(99, 150, 118, 0.12), transparent 28%)",
        "card-glow":
          "radial-gradient(circle at top left, rgba(142, 200, 164, 0.18), transparent 34%), linear-gradient(135deg, rgba(19, 32, 23, 0.96), rgba(7, 17, 10, 0.92))",
      },
    },
  },
  plugins: [],
};

export default config;
