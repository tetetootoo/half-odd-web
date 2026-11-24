import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject, pageview } from '@vercel/analytics'
import './index.css'
import App from './App.tsx'
import { isSuzaanProposal } from './proposalRoute'

const isFitzProposal = /^\/proposal\/fitz\/?$/.test(window.location.pathname)
inject({ framework: 'react', disableAutoTrack: !isFitzProposal })

if (isSuzaanProposal) {
  pageview({ path: '/proposal/suzaan-sauerman' })
  document.documentElement.classList.add('suzaan-proposal')
  const robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex'
  document.head.append(robots)
  document.title = 'suzaan-sauerman-proposal.md · half odd'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
