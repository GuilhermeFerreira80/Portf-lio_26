import { useRef, useState, useEffect } from 'react'
import data from '../data/portfolioData.json'

function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08 }
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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  const primaryLink = (project.live && project.live !== '#')
    ? project.live
    : (project.github && project.github !== '#' ? project.github : null)

  return (
    <article
      ref={ref}
      className={`project-card reveal${visible ? ' visible' : ''}${project.featured ? ' project-featured' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card-inner">
        <div className="project-header">
          <div className="project-header-left">
            <div className="project-icon">
              <i className={`fas ${project.icon}`} />
            </div>
            {project.badge && (
              <span className="project-badge">{project.badge}</span>
            )}
          </div>
          <div className="project-links">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                className="project-link"
                aria-label={`${project.title} GitHub repository`}
                title="GitHub Repository"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github" />
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                className="project-link"
                aria-label={`${project.title} live demo`}
                title="Live Website"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-arrow-up-right-from-square" />
              </a>
            )}
          </div>
        </div>

        <h3 className="project-title">
          {primaryLink ? (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-title-link"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

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
  const [activeFilter, setActiveFilter] = useState('all')
  const list = data.projects[lang]
  const filters = data.projects.filters?.[lang] || []

  const filteredList = activeFilter === 'all'
    ? list
    : list.filter(p => p.category === activeFilter)

  const getCategoryCount = (key) => {
    if (key === 'all') return list.length
    return list.filter(p => p.category === key).length
  }

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'PROJECTS' : 'PROJETOS'}</span>
        <div className="section-line" />
      </div>

      {filters.length > 0 && (
        <div className="project-filters" role="tablist" aria-label="Filter projects by category">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              <span>{f.label}</span>
              <span className="filter-count">{getCategoryCount(f.key)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="projects-grid">
        {filteredList.map((p, i) => (
          <ProjectCard key={`${activeFilter}-${p.title}`} project={p} delay={i * 60} />
        ))}
      </div>
    </section>
  )
}
