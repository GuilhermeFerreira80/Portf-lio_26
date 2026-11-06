import { useRef, useState, useEffect } from 'react'
import data from '../data/portfolioData.json'
import { parseRichText } from '../data/parseRichText'

function useReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return visible
}

export default function Contact({ lang }) {
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const formRef = useRef(null)
  const contentRef = useRef(null)
  const visible = useReveal(contentRef)

  const c = data.contact[lang]
  const personal = data.personal

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim()
    const message = (formData.get('message') || '').toString().trim()

    const subject = encodeURIComponent(
      lang === 'en'
        ? `Portfolio Contact from ${name || 'Visitor'}`
        : `Contacto via Portfólio de ${name || 'Visitante'}`
    )
    const body = encodeURIComponent(
      `${message}\n\n---\n${name ? `${lang === 'en' ? 'From' : 'De'}: ${name}\n` : ''}${email ? `Email: ${email}` : ''}`
    )

    window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${body}`

    setSent(true)
    setTimeout(() => {
      setSent(false)
      formRef.current?.reset()
    }, 3000)
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${data.contact.email}`
    }
  }

  return (
    <section id="contact" className="section section-last">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'CONTACT' : 'CONTACTO'}</span>
        <div className="section-line" />
      </div>

      <div ref={contentRef} className={`reveal${visible ? ' visible' : ''}`}>
        <p className="contact-intro">{parseRichText(c.intro)}</p>

        <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">{lang === 'en' ? 'Name' : 'Nome'}</label>
              <input type="text" id="contact-name" name="name" placeholder={c.namePlaceholder} autoComplete="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input type="email" id="contact-email" name="email" placeholder={c.emailPlaceholder} autoComplete="email" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">{lang === 'en' ? 'Message' : 'Mensagem'}</label>
            <textarea id="contact-message" name="message" rows={5} placeholder={c.messagePlaceholder} required />
          </div>
          <button type="submit" className={`btn-send${sent ? ' sent' : ''}`}>
            <span>{sent ? c.sentButton : c.sendButton}</span>
            <i className={`fas ${sent ? 'fa-check' : 'fa-paper-plane'}`} />
          </button>
        </form>

        <div className="contact-alternatives">
          <a href={`mailto:${data.contact.email}`} className="contact-alt-link">
            <i className="fas fa-envelope" />
            <span>{data.contact.email}</span>
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="contact-alt-btn"
            aria-label={c.copyLabel || 'Copy Email'}
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
            <span>{copied ? (c.copiedLabel || 'Copied!') : (c.copyLabel || 'Copy Email')}</span>
          </button>
          <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="contact-alt-link">
            <i className="fab fa-github" />
            <span>GitHub</span>
          </a>
          <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="contact-alt-link">
            <i className="fab fa-linkedin-in" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  )
}
