/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Définition de votre palette
        'brand-light': '#c8f34c', // Vert Vif (Accent principal)
        'brand-dark': '#3f4b17',  // Vert Olive
        'text-dark': '#172b13',   // Vert Très Foncé (Couleur du texte principal/Fond sombre)
        'bg-light': '#efefef',    // Fond Clair
      },

      fontFamily: {
        // Titres : Utilise la font-family 'Agrandir' que nous avons déclarée
        heading: ['Agrandir', 'sans-serif'],
        // Texte simple : Utilise la font-family 'SF Pro' que nous avons déclarée, avec des fallbacks système
        sans: [
          'SF Pro', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Oxygen', 
          'Ubuntu', 
          'Cantarell', 
          'Fira Sans', 
          'Droid Sans', 
          'Helvetica Neue', 
          'sans-serif'
        ], 
      },
    },
  },
  plugins: [],
}