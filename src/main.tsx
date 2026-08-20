import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css'
import App from './App.tsx'

/**
 * ==========================================
 * GUÍA RÁPIDA DE ESTILOS 
 * ==========================================
 * Este bloque configura el "Tema Global" de la aplicación usando Material-UI (MUI).
 * Aquí es donde puedes cambiar los colores por defecto de los componentes
 * sin tener que ir archivo por archivo.
 * 
 * ¿Cómo funciona?
 * - MuiButton: Controla cómo se ven todos los botones de la app.
 * - MuiInputBase / MuiInputLabel / MuiOutlinedInput: Controlan las cajas de texto (inputs).
 * - MuiMenu / MuiMenuItem / MuiSelect: Controlan los menús desplegables.
 * 
 * ¿Cómo cambiar un color?
 * Solo busca propiedades como `color`, `backgroundColor` o `borderColor`.
 * Puedes reemplazar los valores 'rgba(R, G, B, Opacidad)' por códigos Hex (ej. '#FF0000' para rojo).
 * 
 * Estados especiales:
 * - '&:hover': Define el estilo cuando el usuario pasa el ratón por encima.
 * - '&.Mui-focused': Define el estilo cuando el usuario hace clic para escribir.
 */
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(251, 244, 151, 1)',
          color: 'rgba(0, 27, 57, 1)',
          '&:hover': {
            backgroundColor: 'rgba(251, 244, 151, 0.8)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 1)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 1)',
          '&.Mui-focused': {
            color: 'rgba(251, 244, 151, 1)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: 'rgba(251, 244, 151, 0.5)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(251, 244, 151, 0.8) !important',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(251, 244, 151, 1) !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255, 255, 255, 1)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0, 27, 57, 1)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 61, 38, 0.8)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 61, 38, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(0, 61, 38, 0.8)',
            },
          },
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
