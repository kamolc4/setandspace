import React from "react";
import Link from "next/link";

function parseInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  // Order matters: backtick code first (prevent matching inside it), then links, bold, italic
  const regex = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // `inline code`
      nodes.push(
        <code key={k++}>{match[1]}</code>
      );
    } else if (match[2] !== undefined) {
      // [link text](url)
      const href = match[3];
      const isExternal = /^https?:\/\//.test(href);
      nodes.push(
        isExternal
          ? <a key={k++} href={href} target="_blank" rel="noopener noreferrer">{match[2]}</a>
          : <Link key={k++} href={href}>{match[2]}</Link>
      );
    } else if (match[4] !== undefined) {
      // **bold**
      nodes.push(<strong key={k++}>{match[4]}</strong>);
    } else if (match[5] !== undefined) {
      // *italic*
      nodes.push(<em key={k++}>{match[5]}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) return text;
  return <>{nodes}</>;
}

export function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      // Skip H1 — rendered by the page template above this component
      i++;
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={key++}>{parseInline(line.slice(3))}</h2>);
      i++;
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++}>{parseInline(line.slice(4))}</h3>);
      i++;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={key++}>
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ol>
      );
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={key++}>{parseInline(line.slice(2))}</blockquote>);
      i++;
    } else if (line === "---" || line === "***" || line === "___") {
      elements.push(<hr key={key++} />);
      i++;
    } else if (line.trim() !== "") {
      elements.push(<p key={key++}>{parseInline(line)}</p>);
      i++;
    } else {
      i++;
    }
  }

  return <>{elements}</>;
}
