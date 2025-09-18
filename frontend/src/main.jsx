import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import {App} from './App.jsx'
import { ContextProvider } from '@/shared/api/contextProvider.jsx'
import { AuthProvider} from "@/shared/hooks/AuthContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
