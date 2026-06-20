import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--primary)] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
        <div className="flex flex-col space-y-4">
          <span className="font-['Montserrat'] text-3xl md:text-[48px] font-bold text-white tracking-tight">
            Farriott
          </span>
          <p className="text-sm text-[var(--primary-fixed-dim)] max-w-xs">
            Đối tác sản xuất đồng phục cao cấp đáng tin cậy của doanh nghiệp.
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to="/catalog"
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-fixed-dim)] hover:text-[var(--electric-blue)] transition-all"
          >
            Sản phẩm sỉ
          </Link>
          <Link
            to="/solutions"
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-fixed-dim)] hover:text-[var(--electric-blue)] transition-all"
          >
            Đồng phục thiết kế
          </Link>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to="/solutions"
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-fixed-dim)] hover:text-[var(--electric-blue)] transition-all"
          >
            Công cụ thiết kế
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-fixed-dim)] hover:text-[var(--electric-blue)] transition-all cursor-pointer">
            Logistics
          </span>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to="/about"
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-fixed-dim)] hover:text-[var(--electric-blue)] transition-all"
          >
            Liên hệ
          </Link>
          <p className="text-sm text-[var(--primary-fixed-dim)] mt-8">
            © 2024 Farriott Manufacturing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
