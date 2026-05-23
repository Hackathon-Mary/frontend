import { useState, useRef } from "react";
import { Plus, TrendingUp, Scale, History, Folder, Upload, Link, CircleQuestionMark} from "lucide-react";

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
  { icon: <CircleQuestionMark size={16} />, label: "Help" },
];

export default function MaryUpload() {
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [active, setActive] = useState("new");
  const fileRef = useRef();

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen w-full bg-[#EDEAE2]">

      {/* Sidebar */}
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
          <span className="text-[#085041] font-bold text-base tracking-widest whitespace-nowrap overflow-hidden">
            MARY
          </span>
        )}
      </div>

        {/* New Chat */}
       <div className={expanded ? "px-2" : "px-2"}>
          <button
            onClick={() => setActive("new")}
            style={{ width: expanded ? "100%" : "36px", height: "36px" }}
            className={`flex items-center rounded-lg text-sm font-medium mb-0.5 transition-colors overflow-hidden
              ${active === "new" ? "bg-[#B6E0CD] text-[#085041]" : "text-[#5F5E5A] hover:bg-[#B6E0CD]/40"}`}
          >
            <div className="flex-shrink-0 w-[36px] flex justify-center"><Plus size={16} /></div>
            {expanded && <span className="whitespace-nowrap">New Chat</span>}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{ width: expanded ? "100%" : "36px", height: "36px" }}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors overflow-hidden
                ${active === item.label ? "bg-[#B6E0CD]/60 text-[#085041]" : "text-[#5F5E5A] hover:bg-[#D3D1C7]/40"}`}
>
              <div className="flex-shrink-0 w-[36px] flex justify-center">{item.icon}</div>
              {expanded && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User profile */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[#B6E0CD] flex items-center justify-center text-[#085041] text-xs font-semibold flex-shrink-0">
            SH
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-[#2C2C2A] truncate">Sri Hartono</div>
            <div className="text-[11px] text-[#888780] truncate">+6285710102239</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center bg-[#EDEAE2]">
        <div className="bg-[#F6F6F6] p-[10px] rounded-[21px]">
        <div className="w-full max-w-[500px] flex flex-col gap-3">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 py-14 px-8
              ${isDragging
                ? "border-[#085041] bg-[#B6E0CD]/60"
                : "border-[#B6E0CD] bg-[#B6E0CD]/40"}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic"
              className="hidden"
            />
            <Upload size={50} className="text-[#2C2C2A]" />
            <div className="text-center">
              <p className="text-[13px] text-[#2C2C2A] leading-relaxed">
                Drop, paste your image anywhere or{" "}
                <span className="font-semibold">Click here to upload an image.</span>
              </p>
              <p className="text-[12px] text-[#5F5E5A] mt-1">
                Only JPG, JPEG, PNG, WEBP, HEIC formats allowed
              </p>
            </div>
          </div>

          {/* URL input */}
          <div className="flex items-center gap-2 bg-white border border-[#D3D1C7] rounded-full px-4 py-2.5">
            <Link size={15} className="text-[#888780] flex-shrink-0" />
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="Enter Image URL"
              className="flex-1 text-[13px] text-[#2C2C2A] bg-transparent outline-none placeholder:text-[#B0AEA7]"
            />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}