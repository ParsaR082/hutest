"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useCart } from "@/components/cart/CartProvider";
import { checkoutOrder, initiatePayment } from "@/lib/api/orders";
import { fetchPublicSettings } from "@/lib/api/settings";
import { getAccessToken, getStoredUser } from "@/lib/auth/storage";
import { formatToman } from "@/lib/format-price";

const PAYMENT_METHODS = [
  { value: "online", label: "پرداخت آنلاین (کارت بانکی)" },
  { value: "cash", label: "پرداخت نقدی هنگام تحویل" },
] as const;

const ORDER_TYPES = [
  { value: "dine_in", label: "سرو در رستوران", icon: UtensilsCrossed },
  { value: "takeaway", label: "بیرون‌بر", icon: ShoppingBag },
  { value: "delivery", label: "ارسال به آدرس", icon: Bike },
] as const;

type OrderType = (typeof ORDER_TYPES)[number]["value"];

export function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart, isLoading } = useCart();
  const user = getStoredUser();

  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [freeThreshold, setFreeThreshold] = useState(0);

  useEffect(() => {
    void refreshCart();
    if (user) {
      const fullName = `${user.first_name} ${user.last_name}`.trim();
      setRecipientName(fullName);
      setPhone(user.phone ?? "");
    }
    fetchPublicSettings()
      .then((s) => {
        setDeliveryFee(s.delivery_fee ?? 0);
        setFreeThreshold(s.free_delivery_threshold ?? 0);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart]);

  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;
  const discount = 0;
  const effectiveDeliveryFee = useMemo(() => {
    if (orderType !== "delivery") return 0;
    if (freeThreshold && subtotal >= freeThreshold) return 0;
    return deliveryFee;
  }, [orderType, subtotal, freeThreshold, deliveryFee]);
  const finalTotal = subtotal + effectiveDeliveryFee - discount;

  const handleCheckout = async () => {
    const token = getAccessToken();
    if (!token || items.length === 0) return;

    setError(null);
    setFieldErrors({});

    if (orderType === "delivery") {
      const errs: Record<string, string> = {};
      if (!recipientName.trim()) errs.recipientName = "نام گیرنده الزامی است.";
      if (!phone.trim()) errs.phone = "شماره تماس الزامی است.";
      if (!address.trim()) errs.address = "آدرس کامل الزامی است.";
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
    }

    setSubmitting(true);
    try {
      const order = await checkoutOrder(token, {
        notes,
        payment_method: paymentMethod,
        order_type: orderType,
        ...(orderType === "delivery"
          ? {
              recipient_name: recipientName,
              phone,
              address,
              address_details: addressDetails,
              delivery_notes: deliveryNotes,
            }
          : {}),
      });
      await refreshCart();
      if (paymentMethod === "online") {
        const { redirect_url } = await initiatePayment(token, order.id);
        router.push(redirect_url);
      } else {
        router.push(`/dashboard?order=${order.id}`);
      }
    } catch {
      setError("ثبت سفارش ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-28 text-white/85 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500 transition hover:text-[#F97316]"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به منو
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] text-white">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">تکمیل سفارش</h1>
        </div>

        {isLoading && !cart ? (
          <p className="mt-12 text-center text-sm text-gray-500">در حال بارگذاری...</p>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-800 p-12 text-center">
            <p className="text-gray-500">سبد شما خالی است</p>
            <Link
              href="/menu"
              className="mt-4 inline-block text-sm text-[#F97316] hover:underline"
            >
              مرور منو
            </Link>
          </div>
        ) : (
          <>
            {/* اطلاعات مشتری */}
            <section className="mt-10">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                اطلاعات مشتری
              </h2>
              <div className="mt-3 rounded-xl border border-gray-800 bg-[#111111]/80 px-5 py-4 text-sm">
                <p className="text-white">
                  {user ? `${user.first_name} ${user.last_name}`.trim() || user.username : "مهمان"}
                </p>
                <p className="mt-1 text-xs text-gray-500" dir="ltr">
                  {user?.phone || user?.email || ""}
                </p>
              </div>
            </section>

            {/* اطلاعات تحویل */}
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                اطلاعات تحویل
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ORDER_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setOrderType(type.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center transition ${
                        orderType === type.value
                          ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]"
                          : "border-gray-800 bg-[#111111]/80 text-gray-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[0.65rem] font-medium sm:text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {orderType === "delivery" && (
                <div className="mt-4 space-y-4 rounded-xl border border-gray-800 bg-[#111111]/80 p-4">
                  <div>
                    <label htmlFor="recipient-name" className="text-xs text-gray-500">
                      نام گیرنده
                    </label>
                    <input
                      id="recipient-name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
                      placeholder="نام و نام خانوادگی"
                    />
                    {fieldErrors.recipientName && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.recipientName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="delivery-phone" className="text-xs text-gray-500">
                      شماره تماس
                    </label>
                    <input
                      id="delivery-phone"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-3.5 py-2.5 text-right text-sm text-white outline-none focus:border-[#F97316]/50"
                      placeholder="09xxxxxxxxx"
                    />
                    {fieldErrors.phone && <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="text-xs text-gray-500">
                      آدرس کامل
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="mt-1.5 w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
                      placeholder="خیابان، کوچه، پلاک..."
                    />
                    {fieldErrors.address && <p className="mt-1 text-xs text-red-400">{fieldErrors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="address-details" className="text-xs text-gray-500">
                      جزئیات بیشتر (واحد، طبقه) — اختیاری
                    </label>
                    <input
                      id="address-details"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
                      placeholder="واحد ۳، طبقه ۲"
                    />
                  </div>

                  <div>
                    <label htmlFor="delivery-notes" className="text-xs text-gray-500">
                      یادداشت تحویل — اختیاری
                    </label>
                    <input
                      id="delivery-notes"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
                      placeholder="مثلاً زنگ همسایه را نزنید"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* سبد خرید */}
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                سبد خرید
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#111111]/80 px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">{item.menu_item_name}</p>
                      <p className="text-xs text-gray-500">تعداد: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-[#F97316]">{item.price_display}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <label htmlFor="notes" className="text-xs font-medium uppercase tracking-widest text-gray-500">
                یادداشت سفارش (اختیاری)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
                placeholder="مثلاً بدون پیاز..."
              />
            </section>

            {/* روش پرداخت */}
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                روش پرداخت
              </h2>
              <div className="mt-3 space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    htmlFor={`payment-${method.value}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
                      paymentMethod === method.value
                        ? "border-[#F97316] bg-[#F97316]/10"
                        : "border-gray-800 bg-[#111111]/80"
                    }`}
                  >
                    <input
                      id={`payment-${method.value}`}
                      type="radio"
                      name="payment-method"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="h-4 w-4 accent-[#F97316]"
                    />
                    <span className="text-sm text-white">{method.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* خلاصه سفارش */}
            <section className="mt-8 rounded-xl border border-gray-800 bg-[#111111]/80 p-5">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                خلاصه سفارش
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">جمع سفارش</dt>
                  <dd className="text-gray-200">{formatToman(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">هزینه ارسال</dt>
                  <dd className="text-gray-200">
                    {orderType === "delivery" ? formatToman(effectiveDeliveryFee) : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">تخفیف</dt>
                  <dd className="text-gray-200">{discount > 0 ? `- ${formatToman(discount)}` : "—"}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                  <dt className="font-medium text-white">مبلغ نهایی</dt>
                  <dd className="font-serif text-2xl font-bold text-[#F97316]">{formatToman(finalTotal)}</dd>
                </div>
              </dl>
            </section>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-8">
              <AnimatedButton
                className="w-full py-4 text-xs"
                onClick={() => void handleCheckout()}
                disabled={submitting}
              >
                {submitting
                  ? "در حال ثبت..."
                  : paymentMethod === "online"
                    ? "ثبت سفارش و پرداخت"
                    : "ثبت سفارش"}
              </AnimatedButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
