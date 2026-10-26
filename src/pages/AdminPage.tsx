import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, ProductItem, OrderDetail, CreateProductPayload } from "@/lib/api";

export function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // State Products
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductLoading, setIsProductLoading] = useState(true);

  // Modals for Product CRUD
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState<CreateProductPayload>({
    name: "",
    description: "",
    basePrice: 150000,
    imageUrl: "/images/shirt_white_with_sleeve.png",
    isCustomizable: true,
  });

  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  // State Orders
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<OrderDetail | null>(null);

  // Load Data
  const loadProducts = async () => {
    setIsProductLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setIsProductLoading(false);
  };

  const loadOrders = async () => {
    setIsOrderLoading(true);
    const data = await api.getOrders();
    setOrders(data);
    setIsOrderLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadOrders();
    }
  }, [isAdmin]);

  // Handlers Product CRUD
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      basePrice: 150000,
      imageUrl: "/images/shirt_white_with_sleeve.png",
      isCustomizable: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description || "",
      basePrice: prod.basePrice,
      imageUrl: prod.imageUrl || "/images/shirt_white_with_sleeve.png",
      isCustomizable: prod.isCustomizable,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productForm);
    } else {
      await api.createProduct(productForm);
    }
    setIsProductModalOpen(false);
    loadProducts();
  };

  const handleDeleteProduct = async () => {
    if (deleteProductId !== null) {
      await api.deleteProduct(deleteProductId);
      setDeleteProductId(null);
      loadProducts();
    }
  };

  // Handler Order status change
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await api.updateOrderStatus(orderId, newStatus);
    loadOrders();
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Guard: if not admin
  if (!isAdmin) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Yêu cầu quyền Quản trị viên</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Trang này chỉ dành cho tài khoản có vai trò <strong>Admin</strong>. Bạn cần đăng nhập bằng tài khoản Quản trị để tiếp tục.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-[var(--electric-blue)] hover:bg-blue-600 font-semibold rounded-xl text-sm transition-colors"
            >
              Đăng nhập tài khoản Admin
            </button>
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition-colors py-2"
            >
              Quay lại trang chủ Farriott
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <Link to="/admin" className="font-['Montserrat'] font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              Farriott <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin Console</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-purple-400">
                admin_panel_settings
              </span>
              <span>{user?.fullName || "Quản trị viên"}</span>
            </div>

            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              Xem Website
            </Link>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng Sản Phẩm</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{products.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng Đơn Hàng</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Đơn Chờ Xử Lý</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-0.5">{pendingOrders}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Doanh Thu Ước Tính</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                {totalRevenue.toLocaleString("vi-VN")}đ
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "products"
                  ? "bg-[var(--electric-blue)] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">app_registration</span>
              Quản lý sản phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "orders"
                  ? "bg-[var(--electric-blue)] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              Quản lý đơn hàng ({orders.length})
            </button>
          </div>

          {activeTab === "products" && (
            <button
              onClick={handleOpenCreateProduct}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Thêm sản phẩm mới
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PRODUCT CRUD                                          */}
        {/* ============================================================ */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Search filter bar */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-500 w-full outline-none"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch("")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Product Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Ảnh</th>
                      <th className="py-3.5 px-4">Tên sản phẩm</th>
                      <th className="py-3.5 px-4">Giá cơ bản</th>
                      <th className="py-3.5 px-4">In ấn / Tùy chỉnh</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {isProductLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Đang tải danh sách sản phẩm...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Không tìm thấy sản phẩm nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={prod.imageUrl || "/images/shirt_white_with_sleeve.png"}
                                alt={prod.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-white">{prod.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {prod.description || "Chưa có mô tả chi tiết"}
                            </p>
                          </td>
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            {Number(prod.basePrice).toLocaleString("vi-VN")}đ
                          </td>
                          <td className="py-3 px-4">
                            {prod.isCustomizable ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[13px]">palette</span>
                                Cho phép in áo
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                                Tiêu chuẩn
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-2 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                                title="Chỉnh sửa sản phẩm"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => setDeleteProductId(prod.id)}
                                className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                                title="Xóa sản phẩm"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ORDERS MANAGEMENT                                     */}
        {/* ============================================================ */}
        {activeTab === "orders" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Mã đơn</th>
                    <th className="py-3.5 px-4">Thông tin giao hàng</th>
                    <th className="py-3.5 px-4">Thời gian</th>
                    <th className="py-3.5 px-4">Tổng tiền</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {isOrderLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Đang tải danh sách đơn hàng...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Chưa có đơn hàng nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {ord.orderCode || `FR-${ord.id}`}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-xs text-slate-300 line-clamp-2">
                            {ord.shippingAddress}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                          {ord.totalAmount?.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.status || "pending"}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`text-xs font-semibold py-1 px-2.5 rounded-lg border outline-none cursor-pointer transition-colors ${
                              ord.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : ord.status === "processing"
                                ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                : ord.status === "shipping"
                                ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                                : ord.status === "cancelled"
                                ? "bg-red-500/15 text-red-300 border-red-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            <option value="pending" className="bg-slate-900 text-amber-300">Chờ xử lý</option>
                            <option value="processing" className="bg-slate-900 text-blue-300">Đang in ấn</option>
                            <option value="shipping" className="bg-slate-900 text-purple-300">Đang giao</option>
                            <option value="completed" className="bg-slate-900 text-emerald-300">Hoàn thành</option>
                            <option value="cancelled" className="bg-slate-900 text-red-300">Đã hủy</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setViewingOrder(ord)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Xem chi tiết đơn hàng"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT PRODUCT (CRUD)                          */}
      {/* ============================================================ */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên sản phẩm <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ví dụ: Áo Thun Cổ Bẻ Farriott Premium"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--electric-blue)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Giá cơ bản (VNĐ) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={productForm.basePrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, basePrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--electric-blue)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ảnh mẫu áo (URL)
                  </label>
                  <input
                    type="text"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="/images/shirt_white_with_sleeve.png"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--electric-blue)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Mô tả chất liệu vải, công nghệ in ấn, form dáng..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--electric-blue)] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isCustomizable"
                  checked={productForm.isCustomizable}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isCustomizable: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[var(--electric-blue)] focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label htmlFor="isCustomizable" className="text-xs text-slate-300 cursor-pointer">
                  Cho phép khách hàng đưa vào Design Studio để tự chèn ảnh & logo in ấn
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--electric-blue)] hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DELETE CONFIRMATION                                   */}
      {/* ============================================================ */}
      {deleteProductId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeleteProductId(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <h4 className="font-bold text-white text-base">Xác nhận xóa sản phẩm?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Hành động này sẽ gỡ bỏ sản phẩm khỏi hệ thống và không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteProductId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW ORDER DETAIL (WITH CUSTOM DESIGN PREVIEW)        */}
      {/* ============================================================ */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  Chi tiết đơn hàng {viewingOrder.orderCode || `#${viewingOrder.id}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thời gian: {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                </p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Shipping info */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Địa chỉ & Người nhận
                </p>
                <p className="text-sm text-white">{viewingOrder.shippingAddress}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Danh sách sản phẩm in ấn
                </p>
                <div className="space-y-2">
                  {viewingOrder.items && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 border border-slate-700 flex items-center justify-center shrink-0">
                            <img
                              src={item.productVariant?.product?.imageUrl || "/images/shirt_white_with_sleeve.png"}
                              alt="Shirt"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.productVariant?.product?.name || "Áo Thun Farriott"}
                            </p>
                            <p className="text-xs text-slate-400">
                              Size: <strong className="text-white">{item.productVariant?.size || "M"}</strong> | Màu: <strong className="text-white">{item.productVariant?.color || "Tiêu chuẩn"}</strong> | Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Custom Print Preview if available */}
                        {item.customPrints && item.customPrints.length > 0 && (
                          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 px-2.5 rounded-lg border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Ảnh in:</span>
                            {item.customPrints.map((cp, cIdx) => (
                              <a
                                key={cIdx}
                                href={cp.uploadedImageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded border border-blue-400/50 overflow-hidden block hover:scale-110 transition-transform"
                                title="Bấm để xem ảnh in gốc chất lượng cao"
                              >
                                <img
                                  src={cp.uploadedImageUrl}
                                  alt="Print layer"
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Đơn hàng tùy biến theo đơn báo giá sỉ.</p>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Tổng thanh toán
                </span>
                <span className="text-base font-bold text-emerald-400">
                  {viewingOrder.totalAmount?.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
