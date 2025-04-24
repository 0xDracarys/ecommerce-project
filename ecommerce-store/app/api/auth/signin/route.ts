import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get JWT secret from environment variables or use a fallback (should be set in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

/**
 * POST /api/auth/signin
 * Authenticate a user and create a session
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: "Account requires password reset" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          error: "Please verify your email before signing in",
          needsVerification: true
        },
        { status: 403 }
      );
    }

    // Create session token (JWT)
    const tokenExpiration = rememberMe ? '30d' : '1d';
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      }, 
      JWT_SECRET,
      { expiresIn: tokenExpiration }
    );

    // Set expiration time for cookie
    const cookieExpiration = rememberMe 
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000;     // 1 day
    
    // Set session cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieExpiration,
      sameSite: 'strict'
    });

    // Remove sensitive data from response
    const { password: _, verificationToken: __, resetToken: ___, resetTokenExpiry: ____, ...userWithoutSensitiveInfo } = user;

    // Return success response with user data
    return NextResponse.json({
      user: userWithoutSensitiveInfo,
      message: "Authentication successful"
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "An error occurred during authentication" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

