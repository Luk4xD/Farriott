import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id?: number;
  fullName: string;
  email: string;
  role: string; // 'admin' | 'customer' | string
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loginDemo: (role: "admin" | "customer") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khôi phục phiên đăng nhập từ localStorage khi khởi động
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("farriott_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Lỗi khi đọc phiên đăng nhập:", err);
      localStorage.removeItem("farriott_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem("farriott_user", JSON.stringify(userData));
    localStorage.setItem("farriott_token", userData.token);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.token) {
        const userData: User = {
          fullName: data.fullName || email.split("@")[0],
          email,
          role: (data.role || "customer").toLowerCase(),
          token: data.token,
        };
        saveUserSession(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "Tài khoản hoặc mật khẩu không chính xác.",
        };
      }
    } catch (err) {
      console.warn("Không thể kết nối đến Backend (.NET), chuyển sang chế độ hỗ trợ:", err);
      // Nếu Backend chưa chạy hoặc lỗi mạng, cho phép kiểm tra tài khoản demo để trải nghiệm
      if (email.toLowerCase().includes("admin") && password.length >= 6) {
        const mockAdmin: User = {
          fullName: "Quản trị viên Farriott",
          email,
          role: "admin",
          token: "mock_admin_jwt_token_demo_farriott",
        };
        saveUserSession(mockAdmin);
        return { success: true };
      }

      return {
        success: false,
        message: "Không thể kết nối tới máy chủ API. Vui lòng kiểm tra lại dịch vụ Backend.",
      };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok) {
        return { success: true, message: resData.message || "Đăng ký tài khoản thành công!" };
      } else {
        return {
          success: false,
          message: resData.message || "Đăng ký không thành công. Vui lòng thử lại.",
        };
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      return {
        success: false,
        message: "Không thể kết nối tới máy chủ API Backend.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("farriott_user");
    localStorage.removeItem("farriott_token");
  };

  // Hàm hỗ trợ đăng nhập nhanh Demo (rất tiện cho trải nghiệm và test Admin CRUD)
  const loginDemo = (role: "admin" | "customer") => {
    const isAdm = role === "admin";
    const demoUser: User = {
      fullName: isAdm ? "Admin Farriott" : "Nguyễn Văn Khách",
      email: isAdm ? "admin@farriott.com" : "customer@gmail.com",
      role: isAdm ? "admin" : "customer",
      token: `demo_${role}_jwt_token_${Date.now()}`,
    };
    saveUserSession(demoUser);
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || null,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
