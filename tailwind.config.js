module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        bluegray_900: "#353535",
        gray_600: "#7e7e7e",
        gray_901: "#1e1e1e",
        gray_800: "#414141",
        gray_900: "#1b1b1b",
        white_A700: "#ffffff",
        bluegray_901: "#2b2b2b",
        lime_custom: "#7FF284",
        gray_select: "#141414"
      },
      fontFamily: { poppins: "Poppins" },
    },
  },
  plugins: [require("@tailwindcss/forms"),
            require('tailwind-scrollbar-hide')],
};
