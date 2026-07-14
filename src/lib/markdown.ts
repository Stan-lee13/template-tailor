// Minimal markdown → HTML converter for pasting AI output into Tiptap.
// Supports: #/##/### headings, **bold**, *italic*, `code`, [links], - / 1. lists,
// > blockquotes, --- hr, paragraphs, line breaks.
export function markdownToHtml(md: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const inline = (s: string) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');

  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inQuote = false;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const closeQuote = () => { if (inQuote) { out.push('</blockquote>'); inQuote = false; } };

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeList(); closeQuote(); continue; }
    if (/^---+$/.test(line)) { closeList(); closeQuote(); out.push('<hr>'); continue; }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { closeList(); closeQuote(); const lvl = h[1].length; out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }

    if (/^>\s?/.test(line)) {
      closeList();
      if (!inQuote) { out.push('<blockquote>'); inQuote = true; }
      out.push(`<p>${inline(line.replace(/^>\s?/, ''))}</p>`);
      continue;
    } else { closeQuote(); }

    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      const kind = ul ? 'ul' : 'ol';
      if (listType !== kind) { closeList(); out.push(`<${kind}>`); listType = kind; }
      out.push(`<li>${inline((ul || ol)![1])}</li>`);
      continue;
    } else { closeList(); }

    out.push(`<p>${inline(line)}</p>`);
  }
  closeList(); closeQuote();
  return out.join('');
}
