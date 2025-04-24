import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/signout
 * Sign out the current user by clearing the auth cookie
 */
export async function POST() {
  try {
    // Clear the auth cookie
    cookies().delete({
      name: "auth_token",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign out" },
      { status: 500 }
    );
  }
}

// Also support GET method for convenience
export async function GET() {
  return POST();
}

