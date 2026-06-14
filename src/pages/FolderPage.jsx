import { useState, useEffect } from "react";
import { FileText, Download, Mail, Clock, FolderOpen, ShieldAlert } from "lucide-react";
import { listReports, getReport } from "../services/report";
import { formatTimestamp } from "../services/formatters";
import ReportSubmissionPage from "./ReportSubmissionPage";

const VERDICT_BADGE = {
  ai_generated: { label: "Terindikasi Kuat AI", bg: "#FCEBEB", text: "#791F1F" },
  likely_ai: { label: "Kemungkinan Besar AI", bg: "#FAEEDA", text: "#854F0B" },
  inconclusive: { label: "Tidak Dapat Ditentukan", bg: "#F1EFE8", text: "#5F5E5A" },
  likely_authentic: { label: "Kemungkinan Asli", bg: "#E1F5EE", text: "#085041" },
  authentic: { label: "Asli", bg: "#E1F5EE", text: "#085041" },
  degraded_signal: { label: "Sinyal Tidak Memadai", bg: "#FAEEDA", text: "#854F0B" },
};

function ReportCard({ item, onPrepareSubmission }) {
  const [busy, setBusy] = useState(false);
  const badge = VERDICT_BADGE[item.verdict] || VERDICT_BADGE.inconclusive;
  const isDegraded = item.verdict === "degraded_signal";

  async function handleAction(action) {
    setBusy(true);
    try {
      const report = await getReport(item.report_token);

      if (action === "pdf" && report?.download_url) {
        window.open(report.download_url, "_blank");
      }
      if (action === "letter" && report?.letter_template_url) {
        window.open(report.letter_template_url, "_blank");
      }
      if (action === "share" && report?.download_url) {
        await navigator.clipboard.writeText(report.download_url);
      }
      if (action === "submission") {
        onPrepareSubmission(report, {
          filename: item.original_filename,
          hash: `SHA-256: ${item.sha256_hash || "-"}`,
          timestamp: item.generated_at,
          verdict: item.verdict,
          verdictLabel: badge.label,
          aiScore: Math.round((item.total_confidence_score || 0) * 100),
          isDegraded,
          explanation: "",
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-[#F6F6F6] rounded-2xl p-4 border border-[#E8E6DF] mb-3">
      <div className="flex gap-3">
        <div className="w-[56px] h-[56px] rounded-xl bg-[#E8E6DF] flex-shrink-0 overflow-hidden flex items-center justify-center">
          {item.thumbnail_url
            ? <img src={item.thumbnail_url} alt={item.original_filename} className="w-full h-full object-cover" />
            : <FileText size={20} className="text-[#888780]" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[#2C2C2A] truncate">{item.original_filename}</p>

          {isDegraded ? (
            <div className="flex items-center gap-1 mt-1">
              <ShieldAlert size={12} className="text-[#854F0B]" />
              <span className="text-[11px] font-medium text-[#854F0B]">{badge.label}</span>
            </div>
          ) : (
            <span
              className="inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium mt-1"
              style={{ background: badge.bg, color: badge.text }}
            >
              {badge.label} · {Math.round((item.total_confidence_score || 0) * 100)}%
            </span>
          )}

          <div className="flex items-center gap-1 mt-1.5">
            <Clock size={11} className="text-[#888780]" />
            <span className="text-[11px] text-[#888780]">{formatTimestamp(item.generated_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        <button
          onClick={() => handleAction("pdf")}
          disabled={busy}
          className="flex flex-col items-center gap-1 bg-white border border-[#D3D1C7] rounded-lg py-2 text-[#2C2C2A] hover:border-[#5DCAA5] transition-colors disabled:opacity-50"
        >
          <Download size={15} />
          <span className="text-[11px]">PDF</span>
        </button>

        <button
          onClick={() => handleAction("share")}
          disabled={busy}
          className="flex flex-col items-center gap-1 bg-white border border-[#D3D1C7] rounded-lg py-2 text-[#2C2C2A] hover:border-[#5DCAA5] transition-colors disabled:opacity-50"
        >
          <FolderOpen size={15} />
          <span className="text-[11px]">Salin Link</span>
        </button>

        <button
          onClick={() => handleAction("letter")}
          disabled={busy || !item.has_letter_template}
          className="flex flex-col items-center gap-1 bg-white border border-[#D3D1C7] rounded-lg py-2 text-[#2C2C2A] hover:border-[#5DCAA5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail size={15} />
          <span className="text-[11px]">Surat</span>
        </button>

        <button
          onClick={() => handleAction("submission")}
          disabled={busy || isDegraded}
          className="flex flex-col items-center gap-1 bg-[#B6E0CD] border border-[#B6E0CD] rounded-lg py-2 text-[#085041] hover:bg-[#9FE1CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldAlert size={15} />
          <span className="text-[11px]">Lapor</span>
        </button>
      </div>
    </div>
  );
}

export default function FolderPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionView, setSubmissionView] = useState(null); // { report, cardData } | null

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReports();
      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReports();
  }, []);

  if (submissionView) {
    return (
      <ReportSubmissionPage
        report={submissionView.report}
        cardData={submissionView.cardData}
        onBack={() => setSubmissionView(null)}
      />
    );
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
            <FolderOpen size={32} className="text-[#D3D1C7] mx-auto mb-2" />
            <p className="text-[13px] text-[#888780]">Belum ada laporan tersimpan.</p>
            <p className="text-[12px] text-[#B0AEA7] mt-1">
              Jalankan analisis lalu generate report di halaman Analytics.
            </p>
          </div>
        )}

        {!loading && items.map((item) => (
          <ReportCard
            key={item.report_id}
            item={item}
            onPrepareSubmission={(report, cardData) => setSubmissionView({ report, cardData })}
          />
        ))}
      </div>
    </div>
  );
}