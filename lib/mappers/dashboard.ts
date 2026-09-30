import type { OrderDetail, Reservation } from "@/lib/api/types";
import type { OrderListItem } from "@/lib/api/orders";
import type {
  ActiveOrder,
  OrderHistoryItem,
  Reservation as DashboardReservation,
} from "@/lib/dashboard-data";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("fa-IR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function mapOrderDetailToActiveOrder(order: OrderDetail): ActiveOrder {
  const items = order.items.map((i) => i.name);
  return {
    orderDbId: order.id,
    id: order.order_number,
    dishName: items[0] ?? "سفارش شما",
    items,
    statusIndex: order.status_index,
    orderType: order.order_type,
    estimatedMinutes: order.estimated_minutes ?? 20,
    placedAt: formatDateTime(order.placed_at),
  };
}

export function mapOrderListToHistory(order: OrderListItem): OrderHistoryItem {
  return {
    id: order.order_number,
    date: formatDate(order.placed_at),
    dishes: `${order.item_count} آیتم · ${order.status_label}`,
    price: order.total_display,
    itemCount: order.item_count,
    orderId: order.id,
  };
}

export function mapReservationToDashboard(res: Reservation): DashboardReservation {
  const statusMap: Record<string, DashboardReservation["status"]> = {
    confirmed: "confirmed",
    pending: "pending",
    seated: "confirmed",
    completed: "confirmed",
  };
  return {
    id: res.reservation_code,
    date: formatDate(res.date),
    time: res.time.slice(0, 5),
    guests: res.party_size,
    tableLabel: res.table_label ?? "تخصیص خودکار",
    status: statusMap[res.status] ?? "pending",
    reservationId: res.id,
  };
}

export type OrderHistoryItemWithId = OrderHistoryItem & { orderId: number };
