"use client";

import { useTransition } from "react";
import { deleteArticleAction } from "@/app/admin/_actions/articles";

interface DeleteButtonProps {
  id: string;
  title: string;
  small?: boolean;
}

export function DeleteButton({ id, title, small = false }: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Usunąć "${title}"?`)) return;
    startTransition(() => deleteArticleAction(id));
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
