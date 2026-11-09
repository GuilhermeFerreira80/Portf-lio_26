import { useEffect, useRef, useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import LeftPanel from './components/LeftPanel'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'
import data from './data/portfolioData.json'

const SECTIONS = ['about', 'projects', 'skills', 'contact']

function getInitialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'pt') return saved
  } catch { /* ignore */ }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export default function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [lang, setLang] = useState(getInitialLang)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const rightRef = useRef(null)
  const spotRef = useRef(null)

  /* Persist theme + language */
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fafafa')
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  /* Subtle cursor spotlight */
  useEffect(() => {
    const move = (e) => {
      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  /* Scroll spy — right panel on desktop, window on mobile */
  useEffect(() => {
    const panel = rightRef.current
    if (!panel) return

    const onScroll = () => {
      const isMobile = window.innerWidth <= 768
      const top = isMobile ? 0 : panel.getBoundingClientRect().top
      const height = isMobile ? window.innerHeight : panel.clientHeight
      let current = SECTIONS[0]
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - top < height * 0.42) current = id
      })
      setActiveSection(current)
    }

    panel.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      panel.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    const panel = rightRef.current
    if (!el || !panel) return
    if (window.innerWidth <= 768) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      panel.scrollTo({ top: el.offsetTop - 48, behavior: 'smooth' })
    }
  }, [])

  /* Theme toggle with a circular reveal (View Transitions API when available) */
  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  const toggleLang = () => setLang(l => (l === 'en' ? 'pt' : 'en'))

  const displayName = data.personal.fullName || data.personal.name

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <div className="spotlight" ref={spotRef} aria-hidden="true" />

      <div className="top-controls">
        <button className="ctrl-btn" onClick={toggleLang} aria-label="Toggle language" title="EN / PT">
          {lang.toUpperCase()}
        </button>
        <button
          className="ctrl-btn ctrl-icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
        </button>
      </div>

      <div className="layout">
        <LeftPanel activeSection={activeSection} onNavClick={scrollToSection} lang={lang} />

        <main className="right-panel" ref={rightRef} id="right-panel">
          <About lang={lang} />
          <Projects lang={lang} />
          <Skills lang={lang} />
          <Contact lang={lang} />

          <footer className="site-footer">
            <p>
              {data.personal[lang].footerText}{' '}
              <a href={data.personal.socials.github} target="_blank" rel="noopener noreferrer" className="footer-link">
                {displayName}
              </a>{' '}
              · {data.personal.year}
            </p>
          </footer>
        </main>
      </div>
    </>
  )
}
