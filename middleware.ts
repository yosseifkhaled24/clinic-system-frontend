import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Proxy storage image requests to backend
  if (request.nextUrl.pathname.startsWith("/storage/")) {
    const path = request.nextUrl.pathname;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const backendOrigin = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const imageUrl = `${backendOrigin}${path}`;

    return fetch(imageUrl, {
      headers: request.headers,
    }).catch(() => {
      return new NextResponse("Not Found", { status: 404 });
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/storage/:path*"],
};
