import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { Rnd } from "react-rnd";
import { useNavigate, useSearchParams } from "react-router-dom";
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

// ─── Photoshop-style Color Picker ───────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').slice(0, 6);
  if (clean.length < 6) return null;
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s, v };
}

const PhotoshopColorPicker = memo(function PhotoshopColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (hex: string) => void;
}) {
  // Parse initial color to HSV
  const initHsv = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return { h: 0, s: 1, v: 1 };
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  }, []);

  const [hue, setHue] = useState(initHsv.h);          // 0-360
  const [sat, setSat] = useState(initHsv.s);           // 0-1
  const [val, setVal] = useState(initHsv.v);           // 0-1  (brightness)
  const [opacity, setOpacity] = useState(1);           // 0-1
  const [hexInput, setHexInput] = useState(color.replace('#', '').slice(0, 6));

  const gradRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const opRef = useRef<HTMLDivElement>(null);

  // Compute current hex from hsv + opacity
  const currentRgb = useMemo(() => hsvToRgb(hue, sat, val), [hue, sat, val]);
  const currentHex = useMemo(() => rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b), [currentRgb]);

  // Hue-only color for gradient backgrounds
  const hueHex = useMemo(() => {
    const { r, g, b } = hsvToRgb(hue, 1, 1);
    return rgbToHex(r, g, b);
  }, [hue]);

  // Sync hex input when picker moves
  useEffect(() => { setHexInput(currentHex.slice(1)); }, [currentHex]);

  // Notify parent
  useEffect(() => { onChange(currentHex); }, [currentHex]);

  // ── Gradient square drag ──
  const isDraggingGrad = useRef(false);
  const updateGrad = useCallback((clientX: number, clientY: number) => {
    const el = gradRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    setSat(s);
    setVal(v);
  }, []);

  const onGradMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingGrad.current = true;
    updateGrad(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => { if (isDraggingGrad.current) updateGrad(ev.clientX, ev.clientY); };
    const onUp = () => { isDraggingGrad.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Hue slider drag ──
  const isDraggingHue = useRef(false);
  const updateHue = useCallback((clientX: number) => {
    const el = hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
    setHue(h);
  }, []);

  const onHueMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHue.current = true;
    updateHue(e.clientX);
    const onMove = (ev: MouseEvent) => { if (isDraggingHue.current) updateHue(ev.clientX); };
    const onUp = () => { isDraggingHue.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Opacity slider drag ──
  const isDraggingOp = useRef(false);
  const updateOp = useCallback((clientX: number) => {
    const el = opRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const o = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setOpacity(o);
  }, []);

  const onOpMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingOp.current = true;
    updateOp(e.clientX);
    const onMove = (ev: MouseEvent) => { if (isDraggingOp.current) updateOp(ev.clientX); };
    const onUp = () => { isDraggingOp.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Hex input ──
  const handleHexInput = (v: string) => {
    setHexInput(v.replace(/[^0-9a-fA-F]/g, '').slice(0, 6));
  };
  const commitHex = () => {
    const rgb = hexToRgb('#' + hexInput);
    if (!rgb) return;
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHue(hsv.h); setSat(hsv.s); setVal(hsv.v);
  };

  // Quick preset swatches
  const presets = [
    '#000000','#ffffff','#f97316','#dc2626','#1A2A6C','#9ca3af',
    '#7c3aed','#16a34a','#ec4899','#ca8a04','#c96a4a','#0ea5e9',
  ];

  return (
    <div className="select-none">
      {/* Gradient Square */}
      <div
        ref={gradRef}
        onMouseDown={onGradMouseDown}
        className="relative w-full rounded-lg overflow-hidden cursor-crosshair mb-2"
        style={{ height: 140, background: hueHex }}
      >
        {/* white fade left→right */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
        {/* black fade top→bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, #000)' }} />
        {/* crosshair cursor */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `calc(${sat * 100}% - 8px)`,
            top: `calc(${(1 - val) * 100}% - 8px)`,
            backgroundColor: currentHex,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* Hue Slider */}
      <div className="mb-2">
        <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wider">Màu sắc (Hue)</p>
        <div
          ref={hueRef}
          onMouseDown={onHueMouseDown}
          className="relative h-4 rounded-full cursor-pointer"
          style={{ background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
            style={{
              left: `calc(${(hue / 360) * 100}% - 8px)`,
              backgroundColor: hueHex,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wider">Độ mờ (Opacity)</p>
        <div
          ref={opRef}
          onMouseDown={onOpMouseDown}
          className="relative h-4 rounded-full cursor-pointer overflow-hidden"
          style={{
            background: `linear-gradient(to right, transparent, ${currentHex}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `linear-gradient(to right, transparent, ${currentHex})` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
            style={{
              left: `calc(${opacity * 100}% - 8px)`,
              backgroundColor: `rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},${opacity})`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* Preview + Hex Input */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex-shrink-0 border border-gray-200"
          style={{
            backgroundColor: `rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},${opacity})`,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
          }}
        />
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 mb-0.5 font-medium uppercase tracking-wider">HEX</p>
          <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-gray-50">
            <span className="text-gray-400 text-xs mr-1">#</span>
            <input
              type="text"
              value={hexInput}
              onChange={e => handleHexInput(e.target.value)}
              onBlur={commitHex}
              onKeyDown={e => e.key === 'Enter' && commitHex()}
              className="flex-1 bg-transparent text-xs font-mono text-gray-800 outline-none w-0 min-w-0"
              placeholder="000000"
              maxLength={6}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 mb-0.5 font-medium uppercase tracking-wider">Opacity</p>
          <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-gray-50">
            <input
              type="number"
              value={Math.round(opacity * 100)}
              min={0} max={100}
              onChange={e => setOpacity(Math.max(0, Math.min(1, Number(e.target.value) / 100)))}
              className="flex-1 bg-transparent text-xs font-mono text-gray-800 outline-none w-0 min-w-0"
            />
            <span className="text-gray-400 text-xs ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* RGB readout */}
      <div className="flex gap-1 mb-3">
        {(['R','G','B'] as const).map((ch, i) => (
          <div key={ch} className="flex-1 text-center">
            <div className="border border-gray-200 rounded px-1 py-1 bg-gray-50">
              <p className="text-[9px] text-gray-400 font-medium">{ch}</p>
              <p className="text-xs font-mono text-gray-700">{[currentRgb.r,currentRgb.g,currentRgb.b][i]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map(p => (
          <button
            key={p}
            title={p}
            onClick={() => {
              const rgb = hexToRgb(p)!;
              const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
              setHue(hsv.h); setSat(hsv.s); setVal(hsv.v);
            }}
            className="w-6 h-6 rounded-full transition-transform hover:scale-110"
            style={{
              backgroundColor: p,
              border: currentHex.toLowerCase() === p.toLowerCase() ? '2px solid #c96a4a' : '2px solid #e5e7eb',
              boxShadow: currentHex.toLowerCase() === p.toLowerCase() ? '0 0 0 1px white, 0 0 0 3px #c96a4a' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
});


const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];

const SHIRT_STYLES = [
  {
    id: "short-sleeve",
    name: "Tay ngắn (T-shirt)",
    desc: "Cổ tròn tay ngắn trẻ trung",
    image: "/images/shirt_white.png",
  },
  {
    id: "long-sleeve",
    name: "Tay dài (Long sleeve)",
    desc: "Cổ tròn tay dài ấm áp, lịch sự",
    image: "/images/shirt_white_with_sleeve.png",
  },
  {
    id: "tank-top",
    name: "Không có tay (Tank-top)",
    desc: "Áo ba lỗ thể thao, năng động",
    image: "/images/shirt_tank_top.png",
  },
];

const BASE_PRICE = 152000;

// Vùng in tham chiếu (theo tỉ lệ % khi KHÔNG zoom) — dùng để quy đổi vị trí/kích thước
// khi người dùng bấm Phóng To, để layer giữ đúng vị trí tương đối trên áo.
const PRINT_AREA_BASE = { top: 0.2, left: 0.28, width: 0.44, height: 0.5 };

const tools = [
  { icon: "style", label: "Chọn mẫu áo" },
  { icon: "title", label: "Thêm chữ" },
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
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
};

type TextLayer = {
  id: string;
  type: "text";
  content: string;
  fontSizePct: number;
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

import { processAndUploadImage } from "@/lib/uploadService";

// Xử lý nén ảnh (Base64) hoặc upload trực tiếp Cloudinary nếu có cấu hình
async function urlToDataUrl(url: string): Promise<string> {
  const result = await processAndUploadImage(url);
  return result.url;
}


// --- Layer Item (ảnh hoặc chữ đặt trên áo) ---
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
      enableUserSelectHack={false}
      style={{
        touchAction: "none",
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
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-no-select]")) return;
        onSelect();
        onDragStateChange(true);
      }}
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
  const [selectedStyleId, setSelectedStyleId] = useState("short-sleeve");
  const [hoveredStyleId, setHoveredStyleId] = useState<string | null>(null);
  const selectedStyle = useMemo(() => {
    return SHIRT_STYLES.find((s) => s.id === selectedStyleId) || SHIRT_STYLES[0];
  }, [selectedStyleId]);
  const displayedStyle = useMemo(() => {
    const targetId = hoveredStyleId || selectedStyleId;
    return SHIRT_STYLES.find((s) => s.id === targetId) || SHIRT_STYLES[0];
  }, [hoveredStyleId, selectedStyleId]);
  const [view, setView] = useState<"front" | "back">("front");
  const [quantities, setQuantities] = useState<SizeQty>(
    Object.fromEntries(SIZES.map((s) => [s, 0]))
  );
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSavingToCart, setIsSavingToCart] = useState(false);
  const { items, addItem, updateItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editCartId = searchParams.get("editCartId");

  const [isDefaultMockup, setIsDefaultMockup] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAttributesOpen, setIsAttributesOpen] = useState(true);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(true);

  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [isInteractingLayer, setIsInteractingLayer] = useState(false);
  // Khôi phục thiết kế từ giỏ hàng nếu có editCartId trên URL
  useEffect(() => {
    if (!editCartId) return;
    const itemToEdit = items.find((it) => it.id === editCartId);
    if (!itemToEdit) return;

    if (itemToEdit.color) {
      setSelectedColor(itemToEdit.color);
      setIsDefaultMockup(false);
    }
    if (itemToEdit.styleId) {
      setSelectedStyleId(itemToEdit.styleId);
    }
    if (itemToEdit.sizes) {
      const qMap: Record<string, number> = Object.fromEntries(
        SIZES.map((s) => [s, 0])
      );
      itemToEdit.sizes.forEach((sz) => {
        qMap[sz.size] = sz.quantity;
      });
      setQuantities(qMap);
    }
    if (itemToEdit.layers) {
      const restoredLayers: Layer[] = itemToEdit.layers.map((l) => {
        if (l.type === "image") {
          return {
            id: l.id || uid(),
            type: "image",
            src: l.src || "",
            view: l.view,
            xPct: l.xPct,
            yPct: l.yPct,
            widthPct: l.widthPct,
            heightPct: l.heightPct,
          };
        }
        return {
          id: l.id || uid(),
          type: "text",
          content: l.content || "",
          fontSizePct: l.fontSizePct || 8,
          view: l.view,
          xPct: l.xPct,
          yPct: l.yPct,
          widthPct: l.widthPct,
          heightPct: l.heightPct,
        };
      });
      setLayers(restoredLayers);
    }
  }, [editCartId]);

  useEffect(() => {
    if (!isInteractingLayer) return;
    const handleUp = () => setIsInteractingLayer(false);
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [isInteractingLayer]);

  useEffect(() => {
    if (!isInteractingLayer) return;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const lockScroll = () => window.scrollTo(scrollX, scrollY);
    window.addEventListener("scroll", lockScroll, { passive: false });
    return () => window.removeEventListener("scroll", lockScroll);
  }, [isInteractingLayer]);

  const [textDraft, setTextDraft] = useState("");
  const [textDraftSize, setTextDraftSize] = useState(8);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState({ width: 360, height: 360 });
  const [isDragOver, setIsDragOver] = useState(false);

  // Modal States theo phong cách YouTube Popup
  const [fileErrorModal, setFileErrorModal] = useState<{
    isOpen: boolean;
    fileName: string;
    fileType: string;
  }>({
    isOpen: false,
    fileName: "",
    fileType: "",
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFileErrorModal((prev) => ({ ...prev, isOpen: false }));
        setAlertModal((prev) => ({ ...prev, isOpen: false }));
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const updateSize = () => {
      if (isInteractingLayer) return;
      const rect = el.getBoundingClientRect();
      setBoxSize((prev) => {
        if (prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInteractingLayer]);

  // Danh sách MIME types và đuôi file hình ảnh hợp lệ
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "image/bmp",
  ];
  const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".bmp"];

  // Kiểm tra file và chèn layer ảnh lên áo
  const validateAndAddImage = (file: File) => {
    const fileExt = file.name.includes(".")
      ? file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      : "";
    const isImageMime = file.type
      ? ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith("image/")
      : false;
    const isImageExt = ALLOWED_IMAGE_EXTENSIONS.includes(fileExt);

    if (!isImageMime && !isImageExt) {
      setFileErrorModal({
        isOpen: true,
        fileName: file.name,
        fileType: file.type || fileExt.toUpperCase() || "Không xác định",
      });
      return false;
    }

    const MAX_SIZE_MB = 25;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setAlertModal({
        isOpen: true,
        title: "Dung lượng file quá lớn",
        message: `File "${file.name}" vượt quá giới hạn ${MAX_SIZE_MB}MB.\nVui lòng chọn ảnh có dung lượng nhẹ hơn để đảm bảo tốc độ và chất lượng in.`,
        type: "warning",
      });
      return false;
    }

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
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndAddImage(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndAddImage(file);
    }
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

  const handleAddToCart = async () => {
    const colorInfo = shirtColors.find((c) => c.hex === selectedColor);
    const colorName = colorInfo?.name || "Tùy chỉnh";

    const sizes = SIZES.filter((s) => quantities[s] > 0).map((s) => ({
      size: s,
      quantity: quantities[s],
    }));

    if (sizes.length === 0) {
      setAlertModal({
        isOpen: true,
        title: "Chưa chọn số lượng áo",
        message: "Vui lòng chọn ít nhất một kích cỡ áo (size S, M, L...) với số lượng > 0 ở bảng bên trái trước khi thêm vào giỏ hàng.",
        type: "warning",
      });
      return;
    }

    setIsSavingToCart(true);
    try {
      // Chuyển toạ độ % của mọi layer thành dữ liệu lưu bền (CartLayer).
      // Quan trọng: layer ảnh đang dùng blob URL (từ URL.createObjectURL),
      // chỉ sống trong phiên làm việc hiện tại — phải đổi sang base64 data URL
      // trước khi đưa vào giỏ hàng, nếu không ảnh sẽ "biến mất" sau khi tải lại
      // trang (vì localStorage chỉ lưu được string, và blob URL cũ sẽ hết hiệu lực).
      const cartLayers = await Promise.all(
        layers.map(async (layer) => {
          if (layer.type === "image") {
            const dataUrl = await urlToDataUrl(layer.src);
            return {
              id: layer.id,
              type: "image" as const,
              view: layer.view,
              xPct: layer.xPct,
              yPct: layer.yPct,
              widthPct: layer.widthPct,
              heightPct: layer.heightPct,
              src: dataUrl,
            };
          }
          return {
            id: layer.id,
            type: "text" as const,
            view: layer.view,
            xPct: layer.xPct,
            yPct: layer.yPct,
            widthPct: layer.widthPct,
            heightPct: layer.heightPct,
            content: layer.content,
            fontSizePct: layer.fontSizePct,
          };
        })
      );

      if (editCartId) {
        updateItem(editCartId, {
          color: selectedColor,
          colorName,
          sizes,
          totalPrice: grandTotal,
          layers: cartLayers,
          styleId: selectedStyle.id,
          styleName: selectedStyle.name,
          styleImage: selectedStyle.image,
        });
      } else {
        addItem({
          color: selectedColor,
          colorName,
          sizes,
          totalPrice: grandTotal,
          layers: cartLayers,
          styleId: selectedStyle.id,
          styleName: selectedStyle.name,
          styleImage: selectedStyle.image,
        });
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2800);
    } catch (err) {
      console.error("Lỗi khi lưu thiết kế vào giỏ hàng:", err);
      setAlertModal({
        isOpen: true,
        title: "Có lỗi khi lưu thiết kế",
        message: "Hệ thống gặp sự cố trong quá trình lưu ảnh thiết kế. Vui lòng thử lại hoặc giảm bớt dung lượng ảnh.",
        type: "error",
      });
    } finally {
      setIsSavingToCart(false);
    }
  };

  const handleCheckout = async () => {
    const colorInfo = shirtColors.find((c) => c.hex === selectedColor);
    const colorName = colorInfo?.name || "Tùy chỉnh";

    const sizes = SIZES.filter((s) => quantities[s] > 0).map((s) => ({
      size: s,
      quantity: quantities[s],
    }));

    if (sizes.length === 0) {
      setAlertModal({
        isOpen: true,
        title: "Chưa chọn số lượng áo",
        message: "Vui lòng chọn ít nhất một kích cỡ áo (size S, M, L...) với số lượng > 0 ở bảng bên trái trước khi tiến hành thanh toán.",
        type: "warning",
      });
      return;
    }

    setIsSavingToCart(true);
    try {
      const cartLayers = await Promise.all(
        layers.map(async (layer) => {
          if (layer.type === "image") {
            const dataUrl = await urlToDataUrl(layer.src);
            return {
              id: layer.id,
              type: "image" as const,
              view: layer.view,
              xPct: layer.xPct,
              yPct: layer.yPct,
              widthPct: layer.widthPct,
              heightPct: layer.heightPct,
              src: dataUrl,
            };
          }
          return {
            id: layer.id,
            type: "text" as const,
            view: layer.view,
            xPct: layer.xPct,
            yPct: layer.yPct,
            widthPct: layer.widthPct,
            heightPct: layer.heightPct,
            content: layer.content,
            fontSizePct: layer.fontSizePct,
          };
        })
      );

      addItem({
        color: selectedColor,
        colorName,
        sizes,
        totalPrice: grandTotal,
        layers: cartLayers,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        styleImage: selectedStyle.image,
      });

      navigate("/checkout");
    } catch (err) {
      console.error("Lỗi khi chuyển đến trang thanh toán:", err);
      setAlertModal({
        isOpen: true,
        title: "Có lỗi khi chuyển thanh toán",
        message: "Hệ thống gặp sự cố khi lưu thiết kế để thanh toán. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsSavingToCart(false);
    }
  };

  const visibleLayers = layers.filter((l) => l.view === view);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <main className="min-h-screen bg-[var(--surface)] flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, .png, .jpg, .jpeg, .webp, .svg"
        className="hidden"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Attributes, Sizes, Total & Cart */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-[var(--outline-variant)] overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-[var(--outline-variant)]">
            <button
              onClick={() => setIsAttributesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between mb-2 text-left group"
            >
              <h3 className="font-['Montserrat'] text-xs font-semibold text-[var(--deep-navy)]">
                Thuộc tính áo
              </h3>
              <span className="material-symbols-outlined text-[var(--on-surface-variant)] text-[18px] transition-transform duration-200 group-hover:text-[var(--deep-navy)]" style={{ transform: isAttributesOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                expand_more
              </span>
            </button>

            {isAttributesOpen && (
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <p>
                    <span className="font-medium text-[var(--on-surface)]">Tên sản phẩm: </span>
                    <span className="text-[var(--on-surface-variant)]">{displayedStyle.name}</span>
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
                <button className="inline-flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] border border-[var(--outline-variant)] rounded px-3 py-1.5 hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
                  <span className="material-symbols-outlined text-[14px]">straighten</span>
                  Thông tin size
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-b border-[var(--outline-variant)]">
            <h3 className="text-xs font-semibold text-[var(--deep-navy)] mb-3">
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
                    className="w-full text-center text-xs border border-[var(--outline-variant)] rounded py-1.5 focus:border-[var(--deep-navy)] focus:outline-none transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
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
                disabled={isSavingToCart}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-[var(--electric-blue)] hover:bg-[var(--deep-navy)] text-white"
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedToCart ? "check_circle" : isSavingToCart ? "hourglass_top" : "shopping_cart"}
                </span>
                {addedToCart
                  ? "Đã thêm vào giỏ!"
                  : isSavingToCart
                    ? "Đang lưu..."
                    : "Thêm vào giỏ"}
              </button>
              <button
                onClick={handleCheckout}
                disabled={isSavingToCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-bold uppercase tracking-wider border border-[var(--deep-navy)] text-[var(--deep-navy)] hover:bg-[var(--deep-navy)] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">
                  credit_card
                </span>
                Thanh toán
              </button>
            </div>
          </div>
        </aside>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col bg-[var(--surface-container-low)] min-w-0 relative">
          <div className="flex-1 flex flex-col items-center justify-center py-6 px-6 overflow-hidden">
            <div
              ref={previewRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedLayerId(null);
              }}
              className={`w-full aspect-square relative flex items-center justify-center transition-all duration-300 ease-in-out ${
                isZoomed ? "max-w-[550px]" : "max-w-[360px]"
              } ${isDragOver ? "ring-2 ring-[var(--electric-blue)] ring-offset-2 rounded-xl bg-blue-50/20" : ""}`}
            >
              {isDefaultMockup ? (
                <img
                  src={displayedStyle.image}
                  alt={view === "front" ? "Áo mẫu mặt trước" : "Áo mẫu mặt sau"}
                  className={`max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-300 ${view === "back" ? "scale-x-[-1]" : ""}`}
                />
              ) : (
                <div
                  className="absolute w-full h-full transition-transform duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    WebkitMaskImage: `url(${displayedStyle.image})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: `url(${displayedStyle.image})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    transform: view === "back" ? "scaleX(-1)" : "none"
                  }}
                >
                  <img
                    src={displayedStyle.image}
                    alt="Colored Shirt"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              )}

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

            <div className="flex gap-3 mt-5">
              {(["front", "back"] as const).map((v) => (
                <div key={v} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setView(v)}
                    onMouseEnter={() => setView(v)}
                    className={`w-[60px] h-[60px] p-1.5 rounded border-2 bg-white transition-all ${view === v
                      ? "border-[var(--deep-navy)] shadow-sm"
                      : "border-[var(--outline-variant)] opacity-55 hover:opacity-80"
                      }`}
                  >
                    {isDefaultMockup ? (
                      <img
                        src={displayedStyle.image}
                        alt={v === "front" ? "Mặt trước" : "Mặt sau"}
                        className={`w-full h-full object-contain ${v === "back" ? "scale-x-[-1]" : ""}`}
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: selectedColor,
                          WebkitMaskImage: `url(${displayedStyle.image})`,
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskImage: `url(${displayedStyle.image})`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          transform: v === "back" ? "scaleX(-1)" : "none"
                        }}
                      >
                        <img
                          src={displayedStyle.image}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    )}
                  </button>
                  <span className="text-[10px] text-gray-500 font-medium select-none">
                    {v === "front" ? "Mặt trước" : "Mặt sau"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Control buttons pushed to the bottom of the canvas view */}
          <div className="bg-white border-t border-[var(--outline-variant)] px-4 py-3 flex items-center justify-center gap-3 flex-shrink-0">
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
                    setIsZoomed(!isZoomed);
                  }
                }}
                className="flex flex-col items-center gap-1 px-6 py-2 border border-[var(--outline-variant)] rounded bg-white hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] hover:bg-[var(--surface-container-low)] transition-all group min-w-[80px]"
              >
                <span className="material-symbols-outlined text-[24px] text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.label === "Phóng To" && isZoomed ? "zoom_out" : a.icon}
                </span>
                <span className="text-xs font-medium text-[var(--on-surface-variant)] group-hover:text-[var(--deep-navy)] transition-colors">
                  {a.label === "Phóng To" && isZoomed ? "Thu Nhỏ" : a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Color Picker, Tools & Options */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-l border-[var(--outline-variant)] relative overflow-visible">
          <div className="p-3 border-b border-[var(--outline-variant)]">
            <button
              onClick={() => setIsColorPickerOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-left group mb-1"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                Chọn Màu Áo
              </p>
              <span className="material-symbols-outlined text-[var(--on-surface-variant)] text-[18px] transition-transform duration-200 group-hover:text-[var(--deep-navy)]" style={{ transform: isColorPickerOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                expand_more
              </span>
            </button>

            {isColorPickerOpen && (
              <div className="mt-3">
                <PhotoshopColorPicker
                  color={selectedColor}
                  onChange={(hex) => {
                    setSelectedColor(hex);
                    setIsDefaultMockup(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="p-2 border-b border-[var(--outline-variant)]">
            {tools.map((tool) => (
              <div key={tool.label} className="relative">
                <button
                  onClick={() => {
                    if (tool.label === "Upload ảnh") {
                      fileInputRef.current?.click();
                    } else if (tool.label === "Share") {
                      setIsShareModalOpen(true);
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

                {tool.icon === "style" && activeTool === tool.label && (
                  <div
                    className="absolute right-full top-0 mr-2 w-72 bg-white border border-[var(--outline-variant)] rounded-xl shadow-xl p-4 z-50 space-y-3"
                    onMouseLeave={() => setHoveredStyleId(null)}
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-[var(--outline-variant)]">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                        Chọn phối áo
                      </p>
                      <button
                        onClick={() => setActiveTool(null)}
                        className="text-[var(--on-surface-variant)] hover:text-red-500 transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {SHIRT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyleId(style.id)}
                          onMouseEnter={() => setHoveredStyleId(style.id)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all flex flex-col gap-1 ${selectedStyleId === style.id
                            ? "border-[var(--electric-blue)] bg-blue-50/50"
                            : "border-[var(--outline-variant)] hover:border-[var(--deep-navy)] bg-white"
                            }`}
                        >
                          <span className="text-sm font-bold text-[var(--deep-navy)]">
                            {style.name}
                          </span>
                          <span className="text-xs text-[var(--on-surface-variant)]">
                            {style.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeTool === "Thêm chữ" && (
            <div className="p-4 border-b border-[var(--outline-variant)] space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                Thêm chữ lên áo
              </p>
              <textarea
                value={textDraft}
                onChange={(e) => setTextDraft(e.target.value)}
                onKeyDown={handleTextDraftKeyDown}
                placeholder="Nhập nội dung chữ... (Ctrl+Enter để thêm)"
                rows={3}
                className="w-full text-sm border border-[var(--outline-variant)] rounded p-2 focus:border-[var(--deep-navy)] focus:outline-none resize-none"
              />
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--on-surface-variant)] font-medium">
                  <span>Cỡ chữ</span>
                  <span>{textDraftSize}</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={20}
                  value={textDraftSize}
                  onChange={(e) => setTextDraftSize(Number(e.target.value))}
                  className="w-full accent-[var(--deep-navy)] cursor-pointer"
                />
              </div>
              <button
                onClick={handleAddText}
                disabled={!textDraft.trim()}
                className="w-full py-2 bg-[var(--deep-navy)] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[var(--electric-blue)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm vào áo
              </button>
            </div>
          )}

          {selectedLayer && (
            <div className="p-4 border-b border-[var(--outline-variant)] space-y-3 bg-gray-50/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--deep-navy)]">
                  Chỉnh sửa layer
                </p>
                <button
                  onClick={() => setSelectedLayerId(null)}
                  className="text-xs text-gray-500 hover:text-black"
                >
                  Bỏ chọn
                </button>
              </div>

              {selectedLayer.type === "text" && (
                <div className="space-y-2">
                  <label className="text-xs text-[var(--on-surface-variant)] font-medium block">
                    Nội dung:
                  </label>
                  <textarea
                    value={(selectedLayer as TextLayer).content}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { content: e.target.value })
                    }
                    rows={2}
                    className="w-full text-sm border border-[var(--outline-variant)] rounded p-2 focus:border-[var(--deep-navy)] focus:outline-none resize-none bg-white"
                  />
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[var(--on-surface-variant)] font-medium">
                      <span>Cỡ chữ</span>
                      <span>{Math.round((selectedLayer as TextLayer).fontSizePct)}</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={30}
                      value={(selectedLayer as TextLayer).fontSizePct}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          fontSizePct: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[var(--deep-navy)] cursor-pointer"
                    />
                  </div>
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

          <div className="p-4">
            <button className="w-full flex items-center justify-between px-3 py-2.5 border border-[var(--outline-variant)] rounded text-sm text-[var(--on-surface)] hover:border-[var(--deep-navy)] transition-colors">
              <span>Họa tiết</span>
              <span className="material-symbols-outlined text-[20px] text-[var(--on-surface-variant)]">
                expand_more
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* ============================================================ */}
      {/* 1. Modal thông báo lỗi tệp ảnh (YouTube-style Dark Popup)     */}
      {/* ============================================================ */}
      {fileErrorModal.isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFileErrorModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="bg-[#212121] text-white w-full max-w-[480px] rounded-2xl border border-[#383838] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Centered title with absolute close button */}
            <div className="relative px-6 py-4 border-b border-[#383838]/80 text-center">
              <h3 className="text-white font-semibold text-base tracking-wide">
                Không thể chèn tệp vào áo
              </h3>
              <button
                onClick={() => setFileErrorModal((prev) => ({ ...prev, isOpen: false }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body: Centered and balanced */}
            <div className="p-6 space-y-5">
              {/* File Info Card: Centered layout */}
              <div className="flex flex-col items-center text-center p-4 bg-[#2a2a2a] border border-[#3d3d3d] rounded-xl">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2.5 shadow-inner">
                  <span className="material-symbols-outlined text-2xl">hide_image</span>
                </div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                  Định dạng file không hỗ trợ
                </span>
                <p className="text-sm font-semibold text-white max-w-full truncate mt-1 px-2 font-mono" title={fileErrorModal.fileName}>
                  {fileErrorModal.fileName}
                </p>
                <div className="mt-1.5 px-3 py-1 rounded-full bg-[#1e1e1e] border border-[#383838] text-xs text-neutral-400 inline-flex items-center gap-1.5">
                  <span>Loại tệp:</span>
                  <span className="text-neutral-200 font-mono font-medium">{fileErrorModal.fileType}</span>
                </div>
              </div>

              {/* Description: Centered text */}
              <p className="text-sm text-neutral-300 text-center leading-relaxed px-2">
                Hệ thống Farriott chỉ hỗ trợ chèn các tệp <strong className="text-white">hình ảnh</strong> lên áo để in DTF/Decal sắc nét. Các tệp video, âm thanh hoặc tài liệu không được hỗ trợ.
              </p>

              {/* Supported Formats: Centered badges */}
              <div className="text-center">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                  Định dạng ảnh được chấp nhận:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> PNG (Khuyên dùng)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#333333] text-neutral-200 border border-[#444444]">
                    JPG / JPEG
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#333333] text-neutral-200 border border-[#444444]">
                    WEBP
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#333333] text-neutral-200 border border-[#444444]">
                    SVG (Vector)
                  </span>
                </div>
              </div>

              {/* Action Buttons: Centered */}
              <div className="pt-3 flex items-center justify-center gap-3 border-t border-[#383838]/80 mt-2">
                <button
                  onClick={() => setFileErrorModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setFileErrorModal((prev) => ({ ...prev, isOpen: false }));
                    setTimeout(() => {
                      fileInputRef.current?.click();
                    }, 100);
                  }}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  Chọn ảnh khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. Modal cảnh báo / thông báo chung (YouTube-style Popup)   */}
      {/* ============================================================ */}
      {alertModal.isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="bg-[#212121] text-white w-full max-w-[460px] rounded-2xl border border-[#383838] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Centered title */}
            <div className="relative px-6 py-4 border-b border-[#383838]/80 text-center">
              <h3 className="text-white font-semibold text-base tracking-wide">
                {alertModal.title}
              </h3>
              <button
                onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body: Centered layout */}
            <div className="p-6 space-y-4 flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${
                  alertModal.type === "error"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {alertModal.type === "error" ? "error" : "warning"}
                </span>
              </div>

              <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line max-w-sm">
                {alertModal.message}
              </p>

              {/* Action Buttons: Centered */}
              <div className="pt-3 flex items-center justify-center w-full border-t border-[#383838]/80 mt-2">
                <button
                  onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-8 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition-colors shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. Modal Chia sẻ thiết kế (YouTube-style Share Popup)       */}
      {/* ============================================================ */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-[#212121] text-white w-full max-w-[500px] rounded-2xl border border-[#383838] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Centered title */}
            <div className="relative px-6 py-4 border-b border-[#383838]/80 text-center">
              <h3 className="text-white font-semibold text-base tracking-wide">
                Chia sẻ thiết kế
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body: Centered layout */}
            <div className="p-6 space-y-5 text-center">
              <p className="text-xs text-neutral-400">
                Chia sẻ mẫu áo tùy chỉnh này với bạn bè, đồng nghiệp hoặc đối tác:
              </p>

              {/* Social Channels Row: Centered */}
              <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
                {[
                  {
                    name: "Nhúng",
                    icon: "code",
                    onClick: () => {
                      const embedHtml = `<iframe src="${window.location.href}" width="600" height="600" frameborder="0"></iframe>`;
                      navigator.clipboard.writeText(embedHtml);
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 2000);
                    },
                  },
                  {
                    name: "Facebook",
                    icon: "public",
                    onClick: () => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        "_blank",
                        "width=600,height=500"
                      );
                    },
                  },
                  {
                    name: "X",
                    icon: "tag",
                    onClick: () => {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent("Xem mẫu thiết kế áo Farriott của tôi!")}`,
                        "_blank",
                        "width=600,height=500"
                      );
                    },
                  },
                  {
                    name: "Zalo",
                    icon: "chat",
                    onClick: () => {
                      window.open(
                        `https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`,
                        "_blank",
                        "width=600,height=500"
                      );
                    },
                  },
                  {
                    name: "WhatsApp",
                    icon: "forum",
                    onClick: () => {
                      window.open(
                        `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          "Xem mẫu áo thiết kế: " + window.location.href
                        )}`,
                        "_blank"
                      );
                    },
                  },
                ].map((channel) => (
                  <button
                    key={channel.name}
                    onClick={channel.onClick}
                    className="flex flex-col items-center gap-1.5 group p-1 shrink-0"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3d3d3d] text-white flex items-center justify-center transition-transform group-hover:scale-105 border border-[#3e3e3e]">
                      <span className="material-symbols-outlined text-[20px]">
                        {channel.icon}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-300 group-hover:text-white transition-colors">
                      {channel.name}
                    </span>
                  </button>
                ))}
              </div>

              {copiedEmbed && (
                <p className="text-xs text-emerald-400 font-medium text-center">
                  Đã sao chép mã nhúng HTML iframe vào bộ nhớ tạm!
                </p>
              )}

              {/* Copy Link Input Bar */}
              <div className="bg-[#181818] border border-[#383838] rounded-xl p-1.5 pl-3 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="bg-transparent text-xs text-neutral-300 flex-1 outline-none truncate select-all font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
                    copiedLink
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedLink ? "check" : "content_copy"}
                  </span>
                  {copiedLink ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}