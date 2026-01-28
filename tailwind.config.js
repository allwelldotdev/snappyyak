/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#EA580C',
                    dark: '#132326',
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
                body: ['Inter', 'sans-serif'],
                ui: ['Satoshi', 'sans-serif'],
            },
            borderRadius: {
                'pill': '9999px',
                'card': '30px',
            }
        },
    },
    plugins: [],
}
