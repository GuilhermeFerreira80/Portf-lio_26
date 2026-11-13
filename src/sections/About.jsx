import { useEffect, useRef, useState } from 'react'
import data from '../data/portfolioData.json'
import { parseRichText } from '../data/parseRichText'
import { useReveal } from '../hooks/useReveal'

function useCounter(target, visible) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let current = 0
    const step = Math.max(1, Math.ceil(target / 25))
    const id = setInterval(() => {
      current += step
      if (current >= target) { current = target; clearInterval(id) }
      setCount(current)
    }, 45)
    return () => clearInterval(id)
  }, [visible, target])
  return count
}

function StatCard({ target, suffix, label }) {
  const ref = useRef(null)
  const visible = useReveal(ref)
  const count = useCounter(target, visible)
  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-num">{count}{suffix}</span>
      <p className="stat-label">{label}</p>
    </div>
  )
}

export default function About({ lang }) {
  const textRef = useRef(null)
  const focusRef = useRef(null)
  const credRef = useRef(null)
  const statsRef = useRef(null)
  const textVisible = useReveal(textRef)
  const focusVisible = useReveal(focusRef)
  const credVisible = useReveal(credRef)
  const statsVisible = useReveal(statsRef)

  const aboutData = data.about[lang]
  const cred = aboutData.credentials

  return (
    <section id="about" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'About' : 'Sobre'}</span>
        <div className="section-line" />
      </div>

      <div className={`reveal${textVisible ? ' visible' : ''}`} ref={textRef}>
        {aboutData.paragraphs.map((p, i) => (
          <p key={i} className="about-text">{parseRichText(p)}</p>
        ))}
      </div>

      {aboutData.focusItems && (
        <div className={`focus-block reveal${focusVisible ? ' visible' : ''}`} ref={focusRef}>
          <h3 className="focus-heading">{aboutData.focusTitle}</h3>
          <div className="focus-grid">
            {aboutData.focusItems.map((item, i) => (
              <div key={i} className="focus-item">
                <i className={`fas ${item.icon} focus-item-icon`} />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cred && (
        <div className={`credentials-block reveal${credVisible ? ' visible' : ''}`} ref={credRef}>
          <div className="cred-group">
            <h3 className="focus-heading">{cred.educationTitle}</h3>
            <div className="cred-list">
              {cred.education.map((edu, i) => (
                <div key={i} className="cred-row">
                  <div className="cred-main">
                    <h4>{edu.title}</h4>
                    <p className="cred-org">{edu.org}{edu.detail ? ` · ${edu.detail}` : ''}</p>
                  </div>
                  <span className="cred-period">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cred-split">
            <div className="cred-group">
              <h3 className="focus-heading">{cred.certificationsTitle}</h3>
              {cred.certifications.map((cert, i) => (
                <div key={i} className="cred-row">
                  <div className="cred-main">
                    <h4>
                      {cert.badge && <span className="cred-badge">{cert.badge}</span>}
                      {cert.title}
                    </h4>
                    <p className="cred-org">{cert.org}</p>
                  </div>
                  <span className="cred-period">{cert.period}</span>
                </div>
              ))}
            </div>

            <div className="cred-group">
              <h3 className="focus-heading">{cred.languagesTitle}</h3>
              <div className="lang-pills">
                {cred.languages.map((l, i) => (
                  <span key={i} className="lang-pill">
                    <strong>{l.name}</strong>
                    <span>{l.level}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="cred-group">
            <h3 className="focus-heading">{cred.volunteeringTitle}</h3>
            {cred.volunteering.map((vol, i) => (
              <div key={i} className="cred-row">
                <div className="cred-main">
                  <h4>{vol.title}</h4>
                  <p className="cred-org">{vol.desc}</p>
                </div>
                <span className="cred-period">{vol.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`stats-grid reveal${statsVisible ? ' visible' : ''}`} ref={statsRef}>
        {aboutData.stats.map((stat, i) => (
          <StatCard key={i} target={stat.target} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  )
}
