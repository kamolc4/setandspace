import React from "react";

function parseLine(text: string): React.ReactNode {
  // Handle **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{parseLine(item)}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={key++}>{parseLine(line.slice(2))}</blockquote>);
    } else if (line.trim() !== "") {
      elements.push(<p key={key++}>{parseLine(line)}</p>);
    }
    i++;
  }

  return <>{elements}</>;
}
