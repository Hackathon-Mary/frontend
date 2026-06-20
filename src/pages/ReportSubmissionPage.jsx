import { useState } from "react";
import { Copy, Check, ExternalLink, FileText, AlertCircle } from "lucide-react";
import { buildIncidentNarrative, suggestCaseCategory } from "../services/formatters";

const PASAL_RINGKAS = "UU ITE Ps. 27 ayat (1) tentang distribusi konten asusila tanpa izin, Ps. 35 tentang pemalsuan konten digital, Ps. 27 ayat (3) tentang pencemaran nama baik.";

function CopyField({ label, value, multiline = false }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-white rounded-xl border border-[#D3D1C7] p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-medium text-[#5F5E5A] uppercase tracking-wide">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-[#085041] hover:text-[#5DCAA5] transition-colors flex-shrink-0"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Disalin" : "Salin"}
        </button>
      </div>
      <p className={`text-[13px] text-[#2C2C2A] ${multiline ? "whitespace-pre-line leading-relaxed" : "truncate"}`}>
        {value}
      </p>
    </div>
  );
}

export default function ReportSubmissionPage({ report, cardData, onBack }) {
  if (!report || !cardData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <p className="text-[13px] text-[#888780]">Data laporan tidak ditemukan.</p>
      </div>
    );
  }

  const narrative = buildIncidentNarrative(cardData);
  const caseCategory = suggestCaseCategory(cardData.verdict);

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-5">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">

        {/* Breadcrumb */}
        {onBack && (
          <div className="flex items-center gap-2 text-[12px]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[13px] text-[#5F5E5A] hover:text-[#085041] transition-colors"
            >
              ← Kembali
            </button>
            <span className="text-[#D3D1C7]">/</span>
            <span className="text-[#085041] font-medium">Siapkan Laporan</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF]">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className="text-[#5F5E5A]" />
            <span className="text-[13px] font-medium text-[#2C2C2A]">Siapkan laporan resmi</span>
          </div>
          <p className="text-[12px] text-[#5F5E5A] leading-relaxed">
            Salin informasi di bawah untuk diisi ke formulir{" "}
            <span className="font-medium text-[#085041]">Patroli Siber</span> atau{" "}
            <span className="font-medium text-[#085041]">Dumas Presisi Polri</span>.
            Mary tidak mengisi data pribadimu (nama, NIK, kontak) — isi langsung di formulir resmi.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#FAEEDA] border border-[#F5D89E] rounded-xl px-4 py-3 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-[#854F0B] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#633806] leading-relaxed">
            Dokumen ini adalah bukti pendukung laporan awal, bukan pengganti keterangan ahli forensik
            digital tersertifikasi. Konsultasikan dengan pengacara/lembaga bantuan hukum untuk proses lanjutan.
          </p>
        </div>

        {/* Field siap salin */}
        <div className="flex flex-col gap-3">
          <CopyField label="Jenis kasus (saran)" value={caseCategory} />
          <CopyField label="Pasal yang relevan" value={PASAL_RINGKAS} multiline />
          <CopyField label="Kronologi kejadian (draft)" value={narrative} multiline />
          <CopyField label="Hash integritas file" value={cardData.hash} />
          {report.download_url && (
            <CopyField label="Link laporan forensik (PDF)" value={report.download_url} />
          )}
        </div>

        {/* Tombol ke portal resmi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://patrolisiber.id/submit-report/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#5DCAA5] text-[#085041] text-[13px] font-medium py-3 rounded-xl hover:bg-[#B6E0CD] transition-colors"
          >
            Buka Patroli Siber
            <ExternalLink size={14} />
          </a>
          <a
            href="https://dumas.presisi.polri.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border border-[#5DCAA5] text-[#085041] text-[13px] font-medium py-3 rounded-xl hover:bg-[#E1F5EE] transition-colors"
          >
            Buka Dumas Presisi
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Langkah selanjutnya */}
        <div className="bg-[#E1F5EE] rounded-2xl p-5 border border-[#B6E0CD]">
          <p className="text-[13px] font-medium text-[#085041] mb-2">Langkah pengisian</p>
          <ol className="text-[12px] text-[#5F5E5A] leading-relaxed list-decimal list-inside flex flex-col gap-1">
            <li>Klik salah satu tombol portal di atas untuk membuka formulir resmi di tab baru.</li>
            <li>Isi data dirimu (nama, email, domisili, kontak) langsung di formulir tersebut.</li>
            <li>Pada kolom jenis kasus, kronologi, dan pasal — gunakan tombol "Salin" untuk menempelkan draft dari Mary.</li>
            <li>Pada kolom bukti/lampiran, unggah file PDF laporan forensik yang sudah kamu download, atau tempel link-nya.</li>
            <li>Periksa kembali seluruh isian sebelum mengirim laporan.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}