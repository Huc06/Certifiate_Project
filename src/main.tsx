import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/provider.tsx'
import { StrictMode } from 'react'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
      <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>,
)
