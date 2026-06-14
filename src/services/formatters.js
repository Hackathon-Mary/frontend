/**
 * Helper untuk mengubah response backend mentah jadi format
 * yang lebih mudah dipakai komponen UI.
 */

/** Verdict enum backend -> label bahasa Indonesia untuk UI */
export const VERDICT_LABELS = {
  ai_generated: "Terindikasi Kuat AI",
  likely_ai: "Kemungkinan Besar AI",
  inconclusive: "Tidak Dapat Ditentukan",
  likely_authentic: "Kemungkinan Asli",
  authentic: "Asli",
  degraded_signal: "Sinyal Tidak Memadai",
};

/** Ubah score 0.0–1.0 jadi persen integer. null -> 0 */
export function toPercent(score) {
  if (score === null || score === undefined) return 0;
  return Math.round(score * 100);
}

/** Format ukuran file bytes -> "2.4 MB" */
export function formatFileSize(bytes) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format ISO datetime -> "16 Mei 2026, 14:32 WIB" */
export function formatTimestamp(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const formatted = date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatted} WIB`;
}

/**
 * Gabungkan UploadResponse + AnalysisResponse jadi satu object
 * untuk dipakai langsung oleh AnalysisCard di AnalyticsPage.
 */
export function buildAnalysisCardData(upload, analysis) {
  const layers = analysis?.layers || {};
  const nprScore = layers.npr_signal?.score ?? 0;
  const metadataScore = layers.metadata_anomaly?.score ?? 0;
  const vllm = layers.vllm_analysis;

  const layerList = [
    { name: "NPR Signal", score: toPercent(nprScore) },
    { name: "Metadata Anomaly", score: toPercent(metadataScore) },
  ];

  // Tambahkan layer VLLM hanya jika backend mengembalikannya
  if (vllm) {
    layerList.push({ name: "VLLM Analysis", score: toPercent(vllm.score) });
  }

  const isDegraded = analysis?.verdict === "degraded_signal";

  return {
    id: upload.upload_id,
    filename: upload.original_filename,
    aiScore: toPercent(analysis?.total_confidence_score),
    verdict: analysis?.verdict,
    verdictLabel: VERDICT_LABELS[analysis?.verdict] || "Belum dianalisis",
    isDegraded,
    fileSize: formatFileSize(upload.file_size_bytes),
    timestamp: formatTimestamp(upload.uploaded_at),
    hash: `SHA-256: ${upload.sha256_hash}`,
    thumbnail: upload.thumbnail_url || null,
    layers: layerList,
    explanation: analysis?.explanation || "",
    analysisId: analysis?.analysis_id,
    reportToken: null,
  };
}

/**
 * Bangun draft kronologi siap-paste untuk form Patroli Siber / Dumas Presisi,
 * berdasarkan hasil analisis Mary.
 */
export function buildIncidentNarrative(cardData) {
  const { filename, timestamp, hash, verdictLabel, explanation, aiScore, isDegraded } = cardData;

  const scoreLine = isDegraded
    ? "Sistem tidak dapat memberikan skor pasti karena kualitas gambar terdegradasi (kompresi tinggi)."
    : `Tingkat keyakinan sistem terhadap konten buatan AI: ${aiScore}% (${verdictLabel}).`;

  return [
    `Pada ${timestamp}, saya menerima/menemukan konten visual berupa file "${filename}" yang diduga merupakan hasil rekayasa kecerdasan buatan (AI-generated image) dan digunakan untuk mengancam/mencemarkan nama baik saya.`,
    "",
    `Konten tersebut telah diverifikasi menggunakan sistem Mary (deteksi deepfake berbasis AI Vision). ${scoreLine}`,
    explanation ? `Penjelasan teknis sistem: ${explanation}` : "",
    "",
    `Bukti hash integritas file (${hash}) dan laporan forensik lengkap terlampir sebagai bukti pendukung.`,
  ].filter(Boolean).join("\n");
}

/** Saran kategori kasus untuk dropdown "Jenis Kasus" di Patroli Siber */
export function suggestCaseCategory(verdict) {
  const mapping = {
    ai_generated: "Pemalsuan Identitas / Konten Asusila (Deepfake)",
    likely_ai: "Pemalsuan Identitas / Konten Asusila (Diduga Deepfake)",
    inconclusive: "Pemerasan / Ancaman Online",
    likely_authentic: "Pemerasan / Ancaman Online",
    authentic: "Pemerasan / Ancaman Online",
    degraded_signal: "Pemerasan / Ancaman Online (Verifikasi Lanjutan Diperlukan)",
  };
  return mapping[verdict] || "Kejahatan Siber Lainnya";
}