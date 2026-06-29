import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Chi tiết 1 layer (ảnh hoặc chữ) đã đặt trên áo lúc thiết kế — lưu lại để
// trang giỏ hàng có thể vẽ lại đúng mẫu áo người dùng đã tạo.
export interface CartLayer {
  id: string;
  type: "image" | "text";
  view: "front" | "back";
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  // Chỉ có ở layer ảnh — base64 data URL (bền với localStorage, khác với
  // blob URL tạm thời do URL.createObjectURL tạo ra trong lúc thiết kế).
  src?: string;
  // Chỉ có ở layer chữ
  content?: string;
  fontSizePct?: number;
}

export interface CartItem {
  id: string;
  color: string;
  colorName: string;
  sizes: { size: string; quantity: number }[];
  totalPrice: number;
  createdAt: Date;
  // Chi tiết thiết kế đầy đủ (tuỳ chọn — để tương thích với code cũ chưa gửi layers)
  layers?: CartLayer[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "farriott_cart";

// Đọc giỏ hàng đã lưu từ localStorage (nếu có) — chạy 1 lần lúc khởi tạo state,
// tránh phải dùng useEffect riêng (sẽ gây "nhấp nháy" giỏ hàng trống trong 1 frame).
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    // createdAt được lưu thành string trong JSON, cần parse lại về Date
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (err) {
    // Dữ liệu lỗi/hỏng (vd. đổi cấu trúc CartItem ở version trước) — bỏ qua,
    // không để lỗi này làm sập toàn bộ app.
    console.error("Không thể đọc giỏ hàng đã lưu:", err);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  // Mỗi khi giỏ hàng đổi, lưu lại vào localStorage ngay.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      // Phổ biến nhất: vượt quota localStorage (~5-10MB) do ảnh base64 nặng.
      console.error("Không thể lưu giỏ hàng (có thể đã đầy dung lượng lưu trữ):", err);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "id" | "createdAt">) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce(
    (sum, item) => sum + item.sizes.reduce((s, s2) => s + s2.quantity, 0),
    0
  );

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}