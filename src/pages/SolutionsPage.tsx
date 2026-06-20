const heroImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLvmuvZpCNykyUgQOB78xsl9-BCoz0ezsHSnnor-F0Z7PGdajFYzPwSciCX9Y94XdaNV5MOJVFFZ-Ot7CjVPH00FqyXCnvGdNW3VOaGSdFNhoVo8W-sAaShFTFvQk_5dOmJwpLiWnN-C2JoR5WWOy1egX2CdT5bZ_5mUWb499FuiUX8ATy_uYt4PrT8l_x22hdTA20lph3vUWxHl9idzEDs5o7i9I-Uc6JDWj_j0vkqbgVvzJplitHVQyODV";

const timelineImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLvmuvZpCNykyUgQOB78xsl9-BCoz0ezsHSnnor-F0Z7PGdajFYzPwSciCX9Y94XdaNV5MOJVFFZ-Ot7CjVPH00FqyXCnvGdNW3VOaGSdFNhoVo8W-sAaShFTFvQk_5dOmJwpLiWnN-C2JoR5WWOy1egX2CdT5bZ_5mUWb499FuiUX8ATy_uYt4PrT8l_x22hdTA20lph3vUWxHl9idzEDs5o7i9I-Uc6JDWj_j0vkqbgVvzJplitHVQyODV";

const designImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJmT1_xudQ1j1E3Yd3IP-qCGEAl3bd1eXIJgRO5mZdaAU2t08JG2iLshIxxHbr91xlJOKBWzsktsCgdNwOFsdk0iK96PGbcFx8p5YLnzpVSCiJgfLwexOxJB_X4FafS8F1IWxcGN0mAFo2Zlsc8OOmbpWVFjkWzd1LnMWzu2_yiTNEWeOe2dWxPvBjTPkZzbv4hSZqlzBRYWf5JW-evODupKcWbfDs-PeOWbQ4LCrLreTdg-ttIHUGZzMFSqGYPOqd2356pFSsx7uA";

const processSteps = [
  {
    number: 1,
    title: "Inquiry (Tiếp Nhận Nhu Cầu)",
    description:
      "Ghi nhận thông tin chi tiết về số lượng, phong cách, ngân sách và tiến độ yêu cầu từ khách hàng.",
  },
  {
    number: 2,
    title: "Phác Thảo (Design)",
    description:
      "Lên ý tưởng thiết kế 2D/3D, đề xuất bảng màu và phối hợp chất liệu phù hợp với nhận diện thương hiệu.",
  },
  {
    number: 3,
    title: "Mẫu Thử (Prototyping)",
    description:
      "May mẫu thực tế để khách hàng kiểm tra phom dáng, chất liệu và độ hoàn thiện trước khi sản xuất hàng loạt.",
  },
  {
    number: 4,
    title: "Sản Xuất (Production)",
    description:
      "Tiến hành cắt may công nghiệp trên dây chuyền hiện đại, đảm bảo sự đồng nhất và chính xác cao.",
  },
  {
    number: 5,
    title: "KCS (Quality Control)",
    description:
      "Kiểm tra chất lượng nghiêm ngặt từng sản phẩm (đường may, kích thước, lỗi vải) theo tiêu chuẩn ISO.",
  },
  {
    number: 6,
    title: "Đóng Gói (Packaging)",
    description:
      "Làm phẳng, gắn tag, gấp gọn và đóng gói chuyên nghiệp theo quy cách yêu cầu.",
  },
  {
    number: 7,
    title: "Giao Hàng (Delivery)",
    description: "Vận chuyển an toàn đến tận tay khách hàng với cam kết đúng tiến độ.",
  },
];

const solutions = [
  {
    icon: "architecture",
    title: "Thiết Kế Độc Bản",
    description:
      "Đội ngũ thiết kế sáng tạo mang đến những bộ sưu tập đồng phục mang đậm dấu ấn thương hiệu, kết hợp hài hòa giữa tính thời trang và công năng sử dụng.",
    image: designImage,
    span: "col-span-8 row-span-2",
  },
  {
    icon: "diamond",
    title: "Chất Liệu Cao Cấp",
    description:
      "Sử dụng các dòng vải nhập khẩu, thân thiện môi trường và bền bỉ trong môi trường công sở.",
    span: "col-span-4",
  },
  {
    icon: "support_agent",
    title: "Tư Vấn Chuyên Sâu",
    description:
      "Quy trình tư vấn 1-1, phân tích kỹ lưỡng nhu cầu và văn hóa doanh nghiệp để đưa ra giải pháp tối ưu.",
    span: "col-span-4",
  },
];

const commitments = [
  { icon: "verified", label: "Bảo hành 12 tháng" },
  { icon: "workspace_premium", label: "ISO 9001" },
  { icon: "eco", label: "Vải Sinh Học" },
  { icon: "schedule", label: "Đúng Tiến Độ" },
  { icon: "check_circle", label: "OEKO-TEX" },
];

