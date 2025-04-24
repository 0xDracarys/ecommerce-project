import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/api/:path*",
    "/api/[storeId]/:path*",
    "/api/stores/:path*",
    "/api/products",
    "/api/categories",
    "/api/billboards",
    "/api/colors",
    "/api/sizes",
    "/api/webhook"
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
