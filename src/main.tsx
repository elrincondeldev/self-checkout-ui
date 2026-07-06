import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// This app registers no service worker. Any SW found on this origin was
// left behind by another project that ran on the same localhost port
// (e.g. an MSW mock worker) and would intercept our API calls — evict it.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length === 0) return
    registrations.forEach((registration) => registration.unregister())
    console.warn(
      `Unregistered ${registrations.length} stale service worker(s) from a previous app on this port — reload the page once.`,
    )
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
