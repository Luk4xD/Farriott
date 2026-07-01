import { Link } from "react-router-dom";

const heroImage =
  "/images/Home_img.jpg";

const processImage =
  "/images/Home_img2.png";

const capabilities = [
  {
    title: "Đồng Phục Công Sở",
    description: "Sản xuất quy mô lớn",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpC5WX2--Zh0IossdkIEXuXQZW6lSiUOoxpV_U0SXIpVluT5kxaAeBqHYZ1R_MtwRh0q2FWS6zvX8IkTctRohmt9N10EM3odRkw-Trgtt12LwP0SB5lablGLo7Ur6zgr5vLaqwhxI8xAvmPoWdM_fN9FvlwEd-zQRrqGygU9PeC3RyLBjdiPrVAbgAUnu_WMTpZRSC6b7D08oIqCsWAnMX5pqWIWAv4Frtt7JRigOuDQm8YKunifFovvaK_MHOBWa-TzzK5Mbx3Ryq",
  },
  {
    title: "Sơ Mi Cao Cấp",
    description: "Gia công theo đơn đặt hàng",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVWN4UX0O9ytCS9u40_Y75UphTXfu1OPQqzK59iSH4KHUV3nDPjlHG8_BgzOFyTw3QC7Q8tyGt5A4XmSlEtAECCCqeLlLLcUq7MSrvrWhJTCKGlal--nuSgA4FZ1tnbJNUfMVBZEcoTegKG8EYwOYInxdOBA3ahcOW4o2sHXUVw-ubhuF0QBFkdGRRAgy7B86FNm5aBQJKl1GjzCMmH6vzuRi1soOQMNMC98IjkreobcF1bdpXyfNhNpzmjyOwyrb36gPJqKCWFHvQ",
  },
];

const values = [
  {
    icon: "precision_manufacturing",
    title: "Độ Chính Xác Cao",
    description: "Dây chuyền hiện đại đảm bảo tính đồng nhất trên mọi lô hàng.",
  },
  {
    icon: "schedule",
    title: "Tiến Độ Vững Vàng",
    description: "Quản lý chuỗi cung ứng tối ưu, giao hàng đúng hẹn.",
  },
  {
    icon: "handshake",
    title: "Hợp Tác Dài Hạn",
    description: "Chính sách B2B linh hoạt, hỗ trợ đối tác phát triển bền vững.",
  },
];

export function HomePage() {
  return (
    <main className="pt-20 flex flex-col min-h-screen">
      <section className="relative bg-[var(--surface-container-lowest)] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-[120px] grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[80vh]">
          <div className="md:col-span-5 z-10">
            <h1 className="font-['Montserrat'] text-4xl md:text-5xl lg:text-[48px] font-bold text-[var(--deep-navy)] leading-tight mb-6">
              Thiết kế & Sản xuất
              <br />
              Đồng phục Thông minh
            </h1>
            <p className="text-lg text-[var(--on-surface-variant)] mb-8 max-w-lg">
              Ứng dụng thiết kế áo cá nhân hóa Farriott giúp doanh nghiệp tối ưu
              quy trình đặt hàng, đảm bảo độ chính xác cao và tiết kiệm thời
              gian đáng kể.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/design"
                className="bg-[var(--deep-navy)] text-white text-base font-medium px-8 py-4 rounded hover:bg-[var(--electric-blue)] transition-colors duration-300 text-center"
              >
                Bắt đầu thiết kế
              </Link>
              <button className="border border-[var(--cool-silver)] text-[var(--deep-navy)] bg-transparent text-base font-medium px-8 py-4 rounded hover:border-[var(--deep-navy)] transition-colors duration-300">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
          <div className="md:col-span-7 w-full h-[240px] md:h-[350px] md:-mt-14">
          <img
            alt="Farriott App Interface"
            className="w-full h-full object-cover object-center rounded-xl"
            src={heroImage}
          />
        </div>
        </div>
      </section>

      <section className="bg-[var(--surface-bright)] py-[120px] border-t border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="md:pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--electric-blue)] mb-4 block">
                Vấn đề & Giải pháp
              </span>
              <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-semibold text-[var(--deep-navy)] mb-6">
                Tại sao chọn quy trình số hóa của Farriott?
              </h2>
              <p className="text-base text-[var(--on-surface-variant)] mb-6">
                Trong môi trường sản xuất đồng phục truyền thống, việc trao đổi
                yêu cầu thiết kế, xác nhận mẫu và quản lý đơn hàng thường gặp
                nhiều sai sót và tốn kém thời gian. Farriott giải quyết triệt để
                những vấn đề này thông qua nền tảng công nghệ trực quan.
              </p>
              <ul className="space-y-4 text-base text-[var(--on-surface-variant)]">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-[var(--electric-blue)] mr-3">
                    check_circle
                  </span>
                  Loại bỏ rủi ro sai lệch thông tin trong quá trình truyền đạt.
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-[var(--electric-blue)] mr-3">
                    check_circle
                  </span>
                  Rút ngắn thời gian từ ý tưởng đến sản xuất mẫu thực tế.
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-[var(--electric-blue)] mr-3">
                    check_circle
                  </span>
                  Đáp ứng xu hướng cá nhân hóa mạnh mẽ của thị trường B2B.
                </li>
              </ul>
            </div>
            <div className="w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-md">
            <img
              alt="Quy trình sản xuất thực tế"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              src={processImage}
            />
          </div>
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-semibold text-[var(--deep-navy)]">
              Giá trị mang lại
            </h2>
            <p className="text-lg text-[var(--on-surface-variant)] mt-4 max-w-2xl mx-auto">
              Hệ thống của chúng tôi được thiết kế để tối ưu hóa mọi khía cạnh
              của quá trình đặt hàng.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
              >
                <span className="material-symbols-outlined text-5xl text-[var(--electric-blue)] mb-4">
                  {value.icon}
                </span>
                <h3 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-[var(--surface-container-low)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="flex justify-between items-end border-b border-[var(--outline-variant)] pb-2 mb-8">
            <h3 className="font-['Montserrat'] text-2xl md:text-3xl font-semibold text-[var(--deep-navy)]">
              Năng Lực Sản Xuất
            </h3>
            <Link
              to="/catalog"
              className="text-base text-[var(--electric-blue)] font-bold hover:text-[var(--deep-navy)] transition-colors duration-200 flex items-center"
            >
              Xem tất cả{" "}
              <span className="material-symbols-outlined ml-1 text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map((cap, index) => (
              <Link key={index} to="/catalog" className="group cursor-pointer">
                <div className="aspect-[4/5] bg-[var(--surface-container-low)] rounded overflow-hidden border border-[var(--outline-variant)] relative">
                  <img
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    alt={cap.title}
                    src={cap.image}
                  />
                  <div className="absolute inset-0 bg-[var(--deep-navy)]/0 group-hover:bg-[var(--deep-navy)]/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-xs font-bold uppercase tracking-widest border border-white px-4 py-2 text-white">
                      Chi tiết
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="text-base font-semibold text-[var(--deep-navy)]">
                    {cap.title}
                  </h4>
                  <p className="text-sm text-[var(--on-surface-variant)] mt-1">
                    {cap.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
