/**
 * Helpers to build email links for the contact form.
 *
 * mailto: depends on the visitor having a default mail app configured
 * (on Windows this is often not the case), so we also generate Gmail and
 * Outlook web compose links as fallbacks.
 */

// RFC 6068 recommends CRLF line breaks inside mailto bodies
const crlf = (str) => str.replace(/\r?\n/g, '\r\n')

export function composeMessage({ name, email, message, lang }) {
  const isEn = lang !== 'pt'
  const subject = isEn
    ? `Portfolio contact — ${name || 'Visitor'}`
    : `Contacto via portfólio — ${name || 'Visitante'}`

  const signature = [
    name && `${isEn ? 'Name' : 'Nome'}: ${name}`,
    email && `Email: ${email}`,
  ].filter(Boolean).join('\n')

  const body = signature ? `${message}\n\n---\n${signature}` : message
  return { subject, body }
}

export function buildMailto(to, { subject, body }) {
  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(crlf(body))}`)
  return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`
}

export function buildGmail(to, { subject, body }) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildOutlook(to, { subject, body }) {
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

