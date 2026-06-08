// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // نام کوکی سشن در NextAuth معمولاً این است
  // اگر از پروتکل خاصی استفاده می‌کنید، ممکن است به جای "__Secure-authjs.session-token" نیاز باشد "authjs.session-token" را چک کنید
  const sessionToken = 
    req.cookies.get("authjs.session-token")?.value || 
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const { pathname } = req.nextUrl;

  // ۱. اگر توکن ندارد و می‌خواهد به داشبورد برود
  if (!sessionToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // ۲. اگر توکن دارد و در صفحه /auth است
  if (sessionToken && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard/projects", req.url));
  }
  
  // ۳. ریدایرکت از صفحه اصلی به داشبورد
  if (pathname === "/") {
     return NextResponse.redirect(new URL("/dashboard/projects", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
