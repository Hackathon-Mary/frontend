import { BASE_URL, apiFetch, setToken, clearToken } from "./api";

/*
 * Redirect user ke halaman login Google.
 * Backend akan handle OAuth flow lalu redirect balik ke
 */
export function loginWithGoogle() {
  window.location.href = `${BASE_URL}/auth/google/login`;
}

/*
 * Dipanggil dari halaman /auth/callback setelah Google redirect balik.
 * Ambil access_token dari query string dan simpan ke localStorage.
 */
export function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");
  const expiresIn = params.get("expires_in");

  if (!accessToken) {
    return { success: false, error: "Token tidak ditemukan." };
  }

  setToken(accessToken);

  if (expiresIn) {
    const expiresAt = Date.now() + parseInt(expiresIn, 10) * 1000;
    localStorage.setItem("mary_token_expires_at", expiresAt.toString());
  }

  return { success: true };
}

/* Ambil data user yang sedang login (GET /auth/me) */
export async function getCurrentUser() {
  return apiFetch("/auth/me");
}

/* Logout — hapus token lokal */
export function logout() {
  clearToken();
  localStorage.removeItem("mary_token_expires_at");
  window.location.href = "/";
}

/* Cek apakah user sudah */
export function isAuthenticated() {
  return !!localStorage.getItem("mary_access_token");
}