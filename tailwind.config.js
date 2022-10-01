/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors:{
        nav: '#EFEFEF',
        bg:'#fff',
        form: '#F5F5F5',
        tblhead: '#E0E0E0',
        title: '#515151',
        divider: '#CCCCCC'
      },
      boxShadow: {
        box: '0px 2px 2px rgba(0, 0, 0, 0.4)',
      },
      fontSize: {
        pvsm: '13px'
      }
    },
  },
  plugins: [],
}
