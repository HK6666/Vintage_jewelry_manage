/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8F0', 100: '#FFEFD6', 200: '#FFD9A0', 300: '#FFBF6B',
          400: '#E8A44A', 500: '#C4872E', 600: '#A06B1E', 700: '#7A5018',
          800: '#573913', 900: '#3A250D',
        },
        accent: {
          50: '#FDF2F4', 100: '#F9E0E5', 200: '#F0BFC8', 300: '#E4939F',
          400: '#D4667A', 500: '#8B2240', 600: '#741C36', 700: '#5D162B',
          800: '#461020', 900: '#300B16',
        },
        ivory: {
          50: '#FEFDFB', 100: '#FBF8F1', 200: '#F5EFE0', 300: '#EDE3CC',
          400: '#E0D3B3', 500: '#C9B896', 600: '#A89672', 700: '#877658',
          800: '#655842', 900: '#453C2E',
        },
        ink: {
          50: '#F7F5F3', 100: '#EBE6E0', 200: '#D5CCC0', 300: '#B8AA98',
          400: '#98856E', 500: '#6B5B4A', 600: '#534738', 700: '#3E352A',
          800: '#2B241D', 900: '#1A1613',
        },
      },
      fontFamily: {
        heading: ['"Noto Serif SC"', '"Cormorant"', 'serif'],
        body: ['"Noto Sans SC"', '"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
