import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Proxy storage image requests to backend
  if (request.nextUrl.pathname.startsWith("/storage/")) {
    const path = request.nextUrl.pathname; // e.g., /storage/1/doctor8.jpg
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const backendOrigin = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const imageUrl = `${backendOrigin}${path}`;

    console.log(
      `[Middleware] Proxying storage request: ${path} -> ${imageUrl}`
    );

    // Try to fetch from backend
    return fetch(imageUrl, {
      headers: request.headers,
    }).catch(() => {
      // If fails, return 404
      return new NextResponse("Not Found", { status: 404 });
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/storage/:path*"],
};
