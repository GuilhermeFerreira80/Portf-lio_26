import { useRef, useState } from 'react'
import data from '../data/portfolioData.json'
import { parseRichText } from '../data/parseRichText'

export default function Contact({ lang }) {
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)

  const c = data.contact[lang]
  const personal = data.personal

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      formRef.current?.reset()
    }, 3000)
  }

  return (
    <section id="contact" className="section section-last">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'CONTACT' : 'CONTACTO'}</span>
        <div className="section-line" />
      </div>

      <p className="contact-intro">{parseRichText(c.intro)}</p>

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
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
        <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="contact-alt-link">
          <i className="fab fa-linkedin-in" />
          <span>LinkedIn</span>
        </a>
      </div>
    </section>
  )
}
