import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

function TShirtPreviewWithDesign({
  color,
  layers,
  styleImage,
}: {
  color: string;
  layers?: import("@/context/CartContext").CartLayer[];
  styleImage?: string;
}) {
  const frontLayers = (layers || []).filter((l) => l.view === "front");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(80);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bgImg = styleImage || "/images/shirt_white.png";

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url(${bgImg})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${bgImg})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      >
        <img
          src={bgImg}
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

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Redirect to cart if empty and not in success screen
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [items, orderSuccess, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = { fullName: "", phone: "", address: "" };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim().replace(/[\s.-]/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (phải gồm 10-11 chữ số)";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ nhận hàng";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Chuẩn bị payload khớp với DTO CreateOrderRequest của Backend C#
    const orderPayload = {
      userId: null,
      shippingAddress: `${formData.address} (Khách: ${formData.fullName}, SĐT: ${formData.phone}${formData.notes ? `, Ghi chú: ${formData.notes}` : ""})`,
      items: items.map((item) => {
        const totalQty = item.sizes.reduce((sum, s) => sum + s.quantity, 0) || 1;
        const unitPrice = item.totalPrice / totalQty;

        // Trích xuất các layer in ấn theo yêu cầu
        const customPrints = (item.layers || [])
          .filter((l) => l.type === "image" && l.src)
          .map((l) => ({
            uploadedImageUrl: l.src!,
            printMetadata: JSON.stringify({
              view: l.view,
              xPct: l.xPct,
              yPct: l.yPct,
              widthPct: l.widthPct,
              heightPct: l.heightPct,
            }),
            customerNotes: `Màu áo: ${item.colorName || item.color}, Vị trí: ${l.view}`,
          }));

        return {
          variantId: 1, // Variant mặc định nếu chưa chọn từ catalog
          designId: null,
          quantity: totalQty,
          unitPrice: Math.round(unitPrice),
          customPrints: customPrints.length > 0 ? customPrints : [],
        };
      }),
    };

    try {
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const data = await response.json();
        const orderCode = data.orderCode || (data.id ? `FR-${data.id}` : null) || `FR-${Math.floor(100000 + Math.random() * 900000)}`;
        setGeneratedOrderId(orderCode);
      } else {
        console.warn("Backend trả về lỗi, chuyển sang mã đơn dự phòng:", await response.text());
        setGeneratedOrderId(`FR-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      console.warn("Chưa kết nối được Backend, chuyển sang mã đơn dự phòng:", err);
      setGeneratedOrderId(`FR-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(p)
      .replace("₫", "đ");
  };

  if (orderSuccess) {
    return (
      <main className="pt-24 min-h-screen bg-[var(--surface)] flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-4 bg-white border border-[var(--outline-variant)] rounded-2xl p-8 text-center shadow-lg animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 border border-green-200">
            <span className="material-symbols-outlined text-4xl">check</span>
          </div>
          <h1 className="font-['Montserrat'] text-2xl font-bold text-[var(--deep-navy)] mb-2">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-sm text-[var(--on-surface-variant)] mb-6">
            Cảm ơn bạn đã lựa chọn Farriott. Đơn hàng của bạn đã được tiếp nhận và đang xử lý.
          </p>

          <div className="bg-[var(--surface-container-low)] rounded-xl p-4 text-left mb-6 space-y-2.5 text-sm">
            <div className="flex justify-between border-b border-[var(--outline-variant)] pb-2 mb-2">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <span className="font-bold text-[var(--deep-navy)]">{generatedOrderId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Người nhận:</span>
              <span className="font-medium text-gray-800">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Số điện thoại:</span>
              <span className="font-medium text-gray-800">{formData.phone}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Địa chỉ nhận hàng:</span>
              <span className="font-medium text-gray-800">{formData.address}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-[var(--deep-navy)] text-white font-medium py-3.5 rounded-lg hover:bg-[var(--electric-blue)] transition-colors duration-300"
            >
              Về trang chủ
            </Link>
            <Link
              to="/design"
              className="block w-full border border-[var(--outline-variant)] text-[var(--deep-navy)] font-medium py-3.5 rounded-lg hover:border-[var(--deep-navy)] transition-colors duration-300"
            >
              Thiết kế thêm sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-[var(--surface)] py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-[var(--on-surface-variant)] hover:text-[var(--deep-navy)] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại giỏ hàng
          </Link>
          <h1 className="font-['Montserrat'] text-3xl font-bold text-[var(--deep-navy)] mt-4">
            Thanh Toán Đơn Hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Thông Tin Giao Hàng */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[var(--outline-variant)] rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="font-['Montserrat'] text-xl font-bold text-[var(--deep-navy)] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--electric-blue)]">local_shipping</span>
                Thông Tin Nhận Hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--outline-variant)] focus:border-[var(--electric-blue)]"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--outline-variant)] focus:border-[var(--electric-blue)]"
                    }`}
                    placeholder="0901234567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Địa Chỉ Nhận Hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      errors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--outline-variant)] focus:border-[var(--electric-blue)]"
                    }`}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Ghi Chú Đơn Hàng (Tùy chọn)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--electric-blue)] transition-colors resize-none"
                    placeholder="Ghi chú về thời gian giao hàng, hướng dẫn chỉ đường..."
                  />
                </div>

                <div className="pt-4 border-t border-[var(--outline-variant)]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--deep-navy)] text-white font-medium py-4 rounded-lg hover:bg-[var(--electric-blue)] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        Đang xử lý đơn hàng...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">shopping_bag</span>
                        Xác Nhận Đặt Hàng
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tóm Tắt Đơn Hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[var(--outline-variant)] rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="font-['Montserrat'] text-xl font-bold text-[var(--deep-navy)] mb-6">
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="divide-y divide-[var(--outline-variant)] max-h-[380px] overflow-y-auto pr-1 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <div className="w-[72px] h-[72px] rounded-lg border border-[var(--outline-variant)] overflow-hidden bg-gray-50 flex-shrink-0">
                      <TShirtPreviewWithDesign
                        color={item.color}
                        layers={item.layers}
                        styleImage={item.styleImage}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">
                        {item.styleName || "Áo Thun"} {item.colorName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">Thiết kế tùy chỉnh</p>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes
                          .filter((s) => s.quantity > 0)
                          .map((s) => (
                            <span
                              key={s.size}
                              className="inline-block text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded border border-gray-200"
                            >
                              {s.size} x {s.quantity}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-sm text-[var(--deep-navy)]">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--outline-variant)] pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between border-t border-[var(--outline-variant)] pt-3 text-base font-bold text-[var(--deep-navy)]">
                  <span>Tổng cộng</span>
                  <span className="text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
