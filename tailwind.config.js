/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Playfair Display"', 'serif'],
            },
            colors: {
                rose: {
                    accent: '#ff6b9d',
                    light: '#fce7f3',
                    DEFAULT: '#ff6b9d'
                },
                lavender: {
                    accent: '#c084fc',
                    light: '#e9d5ff',
                    DEFAULT: '#c084fc'
                },
                peach: {
                    accent: '#fbbf24',
                    light: '#fef3c7',
                    DEFAULT: '#fbbf24'
                },
                brand: {
                    rose: '#ff6b9d',
                    lavender: '#c084fc',
                    peach: '#fbbf24'
                },
                light: {
                    100: '#fef3f8',
                    200: '#fef9f3',
                    300: '#f3f4ff'
                }
            },
            animation: {
                'shimmer': 'shimmer 2.5s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-up': 'fadeUp 0.8s ease-out forwards',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    },
    plugins: [],
}
