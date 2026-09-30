"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCart();

  if (!isOpen) return null;

  const items = cart?.items ?? [];
  const total = cart?.total_display ?? "۰ تومان";

  return (
    <>
      <button
        type="button"
        aria-label="بستن سبد خرید"
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside className="fixed inset-y-0 start-0 z-[70] flex w-full max-w-md flex-col border-e border-gray-800 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#F97316]" />
            <h2 className="font-serif text-lg font-semibold text-white">سبد سفارش</h2>
          </div>
          <button
            type="button"
            aria-label="بستن"
            onClick={closeCart}
            className="rounded-lg p-2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && !cart ? (
            <p className="text-center text-sm text-gray-500">در حال بارگذاری...</p>
          ) : items.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-500">سبد شما خالی است</p>
              <Link
                href="/menu"
                onClick={closeCart}
                className="mt-4 text-xs font-medium uppercase tracking-widest text-[#F97316] hover:underline"
              >
                مرور منو
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-gray-800 bg-[#111111]/80 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {item.menu_item_name}
                    </p>
                    <p className="mt-1 text-xs text-[#F97316]">{item.price_display}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="کاهش"
                        onClick={() =>
                          item.quantity <= 1
                            ? void removeItem(item.id)
                            : void updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="افزایش"
                        onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="حذف"
                    onClick={() => void removeItem(item.id)}
                    className="self-start text-gray-600 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-800 px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">جمع کل</span>
            <span className="font-serif text-xl font-bold text-[#F97316]">{total}</span>
          </div>
          {items.length > 0 && (
            <Link href="/checkout" onClick={closeCart}>
              <AnimatedButton className="w-full py-3.5 text-xs">تکمیل سفارش</AnimatedButton>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
