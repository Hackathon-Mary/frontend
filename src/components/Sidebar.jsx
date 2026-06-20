import { useState, useEffect } from "react";
import { Plus, TrendingUp, Scale, History, Folder, CircleHelp, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const IconMary = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#B6E0CD"/>
    <ellipse cx="14" cy="14" rx="8" ry="9" fill="#5DCAA5"/>
    <ellipse cx="14" cy="14" rx="5" ry="6" fill="#E1F5EE"/>
    <ellipse cx="14" cy="14" rx="2.5" ry="3" fill="#085041"/>
    <ellipse cx="15" cy="13" rx="1" ry="1" fill="#fff"/>
  </svg>
);

const navItems = [
  { icon: <TrendingUp size={16} />, label: "Analytics" },
  { icon: <Scale size={16} />, label: "Law" },
  { icon: <History size={16} />, label: "History" },
  { icon: <Folder size={16} />, label: "Folder" },
  { icon: <CircleHelp size={16} />, label: "Help" },
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-full bg-[#F7C1C1] flex items-center justify-center flex-shrink-0">
            <LogOut size={18} className="text-[#A32D2D]" />
          </div>
          <button
            onClick={onCancel}
            className="text-[#888780] hover:text-[#2C2C2A] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-[15px] font-semibold text-[#2C2C2A] mb-1">Keluar dari akun?</p>
        <p className="text-[13px] text-[#5F5E5A] leading-relaxed mb-5">
          Kamu perlu login kembali dengan Google untuk mengakses Mary.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#F1EFE8] text-[#2C2C2A] text-[13px] font-medium py-2.5 rounded-xl hover:bg-[#E8E6DF] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#A32D2D] text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-[#8C2424] transition-colors"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ active, setActive, expanded, setExpanded }) {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [navLocked, setNavLocked] = useState(false);

  useEffect(() => {
    function handleLock(e) {
      setNavLocked(e.detail);
    }
    window.addEventListener("mary:lock-nav", handleLock);
    return () => window.removeEventListener("mary:lock-nav", handleLock);
  }, []);

  return (
    <>
      {expanded && (
        <div
          className="hidden max-sm:block fixed inset-0 bg-black/30 z-30"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className="flex-shrink-0 flex flex-col bg-[#F6F6F6] py-5 border-r border-[#D3D1C7]/60 transition-[width] duration-200 ease-in-out overflow-hidden
          max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:h-full max-sm:z-40 max-sm:shadow-xl"
        style={{ width: expanded ? "185px" : "52px" }}
      >
        {/* Logo */}
        <div
          className="w-full flex items-center gap-2.5 px-3 mb-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="w-[28px] flex-shrink-0 flex items-center justify-center"><IconMary /></div>
          {expanded && (
            <span className="text-[#085041] font-bold text-base tracking-widest whitespace-nowrap">
              MARY
            </span>
          )}
        </div>

        {/* New Chat */}
        <div className="px-2 mb-1">
          <button
            onClick={() => setActive("new")}
            className={`w-full h-9 flex items-center rounded-lg text-sm font-medium transition-colors overflow-hidden
              ${active === "new" ? "bg-[#B6E0CD] text-[#085041]" : "text-[#5F5E5A] hover:bg-[#B6E0CD]/40"}`}
          >
            <div className="w-[36px] flex-shrink-0 flex items-center justify-center"><Plus size={16} /></div>
            {expanded && <span className="whitespace-nowrap">New Chat</span>}
          </button>
        </div>

        {navLocked && expanded && (
          <div className="px-2 pb-1">
            <p className="text-[10px] text-[#854F0B] px-1 leading-relaxed">
              ⚠ Sedang menyiapkan laporan — pindah menu akan membatalkan progres ini.
            </p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              title={!expanded ? item.label : ""}
              className={`w-full h-9 flex items-center rounded-lg text-sm transition-colors overflow-hidden
                ${active === item.label ? "bg-[#B6E0CD]/60 text-[#085041] font-medium" : "text-[#5F5E5A] hover:bg-[#D3D1C7]/40"}`}
            >
              <div className="w-[36px] flex-shrink-0 flex items-center justify-center">{item.icon}</div>
              {expanded && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Logout — buka modal, bukan klik 2x */}
        <div className="px-2 mb-1">
          <button
            onClick={() => setShowLogoutModal(true)}
            title={!expanded ? "Logout" : ""}
            className="w-full h-9 flex items-center rounded-lg text-sm text-[#5F5E5A] hover:bg-[#F7C1C1]/40 hover:text-[#A32D2D] transition-colors overflow-hidden"
          >
            <div className="w-[36px] flex-shrink-0 flex items-center justify-center"><LogOut size={16} /></div>
            {expanded && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>

        {/* User profile — gap diperbaiki, tidak nempel */}
        <div className="px-2">
          <div className="w-full h-10 flex items-center rounded-lg overflow-hidden">
            <div className="w-[36px] flex-shrink-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center text-[#085041] text-xs font-semibold overflow-hidden">
                {user?.picture
                  ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  : getInitials(user?.name)}
              </div>
            </div>
            {expanded && (
              <div className="min-w-0 ml-2 pr-1">
                <div className="text-[13px] font-medium text-[#2C2C2A] truncate leading-tight">{user?.name || "Pengguna"}</div>
                <div className="text-[11px] text-[#888780] truncate leading-tight mt-0.5">{user?.email || ""}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={logout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}