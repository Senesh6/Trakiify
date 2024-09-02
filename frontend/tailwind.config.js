module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
    important: '#root',
    corePlugins:{
      preflight: false,
    }, 
    theme: {
      screens:{
        sm:'600px',
        md:'900px',
        lg:'1200px',
        xl:'1536px'
      },
      colors: {
        'primary': '#1D1E22',
        'secondary': '#2374F7',
        'light-blue':'#72A6FA',
        'taupe-gray':'#81818D',
        'jet':'#2B2B2B',
        'red':'#E95054',
        'green':'#95d5b2',
        'yellow':'#F09917',
        'white': '#FFF',
        'gray':'#757575',
        'tan':'#D5AC95',
        'success':'#56a847',
        'error':'#f44336',
      },
      fontFamily: {
        sans: ['popins', 'sans-serif'],
      },
      extend: {},
    },
    plugins: [],
  }