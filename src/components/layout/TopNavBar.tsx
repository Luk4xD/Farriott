import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Danh mục sỉ", path: "/catalog" },
  { label: "Quy trình & Giải pháp", path: "/solutions" },
  { label: "Về chúng tôi", path: "/about" },
];

export function TopNavBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[var(--surface)] border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex justify-between items-center h-20">
          <Link
            to="/"
            className="font-['Montserrat'] text-3xl md:text-[48px] font-bold text-[var(--deep-navy)] tracking-tight"
          >
            Farriott
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-base font-medium transition-colors duration-300",
                  location.pathname === item.path
                    ? "text-[var(--deep-navy)] border-b-2 border-[var(--deep-navy)] pb-1 font-semibold"
                    : "text-[var(--on-surface-variant)] hover:text-[var(--electric-blue)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/quote"
              className="bg-[var(--electric-blue)] hover:bg-[var(--deep-navy)] text-white px-6 py-2 rounded transition-colors duration-300 text-xs font-bold uppercase tracking-wider"
            >
              Nhận báo giá
            </Link>
          </div>

          <button
            className="md:hidden text-[var(--deep-navy)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-64 bg-[var(--surface)] shadow-lg p-6 pt-24"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-medium",
                    location.pathname === item.path
                      ? "text-[var(--deep-navy)] font-semibold"
                      : "text-[var(--on-surface-variant)]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 bg-[var(--electric-blue)] text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider text-center"
              >
                Nhận báo giá
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
