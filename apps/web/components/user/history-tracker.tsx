"use client";

import { useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { useSession } from "../session-provider";

type HistoryTrackerProps = {
  cardId: string;
};

export function HistoryTracker({ cardId }: HistoryTrackerProps) {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    void apiFetch("/history/views", {
      method: "POST",
      body: JSON.stringify({ cardId })
    }).catch(() => undefined);
  }, [cardId, status]);

  return null;
}
