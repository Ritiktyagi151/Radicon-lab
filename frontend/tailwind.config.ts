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
        // Layout mein defined variable ko yahan map karein
        sans: ["var(--font-livvic)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#FFF1F1",
          100: "#FFE3E3",
          200: "#FFC9C9",
          300: "#FFB0A8",
          400: "#FF8A80",
          500: "#FF8A80",
          600: "#FF6B6B",
          700: "#F45B5B",
          800: "#E95252",
          900: "#D94848",
          950: "#BF3F3F",
          DEFAULT: "#FF6B6B",
        },
        surface: "#F5F5F5",
        line: "#E8E8E8",
      },
    },
  },
  plugins: [],
};
export default config;
