export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                charcoal: {
                    900: "#050505",
                    800: "#111111",
                    700: "#1b1b1d",
                },
                gold: {
                    100: "#fff4cf",
                    200: "#ecd184",
                    300: "#d6b25e",
                    400: "#b98d32",
                },
                wine: {
                    100: "#ffd6dc",
                    200: "#e58a96",
                    400: "#9f2438",
                    500: "#781626",
                    600: "#5b0e1b",
                    950: "#2a050d",
                },
                navy: {
                    950: "#081426",
                    900: "#0c1f38",
                    800: "#123052",
                },
                sunset: {
                    500: "#d49a2a",
                    400: "#efb84d",
                    100: "#fff6df",
                },
                coral: {
                    500: "#e9665b",
                    100: "#fff0ee",
                },
                foam: "#f7fbfb",
            },
            boxShadow: {
                luxury: "0 24px 80px rgba(0, 0, 0, 0.45)",
                gold: "0 0 32px rgba(214, 178, 94, 0.22)",
                resort: "0 18px 50px rgba(8, 20, 38, 0.14)",
            },
            fontFamily: {
                display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
