"use client";

export function setClientCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax`;
}

export function clearClientCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function clearClientSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");
  clearClientCookie("app_session");
  clearClientCookie("panel");
  clearClientCookie("auth_access");
}

