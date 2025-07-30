import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json(
      { error: 'Failed to get user session' },
      { status: 500 }
    );
  }
} 