import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isPublicRoute = 
        req.nextUrl.pathname === "/login" || 
        req.nextUrl.pathname === "/signup" || 
        req.nextUrl.pathname === "/" ||
        req.nextUrl.pathname.startsWith("/api/auth");

    // If user is not authenticated and trying to access a protected route
    if (!req.auth && !isPublicRoute) {
        const newUrl = new URL("/login", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
    return NextResponse.next();
});

export const config = {
    // Exclude static files, public routes, and auth API endpoints
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup|$).*)"],
};
