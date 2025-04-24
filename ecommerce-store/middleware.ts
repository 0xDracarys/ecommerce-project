import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Get JWT secret from environment variables or use a fallback (should be set in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/product",
  "/category",
  "/search",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/session",
];

// Routes that match these patterns don't require authentication
const publicPatterns = [
  /^\/product\/[\w-]+$/,             // Product detail pages
  /^\/category\/[\w-]+$/,            // Category pages
  /^\/api\/products(\/.*)?$/,        // Product APIs
  /^\/api\/categories(\/.*)?$/,      // Category APIs
  /^\/api\/billboards(\/.*)?$/,      // Billboard APIs
  /^\/api\/auth\/reset-password\/.+$/, // Reset password with token
  /\.(jpg|jpeg|png|svg|webp|ico|css|js)$/, // Static assets
];

// Routes that require admin role
const adminRoutes = [
  "/admin",
  "/api/admin",
];

/**
 * Middleware to handle authentication and authorization
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check authentication
  const token = request.cookies.get("auth_token")?.value;

  // If no token, redirect to sign in page
  if (!token) {
    return redirectToSignIn(request);
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Check if route requires admin role
    if (isAdminRoute(pathname) && decoded.role !== "ADMIN") {
      // User is authenticated but not an admin
      return NextResponse.redirect(new URL("/", request.url));
    }

    // User is authenticated and authorized
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    console.error("JWT verification error in middleware:", error);
    
    // Clear the auth cookie by setting a new cookie with max-age=0
    const response = redirectToSignIn(request);
    response.cookies.delete("auth_token");
    
    return response;
  }
}

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  // Check exact match for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check patterns for public routes
  for (const pattern of publicPatterns) {
    if (pattern.test(pathname)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a route requires admin role
 */
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

/**
 * Redirect to sign in page with return URL
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL("/signin", request.url);
  
  // Add the current path as a return URL parameter
  signInUrl.searchParams.set("returnUrl", request.nextUrl.pathname);
  
  return NextResponse.redirect(signInUrl);
}

/**
 * Configure middleware to run on specific paths
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/* (image files)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

