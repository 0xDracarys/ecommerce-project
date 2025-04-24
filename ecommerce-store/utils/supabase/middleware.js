import { NextResponse } from 'next/server';

// Simple middleware that doesn't require @supabase/ssr
export async function updateSession(request) {
  return NextResponse.next();
}

export const middleware = async (request) => {
  return NextResponse.next();
} 