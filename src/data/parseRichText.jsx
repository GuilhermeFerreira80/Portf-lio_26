/**
 * Parses a string containing <highlight>…</highlight> and <b>…</b> markers
 * into an array of React elements.
 *
 * This lets us store rich text in the JSON data file using simple markers
 * instead of raw HTML, and render it safely in React.
 */
export function parseRichText(str) {
  if (!str) return str
  // Split on <highlight>…</highlight> and <b>…</b> tags
  const parts = []
  const regex = /<(highlight|b)>(.*?)<\/\1>/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(str)) !== null) {
    // Push the text before this match
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index))
    }
    const tag = match[1]
    const inner = match[2]
    if (tag === 'highlight') {
      parts.push(<span key={match.index} className="highlight">{inner}</span>)
    } else if (tag === 'b') {
      parts.push(<b key={match.index}>{inner}</b>)
    }
    lastIndex = regex.lastIndex
  }

  // Push remaining text
  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex))
  }

  return parts
}
