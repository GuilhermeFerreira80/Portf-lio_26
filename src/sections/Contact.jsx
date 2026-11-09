import { useRef, useState } from 'react'
import data from '../data/portfolioData.json'
import { parseRichText } from '../data/parseRichText'
import { useReveal } from '../hooks/useReveal'
import { composeMessage, buildMailto, buildGmail, buildOutlook } from '../data/mailto'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function Contact({ lang }) {
  const [draft, setDraft] = useState(null) // { subject, body } after submit
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedMsg, setCopiedMsg] = useState(false)
  const contentRef = useRef(null)
  const visible = useReveal(contentRef)

  const c = data.contact[lang]
  const to = data.contact.email
  const personal = data.personal

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const message = composeMessage({
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      message: String(form.get('message') || '').trim(),
      lang,
    })
    setDraft(message)

    // A real anchor click is more reliable than assigning window.location
    const a = document.createElement('a')
    a.href = buildMailto(to, message)
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleCopyEmail = async () => {
    if (await copyText(to)) {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  const handleCopyMessage = async () => {
    if (!draft) return
    if (await copyText(`${draft.subject}\n\n${draft.body}`)) {
      setCopiedMsg(true)
      setTimeout(() => setCopiedMsg(false), 2000)
    }
  }

  return (
    <section id="contact" className="section section-last">
      <div className="section-header">
        <span className="section-tag">{lang === 'en' ? 'Contact' : 'Contacto'}</span>
        <div className="section-line" />
      </div>

      <div ref={contentRef} className={`reveal${visible ? ' visible' : ''}`}>
        <p className="contact-intro">{parseRichText(c.intro)}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
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
          <button type="submit" className={`btn-send${draft ? ' sent' : ''}`}>
            <span>{draft ? c.sentButton : c.sendButton}</span>
            <i className={`fas ${draft ? 'fa-check' : 'fa-arrow-right'}`} />
          </button>
        </form>

        {draft && (
          <div className="mail-fallback" role="status">
            <p>{c.fallbackText}</p>
            <div className="mail-fallback-actions">
              <a href={buildGmail(to, draft)} target="_blank" rel="noopener noreferrer" className="chip">
                <i className="fab fa-google" /> Gmail
              </a>
              <a href={buildOutlook(to, draft)} target="_blank" rel="noopener noreferrer" className="chip">
                <i className="fab fa-microsoft" /> Outlook
              </a>
              <button type="button" onClick={handleCopyMessage} className="chip">
                <i className={`fas ${copiedMsg ? 'fa-check' : 'fa-copy'}`} />
                {copiedMsg ? c.copiedMessageLabel : c.copyMessageLabel}
              </button>
            </div>
          </div>
        )}

        <div className="contact-alternatives">
          <a href={`mailto:${to}`} className="contact-alt-link">
            <i className="far fa-envelope" />
            <span>{to}</span>
          </a>
          <button type="button" onClick={handleCopyEmail} className="contact-alt-link" aria-label={c.copyLabel}>
            <i className={`fas ${copiedEmail ? 'fa-check' : 'fa-copy'}`} />
            <span>{copiedEmail ? c.copiedLabel : c.copyLabel}</span>
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
