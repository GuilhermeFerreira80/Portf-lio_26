import { useRef, useState } from 'react'
import data from '../data/portfolioData.json'
import { useReveal } from '../hooks/useReveal'

const isLink = (url) => url && url !== '#'

function ProjectCard({ project, delay }) {
  const ref = useRef(null)
  const visible = useReveal(ref, 0.08)
  const primaryLink = isLink(project.live) ? project.live : (isLink(project.github) ? project.github : null)

  return (
    <article
      ref={ref}
      className={`project-card reveal${visible ? ' visible' : ''}${project.featured ? ' project-featured' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="project-header">
        <div className="project-header-left">
          <i className={`fas ${project.icon} project-icon`} />
          {project.badge && <span className="project-badge">{project.badge}</span>}
        </div>
        <div className="project-links">
          {isLink(project.github) && (
            <a href={project.github} className="project-link" aria-label={`${project.title} — GitHub`} title="GitHub" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" />
            </a>
          )}
          {isLink(project.live) && (
            <a href={project.live} className="project-link" aria-label={`${project.title} — live`} title="Live" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-arrow-up-right-from-square" />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-title">
        {primaryLink ? (
          <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="project-title-link">
            {project.title}
            <i className="fas fa-arrow-right project-arrow" aria-hidden="true" />
          </a>
        ) : project.title}
      </h3>

      <p className="project-desc">{project.desc}</p>

      <div className="project-tags">
        {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </article>
  )
}

export default function Projects({ lang }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const list = data.projects[lang]
  const filters = data.projects.filters?.[lang] || []

  const filtered = activeFilter === 'all' ? list : list.filter(p => p.category === activeFilter)
  const count = (key) => (key === 'all' ? list.length : list.filter(p => p.category === key).length)

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'Projects' : 'Projetos'}</span>
        <div className="section-line" />
      </div>

      {filters.length > 0 && (
        <div className="project-filters" role="tablist" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              <span className="filter-count">{count(f.key)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="projects-grid">
        {filtered.map((p, i) => (
          <ProjectCard key={`${activeFilter}-${p.title}`} project={p} delay={i * 50} />
        ))}
      </div>
    </section>
  )
}