export function SolutionsPage() {
  return (
    <main className="pt-20">
      <section className="relative pt-[120px] pb-20 bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 z-10">
            <span className="inline-block px-3 py-1 bg-[var(--primary-fixed)] text-[var(--deep-navy)] rounded text-xs font-bold uppercase tracking-wider mb-6">
              Giải Pháp Đồng Phục
            </span>
            <h1 className="font-['Montserrat'] text-4xl md:text-5xl font-bold text-[var(--deep-navy)] mb-6">
              Kiến tạo hình ảnh chuyên nghiệp cho doanh nghiệp của bạn.
            </h1>
            <p className="text-lg text-[var(--on-surface-variant)] mb-8 max-w-lg">
              Quy trình sản xuất khép kín, chất liệu cao cấp và thiết kế độc
              bản. Chúng tôi mang đến giải pháp toàn diện, tối ưu hóa từ ý tưởng
              đến thành phẩm cuối cùng.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-[var(--electric-blue)] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                <span>Nhận Tư Vấn Miễn Phí</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="border border-[var(--cool-silver)] text-[var(--deep-navy)] px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:border-[var(--deep-navy)] transition-colors">
                Xem Hồ Sơ Năng Lực
              </button>
            </div>
          </div>
          <div className="md:col-span-6 relative">
            <div className="aspect-[4/3] rounded bg-[var(--surface-container)] overflow-hidden relative shadow-lg">
              <img
                alt="Quy trình sản xuất đồng phục cao cấp"
                className="object-cover w-full h-full"
                src={heroImage}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm border border-[var(--surface-container-highest)] shadow-sm p-6 rounded z-20 min-w-[200px] hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--deep-navy)] text-white rounded flex items-center justify-center">
                  <span className="material-symbols-outlined">factory</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--deep-navy)]">
                    10K+
                  </div>
                  <div className="text-sm text-[var(--on-surface-variant)]">
                    Sản phẩm/tháng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-semibold text-[var(--deep-navy)] mb-4">
              Giải Pháp Chuyên Biệt
            </h2>
            <p className="text-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Chúng tôi cung cấp các gói giải pháp linh hoạt, đáp ứng mọi nhu
              cầu khắt khe của doanh nghiệp từ chất liệu đến thiết kế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`${solution.span} rounded overflow-hidden relative group ${
                  solution.image
                    ? "bg-[var(--surface)]"
                    : "bg-[var(--surface-container-low)] border border-[var(--surface-container-highest)]"
                } hover:-translate-y-1 transition-all duration-300`}
              >
                {solution.image ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--deep-navy)]/90 to-transparent z-10 p-10 flex flex-col justify-end">
                      <span className="material-symbols-outlined text-white text-4xl mb-4">
                        {solution.icon}
                      </span>
                      <h3 className="font-['Montserrat'] text-xl font-semibold text-white mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-sm text-white/80 max-w-md">
                        {solution.description}
                      </p>
                    </div>
                    <img
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={solution.title}
                      src={solution.image}
                    />
                  </>
                ) : (
                  <div className="p-8 flex flex-col justify-between h-full">
                    <div className="w-12 h-12 bg-white text-[var(--electric-blue)] rounded flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined">
                        {solution.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-sm text-[var(--on-surface-variant)]">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 sticky top-32 self-start hidden md:block">
            <h2 className="font-['Montserrat'] text-3xl font-semibold text-[var(--deep-navy)] mb-4">
              Quy Trình 7 Bước
            </h2>
            <p className="text-lg text-[var(--on-surface-variant)] mb-8">
              Tiêu chuẩn hóa mọi khâu sản xuất để đảm bảo chất lượng đồng đều và
              đúng tiến độ cam kết.
            </p>
            <div className="aspect-[4/5] rounded bg-[var(--surface-container)] overflow-hidden shadow-md">
              <img
                alt="Chi tiết quy trình kiểm tra chất lượng sản phẩm may mặc"
                className="object-cover w-full h-full"
                src={timelineImage}
              />
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <div className="md:hidden mb-8">
              <h2 className="font-['Montserrat'] text-3xl font-semibold text-[var(--deep-navy)] mb-4">
                Quy Trình 7 Bước
              </h2>
              <p className="text-lg text-[var(--on-surface-variant)]">
                Tiêu chuẩn hóa mọi khâu sản xuất để đảm bảo chất lượng đồng đều
                và đúng tiến độ cam kết.
              </p>
            </div>
            <div className="relative pb-10 pl-8 md:pl-0">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative mb-12 flex last:mb-0"
                >
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-[11px] top-12 bottom-0 w-0.5 bg-[var(--surface-container-highest)]" />
                  )}
                  <div className="absolute left-0 top-0 z-10">
                    <div
                      className={`flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 text-2xl font-bold transition-colors ${
                        index === 0
                          ? "bg-[var(--deep-navy)] border-[var(--deep-navy)] text-white"
                          : "bg-[var(--surface)] border-[var(--surface-container-highest)] text-[var(--cool-silver)]"
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="ml-20 md:ml-24 bg-white p-6 rounded border border-[var(--surface-container-highest)] shadow-sm w-full hover:-translate-y-0.5 transition-transform">
                    <h3 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-[var(--deep-navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,100 C20,0 50,0 100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] text-3xl font-semibold mb-4">
              Cam Kết Chất Lượng
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Niềm tin của khách hàng là thước đo giá trị. Chúng tôi khẳng định
              chất lượng qua những chứng nhận và cam kết rõ ràng.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {commitments.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--electric-blue)] transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    {item.icon}
                  </span>
                </div>
                <h4 className="text-base font-semibold">{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
