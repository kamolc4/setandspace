import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Ścieżka nawigacji" style={{ marginBottom: "1.5rem" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25rem 0.5rem",
          listStyle: "none",
          padding: 0,
          margin: 0,
          alignItems: "center",
        }}
      >
        <li>
          <Link
            href="/"
            className="text-label"
            style={{ color: "var(--text-muted)" }}
          >
            Strona główna
          </Link>
        </li>
        {items.map((item, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span
              aria-hidden="true"
              className="text-label"
              style={{ color: "var(--stone)" }}
            >
              /
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-label"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-label"
                style={{ color: "var(--text-primary)" }}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
