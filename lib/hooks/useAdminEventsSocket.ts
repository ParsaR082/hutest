"use client";

import { useEffect, useRef, useState } from "react";
import { getAuthenticatedWsUrl } from "@/lib/ws/config";

type AdminEventPayload = {
  event: "order_created" | "order_updated";
  order: Record<string, unknown>;
};

export function useAdminEventsSocket(onEvent: (event: AdminEventPayload) => void) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ws: WebSocket | null = null;
    let closed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      ws = new WebSocket(getAuthenticatedWsUrl("/admin/events/"));

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as AdminEventPayload;
          onEventRef.current(data);
        } catch {
          /* ignore */
        }
      };

      ws.onclose = () => {
        if (!closed) retryTimer = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, []);
}
