import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0d",
          900: "#0e1015",
          850: "#13151c",
          800: "#181b24",
          700: "#222633",
          600: "#2d3345",
          500: "#424b63",
          400: "#6f7b99",
          300: "#9da7bd",
          200: "#cbd2e0",
          100: "#e9edf5",
        },
        accent: {
          purple: {
            DEFAULT: "#9370db",
            light: "#b49bfa",
            dark: "#7248c8",
            subtle: "rgba(147, 112, 219, 0.12)",
          },
          green: {
            DEFAULT: "#38b284",
            light: "#5eead4",
            dark: "#208a62",
            subtle: "rgba(56, 178, 132, 0.12)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "glow-purple": "0 0 25px -5px rgba(147, 112, 219, 0.25)",
        "glow-green": "0 0 25px -5px rgba(56, 178, 132, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

