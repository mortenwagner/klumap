/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark foundation
        navy: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#252540',
          600: '#2f2f52',
        },
        // O-Ring accent colors
        oring: {
          opportunity: '#4ECDC4',
          offering: '#FFB347',
          operation: '#FF6B6B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
