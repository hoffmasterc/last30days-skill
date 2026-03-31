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
        cream: "#FFF7ED",
        navy: "#1E2D4E",
        amber: "#F59E0B",
        sage: "#86EFAC",
        rose: "#F43F5E",
      },
      fontFamily: {
        display: ["Nunito", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        story: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
