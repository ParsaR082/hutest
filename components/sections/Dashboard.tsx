"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Settings, UtensilsCrossed, X } from "lucide-react";
import { ActiveOrdersPanel } from "@/components/dashboard/ActiveOrdersPanel";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OrderHistoryPanel } from "@/components/dashboard/OrderHistoryPanel";
import { OrderHistoryWidget } from "@/components/dashboard/OrderHistoryWidget";
import { ReservationsPanel } from "@/components/dashboard/ReservationsPanel";
import { UpcomingReservation } from "@/components/dashboard/UpcomingReservation";
import { ActiveOrderTracker } from "@/components/dashboard/ActiveOrderTracker";
import { useBookingOptional } from "@/components/booking/BookingProvider";
import { useCartOptional } from "@/components/cart/CartProvider";
import { fetchActiveOrder, fetchOrders, reorderOrder } from "@/lib/api/orders";
import {
  cancelReservation,
  fetchReservations,
  fetchUpcomingReservation,
} from "@/lib/api/reservations";
import { fetchMe } from "@/lib/api/user";
import { logout } from "@/lib/api/auth";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
} from "@/lib/auth/storage";
import {
  mapOrderDetailToActiveOrder,
  mapOrderListToHistory,
  mapReservationToDashboard,
} from "@/lib/mappers/dashboard";
import { mapUserProfileToDashboardUser } from "@/lib/mappers/user";
import { useOrderStatusSocket } from "@/lib/hooks/useOrderStatusSocket";
import type { OrderDetail } from "@/lib/api/types";
import {
  DASHBOARD_NAV,
  MOCK_USER,
  type ActiveOrder,
  type DashboardTab,
  type MockUser,
  type OrderHistoryItem,
  type Reservation,
} from "@/lib/dashboard-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function EmptyActiveOrderCard() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-800 bg-[#111111]/40 p-8 text-center sm:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">
        بدون سفارش فعال
      </p>
      <p className="mt-2 text-sm text-gray-400">سفارش جدید از منو ثبت کنید</p>
      <Link
        href="/menu"
        className="mt-4 inline-block text-xs font-medium uppercase tracking-widest text-[#F97316] hover:underline"
      >
        مرور منو ←
      </Link>
    </div>
  );
}

