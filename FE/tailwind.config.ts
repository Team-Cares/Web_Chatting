import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      scrollbarHide: {
        "-webkit-scrollbar": {
          display: "none",
        },
        "scrollbar-width": "none",
        "-ms-overflow-style": "none",
      },
      screens: {
        sm: { min: "330px", max: "767px" },
        md: { min: "768px", max: "1023px" },
        lg: { min: "1024px" },
      },
    },
  },
  plugins: [
    // 다른 플러그인
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".scrollbarCustom::-webkit-scrollbar": {
          width: "12px",
          height: "12px",
        },
        ".scrollbarCustom::-webkit-scrollbar-thumb": {
          "background-color": "#666",
          "border-radius": "10px",
        },
        ".scrollbarCustom::-webkit-scrollbar-track": {
          "background-color": "transparent",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
export default config;
