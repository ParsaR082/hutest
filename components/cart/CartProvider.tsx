"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
  type Cart,
} from "@/lib/api/cart";
import { getAccessToken } from "@/lib/auth/storage";
import { CartDrawer } from "./CartDrawer";

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (menuItemId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = typeof window !== "undefined" ? getAccessToken() : null;

  const refreshCart = useCallback(async () => {
    const access = getAccessToken();
    if (!access) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchCart(access);
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void refreshCart();
    }
  }, [token, refreshCart]);

  const requireAuth = useCallback(() => {
    const access = getAccessToken();
    if (!access) {
      router.push("/auth?next=/menu");
      return null;
    }
    return access;
  }, [router]);

  const addToCart = useCallback(
    async (menuItemId: number, quantity = 1) => {
      const access = requireAuth();
      if (!access) return;
      const data = await addCartItem(access, { menu_item_id: menuItemId, quantity });
      setCart(data);
      setIsOpen(true);
    },
    [requireAuth]
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      const access = requireAuth();
      if (!access) return;
      const data = await updateCartItem(access, itemId, quantity);
      setCart(data);
    },
    [requireAuth]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      const access = requireAuth();
      if (!access) return;
      const data = await removeCartItem(access, itemId);
      setCart(data);
    },
    [requireAuth]
  );

  const value = useMemo(
    () => ({
      cart,
      itemCount: cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
      isOpen,
      isLoading,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [cart, isOpen, isLoading, refreshCart, addToCart, updateQuantity, removeItem]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function useCartOptional() {
  return useContext(CartContext);
}
