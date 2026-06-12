import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Link, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadImage, uploadImageFromUrl } from "../services/upload";

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  async function handleFile(file) {
    if (!ALLOWED_MIME.includes(file.type)) {
      setStatus("error");
      setErrorMsg("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    setStatus("uploading");
    setErrorMsg("");

    try {
      await uploadImage(file);
      setStatus("success");
      // Arahkan ke Analytics setelah berhasil — sesuaikan kalau pakai state navigation
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("mary:navigate", { detail: "Analytics" }));
      }, 800);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Upload gagal. Coba lagi.");
    }
  }

  async function handleUrlSubmit(e) {
    e.preventDefault();
    if (!urlValue.trim()) return;

    setStatus("uploading");
    setErrorMsg("");

    try {
      await uploadImageFromUrl(urlValue.trim());
      setStatus("success");
      setUrlValue("");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("mary:navigate", { detail: "Analytics" }));
      }, 800);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Gagal mengambil gambar dari URL.");
    }
  }

  const isBusy = status === "uploading";

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-[#F6F6F6] p-[10px] rounded-[21px] w-[520px]">
        <div className="flex flex-col gap-3">

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isBusy && fileRef.current.click()}
            className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 py-14 px-8
              ${isDragging ? "border-[#085041] bg-[#B6E0CD]/60" : "border-[#B6E0CD] bg-[#B6E0CD]/40"}
              ${isBusy ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED_EXT.join(",")}
              onChange={handleFileChange}
              className="hidden"
              disabled={isBusy}
            />

            {status === "uploading" && (
              <>
                <RefreshCw size={40} className="text-[#085041] animate-spin" />
                <p className="text-[13px] text-[#085041] font-medium">Mengupload & mengamankan file...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 size={40} className="text-[#085041]" />
                <p className="text-[13px] text-[#085041] font-medium">Upload berhasil! Mengarahkan ke Analytics...</p>
              </>
            )}

            {(status === "idle" || status === "error") && (
              <>
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
              </>
            )}
          </div>

          {/* Error message */}
          {status === "error" && (
            <div className="flex items-center gap-2 bg-[#FCEBEB] border border-[#F09595] text-[#791F1F] text-[12px] rounded-xl px-4 py-2.5">
              <AlertCircle size={14} className="flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* URL input */}
          <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 bg-white border border-[#D3D1C7] rounded-full px-4 py-2.5">
            <Link size={15} className="text-[#888780] flex-shrink-0" />
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="Enter Image URL"
              disabled={isBusy}
              className="flex-1 text-[13px] text-[#2C2C2A] bg-transparent outline-none placeholder:text-[#B0AEA7] disabled:opacity-60"
            />
          </form>

        </div>
      </div>
    </div>
  );
}