import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { queryClient } from './lib/queryClient.js'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
