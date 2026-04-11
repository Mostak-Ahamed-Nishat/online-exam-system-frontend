import { NextResponse } from "next/server";

function decodeJwtPayload(token) {
  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) {
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch (_error) {
    return null;
  }
}

function hasValidAccessToken(token) {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  return payload.exp * 1000 > Date.now();
}

function redirectToLoginWithCookieCleanup(request) {
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = "/login";
  const response = NextResponse.redirect(nextUrl);
  response.cookies.delete("auth_access");
  response.cookies.delete("app_session");
  response.cookies.delete("panel");
  return response;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const panel = request.cookies.get("panel")?.value;
  const hasSessionCookie = request.cookies.get("app_session")?.value === "1";
  const accessToken = request.cookies.get("auth_access")?.value;
  const hasAccessCookie = hasValidAccessToken(accessToken);
  const hasValidPanel = panel === "admin" || panel === "student";
  const isAuthenticated = hasSessionCookie && hasAccessCookie && hasValidPanel;
  const dashboardPath = panel === "student" ? "/student/dashboard" : "/admin/dashboard";

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isLegacyEmployerRoute = pathname.startsWith("/employer");
  const isLegacyCandidateRoute = pathname.startsWith("/candidate");

  // Legacy route migration support.
  if (isLegacyEmployerRoute || isLegacyCandidateRoute) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = isLegacyEmployerRoute
      ? pathname.replace("/employer", "/admin")
      : pathname.replace("/candidate", "/student");
    return NextResponse.redirect(nextUrl);
  }

  // Always start at a login screen when not logged in.
  if (pathname === "/") {
    if (!isAuthenticated) {
      return redirectToLoginWithCookieCleanup(request);
    }

    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = dashboardPath;
    return NextResponse.redirect(nextUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = dashboardPath;
    return NextResponse.redirect(nextUrl);
  }

  // Guard admin/student panels.
  if (!isAuthenticated && (isAdminRoute || isStudentRoute) && !isAuthRoute) {
    return redirectToLoginWithCookieCleanup(request);
  }

  // Protect panel boundaries after login.
  if (isAuthenticated && isAdminRoute && panel !== "admin") {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/student/dashboard";
    return NextResponse.redirect(nextUrl);
  }

  if (isAuthenticated && isStudentRoute && panel !== "student") {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/admin/:path*",
    "/student/:path*",
    "/employer/:path*",
    "/candidate/:path*",
  ],
};
