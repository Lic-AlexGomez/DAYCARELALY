// Importa react en tu bundle
import React from "react";
import ReactDOM from "react-dom/client"; // Cambio aquí para usar 'client'

// Incluye tu archivo tailwind.css y otros estilos
import '../styles/tailwind.css';
import "../styles/index.css";

// Importa tu propio componente
import Layout from "./layout";

// Renderiza tu aplicación React
const root = ReactDOM.createRoot(document.querySelector("#app")); // Crea el root
root.render(<Layout />); // Usa render() para montar el componente
