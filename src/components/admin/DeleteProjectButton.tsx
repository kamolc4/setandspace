"use client";

import { useTransition } from "react";
import { deletePortfolioProjectAction } from "@/app/admin/_actions/portfolio";

interface DeleteProjectButtonProps {
  id: string;
  title: string;
  small?: boolean;
}

export function DeleteProjectButton({ id, title, small = false }: DeleteProjectButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Usunąć realizację "${title}"?`)) return;
    startTransition(() => deletePortfolioProjectAction(id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      style={
        small
          ? { padding: "0.25rem 0.6rem", backgroundColor: "#fff", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "5px", fontSize: "0.75rem", cursor: "pointer" }
          : { padding: "0.5rem 1rem", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "6px", fontSize: "0.875rem", cursor: "pointer", background: "#fff" }
      }
    >
      {pending ? "Usuwam…" : "Usuń"}
    </button>
  );
}
