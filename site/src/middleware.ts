import { NextResponse } from "next/server";

// Basic rate limit placeholder for public endpoints (to be replaced by proper impl later)
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/subscribe", "/api/:path*"],
};


