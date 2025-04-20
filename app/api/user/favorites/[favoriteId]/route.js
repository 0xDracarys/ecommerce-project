import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove a favorite
export async function DELETE(
  request,
  { params }: { params: { favoriteId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the favorite to make sure it belongs to the user
    const favorite = await prisma.favorite.findUnique({
      where: {
        id: params.favoriteId,
      },
      include: {
        user: true,
      },
    });

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    // Make sure the favorite belongs to the user
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (favorite.userId !== dbUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the favorite
    await prisma.favorite.delete({
      where: {
        id: params.favoriteId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 