import { apiFetch } from "./api";

/**
 * Jalankan analisis AI detection untuk upload tertentu.
 * Backend: POST /api/v1/analyze/
 * Body: { upload_id }
 * Return: AnalysisResponse {
 *   upload_id, analysis_id, total_confidence_score, verdict, confidence,
 *   layers: { npr_signal: LayerScore, metadata_anomaly: LayerScore },
 *   explanation, analyzed_at
 * }
 */
export async function analyzeUpload(uploadId) {
  return apiFetch("/api/v1/analyze/", {
    method: "POST",
    body: JSON.stringify({ upload_id: uploadId }),
  });
}