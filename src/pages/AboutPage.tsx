const heroImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLvmuvZpCNykyUgQOB78xsl9-BCoz0ezsHSnnor-F0Z7PGdajFYzPwSciCX9Y94XdaNV5MOJVFFZ-Ot7CjVPH00FqyXCnvGdNW3VOaGSdFNhoVo8W-sAaShFTFvQk_5dOmJwpLiWnN-C2JoR5WWOy1egX2CdT5bZ_5mUWb499FuiUX8ATy_uYt4PrT8l_x22hdTA20lph3vUWxHl9idzEDs5o7i9I-Uc6JDWj_j0vkqbgVvzJplitHVQyODV";

const teamMembers = [
  {
    name: "Nguyễn Văn A",
    role: "Giám Đốc Điều Hành (CEO)",
    description:
      "Hơn 20 năm kinh nghiệm trong ngành dệt may công nghiệp, dẫn dắt Farriott từ những ngày đầu thành lập.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmEKouo4SeAe9eEnKvstVwJgD-p3nN6uH6Zyf7ZOMxbs5xtN7yA7M3TXeasxycR7NHpIBSS9QPuU9Qo8EfJdvzvNF6ZK2_drys9xJtVAJPDJZkRccIzb5322CFoRxwaFr_HM6OIlPLIQ_ALOKuAdnKh6wtdZHfO5fu9VDsGT5gk6G20xe8FjxJTuWJx8t_QhS2F_o2fKLMJLRfsKGXcrga_ByEFpVcO8epp-Z3Y8OCTLc_BHaMo5QGnG2uf0WL7mxEqpaAb-EJUs5X",
  },
  {
    name: "Trần Thị B",
    role: "Giám Đốc Sản Xuất",
    description:
      "Chuyên gia quản lý chất lượng và tối ưu hóa dây chuyền sản xuất quy mô lớn theo tiêu chuẩn ISO.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkqFZdJISxp0Y5giYAFgb-omxerpuoRI_F3SLSkMICkRzHeiQ4GxSnHVXHhVwvAMMnYeAgR2uYQNRAcEB9F4EaZf3b9g38SWmOiuEPVFdpdxmkNquj1RxDs8H-8pD64YfiRG9cFcT7rNvfW3vN1JAsSupfiHVC2hh5LcZBq0TARGjS7SiJ70C5SRTmYRXxWJnkUyUiGTJjSjuQhNMJaXD5EJtkwkDWtOcdL5rp0Kl8g2vOGjwt8UUMBrxhMYj6gVuocjf2-RQTrmC5",
  },
  {
    name: "Lê Văn C",
    role: "Trưởng Phòng R&D Thiết Kế",
    description:
      "Tiên phong nghiên cứu vật liệu mới và giải pháp thiết kế công thái học cho đồng phục chuyên dụng.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAXwYj_4w10pat7gid9BfphwPh1vLRHn6HKxZgyNMEWW3IOp1SkGeGioLlXbL9ZMREOHJVwJTCeBnzGNOdlFFj9JuvGMj9spaJcdSRzHISuz1aR_JIhM8UNUTQ-EJpI-G8PvCvSTdBZKF9BuvJXaeHG8O5UROyI8k_zT5y12cTBKpa_lOtnjBH7xiudkswIOkmRvJKNa13DvZArItbq65lEKCWAzE_Xx4OotwQRQAWh84Qaov_gul-1OdhpCHpWNAkyFl9yZ9qggfy",
  },
];

const coreValues = [
  {
    icon: "verified",
    title: "Chất lượng",
    description: "Không thỏa hiệp trong từng chi tiết sản xuất.",
  },
  {
    icon: "handshake",
    title: "Độ tin cậy",
    description: "Đối tác bền vững, giao hàng đúng hẹn.",
  },
  {
    icon: "lightbulb",
    title: "Đổi mới",
    description: "Áp dụng công nghệ tiên tiến nhất.",
  },
];

export function AboutPage() {
  return (
    <main className="pt-20 pb-24 md:pb-0">
      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-12 md:py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="font-['Montserrat'] text-4xl md:text-5xl font-bold text-[var(--deep-navy)] mb-6">
              Hành Trình Kiến Tạo Chuẩn Mực
            </h1>
            <p className="text-lg text-[var(--on-surface-variant)]">
              Từ một xưởng may thủ công tâm huyết, Farriott đã chuyển mình thành tổ
              hợp công nghiệp hiện đại, mang đến giải pháp sản xuất đồng phục
              doanh nghiệp quy mô lớn với độ hoàn thiện tinh tế. Chúng tôi tin
              rằng mỗi đường kim mũi chỉ là một lời cam kết về chất lượng.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded overflow-hidden border border-[var(--outline-variant)]">
            <img
              alt="Farriott Manufacturing Facility"
              className="w-full h-full object-cover"
              src={heroImage}
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-container-low)] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[var(--primary-fixed)] text-[var(--deep-navy)] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <h2 className="font-['Montserrat'] text-2xl font-semibold text-[var(--deep-navy)]">
                  Tầm Nhìn
                </h2>
              </div>
              <p className="text-base text-[var(--on-surface-variant)]">
                Trở thành đối tác sản xuất đồng phục và dệt may công nghiệp hàng đầu
                khu vực Đông Nam Á, tiên phong trong việc ứng dụng công nghệ xanh
                và quy trình quản lý chất lượng chuẩn quốc tế, góp phần nâng tầm
                diện mạo cho mọi doanh nghiệp đối tác.
              </p>
            </div>
            <div className="bg-white p-8 rounded border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[var(--primary-fixed)] text-[var(--deep-navy)] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">flag</span>
                </div>
                <h2 className="font-['Montserrat'] text-2xl font-semibold text-[var(--deep-navy)]">
                  Sứ Mệnh
                </h2>
              </div>
              <p className="text-base text-[var(--on-surface-variant)]">
                Mang lại giá trị thực bền vững cho khách hàng thông qua giải pháp
                sản xuất tối ưu chi phí, đảm bảo tiến độ khắt khe và chất lượng
                đồng nhất trên quy mô lớn. Farriott đồng hành cùng sự phát triển
                của đối tác bằng sự thấu hiểu và chuyên nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--surface-container-low)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <h2 className="font-['Montserrat'] text-2xl md:text-3xl font-semibold text-[var(--deep-navy)] text-center mb-8">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white border border-[var(--outline-variant)] rounded p-6 flex flex-col items-center text-center"
              >
                <span className="material-symbols-outlined text-4xl text-[var(--electric-blue)] mb-4">
                  {value.icon}
                </span>
                <h3 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--secondary)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-[120px]">
        <h2 className="font-['Montserrat'] text-2xl md:text-3xl font-semibold text-[var(--deep-navy)] text-center mb-12">
          Đội Ngũ Chuyên Gia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group border border-[var(--outline-variant)] rounded bg-white overflow-hidden hover:border-[var(--electric-blue)] transition-colors"
            >
              <div className="aspect-[4/5] relative">
                <img
                  className="w-full h-full object-cover"
                  alt={member.name}
                  src={member.image}
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Montserrat'] text-xl font-semibold text-[var(--deep-navy)] mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--cool-silver)] mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
