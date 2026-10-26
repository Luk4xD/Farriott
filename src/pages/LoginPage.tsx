import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, loginDemo } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Lấy đường dẫn chuyển tiếp nếu có (ví dụ cố vào /admin nhưng chưa login)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  useEffect(() => {
    if (user) {
      if (user.role?.toLowerCase() === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from || "/", { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (mode === "login") {
      const res = await login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } else {
      if (!fullName.trim()) {
        setIsLoading(false);
        setErrorMessage("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      const res = await register({ fullName, email, password, phone });
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage("Đăng ký tài khoản thành công! Đang chuyển sang màn hình đăng nhập...");
        setTimeout(() => {
          setMode("login");
          setSuccessMessage("");
        }, 1500);
      } else {
        setErrorMessage(res.message || "Đăng ký không thành công. Vui lòng thử lại.");
      }
    }
  };

  const handleQuickDemo = (role: "admin" | "customer") => {
    loginDemo(role);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#0e1626] via-[#141e33] to-[#0a0f1d] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--electric-blue)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Card */}
        <div className="bg-[#182235]/90 border border-slate-700/60 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-block font-['Montserrat'] text-3xl font-extrabold text-white tracking-wider mb-2 hover:opacity-90 transition-opacity"
            >
              Farriott<span className="text-[var(--electric-blue)]">.</span>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Hệ thống xác thực Khách hàng & Quản trị
            </p>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 p-1 bg-slate-900/80 rounded-2xl flex border border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-[var(--electric-blue)] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-[var(--electric-blue)] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-300 text-xs animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-red-400">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-emerald-300 text-xs animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-emerald-400">
                check_circle
              </span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Địa chỉ Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    phone
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mật khẩu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-11 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[var(--electric-blue)] to-blue-600 hover:from-blue-600 hover:to-[var(--deep-navy)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : mode === "login" ? (
                "Đăng nhập ngay"
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              ⚡ Tài khoản trải nghiệm nhanh (1-Click Demo):
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="py-2.5 px-3 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 group"
              >
                <span className="material-symbols-outlined text-[18px] text-purple-400 group-hover:scale-110 transition-transform">
                  shield_person
                </span>
                Admin Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("customer")}
                className="py-2.5 px-3 rounded-xl bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 text-blue-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 group"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-400 group-hover:scale-110 transition-transform">
                  person
                </span>
                Khách hàng
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Bấm để đăng nhập ngay với đầy đủ quyền mà không cần gõ mật khẩu.
            </p>
          </div>
        </div>

        {/* Footer Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại trang chủ Farriott
          </Link>
        </div>
      </div>
    </main>
  );
}
