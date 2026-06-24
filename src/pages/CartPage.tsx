import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

function TShirtMiniSVG({ color }: { color: string }) {
  const light = isLightColor(color);
  const strokeColor = light ? "#d1d5db" : "none";

  return (
    <svg viewBox="0 0 300 290" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        fill={color}
        stroke={strokeColor}
        strokeWidth="1"
        d="M 97 60
           L 22 34
           L 3 72
           L 60 97
           L 60 272
           L 240 272
           L 240 97
           L 297 72
           L 278 34
           L 203 60
           C 192 52, 165 35, 150 35
           C 135 35, 108 52, 97 60 Z"
      />
      <path
        fill={light ? "#e5e7eb" : "rgba(0,0,0,0.08)"}
        d="M 22 34 L 3 72 L 60 97 L 60 72 Z"
      />
      <path
        fill={light ? "#e5e7eb" : "rgba(0,0,0,0.08)"}
        d="M 278 34 L 297 72 L 240 97 L 240 72 Z"
      />
      <path
        fill={light ? "#d1d5db" : "rgba(0,0,0,0.13)"}
        d="M 97 60
           C 108 78, 136 93, 150 93
           C 164 93, 192 78, 203 60
           C 192 52, 165 35, 150 35
           C 135 35, 108 52, 97 60 Z"
      />
    </svg>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function CartPage() {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-20 min-h-screen bg-[var(--surface)]">
        <section className="py-[120px]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-16 text-center">
            <span className="material-symbols-outlined text-[80px] text-[var(--outline-variant)] mb-6 block">
              shopping_cart
            </span>
            <h1 className="font-['Montserrat'] text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mb-4 mt-4">
              Giỏ Hàng Trống
            </h1>
            <p className="text-[var(--on-surface-variant)] mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              to="/design"
              className="inline-flex items-center gap-2 bg-[var(--deep-navy)] text-white px-8 py-4 rounded hover:bg-[var(--electric-blue)] transition-colors duration-300"
            >
              <span className="material-symbols-outlined">design_services</span>
              Bắt đầu thiết kế
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-[var(--surface)]">
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-['Montserrat'] text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mt-4">
              Giỏ Hàng
              <span className="text-lg font-normal text-[var(--on-surface-variant)] ml-2">
                ({totalItems} sản phẩm)
              </span>
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[var(--outline-variant)] rounded-xl p-4 md:p-6 shadow-sm"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* T-Shirt Preview */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-[var(--surface-container-low)] rounded border border-[var(--outline-variant)] p-2">
                      <TShirtMiniSVG color={item.color} />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[var(--deep-navy)] text-lg">
                            Áo Thun {item.colorName}
                          </h3>
                          <p className="text-sm text-[var(--on-surface-variant)]">
                            Mẫu thiết kế tùy chỉnh
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--on-surface-variant)] hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>

                      {/* Size breakdown */}
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)] mb-2">
                          Phân loại size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes.map((s) => (
                            <div
                              key={s.size}
                              className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded px-3 py-1.5 text-sm"
                            >
                              <span className="font-medium text-[var(--deep-navy)]">
                                {s.size}
                              </span>
                              <span className="text-[var(--on-surface-variant)]">
                                {" "}
                                x {s.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Item total */}
                      <div className="mt-4 text-right">
                        <p className="text-xs text-[var(--on-surface-variant)]">
                          Thành tiền
                        </p>
                        <p className="text-xl font-bold text-[var(--deep-navy)]">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[var(--outline-variant)] rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-6">
                  Tổng Đơn Hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[var(--on-surface-variant)]">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--on-surface-variant)]">
                    <span>Phí thiết kế</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-[var(--outline-variant)] pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--deep-navy)]">
                        Tổng cộng
                      </span>
                      <span className="font-bold text-xl text-[var(--deep-navy)]">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">
                      * Đã bao gồm VAT
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-[var(--deep-navy)] text-white font-medium py-4 rounded hover:bg-[var(--electric-blue)] transition-colors duration-300 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">request_quote</span>
                    Yêu cầu báo giá
                  </button>
                  <Link
                    to="/design"
                    className="w-full border border-[var(--outline-variant)] text-[var(--deep-navy)] font-medium py-4 rounded hover:border-[var(--deep-navy)] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Thêm sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
