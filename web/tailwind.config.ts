import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      textColor:{
        primary: "var(--primary-text)",
        secondary: "var(--secondary-text)",
      },
      colors:{ 
        iconColor: "var(--iconColor)",
        borderColor: "var(--border-color)",
        "bg-primary": "var(--bg-primary)",
        "bg-primary-dark": "var(--bg-primary-dark)",
        primary: "var(--primary-text)",

      },
      backgroundColor: {
        primary: "var(--bg-primary)",
        dark: "var(--bg-primary-dark)",
      }, 
    },
  },
  plugins: [],
};
 
export default config;
