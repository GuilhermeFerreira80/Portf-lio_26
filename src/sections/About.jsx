import { useEffect, useRef, useState } from 'react'
import data from '../data/portfolioData.json'
import { parseRichText } from '../data/parseRichText'

function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    // Use IntersectionObserver relative to the right-panel scroll container
    const panel = document.getElementById('right-panel')
    if (!panel || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { root: panel, threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return visible
}

function useCounter(target, visible) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let current = 0
    const step = Math.ceil(target / 30)
    const id = setInterval(() => {
      current += step
      if (current >= target) { current = target; clearInterval(id) }
      setCount(current)
    }, 50)
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
      <span className="stat-num">{count}</span><span className="stat-suffix">{suffix}</span>
      <p className="stat-label">{label}</p>
    </div>
  )
}

export default function About({ lang }) {
  const textRef = useRef(null)
  const statsRef = useRef(null)
  const textVisible = useReveal(textRef)
  const statsVisible = useReveal(statsRef)

  const aboutData = data.about[lang]

  return (
    <section id="about" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'ABOUT' : 'SOBRE'}</span>
        <div className="section-line" />
      </div>

      <div className={`reveal${textVisible ? ' visible' : ''}`} ref={textRef}>
        {aboutData.paragraphs.map((p, i) => (
          <p key={i} className="about-text">{parseRichText(p)}</p>
        ))}
      </div>

      <div
        className={`stats-grid reveal${statsVisible ? ' visible' : ''}`}
        ref={statsRef}
        style={{ transitionDelay: '0.15s' }}
      >
        {aboutData.stats.map((stat, i) => (
          <StatCard key={i} target={stat.target} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  )
}
