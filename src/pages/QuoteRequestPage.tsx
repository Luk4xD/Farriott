import { useState } from "react";

const productTypes = [
  { id: "dong-phuc-cong-so", name: "Đồng Phục Công Sở" },
  { id: "so-mi-cao-cap", name: "Sơ Mi Cao Cấp" },
  { id: "ao-thun", name: "Áo Thun" },
  { id: "ao-khoac", name: "Áo Khoác" },
  { id: "dong-phuc-hoc-sinh", name: "Đồng Phục Học Sinh" },
  { id: "dong-phuc-bao-ve", name: "Đồng Phục Bảo Vệ" },
  { id: "khac", name: "Khác" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];

export function QuoteRequestPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productType: "",
    quantity: "",
    designRequired: "yes",
    sizeBreakdown: "",
    deadline: "",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="pt-20 min-h-screen bg-[var(--surface)]">
      <section className="bg-[var(--surface-container-lowest)] py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-['Montserrat'] text-3xl md:text-4xl font-bold text-[var(--deep-navy)] text-center mb-4 mt-4">
              Nhận Báo Giá
            </h1>
            <p className="text-center text-[var(--on-surface-variant)] mb-10">
              Điền thông tin bên dưới để nhận báo giá chi tiết từ đội ngũ Farriott
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-center">
                <span className="material-symbols-outlined align-middle mr-2">
                  check_circle
                </span>
                Yêu cầu báo giá đã được gửi thành công! Chúng tôi sẽ liên hệ trong
                24-48 giờ.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[var(--outline-variant)] rounded-xl p-6 md:p-8 shadow-sm"
            >
              {/* Company Section */}
              <div className="mb-8">
                <h2 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[var(--electric-blue)]">
                    business
                  </span>
                  Thông Tin Doanh Nghiệp
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Tên Công Ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                      placeholder="Công ty TNHH ABC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Người Liên Hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h2 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[var(--electric-blue)]">
                    contact_mail
                  </span>
                  Thông Tin Liên Hệ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                      placeholder="email@company.com"
                    />
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
                      required
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                      placeholder="0901 234 567"
                    />
                  </div>
                </div>
              </div>

              {/* Product Section */}
              <div className="mb-8">
                <h2 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[var(--electric-blue)]">
                    inventory_2
                  </span>
                  Thông Tin Sản Phẩm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Loại Sản Phẩm <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors bg-white"
                    >
                      <option value="">-- Chọn loại sản phẩm --</option>
                      {productTypes.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                      Số Lượng Dự Kiến <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Có Yêu Cầu Thiết Kế Không?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="designRequired"
                        value="yes"
                        checked={formData.designRequired === "yes"}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 accent-[var(--electric-blue)]"
                      />
                      Có, cần thiết kế mới
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="designRequired"
                        value="no"
                        checked={formData.designRequired === "no"}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 accent-[var(--electric-blue)]"
                      />
                      Không, đã có mẫu
                    </label>
                  </div>
                </div>
              </div>

              {/* Size Breakdown */}
              <div className="mb-8">
                <h2 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[var(--electric-blue)]">
                    straighten
                  </span>
                  Phân Loại Size (Tùy Chọn)
                </h2>
                <div className="bg-[var(--surface-container-low)] rounded p-4">
                  <div className="grid grid-cols-5 md:grid-cols-9 gap-2 mb-3">
                    {sizes.map((size) => (
                      <div
                        key={size}
                        className="text-center text-xs font-bold text-[var(--on-surface-variant)]"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  <textarea
                    name="sizeBreakdown"
                    value={formData.sizeBreakdown}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors text-sm"
                    placeholder="Ví dụ: S: 10, M: 30, L: 40, XL: 20"
                  />
                </div>
              </div>

              {/* Timeline & Notes */}
              <div className="mb-8">
                <h2 className="font-['Montserrat'] text-lg font-semibold text-[var(--deep-navy)] mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[var(--electric-blue)]">
                    event_note
                  </span>
                  Thời Gian & Ghi Chú
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Ngày Cần Hàng
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full md:w-1/2 px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                    Ghi Chú Thêm
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded focus:outline-none focus:border-[var(--electric-blue)] transition-colors"
                    placeholder="Mô tả thêm về yêu cầu thiết kế, màu sắc, chất liệu, hoặc bất kỳ thông tin gì khác..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-[var(--deep-navy)] text-white font-medium px-12 py-4 rounded hover:bg-[var(--electric-blue)] transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Gửi Yêu Cầu Báo Giá
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-10 text-center">
              <p className="text-[var(--on-surface-variant)] mb-2">
                Hoặc liên hệ trực tiếp với chúng tôi:
              </p>
              <p className="text-[var(--deep-navy)] font-medium">
                <span className="material-symbols-outlined align-middle mr-1 text-sm">
                  phone
                </span>
                1900 1234
                <span className="mx-4">|</span>
                <span className="material-symbols-outlined align-middle mr-1 text-sm">
                  mail
                </span>
                info@farriott.vn
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
