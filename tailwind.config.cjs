/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      succes : '#23d160',
      colors: {
        reprodata : {
          '50' : '#FF9FD3',
          '100': '#FF8ACA',
          '200': '#FF61B8',
          '300': '#FF39A5',
          '400': '#FF1093',
          '500': '#E6007E',
          '600': '#AE005F',
          '700': '#760041',
          '800': '#3E0022',
          '900': '#060003'
        },
        datacont : {
          '50' : '#FA9FA5',
          '100': '#F98C93',
          '200': '#F7656F',
          '300': '#F53E4A',
          '400': '#F31826',
          '500': '#D70B18',
          '600': '#A20812',
          '700': '#6C060C',
          '800': '#370306',
          '900': '#020000'
        }
        // green : {
        //   '50' : '#B8F3CD',
        //   '100': '#A7F0C1',
        //   '200': '#84EAA8',
        //   '300': '#61E58F',
        //   '400': '#3EDF76',
        //   '500': '#23D160',
        //   '600': '#1BA14A',
        //   '700': '#137134',
        //   '800': '#0B411E',
        //   '900': '#031108'
        // }
      }
    },
    fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    }
  }
}