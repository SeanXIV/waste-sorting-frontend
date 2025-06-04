/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ea',
          100: '#c3e6cb',
          200: '#9fd6ab',
          300: '#7bc68a',
          400: '#5cb85c',
          500: '#4caf50',
          600: '#45a049',
          700: '#3d8b40',
          800: '#367d36',
          900: '#2e6d2e',
        },
        secondary: {
          50: '#e8f0fe',
          100: '#c5d9fd',
          200: '#9ec0fc',
          300: '#77a7fa',
          400: '#5094f9',
          500: '#3c85f8',
          600: '#367be8',
          700: '#2e6ed3',
          800: '#2761be',
          900: '#1f54a9',
        },
        accent: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        dark: {
          50: '#e6e8ed',
          100: '#c1c6d1',
          200: '#9aa0b3',
          300: '#727a94',
          400: '#555e7b',
          500: '#384263',
          600: '#323c5b',
          700: '#2b3451',
          800: '#242c47',
          900: '#1a2035',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}