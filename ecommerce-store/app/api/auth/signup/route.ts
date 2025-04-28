import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, password, confirmPassword, phone } = body;

    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "CUSTOMER",
        isVerified: false,
        verificationToken,
      },
    });

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user;

    // TODO: Send verification email
    // For now, we'll consider this a placeholder for email sending logic
    console.log(`Verification token for ${email}: ${verificationToken}`);

    // Return success response
    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Account created successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

