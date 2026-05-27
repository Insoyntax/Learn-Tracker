import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // If user is not authenticated and trying to access a protected route
    if (!req.auth && req.nextUrl.pathname !== "/login" && !req.nextUrl.pathname.startsWith("/api/auth")) {
        const newUrl = new URL("/login", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
    return NextResponse.next();
});

export const config = {
    // Exclude static files, public routes, and auth API endpoints
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login|$).*)"],
};
