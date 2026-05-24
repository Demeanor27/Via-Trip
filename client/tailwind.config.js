/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EDF5E4',
          100: '#D4E8C2',
          200: '#C8DFA8',
          300: '#8FBF5C',
          400: '#6B9E45',
          500: '#4A7C2F',
          600: '#3D6B20',
          700: '#2D5016',
          800: '#1E3A0A',
        },
        sage: {
          50:  '#F5F0E8',
          100: '#EEF4E6',
          200: '#D4E8C2',
          300: '#A8C490',
          400: '#7A9E6B',
        },
        neutral: {
          warm50:  '#F9F6F0',
          warm100: '#F0EDE6',
          warm200: '#E0DED6',
          warm300: '#C4C4B0',
          warm400: '#A8A898',
          warm700: '#6B6B58',
          warm900: '#2D2D20',
        },
        primary: {
          DEFAULT: '#4A7C2F',
          light: '#EDF5E4',
          dark: '#2D5016',
        },
        accent: {
          DEFAULT: '#4A7C2F',
          light: '#F0F5EB',
        },
        surface: '#F5F0E8',
        muted: '#6B6B58',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
