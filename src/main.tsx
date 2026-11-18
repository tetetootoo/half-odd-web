import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App.tsx'

const isFitzProposal = /^\/proposal\/fitz\/?$/.test(window.location.pathname)
inject({ framework: 'react', disableAutoTrack: !isFitzProposal })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