function EmptyReservationCard({ onBook }: { onBook: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-800 bg-[#111111]/40 p-8 text-center sm:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">
        بدون رزرو
      </p>
      <button
        type="button"
        onClick={onBook}
        className="mt-4 text-xs font-medium uppercase tracking-widest text-[#F97316] hover:underline"
      >
        رزرو میز ←
      </button>
    </div>
  );
}

export function Dashboard() {
  const router = useRouter();
  const booking = useBookingOptional();
  const cart = useCartOptional();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<MockUser>(() => {
    const stored = getStoredUser();
    return stored ? mapUserProfileToDashboardUser(stored) : MOCK_USER;
  });

  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [upcomingReservation, setUpcomingReservation] = useState<Reservation | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadDashboardData = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const [profile, active, upcoming, history, reservations] = await Promise.all([
        fetchMe(token).catch(() => null),
        fetchActiveOrder(token).catch(() => null),
        fetchUpcomingReservation(token).catch(() => null),
        fetchOrders(token, "completed").catch(() => []),
        fetchReservations(token).catch(() => []),
      ]);

      if (profile) setUser(mapUserProfileToDashboardUser(profile));
      setActiveOrder(active ? mapOrderDetailToActiveOrder(active) : null);
      setUpcomingReservation(upcoming ? mapReservationToDashboard(upcoming) : null);
      setOrderHistory(history.map(mapOrderListToHistory));
      setAllReservations(reservations.map(mapReservationToDashboard));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
    const interval = setInterval(() => void loadDashboardData(), 30000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleOrderWsUpdate = useCallback(
    (order: OrderDetail) => {
      if (order.status === "delivered" || order.status === "cancelled") {
        setActiveOrder(null);
        void loadDashboardData();
        return;
      }
      setActiveOrder(mapOrderDetailToActiveOrder(order));
    },
    [loadDashboardData]
  );

  const { connected: orderWsConnected } = useOrderStatusSocket(
    activeOrder?.orderDbId ?? null,
    handleOrderWsUpdate
  );

  const handleReorder = async (orderId: number) => {
    const token = getAccessToken();
    if (!token) return;
    setReorderingId(orderId);
    try {
      await reorderOrder(token, orderId);
      await cart?.refreshCart();
      cart?.openCart();
    } catch {
      /* ignore */
    } finally {
      setReorderingId(null);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    const token = getAccessToken();
    if (!token) return;
    setCancellingId(reservationId);
    try {
      await cancelReservation(token, reservationId);
      await loadDashboardData();
    } catch {
      /* ignore */
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = async () => {
    const access = getAccessToken();
    const refresh = getRefreshToken();
    if (access && refresh) {
      try {
        await logout(refresh, access);
      } catch {
        /* ignore */
      }
    }
    clearAuthSession();
    router.push("/auth");
  };

  const overviewContent = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
    >
      <motion.div variants={cardVariants} className="lg:col-span-2">
        {activeOrder ? (
          <ActiveOrderTracker order={activeOrder} isLive={orderWsConnected} />
        ) : (
          <EmptyActiveOrderCard />
        )}
      </motion.div>

      <motion.div variants={cardVariants}>
        {upcomingReservation ? (
          <UpcomingReservation
            reservation={upcomingReservation}
            onEdit={() => booking?.openBooking()}
            onCancel={
              upcomingReservation.reservationId != null
                ? () => handleCancelReservation(upcomingReservation.reservationId!)
                : undefined
            }
            isCancelling={cancellingId === upcomingReservation.reservationId}
          />
        ) : (
          <EmptyReservationCard onBook={() => booking?.openBooking()} />
        )}
      </motion.div>

      <motion.div
        variants={cardVariants}
        className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6 backdrop-blur-md sm:p-8"
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F97316]">
          امتیازات VIP
        </p>
        <h3 className="font-serif mt-2 text-xl font-bold text-white">مزایای عضویت شما</h3>
        <ul className="mt-5 space-y-3 text-sm text-gray-400">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#F97316]" />
            اولویت در رزرو میز
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#F97316]" />
            پیش‌غذا رایگان در هر بازدید
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#F97316]" />
            رویدادهای انحصاری میز سرآشپز
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#F97316]" />
            پیگیری سفارش زنده و سفارش مجدد یک‌کلیکی
          </li>
        </ul>
      </motion.div>

      <motion.div variants={cardVariants} className="lg:col-span-2">
        <OrderHistoryWidget
          orders={orderHistory.slice(0, 3)}
          onReorder={handleReorder}
          reorderingId={reorderingId}
          showViewAll={orderHistory.length > 3}
          onViewAll={() => setActiveTab("history")}
        />
      </motion.div>
    </motion.div>
  );

  const tabContent = (() => {
    if (loading) {
      return (
        <div className="flex min-h-[320px] items-center justify-center text-sm text-gray-500">
          در حال بارگذاری...
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return overviewContent;
      case "active-orders":
        return (
          <ActiveOrdersPanel
            order={activeOrder}
            isLive={orderWsConnected}
          />
        );
      case "history":
        return (
          <OrderHistoryPanel
            orders={orderHistory}
            onReorder={handleReorder}
            reorderingId={reorderingId}
          />
        );
      case "reservations":
        return (
          <ReservationsPanel
            reservations={allReservations}
            onCancel={handleCancelReservation}
            cancellingId={cancellingId}
          />
        );
      default:
        return overviewContent;
    }
  })();

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white/85">
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
        <header className="flex items-center justify-between border-b border-gray-800 px-4 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-white">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            <span lang="en" className="font-script text-xl text-white">
              Humazd
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <DashboardNotifications />
            <Link
              href="/dashboard/settings"
              aria-label="تنظیمات"
              className="rounded-lg border border-gray-800 p-2 text-gray-400"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label="باز و بسته کردن منو"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-lg border border-gray-800 p-2 text-gray-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="border-b border-gray-800 bg-[#111111] px-4 py-4 lg:hidden">
            <p className="font-serif text-lg font-semibold text-white">{user.name}</p>
            <span className="mt-1 inline-block rounded-full border border-[#F97316]/40 bg-[#F97316]/10 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-[#F97316]">
              {user.tier}
            </span>
            <div className="mt-4 flex flex-col gap-1">
              {DASHBOARD_NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2.5 text-start text-sm ${
                    activeTab === item.id
                      ? "bg-[#0a0a0a] text-[#F97316]"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/dashboard/settings"
                className="rounded-lg px-3 py-2.5 text-sm text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                تنظیمات پروفایل
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
                سالن VIP
              </p>
              <h1 className="font-serif mt-2 text-3xl font-bold text-white sm:text-4xl">
                خوش آمدید، {user.name.split(" ")[0]}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                عضو از {user.memberSince} · {user.tier}
              </p>
            </motion.div>

            <div className="mt-10">{tabContent}</div>
          </div>
        </main>
      </div>

      <DashboardMobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
    </div>
  );
}
