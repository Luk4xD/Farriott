import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Danh mục sỉ", path: "/catalog" },
  { label: "Quy trình & Giải pháp", path: "/solutions" },
  { label: "Về chúng tôi", path: "/about" },
];

export function TopNavBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();

  return (
    <>
      <header className="relative w-full z-50 bg-[var(--surface)] border-b border-[var(--outline-variant)]">
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
            <Link to="/cart" className="relative text-[var(--deep-navy)] hover:text-[var(--electric-blue)] transition-colors">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--electric-blue)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/quote"
              className="inline-flex items-center justify-center bg-[var(--electric-blue)] hover:bg-[var(--deep-navy)] text-white px-5 py-2 rounded transition-colors duration-300 text-xs font-bold uppercase tracking-wider h-9"
            >
              Nhận báo giá
            </Link>

            {/* User Profile / Admin / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[var(--outline-variant)] hover:border-[var(--deep-navy)] bg-white text-xs font-semibold text-[var(--deep-navy)] transition-all shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--deep-navy)] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate">{user.fullName}</span>
                  {isAdmin && (
                    <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[var(--outline-variant)] py-1.5 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[var(--outline-variant)] text-xs">
                      <p className="font-bold text-[var(--deep-navy)] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[var(--on-surface-variant)] truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Trang Quản Trị (Admin)
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 border border-[var(--outline-variant)] hover:border-[var(--deep-navy)] text-[var(--deep-navy)] hover:text-[var(--electric-blue)] hover:bg-slate-50 transition-colors duration-300 px-5 py-2 rounded text-xs font-bold uppercase tracking-wider h-9"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Đăng nhập
              </Link>
            )}
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
            className="absolute right-0 top-0 h-full w-72 bg-[var(--surface)] shadow-lg p-6 pt-20 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-4">
              {user && (
                <div className="pb-3 border-b border-[var(--outline-variant)]">
                  <p className="font-bold text-sm text-[var(--deep-navy)]">{user.fullName}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">{user.email}</p>
                  {isAdmin && (
                    <span className="mt-1 inline-block bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                </div>
              )}

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
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-[var(--on-surface-variant)]"
              >
                <span>Giỏ hàng</span>
                <span className="bg-[var(--electric-blue)] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-semibold text-purple-700"
                >
                  <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                  Trang Quản Trị
                </Link>
              )}

              <Link
                to="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 bg-[var(--electric-blue)] text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider text-center"
              >
                Nhận báo giá
              </Link>
            </nav>

            <div className="pt-6 border-t border-[var(--outline-variant)]">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-lg border border-[var(--deep-navy)] text-[var(--deep-navy)] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
