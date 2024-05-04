/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    1: "#8000ff",
                    2: "#e000ff",
                    3: "rgb(30 41 59)",
                },
                authform: {
                    1: "#12055c",
                    2: "#42045e",
                },
                fadingWhite: "rgba(255,255,255,0.7)",
                error: "crimson",
                success: "rgb(20, 220, 60)",
            },
            dropShadow: {
                "3xl": "0 0 0.2rem rgba(0, 0, 0, 0.6)",
            },
            screens: {
                xhover: {
                    raw: "(hover: hover)",
                },
            },
        },
        screens: {
            xl: { max: "1279px" },
            lg: { max: "1023px" },
            md: { max: "767px" },
            sm: { max: "639px" },
        },
    },
    plugins: [],
};
