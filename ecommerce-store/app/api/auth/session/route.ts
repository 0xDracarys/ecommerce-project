import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get JWT secret from environment variables or use a fallback (should be set in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

/**
 * GET /api/auth/session
 * Check if user is authenticated and return session data
 */
export async function GET() {
  try {
    // Get the auth token from cookies
    const token = cookies().get("auth_token")?.value;

    // If no token, user is not authenticated
    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };

      // Get user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          // Include address count
          addresses: {
            select: {
              id: true,
            },
          },
          // Include favorites count
          favorites: {
            select: {
              id: true,
            },
          },
          // Include basic order summary
          orders: {
            select: {
              id: true,
              isPaid: true,
              isSent: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5, // Only get the 5 most recent orders
          },
        },
      });

      // If user not found in database
      if (!user) {
        // Clear the invalid token
        cookies().delete({
          name: "auth_token",
          path: "/",
        });
        return NextResponse.json({ user: null });
      }

      // Format session data
      const sessionData = {
        user: {
          ...user,
          addressCount: user.addresses.length,
          favoriteCount: user.favorites.length,
          recentOrders: user.orders,
          // Remove arrays since we just want counts
          addresses: undefined,
          favorites: undefined,
        },
        expires: new Date(
          // Add a day to current time (or longer if remembered)
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      return NextResponse.json(sessionData);
    } catch (jwtError) {
      // Token is invalid or expired
      console.error("JWT verification error:", jwtError);
      
      // Clear the invalid token
      cookies().delete({
        name: "auth_token",
        path: "/",
      });
      
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving session" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

