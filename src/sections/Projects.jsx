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

function ProjectCard({ project, delay }) {
  const ref = useRef(null)
  const visible = useReveal(ref)

  const handleMouseMove = (e) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <article
      ref={ref}
      className={`project-card reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card-inner">
        <div className="project-header">
          <div className="project-icon">
            <i className={`fas ${project.icon}`} />
          </div>
          <div className="project-links">
            {project.github && (
              <a href={project.github} className="project-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github" />
              </a>
            )}
            {project.live && (
              <a href={project.live} className="project-link" aria-label="Live demo" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-external-link-alt" />
              </a>
            )}
          </div>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>
        <div className="project-tags">
          {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
      <div className="project-glow" />
    </article>
  )
}

export default function Projects({ lang }) {
  const list = data.projects[lang]
  return (
    <section id="projects" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'PROJECTS' : 'PROJETOS'}</span>
        <div className="section-line" />
      </div>
      <div className="projects-grid">
        {list.map((p, i) => (
          <ProjectCard key={i} project={p} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}
