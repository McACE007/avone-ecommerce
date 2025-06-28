import { NextRequest, NextResponse } from "next/server";
import { API_ROUTES } from "./utils/api.util";
import { jwtVerify } from "jose";

const publicRoutes = ["/auth/register", "/auth/login"];
const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
const userRoutes = ["/home"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (!accessToken) {
    if (publicRoutes.includes(pathname)) return NextResponse.next();
    else return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const { role } = payload as { role: string };

    if (publicRoutes.includes(pathname))
      return NextResponse.redirect(
        new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/home", request.url)
      );
    else if (
      role === "SUPER_ADMIN" &&
      userRoutes.some((route) => pathname.startsWith(route))
    )
      return NextResponse.redirect(new URL("/super-admin", request.url));
    else if (
      role !== "SUPER_ADMIN" &&
      superAdminRoutes.some((route) => pathname.startsWith(route))
    )
      return NextResponse.redirect(new URL("/home", request.url));

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed", error);

    const refreshReponse = await fetch(`${API_ROUTES.AUTH}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshReponse.ok) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const response = NextResponse.next();
    response.cookies.set(
      "accessToken",
      refreshReponse.headers.get("Set-Cookie") || ""
    );
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
