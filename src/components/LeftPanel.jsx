import { useState, useEffect, useRef, useCallback } from 'react'
import data from '../data/portfolioData.json'
import profileImg from '../assets/profile.png'

const NAV_LABELS = {
  en: { about: 'About', projects: 'Projects', skills: 'Skills', contact: 'Contact', cv: 'Download CV' },
  pt: { about: 'Sobre', projects: 'Projetos', skills: 'Competências', contact: 'Contacto', cv: 'Descarregar CV' },
}

const NAV_ITEMS = ['about', 'projects', 'skills', 'contact']

/*
 * Any PDF dropped in src/data/ is picked up automatically.
 * If you add language variants (…_EN.pdf / …_PT.pdf) the right one is used per language.
 */
const cvFiles = import.meta.glob('../data/*.pdf', { eager: true, query: '?url', import: 'default' })

function getCv(lang) {
  const entries = Object.entries(cvFiles)
  if (!entries.length) return data.personal.cvFile ? { url: data.personal.cvFile, name: 'CV.pdf' } : null
  const byLang = (code) => entries.find(([path]) => new RegExp(`_${code}\\.pdf$`, 'i').test(path))
  const [path, url] = byLang(lang) || byLang('en') || entries[0]
  return { url, name: path.split('/').pop() }
}

/* Subtle text scramble on hover */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function useScramble(text) {
  const [output, setOutput] = useState(text)
  const timer = useRef(null)

  useEffect(() => {
    setOutput(text)
    return () => clearInterval(timer.current)
  }, [text])

  const run = useCallback(() => {
    clearInterval(timer.current)
    let progress = 0
    timer.current = setInterval(() => {
      progress += 0.5
      setOutput(
        text.split('').map((ch, i) =>
          ch === ' ' || i < progress ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join('')
      )
      if (progress >= text.length) clearInterval(timer.current)
    }, 28)
  }, [text])

  return [output, run]
}

export default function LeftPanel({ activeSection, onNavClick, lang }) {
  const personal = data.personal
  const labels = NAV_LABELS[lang]
  const cv = getCv(lang)
  const displayName = personal.fullName || personal.name
  const [scrambled, scramble] = useScramble(displayName)

  return (
    <aside className="left-panel">
      <div className="left-top">
        <h1 className="name" onMouseEnter={scramble} aria-label={displayName}>
          <span aria-hidden="true">{scrambled}</span>
        </h1>

        <p className="title-role">{personal[lang].role}</p>

        {personal.location && (
          <p className="location">
            <span className="status-dot" aria-hidden="true" />
            {personal.location}
          </p>
        )}

        <p className="subtitle">{personal[lang].subtitle}</p>

        <nav className="sidebar-nav" aria-label="Section navigation">
          <ul>
            {NAV_ITEMS.map((id, i) => (
              <li key={id}>
                <button
                  className={`nav-link${activeSection === id ? ' active' : ''}`}
                  onClick={() => onNavClick(id)}
                  aria-current={activeSection === id ? 'true' : undefined}
                >
                  <span className="nav-index">0{i + 1}</span>
                  <span className="nav-line" />
                  <span className="nav-label">{labels[id]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="profile-photo-wrapper">
        <img src={profileImg} alt={displayName} className="profile-photo" draggable="false" />
      </div>

      <div className="social-links">
        {cv && (
          <a href={cv.url} className="cv-btn" download={cv.name} aria-label={labels.cv}>
            <i className="fas fa-arrow-down" />
            <span>{labels.cv}</span>
          </a>
        )}
        <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub" title="GitHub">
          <i className="fab fa-github" />
        </a>
        <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn" title="LinkedIn">
          <i className="fab fa-linkedin-in" />
        </a>
        {data.contact?.email && (
          <a href={`mailto:${data.contact.email}`} className="social-icon" aria-label="Email" title={data.contact.email}>
            <i className="far fa-envelope" />
          </a>
        )}
      </div>
    </aside>
  )
}
