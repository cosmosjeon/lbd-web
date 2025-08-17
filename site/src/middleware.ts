import { NextResponse, type NextRequest } from "next/server";

// 간단한 에지 레이트 리밋 스텁: 공개 입력 경로만 헤더 부착
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api/subscribe") || req.nextUrl.pathname === "/subscribe") {
    res.headers.set("x-rate-limit-policy", "10rpm");
  }
  return res;
}

export const config = {
  matcher: ["/subscribe", "/resources", "/info", "/notices", "/admin/:path*", "/api/:path*"],
};


