import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UploadPage from "./pages/UploadPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LawPage from "./pages/LawPage";
import HistoryPage from "./pages/HistoryPage";
import FolderPage from "./pages/FolderPage";
import HelpPage from "./pages/HelpPage";

function MainLayout() {
  const [active, setActive] = useState("new");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function handleNavigate(e) {
      setActive(e.detail);
      setExpanded(false);
    }
    window.addEventListener("mary:navigate", handleNavigate);
    return () => window.removeEventListener("mary:navigate", handleNavigate);
  }, []);

  const renderPage = () => {
    switch (active) {
      case "new": return <UploadPage />;
      case "Analytics": return <AnalyticsPage />;
      case "Law": return <LawPage />;
      case "History": return <HistoryPage />;
      case "Folder": return <FolderPage />;
      case "Help": return <HelpPage />;
      default: return <UploadPage />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col sm:flex-row h-screen w-full bg-[#EDEAE2] overflow-hidden">
      {/* Topbar mobile (di atas) */}
      <MobileNav active={active} setActive={setActive} />

      {/* Sidebar desktop (kiri) */}
      <Sidebar active={active} setActive={setActive} expanded={expanded} setExpanded={setExpanded} />

      {/* Konten — beri padding bawah di mobile supaya tidak ketutup bottom nav */}
      <main className="relative flex-1 bg-[#EDEAE2] overflow-hidden min-w-0 pb-16 sm:pb-0">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}