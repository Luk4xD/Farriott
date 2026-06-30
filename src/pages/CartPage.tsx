import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useEffect, useRef, useState } from "react";

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

// Preview áo có kèm layer ảnh/chữ đã thiết kế (nếu có), dùng đúng toạ độ %
// đã lưu trong giỏ hàng để vẽ lại đúng vị trí tương đối như lúc thiết kế.
// Chỉ vẽ layer thuộc view "front" — đủ cho mục đích xem nhanh trong giỏ hàng.
function TShirtPreviewWithDesign({
  color,
  layers,
}: {
  color: string;
  layers?: import("@/context/CartContext").CartLayer[];
}) {
  const frontLayers = (layers || []).filter((l) => l.view === "front");
  const containerRef = useRef<HTMLDivElement>(null);
  // Đo chiều cao thật của khung preview để tính cỡ chữ theo px — tránh phụ
  // thuộc vào container query units (cqh), vốn chưa được hỗ trợ ở mọi trình
  // duyệt/setup build, để đảm bảo hiển thị đúng trên mọi môi trường.
  const [containerHeight, setContainerHeight] = useState(96);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: "url(/images/shirt_white.png)",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: "url(/images/shirt_white.png)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      >
        <img
          src="/images/shirt_white.png"
          alt="Colored Shirt"
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
      {frontLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute pointer-events-none select-none flex items-center justify-center overflow-hidden"
          style={{
            left: `${layer.xPct * 100}%`,
            top: `${layer.yPct * 100}%`,
            width: `${layer.widthPct * 100}%`,
            height: `${layer.heightPct * 100}%`,
          }}
        >
          {layer.type === "image" ? (
            <img
              src={layer.src}
              alt="Thiết kế"
              className="w-full h-full object-contain"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-center whitespace-pre-wrap break-words"
              style={{
                // fontSizePct được lưu theo % chiều cao khung preview LÚC THIẾT KẾ
                // (xem DesignStudioPage). Ở đây nhân lại với chiều cao khung hiện
                // tại (đo qua ResizeObserver) để giữ đúng tỉ lệ tương đối, dù khung
                // ở trang giỏ hàng nhỏ hơn nhiều so với khung lúc thiết kế.
                fontSize: `${((layer.fontSizePct || 8) / 100) * containerHeight}px`,
                color: isLightColor(color) ? "#1a1a1a" : "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              {layer.content}
            </div>
          )}
        </div>
      ))}
    </div>
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
          <div className="mb-6">
            <Link
              to="/design"
              className="inline-flex items-center gap-2 text-sm text-[var(--deep-navy)] hover:text-[var(--electric-blue)] font-medium transition-colors group"
            >
              <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Quay lại trang thiết kế
            </Link>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-['Montserrat'] text-3xl md:text-4xl font-bold text-[var(--deep-navy)]">
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
                    {/* T-Shirt Preview — kèm ảnh/chữ đã thiết kế nếu có */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-[var(--surface-container-low)] rounded border border-[var(--outline-variant)] p-2">
                      <TShirtPreviewWithDesign color={item.color} layers={item.layers} />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[var(--deep-navy)] text-lg">
                            Áo Thun {item.colorName}
                          </h3>
                          <p className="text-sm text-[var(--on-surface-variant)]">
                            {item.layers && item.layers.length > 0
                              ? `Mẫu thiết kế tùy chỉnh (${item.layers.length} chi tiết)`
                              : "Mẫu thiết kế tùy chỉnh"}
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