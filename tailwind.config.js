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
          opportunity: '#c0392b',
          offering: '#4a6a8a',
          operation: '#7a8a7a',
        },
        // UI accent (warm copper)
        accent: '#c8956a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
