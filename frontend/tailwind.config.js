/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.html", "./src/**/*.{ts,js,html}"],
  safelist: [
    "hidden",
    "block",
    "inline-block",
    "sm:hidden",
    "sm:block",
    "sm:inline-block",
    "md:hidden",
    "md:block",
    "md:inline-block",
    "lg:hidden",
    "lg:block",
    "lg:inline-block",
  ],
  theme: {
    extend: {
      zIndex: {
        60: "60",
        70: "70",
      },
    },
  },
  plugins: [],
};
