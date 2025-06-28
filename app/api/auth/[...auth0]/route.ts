import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  return await auth0.middleware(request);
}

export async function POST(request: NextRequest) {
  return await auth0.middleware(request);
} 