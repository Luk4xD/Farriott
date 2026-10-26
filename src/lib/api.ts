const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("farriott_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface ProductItem {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isCustomizable: boolean;
  createdAt?: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isCustomizable: boolean;
}

export interface OrderItemCustomPrint {
  uploadedImageUrl: string;
  printMetadata?: string;
  customerNotes?: string;
}

export interface OrderItemDetail {
  id: number;
  quantity: number;
  unitPrice: number;
  productVariant?: {
    size?: string;
    color?: string;
    product?: {
      name?: string;
      imageUrl?: string;
    };
  };
  customPrints?: OrderItemCustomPrint[];
}

export interface OrderDetail {
  id: number;
  orderCode?: string;
  totalAmount: number;
  status: string; // "pending" | "processing" | "shipping" | "completed" | "cancelled"
  shippingAddress: string;
  createdAt?: string;
  items?: OrderItemDetail[];
}

// Mock initial data if backend is not yet populated
export const INITIAL_MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "Áo Thun Cổ Tròn Cotton 100% (Customizable)",
    description: "Vải cotton 4 chiều mềm mịn, form oversize thoáng mát, tối ưu cho công nghệ in DTF sắc nét.",
    basePrice: 152000,
    imageUrl: "/images/shirt_white_with_sleeve.png",
    isCustomizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Áo Polo Đồng Phục Cao Cấp Pique",
    description: "Chất liệu cá sấu thể thao cao cấp, đứng form, thấm hút mồ hôi tốt, chống nhăn xù.",
    basePrice: 195000,
    imageUrl: "/images/shirt_polo.png",
    isCustomizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Áo Ba Lỗ Thể Thao Tank-top",
    description: "Vải mè thể thao co giãn 4 chiều, thiết kế khoét nách thể thao, thoáng khí tối đa.",
    basePrice: 135000,
    imageUrl: "/images/shirt_tank_top.png",
    isCustomizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Áo Thun Tay Dài Thu Đông Farriott",
    description: "Áo giữ nhiệt nhẹ, cổ tròn bo dệt kim, giữ ấm phong cách tối giản thanh lịch.",
    basePrice: 175000,
    imageUrl: "/images/shirt_white_with_sleeve.png",
    isCustomizable: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_MOCK_ORDERS: OrderDetail[] = [
  {
    id: 101,
    orderCode: "FR-849201",
    totalAmount: 304000,
    status: "processing",
    shippingAddress: "Số 128 Nguyễn Trãi, Thanh Xuân, Hà Nội (Khách: Trần Minh Quân, SĐT: 0987654321)",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: 1,
        quantity: 2,
        unitPrice: 152000,
        productVariant: {
          size: "L",
          color: "Đen",
          product: {
            name: "Áo Thun Cổ Tròn Cotton 100%",
            imageUrl: "/images/shirt_white_with_sleeve.png",
          },
        },
      },
    ],
  },
  {
    id: 102,
    orderCode: "FR-512093",
    totalAmount: 585000,
    status: "pending",
    shippingAddress: "Tầng 5 Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh (Khách: Lê Hoài Nam, SĐT: 0912345678)",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: 2,
        quantity: 3,
        unitPrice: 195000,
        productVariant: {
          size: "XL",
          color: "Xanh Navy",
          product: {
            name: "Áo Polo Đồng Phục Cao Cấp",
            imageUrl: "/images/shirt_polo.png",
          },
        },
      },
    ],
  },
];

export const api = {
  // PRODUCTS
  async getProducts(): Promise<ProductItem[]> {
    try {
      const res = await fetch(`${API_URL}/api/Products`);
      if (res.ok) {
        const data = await res.json();
        // data có thể là array hoặc { items: [] } tùy phân trang
        const items = Array.isArray(data) ? data : data.items || [];
        if (items.length > 0) return items;
      }
    } catch (e) {
      console.warn("Backend getProducts failed, fallback to local cache:", e);
    }
    // Fallback local storage or initial
    const cached = localStorage.getItem("farriott_admin_products");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    localStorage.setItem("farriott_admin_products", JSON.stringify(INITIAL_MOCK_PRODUCTS));
    return INITIAL_MOCK_PRODUCTS;
  },

  async createProduct(payload: CreateProductPayload): Promise<ProductItem> {
    try {
      const res = await fetch(`${API_URL}/api/Products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend createProduct failed, fallback to local:", e);
    }
    // Fallback local
    const current = await this.getProducts();
    const newProd: ProductItem = {
      id: Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProd, ...current];
    localStorage.setItem("farriott_admin_products", JSON.stringify(updated));
    return newProd;
  },

  async updateProduct(id: number, payload: CreateProductPayload): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/Products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Backend updateProduct failed, fallback to local:", e);
    }
    // Fallback local
    const current = await this.getProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...payload } : p));
    localStorage.setItem("farriott_admin_products", JSON.stringify(updated));
    return true;
  },

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/Products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Backend deleteProduct failed, fallback to local:", e);
    }
    // Fallback local
    const current = await this.getProducts();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem("farriott_admin_products", JSON.stringify(updated));
    return true;
  },

  // ORDERS
  async getOrders(): Promise<OrderDetail[]> {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        if (items.length > 0) return items;
      }
    } catch (e) {
      console.warn("Backend getOrders failed, fallback to local cache:", e);
    }
    const cached = localStorage.getItem("farriott_admin_orders");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    localStorage.setItem("farriott_admin_orders", JSON.stringify(INITIAL_MOCK_ORDERS));
    return INITIAL_MOCK_ORDERS;
  },

  async updateOrderStatus(id: number, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Backend updateOrderStatus failed, fallback to local:", e);
    }
    // Fallback local
    const current = await this.getOrders();
    const updated = current.map((o) => (o.id === id ? { ...o, status } : o));
    localStorage.setItem("farriott_admin_orders", JSON.stringify(updated));
    return true;
  },
};
