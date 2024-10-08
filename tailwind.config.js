/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      utilities: {
        '.drag-none': {
          'user-drag': 'none',
        },
      },
    },
    screens: {
      'mini-screen':'200px',
      '476':'476px',
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      'lg':'1080px',
      // => @media (min-width: 1024px) { ... }
      'xl': '1280px',
      '2xl':'20000px'
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}