// Base URL backend FastAPI Mary
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper untuk ambil token dari localStorage
export function getToken() {
  return localStorage.getItem("mary_access_token");
}

export function setToken(token) {
  localStorage.setItem("mary_access_token", token);
}

export function clearToken() {
  localStorage.removeItem("mary_access_token");
}

// Wrapper fetch dengan Authorization header otomatis
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Jangan set Content-Type kalau body FormData (browser auto-set boundary)
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Sesi habis, silakan login kembali.");
  }

  if (!res.ok) {
    let detail = "Terjadi kesalahan pada server.";
    try {
      const errBody = await res.json();
      detail = errBody.detail || errBody.error || detail;
    } catch {}
    const error = new Error(detail);
    error.status = res.status;
    throw error;
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}