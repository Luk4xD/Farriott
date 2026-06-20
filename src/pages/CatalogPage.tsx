import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Sơ mi Oxford",
    material: "Cotton Pima 100%",
    moq: "50 Sản phẩm",
    price: "Từ 250.000đ",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtoJColMK4bu0R92GehnCO2l-dTQnm4cDAYfm1kjZIBjV_hdEcXGUvh3D6_DSGzpppWC88R4vpn_9BMqAOFTGBU3D1xnvwVB3qF0EiR3A1dk_uwS9_9_S_9QpKJKmqylX5jPmw8G24cyI70RW-kTm-iJ6aQdZdXokDDLGUL359VQ_IivIFqnAPd4v0PWiGKkj9JQ8v4kIzfOTipF087ZJnhKc_eoH27YanTZe7oaz63XK0nzQAxD-hNggY5",
  },
  {
    id: 2,
    name: "Áo Polo Piqué",
    material: "Cotton Chải kỹ",
    moq: "100 Sản phẩm",
    price: "Từ 180.000đ",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtoJColMK4bu0R92GehnCO2l-dTQnm4cDAYfm1kjZIBjV_hdEcXGUvh3D6_DSGzpppWC88R4vpn_9BMqAOFTGBU3D1xnvwVB3qF0EiR3A1dk_uwS9_9_S_9QpKJKmqylX5jPmw8G24cyI70RW-kTm-iJ6aQdZdXokDDLGUL359VQ_IivIFqnAPd4v0PWiGKkj9JQ8v4kIzfOTipF087ZJnhKc_eoH27YanTZe7oaz63XK0nzQAxD-hNggY5",
  },
  {
    id: 3,
    name: "Blazer cấu trúc nhẹ",
    material: "Polyester tái chế / Len",
    moq: "30 Sản phẩm",
    price: "Từ 850.000đ",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLs8uaqQKSHk0sNwuTMGW4VJZs3Qt-PjZBXsyU066e352Y__n1TQfjD0-Bua-0p5cJL0hluxx0gBvxLbZVAuBURPgrBlaadOCS2mtLSRq-Gobk-Lmy0f9r43cRVoMh06RUva018NJiRq2fI-bU5EvqEkKiDWnKzgPkg1_3g-4sMpuGQhYfXq-F33slPtAL9PCHZ5X35pd2sZ_OQ8Q2VXFlyqUGO-aMG7qSTO4bQupO-49LbSxWi3A9FORLM",
  },
  {
    id: 4,
    name: "Áo thun Heavyweight",
    material: "Cotton Chải kỹ 100%",
    moq: "200 Sản phẩm",
    price: "Từ 150.000đ",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtoJColMK4bu0R92GehnCO2l-dTQnm4cDAYfm1kjZIBjV_hdEcXGUvh3D6_DSGzpppWC88R4vpn_9BMqAOFTGBU3D1xnvwVB3qF0EiR3A1dk_uwS9_9_S_9QpKJKmqylX5jPmw8G24cyI70RW-kTm-iJ6aQdZdXokDDLGUL359VQ_IivIFqnAPd4v0PWiGKkj9JQ8v4kIzfOTipF087ZJnhKc_eoH27YanTZe7oaz63XK0nzQAxD-hNggY5",
  },
  {
    id: 5,
    name: "Tạp dề Canvas",
    material: "Cotton Canvas siêu bền",
    moq: "50 Sản phẩm",
    price: "Từ 220.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApXO0BUrTYhd85yr6bSUfSS6wsWwWztEDOd1PnMl04vRI34dNJFIfr4Q4TePBB82irR3c3GPSqnZK5ikSdo2jc3_7E9hPov2QgOFxQYD_c1iatl57noIUUsxHDzC9Jsu2gJ42F6Wlym7JER8fyhwvU3FjTiNLk_CRI6LCLMlBiPFZwbIVl0jgQJeQCbiS0Qh8JF8eIZA8Qq-23eVVf0DUg-AZf_7jsGULzcprfBowzKcRG1MsijuxzWjhpqHZUYnxrm0D0dl6dO5EP",
  },
  {
    id: 6,
    name: "Áo len Merino",
    material: "Len Merino 100%",
    moq: "50 Sản phẩm",
    price: "Từ 550.000đ",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtoJColMK4bu0R92GehnCO2l-dTQnm4cDAYfm1kjZIBjV_hdEcXGUvh3D6_DSGzpppWC88R4vpn_9BMqAOFTGBU3D1xnvwVB3qF0EiR3A1dk_uwS9_9_S_9QpKJKmqylX5jPmw8G24cyI70RW-kTm-iJ6aQdZdXokDDLGUL359VQ_IivIFqnAPd4v0PWiGKkj9JQ8v4kIzfOTipF087ZJnhKc_eoH27YanTZe7oaz63XK0nzQAxD-hNggY5",
  },
];

const categories = [
  "Tất cả sản phẩm",
  "Sơ mi & Áo Polo",
  "Áo khoác & Blazer",
  "Trang phục bảo hộ",
];

