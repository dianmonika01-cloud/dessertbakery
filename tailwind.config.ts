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
        brand: {
          cream: "#FAF7F2",
          beige: "#EBDCCB",
          chocolate: "#654632",
          softBrown: "#B7835C",
          darkBrown: "#49372C",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(73, 55, 44, 0.08)",
        card: "0 14px 34px -12px rgba(73, 55, 44, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
