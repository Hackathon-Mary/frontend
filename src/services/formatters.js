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
};

/** Ubah score 0.0–1.0 jadi persen integer */
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

  return {
    id: upload.upload_id,
    filename: upload.original_filename,
    aiScore: toPercent(analysis?.total_confidence_score),
    verdict: analysis?.verdict,
    verdictLabel: VERDICT_LABELS[analysis?.verdict] || "Belum dianalisis",
    fileSize: formatFileSize(upload.file_size_bytes),
    timestamp: formatTimestamp(upload.uploaded_at),
    hash: `SHA-256: ${upload.sha256_hash}`,
    thumbnail: upload.thumbnail_url || null,
    layers: [
      { name: "NPR Signal", score: toPercent(nprScore) },
      { name: "Metadata Anomaly", score: toPercent(metadataScore) },
    ],
    analysisId: analysis?.analysis_id,
    reportToken: null,
  };
}