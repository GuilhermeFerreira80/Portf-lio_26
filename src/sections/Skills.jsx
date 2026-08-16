import { useRef, useState, useEffect } from 'react'
import data from '../data/portfolioData.json'

function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const panel = document.getElementById('right-panel')
    if (!panel || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { root: panel, threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return visible
}

function SkillBar({ label, pct, visible }) {
  return (
    <div className="skill-bar-item">
      <div className="skill-bar-header">
        <span>{label}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}

function SkillBlock({ block, delay }) {
  const ref = useRef(null)
  const visible = useReveal(ref)

  return (
    <div
      ref={ref}
      className={`skill-category reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="skill-cat-title">
        <i className={`fas ${block.icon}`} />
        <span>{block.title}</span>
      </h3>
      {block.type === 'bars' && (
        <div className="skill-bars">
          {block.items.map(b => (
            <SkillBar key={b.label} label={b.label} pct={b.pct} visible={visible} />
          ))}
        </div>
      )}
      {block.type === 'pills' && (
        <div className="skill-pills">
          {block.items.map(p => <span key={p} className="pill">{p}</span>)}
        </div>
      )}
    </div>
  )
}

export default function Skills({ lang }) {
  const categories = data.skills[lang].categories

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'SKILLS' : 'COMPETÊNCIAS'}</span>
        <div className="section-line" />
      </div>
      <div className="skills-content">
        {categories.map((block, i) => (
          <SkillBlock key={block.key} block={block} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}
