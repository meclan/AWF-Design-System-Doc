import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { BrandThemeProvider } from './contexts/BrandThemeContext.jsx'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <BrandThemeProvider>
          <App />
        </BrandThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
