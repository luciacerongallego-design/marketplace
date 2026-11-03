import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#121212",
          surface: "#f8f8f7",
          muted: "#767676",
          border: "#e7e5e4",
          accent: "#262626",
          sand: "#eae6df",
        },
      },
      letterSpacing: {
        editorial: "0.14em",
        wideEditorial: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
