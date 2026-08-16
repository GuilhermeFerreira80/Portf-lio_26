import { useState, useEffect } from 'react'
import data from '../data/portfolioData.json'
import profileImg from '../assets/profile.png'

const NAV_LABELS = {
  en: { about: 'ABOUT', projects: 'PROJECTS', skills: 'SKILLS', contact: 'CONTACT', cv: 'CV' },
  pt: { about: 'SOBRE', projects: 'PROJETOS', skills: 'COMPETÊNCIAS', contact: 'CONTACTO', cv: 'CV' },
}

const NAV_ITEMS = ['about', 'projects', 'skills', 'contact']

export default function LeftPanel({ activeSection, onNavClick, lang }) {
  const [glitching, setGlitching] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  const personal = data.personal
  const labels = NAV_LABELS[lang]
  const subtitle = personal[lang].subtitle

  // Typing animation for subtitle
  useEffect(() => {
    setTypedText('')
    setTypingDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setTypedText(subtitle.slice(0, i))
      if (i >= subtitle.length) {
        clearInterval(timer)
        setTimeout(() => setTypingDone(true), 800)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [lang, subtitle])

  const nameChars = personal.name.split('')

  return (
    <aside className="left-panel">
      <div className="left-top">
        {/* Name with glitch */}
        <div className="name-block">
          <h1
            className={`name${glitching ? ' glitching' : ''}`}
            onMouseEnter={() => setGlitching(true)}
            onMouseLeave={() => setGlitching(false)}
          >
            {nameChars.map((char, i) => (
              <span key={i} className="name-char" style={{ '--i': i }}>{char}</span>
            ))}
          </h1>

          <p className="title-role">{personal[lang].role}</p>

          <p className={`subtitle${typingDone ? '' : ' typing'}`}>
            {typedText}
          </p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Section navigation">
          <ul>
            {NAV_ITEMS.map((id) => (
              <li key={id}>
                <button
                  className={`nav-link${activeSection === id ? ' active' : ''}`}
                  onClick={() => onNavClick(id)}
                  aria-label={`Go to ${id} section`}
                >
                  <span className="nav-line" />
                  <span className="nav-label">{labels[id]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Profile photo */}
      <div className="profile-photo-wrapper">
        <img
          src={profileImg}
          alt={personal.name}
          className="profile-photo"
          draggable="false"
        />
      </div>

      {/* Social links */}
      <div className="social-links">
        <a href={personal.cvFile} className="cv-btn" download aria-label="Download CV">
          <i className="fas fa-download" />
          <span>{labels.cv}</span>
        </a>
        <a
          href={personal.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="LinkedIn"
        >
          <i className="fab fa-linkedin-in" />
        </a>
        <a
          href={personal.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="GitHub"
        >
          <i className="fab fa-github" />
        </a>
      </div>
    </aside>
  )
}

