import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
