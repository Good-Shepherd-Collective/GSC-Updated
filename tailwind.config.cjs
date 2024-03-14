/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {

      sans: ["Clash Display", ...defaultTheme.fontFamily.sans],
    },


    colors: {
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      zinc: colors.zinc,
      transparent: colors.transparent,
      green: {
        50: "hsl(104, 65%, 97%)",
        100: "hsl(111, 68%, 93%)",
        200: "hsl(112, 66%, 85%)",
        300: "hsl(111, 64%, 73%)",
        400: "hsl(112, 57%, 58%)",
        500: "hsl(112, 58%, 45%)",
        600: "hsl(112, 63%, 35%)",
        700: "hsl(112, 60%, 29%)",
        800: "hsl(113, 53%, 24%)",
        900: "hsl(113, 51%, 20%)",
        950: "hsl(115, 65%, 10%)",
      },
      blue: {
       '50': 'hsl(208, 100%, 97%)',
    '100': 'hsl(206, 94%, 94%)',
    '200': 'hsl(202, 94%, 86%)',
    '300': 'hsl(201, 97%, 74%)',
    '400': 'hsl(200, 94%, 57%)',
    '500': 'hsl(201, 89%, 48%)',
    '600': 'hsl(203, 99%, 39%)',
    '700': 'hsl(203, 98%, 32%)',
    '800': 'hsl(203, 91%, 27%)',
    '900': 'hsl(204, 82%, 24%)',
    '950': 'hsl(206, 80%, 16%)',
      },
       violet: {
      '50': 'hsl(255, 100%, 98%)',
    '100': 'hsl(257, 91%, 95%)',
    '200': 'hsl(257, 100%, 92%)',
    '300': 'hsl(259, 97%, 85%)',
    '400': 'hsl(261, 95%, 76%)',
    '500': 'hsl(264, 92%, 65%)',
    '600': 'hsl(268, 86%, 58%)',
    '700': 'hsl(270, 72%, 50%)',
    '800': 'hsl(269, 71%, 42%)',
    '900': 'hsl(270, 70%, 35%)',
    '950': 'hsl(268, 74%, 23%)',
      },
    },
    extend: {
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
