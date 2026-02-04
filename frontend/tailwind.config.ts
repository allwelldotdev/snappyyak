import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#EA580C', // Keeping consistent with legacy
                    dark: '#132326',
                    indigo: '#4F46E5',
                },
                bg: {
                    main: '#FFFFFF',
                    alt: '#FFFAF8',
                },
                text: {
                    heading: '#132326',
                    body: '#404042',
                    muted: '#646466',
                },
                border: {
                    primary: '#F4CBB5',
                    secondary: '#D3D3D3',
                }
            },
            fontFamily: {
                heading: ['"Instrument Sans"', 'sans-serif'],
                body: ['Satoshi', 'Inter', 'sans-serif'],
                ui: ['Satoshi', 'sans-serif'],
            },
            borderRadius: {
                'pill': '9999px',
                'card': '30px',
            }
        },
    },
    plugins: [],
};
export default config;
