import { useRef } from 'react'
import data from '../data/portfolioData.json'
import { useReveal } from '../hooks/useReveal'

function SkillBar({ label, pct, visible }) {
  return (
    <div className="skill-bar-item">
      <div className="skill-bar-header">
        <span>{label}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ transform: `scaleX(${visible ? pct / 100 : 0})` }} />
      </div>
    </div>
  )
}

function SkillBlock({ block, delay }) {
  const ref = useRef(null)
  const visible = useReveal(ref)

  return (
    <div ref={ref} className={`skill-category reveal${visible ? ' visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <h3 className="skill-cat-title">
        <i className={`fas ${block.icon}`} />
        <span>{block.title}</span>
      </h3>
      {block.type === 'bars' && (
        <div className="skill-bars">
          {block.items.map(b => <SkillBar key={b.label} label={b.label} pct={b.pct} visible={visible} />)}
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
        <span className="section-tag">{lang === 'en' ? 'Skills' : 'Competências'}</span>
        <div className="section-line" />
      </div>
      <div className="skills-content">
        {categories.map((block, i) => <SkillBlock key={block.key} block={block} delay={i * 70} />)}
      </div>
    </section>
  )
}
