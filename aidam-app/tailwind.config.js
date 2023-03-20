/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aidam: '#0C0992',
        aidam80: 'rgba(12, 9, 146, 0.8)',
        grey1: '#F5F5F5',
        grey2: '#F0F0F0',
        grey3: '#E1E1E1',
        grey4: '#C8C8C8',
        grey5: '#AFAFAF',
        grey6: '#8C8C8C',
        grey7: '#6E6E6E',
        grey8: '#505050',
        exito: '#00A541',
        error: '#E53939',
        errorHover: '#E54949',
        black02: 'rgba(0, 0, 0, 0.2)',
        aidam: '#0C0992',
        aidam80: 'rgba(12, 9, 146, 0.8)',
      },
      fontSize: {
        xm: ['13px', '16px'],
        ss: ['14px', '16px'],
        ls: ['15px', '20px'],
        lm: ['15px', '18px'],
        lb: ['16px', '20px'],
        ln: ['18px', '24px'],
        lx: ['19px', '24px'],
        xb: ['20px', '24px'],
        '4.5xl': ['40px', '47px'],
      },
      boxShadow: {
        xg: '0 0 24px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
