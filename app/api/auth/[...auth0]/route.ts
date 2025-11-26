import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = await auth0.middleware(request);
  
  // After successful login callback, redirect to dashboard
  if (request.nextUrl.pathname === '/api/auth/callback') {
    const session = await auth0.getSession();
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  return await auth0.middleware(request);
} 