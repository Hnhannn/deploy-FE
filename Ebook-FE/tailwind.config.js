/** @type {import('tailwindcss').Config} */
import flowbitePlugin from "flowbite/plugin";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Thêm font Roboto
        serif: ["YourCustomSerifFont", "serif"], // Nếu bạn có font serif tùy chỉnh
      },
      fontSize: {
        "13-13": ".8125rem", // Font size custom class
      },
      colors: {
        "white-50": "rgb(242 242 242)",
        999: "rgb(153, 153, 153)",
        f2f: "rgb(242, 242, 242)",
        greenyuki: "rgb(21 176 136)",
        "bg-c1c": "rgb(28, 28, 30)",
        "bg-explore": "rgb(44, 46)",
        "white-default": "rgb(255, 255, 255)",
        "white-700": "rgb(51, 51, 51)",
        "yuki-500": "rgb(21 176 136)",
        "white-400": "rgb(153 153 153)",
        "white-overlay": "border-color: hsla(0, 0%, 100%, .1)",
        "white-300": "rgb(179, 179, 179)",
        "pink-500": "rgb(255, 55, 95)",
        "white-600": "rgb(102, 102, 102)",
        "white-900": "rgb(26, 26, 26)",
      },
    },
  },
  plugins: [flowbitePlugin],
};
