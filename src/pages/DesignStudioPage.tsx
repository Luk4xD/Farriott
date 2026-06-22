import { useState } from "react";

// --- Data ---

const shirtColors = [
  { name: "Đen", hex: "#1a1a1a" },
  { name: "Trắng", hex: "#f5f5f5" },
  { name: "Cam", hex: "#f97316" },
  { name: "Đỏ", hex: "#dc2626" },
  { name: "Navy", hex: "#1A2A6C" },
  { name: "Xám", hex: "#9ca3af" },
  { name: "Tím", hex: "#7c3aed" },
  { name: "Đỏ đậm", hex: "#991b1b" },
  { name: "Xanh lá", hex: "#16a34a" },
  { name: "Hồng", hex: "#ec4899" },
  { name: "Hồng nhạt", hex: "#f9a8d4" },
  { name: "Vàng", hex: "#ca8a04" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];

const BASE_PRICE = 152000;

const tools = [
  { icon: "style", label: "Chọn phối" },
  { icon: "title", label: "Thêm chữ" },
  { icon: "photo_library", label: "Chọn ảnh từ thư viện" },
  { icon: "upload", label: "Upload ảnh" },
  { icon: "person", label: "Thiết kế của tôi" },
  { icon: "share", label: "Share" },
];

const centerActions = [
  { icon: "rotate_right", label: "Xoay" },
  { icon: "visibility", label: "Xem Thử" },
  { icon: "zoom_in", label: "Phóng To" },
  { icon: "delete_forever", label: "Reset" },
];

// --- Helpers ---

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

// --- SVG T-Shirt ---

function TShirtSVG({ color, back = false }: { color: string; back?: boolean }) {
  const light = isLightColor(color);
  const strokeColor = light ? "#d1d5db" : "none";
  const collarShade = light ? "#d1d5db" : "rgba(0,0,0,0.13)";
  const shadowShade = light ? "#e5e7eb" : "rgba(0,0,0,0.08)";

  return (
    <svg
      viewBox="0 0 300 290"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
    >
      {/* Shirt body */}
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
      {/* Sleeve shadow — left */}
      <path
        fill={shadowShade}
        d="M 22 34 L 3 72 L 60 97 L 60 72 Z"
      />
      {/* Sleeve shadow — right */}
      <path
        fill={shadowShade}
        d="M 278 34 L 297 72 L 240 97 L 240 72 Z"
      />
      {/* Collar */}
      <path
        fill={collarShade}
        d="M 97 60
           C 108 78, 136 93, 150 93
           C 164 93, 192 78, 203 60
           C 192 52, 165 35, 150 35
           C 135 35, 108 52, 97 60 Z"
      />
      {/* Back label */}
      {back && (
        <text
          x="150"
          y="175"
          textAnchor="middle"
          fill={light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.22)"}
          fontSize="22"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          letterSpacing="4"
        >
          MẶT SAU
        </text>
      )}
    </svg>
  );
}

// --- Main Component ---

type SizeQty = Record<string, number>;

export function DesignStudioPage() {
  const [selectedColor, setSelectedColor] = useState("#1a1a1a");
  const [view, setView] = useState<"front" | "back">("front");
  const [quantities, setQuantities] = useState<SizeQty>(
    Object.fromEntries(SIZES.map((s) => [s, 0]))
  );
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const shirtTotal = BASE_PRICE * (totalQty || 1);
  const grandTotal = shirtTotal;

  const updateQty = (size: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [size]: Math.max(0, val) }));

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2800);
  };

  return (
    <main className="pt-20 min-h-screen bg-[var(--surface)] flex flex-col">
      {/* Page header */}
      <div className="bg-white border-b border-[var(--outline-variant)] py-5 text-center flex-shrink-0">
        <h1 className="font-['Montserrat'] text-2xl md:text-3xl font-bold text-[var(--deep-navy)]">
          Ứng Dụng Thiết Kế
        </h1>
        <p className="text-sm text-[var(--on-surface-variant)] mt-1">
          Cá nhân hoá đồng phục và đặt hàng trực tiếp với Farriott
        </p>
      </div>

      {/* Three-panel workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel ── */}
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-white border-r border-[var(--outline-variant)] overflow-y-auto">
          {/* Color picker */}
          <div className="p-4 border-b border-[var(--outline-variant)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)] text-center mb-3">
              Chọn Màu
            </p>
            <div className="grid grid-cols-6 gap-2">
              {shirtColors.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setSelectedColor(c.hex)}
                  className="w-7 h-7 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: c.hex,
                    border:
                      selectedColor === c.hex
                        ? "3px solid var(--electric-blue)"
                        : isLightColor(c.hex)
                        ? "2px solid #d1d5db"
                        : "2px solid transparent",
                    transform: selectedColor === c.hex ? "scale(1.18)" : "scale(1)",
                    boxShadow:
                      selectedColor === c.hex
                        ? "0 0 0 2px white, 0 0 0 4px var(--electric-blue)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="p-2 border-b border-[var(--outline-variant)]">
            {tools.map((tool) => (
              <button
                key={tool.label}
                onClick={() =>
                  setActiveTool(activeTool === tool.label ? null : tool.label)
                }
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  activeTool === tool.label
                    ? "bg-[var(--primary-fixed)] text-[var(--deep-navy)] font-medium"
                    : "text-[var(--on-surface)] hover:bg-[var(--surface-container-low)] hover:text-[var(--deep-navy)]"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[var(--deep-navy)]">
                  {tool.icon}
                </span>
                {tool.label}
              </button>
            ))}
          </div>

          {/* Pattern dropdown */}
          <div className="p-4">
            <button className="w-full flex items-center justify-between px-3 py-2.5 border border-[var(--outline-variant)] rounded text-sm text-[var(--on-surface)] hover:border-[var(--deep-navy)] transition-colors">
              <span>Họa tiết</span>
              <span className="material-symbols-outlined text-[20px] text-[var(--on-surface-variant)]">
                expand_more
              </span>
            </button>
          </div>
        </aside>

        {/* ── Center panel ── */}
        <div className="flex-1 flex flex-col bg-[var(--surface-container-low)] min-w-0">
          {/* Center toolbar */}
          <div className="bg-white border-b border-[var(--outline-variant)] px-4 py-4 flex items-center justify-center gap-3 flex-shrink-0">
            {centerActions.map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-1.5 px-8 py-3 border border-[var(--outline-variant)] rounded bg-white hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] hover:bg-[var(--surface-container-low)] transition-all group min-w-[88px]"
              >
                <span className="material-symbols-outlined text-[32px] text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.icon}
                </span>
                <span className="text-sm font-medium text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.label}
                </span>
              </button>
            ))}
          </div>

          {/* Shirt preview */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 px-6">
            <div className="w-full max-w-[360px] aspect-square">
              <TShirtSVG color={selectedColor} back={view === "back"} />
            </div>

            {/* Front / Back toggle thumbnails */}
            <div className="flex gap-3 mt-5">
              {(["front", "back"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`w-[60px] h-[60px] p-1.5 rounded border-2 bg-white transition-all ${
                    view === v
                      ? "border-[var(--deep-navy)] shadow-sm"
                      : "border-[var(--outline-variant)] opacity-55 hover:opacity-80"
                  }`}
                >
                  <TShirtSVG color={selectedColor} back={v === "back"} />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile color bar */}
          <div className="md:hidden px-4 pb-4 bg-white border-t border-[var(--outline-variant)] pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)] mb-2">
              Chọn Màu
            </p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {shirtColors.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setSelectedColor(c.hex)}
                  className="flex-shrink-0 w-7 h-7 rounded-full transition-all"
                  style={{
                    backgroundColor: c.hex,
                    border:
                      selectedColor === c.hex
                        ? "3px solid var(--electric-blue)"
                        : isLightColor(c.hex)
                        ? "2px solid #d1d5db"
                        : "2px solid transparent",
                    boxShadow:
                      selectedColor === c.hex
                        ? "0 0 0 2px white, 0 0 0 4px var(--electric-blue)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <aside className="w-72 flex-shrink-0 bg-white border-l border-[var(--outline-variant)] overflow-y-auto flex flex-col">
          {/* Product attributes */}
          <div className="p-4 border-b border-[var(--outline-variant)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Montserrat'] text-sm font-semibold text-[var(--deep-navy)]">
                Thuộc tính áo
              </h3>
              <span className="material-symbols-outlined text-[var(--on-surface-variant)] text-[20px]">
                expand_more
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="font-medium text-[var(--on-surface)]">Tên sản phẩm: </span>
                <span className="text-[var(--on-surface-variant)]">Cổ tròn tay ngắn</span>
              </p>
              <p>
                <span className="font-medium text-[var(--on-surface)]">Loại vải: </span>
                <span className="text-[var(--on-surface-variant)]">95% cotton, 5% spandex</span>
              </p>
              <p>
                <span className="font-medium text-[var(--on-surface)]">Loại in: </span>
                <span className="text-[var(--on-surface-variant)]">DTF / Decal đa sắc</span>
              </p>
            </div>
            <button className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] border border-[var(--outline-variant)] rounded px-3 py-1.5 hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
              <span className="material-symbols-outlined text-[16px]">straighten</span>
              Thông tin size
            </button>
          </div>

          {/* Size grid */}
          <div className="p-4 border-b border-[var(--outline-variant)]">
            <h3 className="text-sm font-semibold text-[var(--deep-navy)] mb-3">
              Size áo
            </h3>
            <div className="grid grid-cols-3 gap-x-2 gap-y-3">
              {SIZES.map((size) => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <label className="text-xs font-semibold text-[var(--on-surface-variant)]">
                    {size}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={quantities[size]}
                    onChange={(e) => updateQty(size, parseInt(e.target.value) || 0)}
                    className="w-full text-center text-sm border border-[var(--outline-variant)] rounded py-1.5 focus:border-[var(--deep-navy)] focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            {totalQty > 0 && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--electric-blue)] text-[16px]">
                  info
                </span>
                <p className="text-xs text-[var(--electric-blue)] font-medium">
                  Tổng: {totalQty} sản phẩm
                </p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-['Montserrat'] text-base font-semibold text-[var(--deep-navy)] mb-3">
                Tổng cộng:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[var(--on-surface-variant)]">
                  <span>Tiền áo</span>
                  <span>{shirtTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-[var(--on-surface-variant)]">
                  <span>Tiền in</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between text-[var(--on-surface-variant)]">
                  <span>Tiền ảnh</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[var(--outline-variant)]">
                  <span className="text-sm text-[var(--on-surface-variant)]">Tổng cộng:</span>
                  <span className="font-['Montserrat'] text-2xl font-bold text-[var(--deep-navy)]">
                    {grandTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <p className="text-xs text-[var(--cool-silver)] italic">
                  Giá đã bao gồm 8% VAT
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[var(--electric-blue)] hover:bg-[var(--deep-navy)] text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedToCart ? "check_circle" : "shopping_cart"}
                </span>
                {addedToCart ? "Đã thêm vào giỏ!" : "Thêm vào giỏ"}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-bold uppercase tracking-wider border border-[var(--deep-navy)] text-[var(--deep-navy)] hover:bg-[var(--deep-navy)] hover:text-white transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  request_quote
                </span>
                Nhận báo giá
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