const materials = [
  "Cotton Pima",
  "Cotton Chải kỹ",
  "Len Merino",
  "Polyester tái chế",
];

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả sản phẩm");
  const [sortBy, setSortBy] = useState("Mới nhất");

  return (
    <main className="pt-20 flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12 pb-24 md:pb-12">
      <div className="mb-12">
        <h1 className="font-['Montserrat'] text-4xl md:text-5xl font-bold text-[var(--deep-navy)] mb-4">
          Danh mục sản phẩm
        </h1>
        <p className="text-lg text-[var(--on-surface-variant)] max-w-2xl mb-8">
          Khám phá các dòng sản phẩm chất lượng cao, được thiết kế cho tính bền
          bỉ và sự tinh tế trong môi trường doanh nghiệp.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[var(--outline-variant)] rounded p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[var(--primary-fixed)] rounded-full text-[var(--deep-navy)]">
              <span className="material-symbols-outlined">factory</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
                Trạng thái sản xuất
              </p>
              <p className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)]">
                Đang hoạt động
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[var(--secondary-container)] rounded-full text-[var(--deep-navy)]">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
                Tỷ lệ chất lượng đạt chuẩn
              </p>
              <p className="font-['Montserrat'] text-xl font-semibold text-[var(--electric-blue)]">
                98.4%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-1/4 flex-shrink-0">
          <div className="bg-white border border-[var(--outline-variant)] p-6 rounded sticky top-28">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2">filter_list</span>{" "}
              Bộ lọc
            </h2>

            <div className="mb-8 border-b border-[var(--surface-container)] pb-6">
              <h3 className="text-lg font-semibold text-[var(--deep-navy)] mb-3">
                Danh mục
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="form-checkbox accent-[var(--electric-blue)] rounded border-[var(--cool-silver)]"
                    />
                    <span className="text-sm text-[var(--on-surface)] group-hover:text-[var(--electric-blue)] transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8 border-b border-[var(--surface-container)] pb-6">
              <h3 className="text-lg font-semibold text-[var(--deep-navy)] mb-3">
                Chất liệu
              </h3>
              <div className="space-y-2">
                {materials.map((mat) => (
                  <label
                    key={mat}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox accent-[var(--electric-blue)] rounded border-[var(--cool-silver)]"
                    />
                    <span className="text-sm text-[var(--on-surface)] group-hover:text-[var(--electric-blue)] transition-colors">
                      {mat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--deep-navy)] mb-3">
                Đơn giá (VND)
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  className="w-full text-sm border border-[var(--cool-silver)] rounded px-3 py-2 focus:border-[var(--deep-navy)] focus:ring-0 outline-none"
                  placeholder="Từ"
                  type="number"
                />
                <span className="text-[var(--on-surface-variant)]">-</span>
                <input
                  className="w-full text-sm border border-[var(--cool-silver)] rounded px-3 py-2 focus:border-[var(--deep-navy)] focus:ring-0 outline-none"
                  placeholder="Đến"
                  type="number"
                />
              </div>
              <button className="w-full mt-4 bg-transparent border border-[var(--cool-silver)] text-[var(--deep-navy)] text-xs font-bold uppercase tracking-wider py-2 rounded hover:border-[var(--deep-navy)] transition-colors">
                Áp dụng
              </button>
            </div>
          </div>
        </aside>

        <div className="w-full md:w-3/4">
          {/* Mobile filter pills */}
          <div className="md:hidden mb-4 overflow-x-auto hide-scrollbar flex gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${
                  selectedCategory === cat
                    ? "bg-[var(--deep-navy)] text-white"
                    : "bg-white border border-[var(--outline-variant)] text-[var(--on-surface-variant)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-[var(--on-surface-variant)]">
              Hiển thị {products.length} sản phẩm
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--on-surface-variant)]">
                Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-[var(--cool-silver)] rounded px-3 py-1 focus:border-[var(--deep-navy)] focus:ring-0 cursor-pointer bg-transparent"
              >
                <option>Mới nhất</option>
                <option>Giá: Thấp đến Cao</option>
                <option>Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[var(--surface-container)] rounded overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="relative w-full pb-[125%] overflow-hidden bg-[var(--surface)]">
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={product.name}
                    src={product.image}
                  />
                  <div className="absolute inset-0 bg-[var(--deep-navy)]/0 group-hover:bg-[var(--deep-navy)]/80 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-xs font-bold uppercase tracking-wider text-white transition-opacity duration-300">
                      Xem chi tiết
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--on-surface-variant)] mb-2">
                      {product.material}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
                      MOQ: {product.moq}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--surface-container)] flex justify-between items-center">
                    <span className="text-xl font-bold text-[var(--electric-blue)]">
                      {product.price}
                    </span>
                    <span className="material-symbols-outlined text-[var(--cool-silver)] group-hover:text-[var(--deep-navy)] transition-colors">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center items-center space-x-2">
            <button className="w-10 h-10 border border-[var(--cool-silver)] rounded flex items-center justify-center text-[var(--on-surface-variant)] hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 bg-[var(--deep-navy)] text-white rounded text-sm font-semibold">
              1
            </button>
            <button className="w-10 h-10 border border-[var(--cool-silver)] rounded text-sm text-[var(--on-surface-variant)] hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
              2
            </button>
            <button className="w-10 h-10 border border-[var(--cool-silver)] rounded text-sm text-[var(--on-surface-variant)] hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
              3
            </button>
            <span className="text-[var(--on-surface-variant)] px-2">...</span>
            <button className="w-10 h-10 border border-[var(--cool-silver)] rounded flex items-center justify-center text-[var(--on-surface-variant)] hover:border-[var(--deep-navy)] hover:text-[var(--deep-navy)] transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
