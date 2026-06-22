import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { CatalogPage } from "@/pages/CatalogPage";
import { SolutionsPage } from "@/pages/SolutionsPage";
import { AboutPage } from "@/pages/AboutPage";
import { DesignStudioPage } from "@/pages/DesignStudioPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <TopNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/design" element={<DesignStudioPage />} />
        </Routes>
        <Footer />
        <BottomNavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
