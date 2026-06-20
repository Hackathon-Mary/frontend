import { useState, useEffect } from "react";
import { Plus, TrendingUp, Scale, History, Folder, CircleHelp, LogOut } from "lucide-react";
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

export default function Sidebar({ active, setActive, expanded, setExpanded }) {
  const { user, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [navLocked, setNavLocked] = useState(false);

  useEffect(() => {
    function handleLock(e) {
      setNavLocked(e.detail);
    }
    window.addEventListener("mary:lock-nav", handleLock);
    return () => window.removeEventListener("mary:lock-nav", handleLock);
  }, []);

  function handleLogoutClick() {
    if (confirmLogout) {
      logout();
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  }

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
        {/* Logo — SELALU w-full, ikon dalam slot 28px tetap */}
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

        {/* New Chat — button SELALU w-full */}
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

        {/* Nav items — button SELALU w-full */}
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

        {/* Logout — button SELALU w-full */}
        <div className="px-2 mb-1">
          <button
            onClick={handleLogoutClick}
            title={!expanded ? "Logout" : ""}
            className={`w-full h-9 flex items-center rounded-lg text-sm transition-colors overflow-hidden
              ${confirmLogout
                ? "bg-[#F7C1C1] text-[#A32D2D]"
                : "text-[#5F5E5A] hover:bg-[#F7C1C1]/40 hover:text-[#A32D2D]"}`}
          >
            <div className="w-[36px] flex-shrink-0 flex items-center justify-center"><LogOut size={16} /></div>
            {expanded && (
              <span className="whitespace-nowrap">
                {confirmLogout ? "Klik lagi untuk keluar" : "Logout"}
              </span>
            )}
          </button>
        </div>

        {/* User profile — container SELALU w-full, sama pola persis seperti button di atas */}
        <div className="px-2">
          <div className="w-full h-9 flex items-center rounded-lg overflow-hidden">
            <div className="w-[36px] flex-shrink-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center text-[#085041] text-xs font-semibold overflow-hidden">
                {user?.picture
                  ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  : getInitials(user?.name)}
              </div>
            </div>
            {expanded && (
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[#2C2C2A] truncate">{user?.name || "Pengguna"}</div>
                <div className="text-[11px] text-[#888780] truncate">{user?.email || ""}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}