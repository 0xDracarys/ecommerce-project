import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get current user profile
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch user profile from database
    const profile = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // If no profile exists yet, create one
    if (!profile) {
      const newProfile = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || '',
          image: user.user_metadata?.avatar_url || '',
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return NextResponse.json(newProfile);
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, image } = body;

    // Find the user
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user profile
    const updatedProfile = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        phone: phone !== undefined ? phone : existingUser.phone,
        address: address !== undefined ? address : existingUser.address,
        image: image !== undefined ? image : existingUser.image,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 