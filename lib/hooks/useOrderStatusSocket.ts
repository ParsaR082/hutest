"use client";

import { useEffect, useRef, useState } from "react";
import type { OrderDetail } from "@/lib/api/types";
import { getAuthenticatedWsUrl } from "@/lib/ws/config";

export function useOrderStatusSocket(
  orderId: number | null,
  onUpdate: (order: OrderDetail) => void
) {
  const onUpdateRef = useRef(onUpdate);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!orderId || typeof window === "undefined") {
      setConnected(false);
      return;
    }

    let ws: WebSocket | null = null;
    let closed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      ws = new WebSocket(getAuthenticatedWsUrl(`/orders/${orderId}/`));

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as OrderDetail;
          onUpdateRef.current(data);
        } catch {
          /* ignore malformed payloads */
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (!closed) {
          retryTimer = setTimeout(connect, 4000);
        }
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
      setConnected(false);
    };
  }, [orderId]);

  return { connected };
}
