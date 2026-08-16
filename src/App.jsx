import { useEffect, useRef, useState, useCallback } from 'react'
import CanvasBg from './components/CanvasBg'
import LeftPanel from './components/LeftPanel'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'
import data from './data/portfolioData.json'

const SECTIONS = ['about', 'projects', 'skills', 'contact']

export default function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [lang, setLang] = useState('en')
  const rightRef = useRef(null)
  const cursorRef = useRef(null)

  /* Cursor glow */
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  /* Scroll spy — watches right panel scroll */
  useEffect(() => {
    const panel = rightRef.current
    if (!panel) return

    const onScroll = () => {
      const panelTop = panel.getBoundingClientRect().top
      let current = SECTIONS[0]

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        // section is considered active when its top passes the upper 40% of the viewport
        if (rect.top - panelTop < panel.clientHeight * 0.4) {
          current = id
        }
      })
      setActiveSection(current)
    }

    panel.addEventListener('scroll', onScroll, { passive: true })
    return () => panel.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll to section */
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    const panel = rightRef.current
    if (!el || !panel) return
    panel.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' })
  }, [])

  const toggleLang = () => setLang(l => l === 'en' ? 'pt' : 'en')

  return (
    <>
      <CanvasBg />
      <div className="cursor-glow" ref={cursorRef} />

      {/* Language toggle */}
      <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
        {lang.toUpperCase()}
      </button>

      <div className="layout">
        <LeftPanel
          activeSection={activeSection}
          onNavClick={scrollToSection}
          lang={lang}
        />

        <main className="right-panel" ref={rightRef} id="right-panel">
          <About lang={lang} />
          <Projects lang={lang} />
          <Skills lang={lang} />
          <Contact lang={lang} />

          <footer className="site-footer">
            <p>
              {data.personal[lang].footerText} <span className="highlight">{data.personal.name.charAt(0) + data.personal.name.slice(1).toLowerCase()}</span> · {data.personal.year}
            </p>
          </footer>
        </main>
      </div>
    </>
  )
}
