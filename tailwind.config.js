/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6f9',
          100: '#fceef4',
          200: '#fce1ed',
          300: '#fac9dd',
          400: '#f7a5c6',
          500: '#f48fb4',
          600: '#e96d9a',
          700: '#d45180',
          800: '#b1446a',
          900: '#923b5a',
          950: '#591b33',
        },
        petal: {
          50: '#fef5f8',
          100: '#fdeef3',
          200: '#fcd9e6',
          300: '#fbbedb',
          400: '#f79ac7',
          500: '#f174ae',
          600: '#e05394',
          700: '#c23d77',
          800: '#a13563',
          900: '#863154',
          950: '#52172e',
        },
        accent: {
          peach: {
            50: '#fef7f4',
            100: '#fdeee8',
            200: '#fcdad0',
            300: '#f9bfad',
            400: '#f49a83',
            500: '#ed7558',
            600: '#da5a3f',
            700: '#b64833',
            800: '#953d30',
            900: '#7b362d',
            950: '#431a15',
          },
          cream: {
            50: '#fefdfb',
            100: '#fdf9f5',
            200: '#fbf3ea',
            300: '#f8e9d8',
            400: '#f3d5b8',
            500: '#ecba8e',
            600: '#e39a63',
            700: '#d67e45',
            800: '#b2663a',
            900: '#8f5432',
            950: '#4d2a18',
          }
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Kumbh Sans', 'system-ui', 'sans-serif'],
        body: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': {
            'box-shadow': '0 0 20px rgba(244, 143, 180, 0.3)',
          },
          'to': {
            'box-shadow': '0 0 30px rgba(244, 143, 180, 0.5), 0 0 40px rgba(247, 165, 198, 0.4)',
          },
        },
        slideUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
