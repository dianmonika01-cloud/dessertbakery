import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

const LOCAL_SESSION_COOKIE = "by_dimo_admin_session";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isProtectedAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") && !isLoginPage;

  // Cek sesi cookie server lokal
  const localSession = request.cookies.get(LOCAL_SESSION_COOKIE)?.value;
  const hasLocalSession = Boolean(
    localSession && localSession.endsWith(":admin")
  );

  let hasSupabaseUser = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient(
        getSupabaseUrl(),
        getSupabasePublishableKey(),
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();
      hasSupabaseUser = Boolean(user);
    } catch {
      // Abaikan jika gagal menghubungi Supabase Auth
    }
  }

  const isAuthenticated = hasLocalSession || hasSupabaseUser;

  if (isProtectedAdminRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
