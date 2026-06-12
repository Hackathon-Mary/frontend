import { useState, useEffect } from "react";
import { Download, Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { apiFetch } from "../services/api";
import { analyzeUpload } from "../services/analyze";
import { generateReport } from "../services/report";
import { buildAnalysisCardData, VERDICT_LABELS } from "../services/formatters";

function getScoreColor(score) {
  if (score >= 70) return "#D32F2F";
  if (score >= 40) return "#E65100";
  return "#2E7D32";
}

function getBarColor(score) {
  if (score >= 70) return "#EF5350";
  if (score >= 40) return "#FFA726";
  return "#66BB6A";
}

function AnalysisCard({ data, onAnalyze, onGenerateReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasAnalysis = data.verdict != null;

  const handleAnalyze = async () => {
    setBusy(true);
    try {
      await onAnalyze(data.id);
    } finally {
      setBusy(false);
    }
  };

  const handleReport = async () => {
    setBusy(true);
    setMenuOpen(false);
    try {
      const report = await onGenerateReport(data.id);
      if (report?.download_url) {
        window.open(report.download_url, "_blank");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[#F6F6F6] rounded-2xl p-4 border border-[#E8E6DF] mb-3">
      {/* Top row */}
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-[80px] h-[80px] rounded-xl bg-[#E8E6DF] flex-shrink-0 overflow-hidden">
          {data.thumbnail
            ? <img src={data.thumbnail} alt={data.filename} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-[#D3D1C7] flex items-center justify-center text-[#888780] text-xs">No img</div>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] text-[#5F5E5A] truncate mb-0.5">{data.filename}</p>
              {hasAnalysis ? (
                <p className="text-[28px] font-bold leading-none" style={{ color: getScoreColor(data.aiScore) }}>
                  {data.aiScore}% <span className="text-[22px]">AI</span>
                </p>
              ) : (
                <p className="text-[14px] text-[#888780] mt-1">Belum dianalisis</p>
              )}
            </div>
            {/* Menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg hover:bg-[#EDEAE2] text-[#888780] transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 bg-white border border-[#E8E6DF] rounded-xl shadow-md z-10 w-[160px] py-1">
                  {!hasAnalysis && (
                    <button
                      onClick={() => { setMenuOpen(false); handleAnalyze(); }}
                      disabled={busy}
                      className="w-full text-left px-3 py-2 text-[13px] text-[#085041] hover:bg-[#F1EFE8] disabled:opacity-50"
                    >
                      {busy ? "Menganalisis..." : "Jalankan analisis"}
                    </button>
                  )}
                  {hasAnalysis && (
                    <button
                      onClick={handleReport}
                      disabled={busy}
                      className="w-full text-left px-3 py-2 text-[13px] text-[#2C2C2A] hover:bg-[#F1EFE8] disabled:opacity-50"
                    >
                      {busy ? "Membuat..." : "Download PDF Report"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasAnalysis && (
            <p className="text-[11px] text-[#5F5E5A] mt-1">{data.verdictLabel}</p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-1 mt-1.5">
            <Download size={12} className="text-[#888780]" />
            <span className="text-[12px] text-[#888780]">{data.fileSize}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock size={12} className="text-[#888780]" />
            <span className="text-[12px] text-[#888780]">{data.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Hash */}
      <div className="mt-2.5 bg-[#EDEAE2] rounded-lg px-3 py-1.5">
        <p className="text-[11px] text-[#888780] font-mono truncate">{data.hash}</p>
      </div>

      {/* Layer bars — hanya tampil kalau sudah dianalisis */}
      {hasAnalysis && (
        <div className="mt-3 flex flex-col gap-2">
          {data.layers.map((layer) => (
            <div key={layer.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] text-[#5F5E5A]">{layer.name}</span>
                <span className="text-[12px] font-medium" style={{ color: getScoreColor(layer.score) }}>
                  {layer.score}%
                </span>
              </div>
              <div className="h-[6px] bg-[#EDEAE2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${layer.score}%`, background: getBarColor(layer.score) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tombol analisis kalau belum ada hasil */}
      {!hasAnalysis && (
        <button
          onClick={handleAnalyze}
          disabled={busy}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#B6E0CD] text-[#085041] text-[13px] font-medium py-2 rounded-lg hover:bg-[#9FE1CB] transition-colors disabled:opacity-50"
        >
          {busy ? <RefreshCw size={14} className="animate-spin" /> : null}
          {busy ? "Menganalisis..." : "Jalankan Analisis AI"}
        </button>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads() {
    setLoading(true);
    setError(null);
    try {
      // Endpoint daftar upload milik user — sesuaikan path kalau backend
      // menyediakan GET /api/v1/upload/ untuk list
      const data = await apiFetch("/api/v1/upload/");
      const list = Array.isArray(data) ? data : data?.items || [];

      const mapped = list.map((upload) =>
        buildAnalysisCardData(upload, upload.analysis || null)
      );
      setItems(mapped);
    } catch (err) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze(uploadId) {
    try {
      const result = await analyzeUpload(uploadId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === uploadId
            ? buildAnalysisCardData(
                { ...item, upload_id: item.id, sha256_hash: item.hash.replace("SHA-256: ", ""), original_filename: item.filename, file_size_bytes: null, uploaded_at: null },
                result
              )
            : item
        )
      );
      // Reload supaya data fresh dari backend (lebih aman)
      loadUploads();
    } catch (err) {
      setError(err.message || "Analisis gagal.");
    }
  }

  async function handleGenerateReport(uploadId) {
    try {
      return await generateReport(uploadId);
    } catch (err) {
      setError(err.message || "Gagal membuat report.");
      return null;
    }
  }

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5">
      <div className="max-w-[500px] mx-auto">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#B6E0CD] border-t-[#085041] rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-[#FCEBEB] border border-[#F09595] text-[#791F1F] text-[13px] rounded-xl px-4 py-3 mb-3">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[13px] text-[#888780]">Belum ada upload. Mulai dari halaman New Chat.</p>
          </div>
        )}

        {!loading && items.map((item) => (
          <AnalysisCard
            key={item.id}
            data={item}
            onAnalyze={handleAnalyze}
            onGenerateReport={handleGenerateReport}
          />
        ))}
      </div>
    </div>
  );
}