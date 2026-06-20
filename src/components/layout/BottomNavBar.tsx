import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", path: "/", icon: "home" },
  { label: "Danh mục", path: "/catalog", icon: "category" },
  { label: "Giải pháp", path: "/solutions", icon: "precision_manufacturing" },
  { label: "Chúng tôi", path: "/about", icon: "business" },
];

export function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-2 bg-[var(--surface)] border-t border-[var(--outline-variant)] z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center pt-2 transition-all duration-300 ease-in-out w-full h-full",
              isActive
                ? "text-[var(--deep-navy)] border-t-2 border-[var(--deep-navy)]"
                : "text-[var(--secondary)]"
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
