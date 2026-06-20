import { useState, useEffect } from "react";
import { Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { IconMary, navItems, getInitials, LogoutModal } from "./sidebarShared";

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
      <aside
        className="hidden sm:flex flex-shrink-0 flex-col bg-[#F6F6F6] py-5 border-r border-[#D3D1C7]/60 transition-[width] duration-200 ease-in-out overflow-hidden"
        style={{ width: expanded ? "185px" : "52px" }}
      >
        {/* Logo */}
        <div
          className="w-full flex items-center gap-2.5 px-3 mb-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="w-[28px] shrink-0 flex items-center justify-center"><IconMary /></div>
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
            <div className="w-[36px] shrink-0 flex items-center justify-center"><Plus size={16} /></div>
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
              <div className="w-[36px] shrink-0 flex items-center justify-center">{item.icon}</div>
              {expanded && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Logout */}
        <div className="px-2 mb-1">
          <button
            onClick={() => setShowLogoutModal(true)}
            title={!expanded ? "Logout" : ""}
            className="w-full h-9 flex items-center rounded-lg text-sm text-[#5F5E5A] hover:bg-[#F7C1C1]/40 hover:text-[#A32D2D] transition-colors overflow-hidden"
          >
            <div className="w-[36px] shrink-0 flex items-center justify-center"><LogOut size={16} /></div>
            {expanded && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>

        {/* User profile */}
        <div className="px-2">
          <div className="w-full h-10 flex items-center rounded-lg overflow-hidden">
            <div className="w-[36px] shrink-0 flex items-center justify-center">
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
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogoutModal(false)} />
      )}
    </>
  );
}