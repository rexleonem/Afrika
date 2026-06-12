"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useSession } from "../session-provider";

type SaveButtonProps = {
  cardId: string;
  className?: string;
  initialSaved?: boolean;
  label?: string;
};

export function SaveButton({ cardId, className = "", initialSaved = false, label = "Save" }: SaveButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save this discovery"}
      className={className}
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (status !== "authenticated") {
          router.push("/sign-in");
          return;
        }

        if (loading) return;
        setLoading(true);

        try {
          if (saved) {
            await apiFetch(`/saves/${cardId}`, { method: "DELETE" });
            setSaved(false);
          } else {
            await apiFetch("/saves", {
              method: "POST",
              body: JSON.stringify({ cardId })
            });
            setSaved(true);
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      {label}
    </button>
  );
}
