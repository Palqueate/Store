import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/styles.css'

// Visit /#showcase (or /#showcase/<component>) to browse the component docs;
// anything else loads the app. The docs site is code-split — its chunk (and
// Heroicons) only downloads when you actually open the showcase.
const Showcase = lazy(() => import('./lib/Showcase'))

const isShowcase = () => window.location.hash.replace(/^#\/?/, '').split('/')[0] === 'showcase'

// Only reload when crossing the app <-> showcase boundary. Internal docs
// navigation (changing the component slug) is handled inside DocsApp.
const current = isShowcase()
window.addEventListener('hashchange', () => { if (isShowcase() !== current) window.location.reload() })

createRoot(document.getElementById('root')!).render(
  current ? <Suspense fallback={null}><Showcase /></Suspense> : <BrowserRouter><App /></BrowserRouter>,
)
