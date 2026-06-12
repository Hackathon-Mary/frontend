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

  return (
    <aside
      className="flex-shrink-0 flex flex-col bg-[#F6F6F6] py-5 border-r border-[#D3D1C7]/60 transition-[width] duration-200 ease-in-out overflow-hidden"
      style={{ width: expanded ? "185px" : "52px" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-3 mb-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-shrink-0"><IconMary /></div>
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
          style={{ width: expanded ? "100%" : "36px", height: "36px" }}
          className={`flex items-center rounded-lg text-sm font-medium transition-colors overflow-hidden
            ${active === "new" ? "bg-[#B6E0CD] text-[#085041]" : "text-[#5F5E5A] hover:bg-[#B6E0CD]/40"}`}
        >
          <div className="w-[36px] flex-shrink-0 flex justify-center"><Plus size={16} /></div>
          {expanded && <span className="whitespace-nowrap">New Chat</span>}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            title={!expanded ? item.label : ""}
            style={{ width: expanded ? "100%" : "36px", height: "36px" }}
            className={`flex items-center rounded-lg text-sm transition-colors overflow-hidden
              ${active === item.label ? "bg-[#B6E0CD]/60 text-[#085041] font-medium" : "text-[#5F5E5A] hover:bg-[#D3D1C7]/40"}`}
          >
            <div className="w-[36px] flex-shrink-0 flex justify-center">{item.icon}</div>
            {expanded && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="px-2 mb-1">
        <button
          onClick={logout}
          title={!expanded ? "Logout" : ""}
          style={{ width: expanded ? "100%" : "36px", height: "36px" }}
          className="flex items-center rounded-lg text-sm text-[#5F5E5A] hover:bg-[#F7C1C1]/40 hover:text-[#A32D2D] transition-colors overflow-hidden"
        >
          <div className="w-[36px] flex-shrink-0 flex justify-center"><LogOut size={16} /></div>
          {expanded && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>

      {/* User profile */}
      <div className={`flex items-center gap-2.5 px-2 py-2 ${!expanded && "justify-center"}`}>
        <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center text-[#085041] text-xs font-semibold flex-shrink-0 overflow-hidden">
          {user?.picture
            ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
            : getInitials(user?.name)}
        </div>
        {expanded && (
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-[#2C2C2A] truncate">{user?.name || "Pengguna"}</div>
            <div className="text-[11px] text-[#888780] truncate">{user?.email || ""}</div>
          </div>
        )}
      </div>
    </aside>
  );
}