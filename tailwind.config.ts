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
        // Custom brand colors matching existing design tokens
        brand: {
          DEFAULT: "var(--brand)",
          2: "var(--brand-2)",
        },
        bg: "var(--bg)",
        text: "var(--text)",
        muted: "var(--muted)",
        card: "var(--card)",
        border: "var(--border)",
      },
      fontFamily: {
        // Custom font families
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Custom border radius matching existing design (18px)
        DEFAULT: "var(--radius)",
        card: "var(--radius)",
      },
      boxShadow: {
        // Custom shadow matching existing design
        DEFAULT: "var(--shadow)",
        card: "var(--shadow)",
      },
      spacing: {
        // Custom spacing values matching existing design
        section: "88px",
      },
    },
  },
  plugins: [],
};

export default config;
