import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const panel = request.cookies.get("panel")?.value;
  const hasSessionCookie = request.cookies.get("app_session")?.value === "1";
  const hasAccessCookie = Boolean(request.cookies.get("auth_access")?.value);
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
    const nextUrl = request.nextUrl.clone();
    if (!isAuthenticated) {
      nextUrl.pathname = "/login";
      return NextResponse.redirect(nextUrl);
    }

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
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/login";
    return NextResponse.redirect(nextUrl);
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
