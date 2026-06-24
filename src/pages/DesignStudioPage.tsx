import { useState, useRef, useEffect, useMemo, memo } from "react";
import { Rnd } from "react-rnd";
import { useCart } from "@/context/CartContext";

// --- Data ---

const shirtColors = [
  { name: "Đen", hex: "#000000ff" },
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

// Vùng in tham chiếu (theo tỉ lệ % khi KHÔNG zoom) — dùng để quy đổi vị trí/kích thước
// khi người dùng bấm Phóng To, để layer giữ đúng vị trí tương đối trên áo.
const PRINT_AREA_BASE = { top: 0.2, left: 0.28, width: 0.44, height: 0.5 };

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

// --- Types cho các layer (ảnh / chữ) đặt trên áo ---

type ImageLayer = {
  id: string;
  type: "image";
  src: string;
  view: "front" | "back";
  // Vị trí & kích thước được lưu ở tỉ lệ % (0-1) so với khung preview,
  // để có thể quy đổi chính xác khi đổi kích thước khung lúc Phóng To.
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
};

type TextLayer = {
  id: string;
  type: "text";
  content: string;
  fontSizePct: number; // cỡ chữ lưu theo % chiều cao khung, để scale đúng tỉ lệ khi zoom
  view: "front" | "back";
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
};

type Layer = ImageLayer | TextLayer;

// --- Helpers ---

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// --- Layer Item (ảnh hoặc chữ đặt trên áo) ---
// Tách riêng thành component để:
// 1) Mỗi layer chỉ re-render khi chính nó thay đổi, không bị ảnh hưởng bởi
//    việc chọn/hover một layer KHÁC (tránh Rnd nhận props "mới" một cách không cần thiết).
// 2) Dùng useMemo để giữ NGUYÊN reference của object `position`/`size` khi giá trị số
//    không đổi — vì Rnd so sánh prop bằng reference, một object mới (dù số giống cũ)
//    cũng khiến nó tưởng vị trí vừa bị set lại từ bên ngoài và "đồng bộ" lại,
//    gây hiện tượng khựng nếu việc này trùng thời điểm với lúc bắt đầu kéo.
const LayerItem = memo(function LayerItem({
  layer,
  boxW,
  boxH,
  isHovered,
  isSelected,
  onSelect,
  onHoverChange,
  onDragStateChange,
  onUpdate,
  onRemove,
  selectedColor,
}: {
  layer: Layer;
  boxW: number;
  boxH: number;
  isHovered: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onHoverChange: (hovering: boolean) => void;
  onDragStateChange: (dragging: boolean) => void;
  onUpdate: (patch: Partial<Layer>) => void;
  onRemove: () => void;
  selectedColor: string;
}) {
  const position = useMemo(
    () => ({ x: layer.xPct * boxW, y: layer.yPct * boxH }),
    [layer.xPct, layer.yPct, boxW, boxH]
  );
  const size = useMemo(
    () => ({ width: layer.widthPct * boxW, height: layer.heightPct * boxH }),
    [layer.widthPct, layer.heightPct, boxW, boxH]
  );

  return (
    <Rnd
      bounds="parent"
      size={size}
      position={position}
      lockAspectRatio={layer.type === "image"}
      // Tắt hack user-select trên <body>: tránh trang bị "giật" khi bắt đầu kéo
      enableUserSelectHack={false}
      style={{
        touchAction: "none",
        // Viền chỉ hiện khi đang trỏ chuột vào (hover), không phụ thuộc
        // việc layer có đang được chọn hay không.
        border: isHovered
          ? "2px dashed var(--electric-blue)"
          : "2px dashed transparent",
        cursor: isHovered ? "move" : "default",
      }}
      onDragStart={(e) => {
        e.preventDefault();
        onDragStateChange(true);
      }}
      onDrag={() => {
        if (!isSelected) onSelect();
      }}
      onDragStop={(_e, d) => {
        onUpdate({ xPct: d.x / boxW, yPct: d.y / boxH } as Partial<Layer>);
        onDragStateChange(false);
      }}
      onResizeStart={() => {
        onSelect();
        onDragStateChange(true);
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        onUpdate({
          widthPct: ref.offsetWidth / boxW,
          heightPct: ref.offsetHeight / boxH,
          xPct: pos.x / boxW,
          yPct: pos.y / boxH,
          ...(layer.type === "text"
            ? {
              fontSizePct:
                ((layer as TextLayer).fontSizePct * ref.offsetHeight) /
                (layer.heightPct * boxH),
            }
            : {}),
        } as Partial<Layer>);
        onDragStateChange(false);
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      // Chọn layer khi bấm xuống, NHƯNG bỏ qua nếu đang bấm vào nút xoá
      // (data-no-select đánh dấu nút đó) — tránh việc Rnd "nuốt" click của
      // nút xoá khi cả hai cùng lắng nghe sự kiện trên cùng vùng DOM.
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-no-select]")) return;
        onSelect();
        // Khoá luôn từ lúc nhấn xuống (không chờ tới onDragStart), để không
        // có khoảng hở giữa lúc "chọn" và lúc bắt đầu kéo thực sự — đây là
        // khoảng hở mà sidebar có thể đổi layout và làm lệch toạ độ layer.
        onDragStateChange(true);
      }}
      // Handle resize ở góc trên-phải trùng vị trí nút xoá (-top-3 -right-3).
      // Thu nhỏ vùng bắt sự kiện của riêng handle này và bỏ cursor resize,
      // để nó không đè cursor "nesw-resize" lên trên nút xoá nữa.
      resizeHandleStyles={{
        topRight: { cursor: "default", width: "10px", height: "10px" },
      }}
      className={`group ${isSelected ? "z-20" : "z-10"}`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {layer.type === "image" ? (
          <img
            src={layer.src}
            alt="Hình tải lên"
            draggable={false}
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-center whitespace-pre-wrap break-words pointer-events-none select-none"
            style={{
              fontSize: `${(layer.fontSizePct / 100) * boxH}px`,
              color: isLightColor(selectedColor) ? "#1a1a1a" : "#ffffff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            {layer.content}
          </div>
        )}

        {/* Nút xoá layer, CHỈ hiện khi đang trỏ chuột vào layer (hover).
            data-no-select để onMouseDown ở Rnd phía trên biết bỏ qua, không
            chọn/kéo layer khi người dùng đang thực sự bấm vào nút này. */}
        <button
          type="button"
          tabIndex={-1}
          data-no-select="true"
          style={{ cursor: "pointer" }}
          className={`absolute -top-3 -right-3 z-30 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-opacity ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Xóa"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </Rnd>
  );
});


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
  const { addItem } = useCart();

  // Hiển thị ảnh áo mẫu thật ban đầu, tắt đi khi người dùng chọn màu để chuyển sang SVG
  const [isDefaultMockup, setIsDefaultMockup] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Tất cả layer (ảnh upload + chữ) đặt trên áo, có thể kéo-thả & resize tự do
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  // true trong suốt thời gian đang kéo/resize một layer — dùng để khoá cuộn trang,
  // vì nguyên nhân chính của hiện tượng "trang tự giật lên" là trình duyệt tự cuộn
  // theo phần tử đang được tương tác trong lúc kéo (đặc biệt khi panel cha có overflow-y).
  const [isInteractingLayer, setIsInteractingLayer] = useState(false);

  useEffect(() => {
    if (!isInteractingLayer) return;
    // Nếu người dùng chỉ bấm chọn (mousedown) mà không thực sự kéo, onDragStop
    // của Rnd sẽ không chạy. Lắng nghe mouseup toàn cục để đảm bảo trạng thái
    // "đang tương tác" luôn được tắt lại, không bị treo ở true mãi.
    const handleUp = () => setIsInteractingLayer(false);
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [isInteractingLayer]);

  useEffect(() => {
    if (!isInteractingLayer) return;

    // Ghim cứng vị trí cuộn hiện tại của trang trong suốt lúc kéo/resize
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const lockScroll = () => window.scrollTo(scrollX, scrollY);

    window.addEventListener("scroll", lockScroll, { passive: false });
    return () => window.removeEventListener("scroll", lockScroll);
  }, [isInteractingLayer]);

  // State cho ô nhập chữ (panel "Thêm chữ")
  const [textDraft, setTextDraft] = useState("");
  const [textDraftSize, setTextDraftSize] = useState(8); // % chiều cao khung preview

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kích thước khung preview hiện tại (px) — cần để quy đổi giữa px <-> %.
  // Dùng ResizeObserver thay vì đọc getBoundingClientRect() trực tiếp trong render,
  // vì lúc đang chạy CSS transition (khi bấm Phóng To), getBoundingClientRect()
  // có thể trả về kích thước giữa chừng (chưa tới đích), khiến layer bị lệch vị trí
  // và scale sai tỉ lệ trong khoảnh khắc chuyển đổi.
  const previewRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState({ width: 360, height: 360 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const updateSize = () => {
      // Trong lúc đang kéo/resize một layer, không cập nhật boxSize nữa.
      // Lý do: chọn layer (mousedown) có thể khiến sidebar trái hiện thêm
      // panel "Chỉnh chữ đang chọn", làm layout flex tổng thể co giãn nhẹ,
      // kéo theo khung preview bị đo lại kích thước đúng lúc người dùng vừa
      // nhấn xuống để kéo — gây cảm giác layer bị "khựng" một nhịp.
      if (isInteractingLayer) return;
      const rect = el.getBoundingClientRect();
      setBoxSize((prev) => {
        // Chỉ update khi thực sự đổi, tránh re-render thừa
        if (prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInteractingLayer]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newLayer: ImageLayer = {
        id: uid(),
        type: "image",
        src: url,
        view,
        xPct: PRINT_AREA_BASE.left + PRINT_AREA_BASE.width / 2 - 0.15,
        yPct: PRINT_AREA_BASE.top + PRINT_AREA_BASE.height / 2 - 0.15,
        widthPct: 0.3,
        heightPct: 0.3,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    }
    // reset input để có thể upload lại cùng 1 file nếu cần
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddText = () => {
    const content = textDraft.trim();
    if (!content) return;
    const newLayer: TextLayer = {
      id: uid(),
      type: "text",
      content,
      fontSizePct: textDraftSize,
      view,
      xPct: PRINT_AREA_BASE.left + 0.04,
      yPct: PRINT_AREA_BASE.top + PRINT_AREA_BASE.height / 2 - 0.05,
      widthPct: PRINT_AREA_BASE.width - 0.08,
      heightPct: 0.18,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setTextDraft("");
  };

  // Enter để xuống dòng là hành vi mặc định của <textarea>, nên không cần xử lý thêm.
  // Chỉ chặn Enter khi giữ Ctrl/Cmd để thêm chữ nhanh (tuỳ chọn UX).
  const handleTextDraftKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddText();
    }
  };

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l))
    );
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const shirtTotal = BASE_PRICE * (totalQty || 1);
  const grandTotal = shirtTotal;

  const updateQty = (size: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [size]: Math.max(0, val) }));

  const handleAddToCart = () => {
    // Get color name from hex
    const colorInfo = shirtColors.find((c) => c.hex === selectedColor);
    const colorName = colorInfo?.name || "Tùy chỉnh";

    // Build sizes array from quantities
    const sizes = SIZES.filter((s) => quantities[s] > 0).map((s) => ({
      size: s,
      quantity: quantities[s],
    }));

    // Require at least one item
    if (sizes.length === 0) {
      alert("Vui lòng chọn ít nhất một size với số lượng > 0");
      return;
    }

    // Add to cart
    addItem({
      color: selectedColor,
      colorName,
      sizes,
      totalPrice: grandTotal,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2800);
  };

  const visibleLayers = layers.filter((l) => l.view === view);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <main className="pt-20 min-h-screen bg-[var(--surface)] flex flex-col">
      {/* Nút upload ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {/* Page header */}
      <div className="bg-white border-b border-[var(--outline-variant)] py-5 text-center flex-shrink-0">
        <h1 className="font-['Montserrat'] text-2xl md:text-3xl font-bold text-[var(--deep-navy)] mt-4">
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
                  onClick={() => {
                    setSelectedColor(c.hex);
                    setIsDefaultMockup(false);
                  }}
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
                onClick={() => {
                  if (tool.label === "Upload ảnh") {
                    fileInputRef.current?.click();
                  } else {
                    setActiveTool(activeTool === tool.label ? null : tool.label);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${activeTool === tool.label
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

          {/* Panel "Thêm chữ" — chỉ hiện khi tool đang được chọn */}
          {activeTool === "Thêm chữ" && (
            <div className="p-4 border-b border-[var(--outline-variant)] space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                Thêm chữ
              </p>
              <textarea
                value={textDraft}
                onChange={(e) => setTextDraft(e.target.value)}
                onKeyDown={handleTextDraftKeyDown}
                placeholder={"Nhập chữ của bạn...\n(Enter để xuống dòng)"}
                rows={3}
                className="w-full text-sm border border-[var(--outline-variant)] rounded p-2 resize-none focus:border-[var(--deep-navy)] focus:outline-none transition-colors"
              />

              {/* Bảng chỉnh cỡ chữ */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[var(--on-surface-variant)]">
                    Cỡ chữ
                  </label>
                  <span className="text-xs font-semibold text-[var(--deep-navy)]">
                    {textDraftSize}
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={0.5}
                  value={textDraftSize}
                  onChange={(e) => setTextDraftSize(parseFloat(e.target.value))}
                  className="w-full accent-[var(--electric-blue)]"
                />
              </div>

              <button
                onClick={handleAddText}
                disabled={!textDraft.trim()}
                className="w-full py-2 rounded text-sm font-semibold bg-[var(--electric-blue)] text-white hover:bg-[var(--deep-navy)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Thêm vào áo
              </button>
            </div>
          )}

          {/* Panel layer đang chọn trên áo — LUÔN giữ cùng cấu trúc/chiều cao
              cho cả layer ảnh và chữ (chỉ đổi nội dung bên trong). Lý do:
              nếu panel này CHỈ xuất hiện cho layer chữ, lúc người dùng chuyển
              từ chọn layer chữ sang layer ảnh, panel đột ngột biến mất, sidebar
              co lại, toàn bộ layout trang đổi chiều cao — trình duyệt buộc phải
              điều chỉnh lại vị trí cuộn, gây ra cảm giác trang bị "giật" xuống.
              Giữ khung panel cố định (ẩn/hiện nội dung bên trong, không ẩn/hiện
              cả khung) loại bỏ hoàn toàn nguyên nhân layout-shift này. */}
          {selectedLayer && (
            <div
              className="p-4 border-b border-[var(--outline-variant)] space-y-3"
              style={{ minHeight: "260px" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                {selectedLayer.type === "text" ? "Chỉnh chữ đang chọn" : "Ảnh đang chọn"}
              </p>

              {selectedLayer.type === "text" ? (
                <>
                  <textarea
                    value={selectedLayer.content}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { content: e.target.value })
                    }
                    rows={3}
                    className="w-full text-sm border border-[var(--outline-variant)] rounded p-2 resize-none focus:border-[var(--deep-navy)] focus:outline-none transition-colors"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[var(--on-surface-variant)]">
                        Cỡ chữ
                      </label>
                      <span className="text-xs font-semibold text-[var(--deep-navy)]">
                        {selectedLayer.fontSizePct}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      step={0.5}
                      value={selectedLayer.fontSizePct}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          fontSizePct: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-[var(--electric-blue)]"
                    />
                  </div>
                </>
              ) : (
                // Layer ảnh: preview nhỏ + thông báo, giữ cùng khoảng chiều cao
                // tương đối với phần chữ ở trên để tránh layout nhảy quá mạnh.
                <div className="flex items-center gap-3 p-2 border border-[var(--outline-variant)] rounded">
                  <img
                    src={selectedLayer.src}
                    alt="Ảnh đang chọn"
                    className="w-12 h-12 object-contain rounded border border-[var(--outline-variant)]"
                  />
                  <p className="text-xs text-[var(--on-surface-variant)]">
                    Kéo hoặc resize ảnh trực tiếp trên áo.
                  </p>
                </div>
              )}

              <button
                onClick={() => removeLayer(selectedLayer.id)}
                className="w-full py-2 rounded text-sm font-semibold border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
              >
                {selectedLayer.type === "text" ? "Xoá chữ này" : "Xoá ảnh này"}
              </button>
            </div>
          )}


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
                onClick={() => {
                  if (a.label === "Reset") {
                    setIsDefaultMockup(true);
                    setSelectedColor("#1a1a1a");
                    setLayers([]);
                    setSelectedLayerId(null);
                  } else if (a.label === "Phóng To") {
                    // Chỉ đổi kích thước khung hiển thị; vì toạ độ & cỡ chữ của
                    // layer được lưu theo %, chúng tự scale đúng tỉ lệ theo áo.
                    setIsZoomed(!isZoomed);
                  }
                }}
                className="flex flex-col items-center gap-1.5 px-8 py-3 border border-[var(--outline-variant)] rounded bg-white hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] hover:bg-[var(--surface-container-low)] transition-all group min-w-[88px]"
              >
                <span className="material-symbols-outlined text-[32px] text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.label === "Phóng To" && isZoomed ? "zoom_out" : a.icon}
                </span>
                <span className="text-sm font-medium text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.label === "Phóng To" && isZoomed ? "Thu Nhỏ" : a.label}
                </span>
              </button>
            ))}
          </div>

          {/* Shirt preview */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 px-6 overflow-hidden">
            <div
              ref={previewRef}
              onClick={(e) => {
                // Bấm ra vùng trống thì bỏ chọn layer
                if (e.target === e.currentTarget) setSelectedLayerId(null);
              }}
              className={`w-full aspect-square relative flex items-center justify-center transition-all duration-300 ease-in-out ${isZoomed ? "max-w-[550px]" : "max-w-[360px]"}`}
            >
              {isDefaultMockup ? (
                <img
                  src="/images/shirt_white.png"
                  alt={view === "front" ? "Áo mẫu mặt trước" : "Áo mẫu mặt sau"}
                  className={`max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-300 ${view === "back" ? "scale-x-[-1]" : ""}`}
                />
              ) : (
                <div
                  className="absolute w-full h-full transition-transform duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    WebkitMaskImage: 'url(/images/shirt_white.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/images/shirt_white.png)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    transform: view === "back" ? "scaleX(-1)" : "none"
                  }}
                >
                  <img
                    src="/images/shirt_white.png"
                    alt="Colored Shirt"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              )}

              {/* Các layer ảnh / chữ — kéo-thả & resize tự do, toạ độ lưu theo %
                  nên tự scale đúng tỉ lệ áo khi khung preview đổi kích thước (Phóng To) */}
              {visibleLayers.map((layer) => {
                const boxW = boxSize.width;
                const boxH = boxSize.height;

                const isHovered = hoveredLayerId === layer.id;
                const isSelected = selectedLayerId === layer.id;

                return (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    boxW={boxW}
                    boxH={boxH}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    onSelect={() => setSelectedLayerId(layer.id)}
                    onHoverChange={(hovering) =>
                      setHoveredLayerId(hovering ? layer.id : null)
                    }
                    onDragStateChange={setIsInteractingLayer}
                    onUpdate={(patch) => updateLayer(layer.id, patch)}
                    onRemove={() => removeLayer(layer.id)}
                    selectedColor={selectedColor}
                  />
                );
              })}
            </div>

            {/* Front / Back toggle thumbnails */}
            <div className="flex gap-3 mt-5">
              {(["front", "back"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  onMouseEnter={() => setView(v)}
                  className={`w-[60px] h-[60px] p-1.5 rounded border-2 bg-white transition-all ${view === v
                    ? "border-[var(--deep-navy)] shadow-sm"
                    : "border-[var(--outline-variant)] opacity-55 hover:opacity-80"
                    }`}
                >
                  {isDefaultMockup ? (
                    <img
                      src="/images/shirt_white.png"
                      alt={v === "front" ? "Mặt trước" : "Mặt sau"}
                      className={`w-full h-full object-contain ${v === "back" ? "scale-x-[-1]" : ""}`}
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: selectedColor,
                        WebkitMaskImage: 'url(/images/shirt_white.png)',
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskImage: 'url(/images/shirt_white.png)',
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        transform: v === "back" ? "scaleX(-1)" : "none"
                      }}
                    >
                      <img
                        src="/images/shirt_white.png"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  )}
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
                  <label className="text-xs font-semibold text-[var(--on-surface-variant)] text-center w-full">
                    {size}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={quantities[size]}
                    onChange={(e) => updateQty(size, parseInt(e.target.value) || 0)}
                    className="w-full text-center text-sm border border-[var(--outline-variant)] rounded py-1.5 focus:border-[var(--deep-navy)] focus:outline-none transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
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
                className={`w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all duration-300 ${addedToCart
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