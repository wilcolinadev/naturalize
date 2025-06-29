import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUser } from '@/lib/supabase/users';

export async function POST(request: NextRequest) {
  console.log('🔥 API /user/ensure POST called');
  
  try {
    // Get Auth0 user data from request body
    console.log('📋 Getting Auth0 user data from request...');
    const { auth0User } = await request.json();
    
    if (!auth0User || !auth0User.sub) {
      console.log('❌ No Auth0 user data provided');
      return NextResponse.json(
        { error: 'Auth0 user data required' },
        { status: 400 }
      );
    }

    console.log('✅ Auth0 user data received:', {
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      hasAllData: !!(auth0User.sub && auth0User.email)
    });
    
    // Ensure user exists in Supabase
    console.log('🔍 Checking/creating user in Supabase...');
    const supabaseUser = await findOrCreateUser({
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture
    });

    if (!supabaseUser) {
      console.log('❌ Failed to create or fetch user from Supabase');
      return NextResponse.json(
        { error: 'Failed to create or fetch user' },
        { status: 500 }
      );
    }

    console.log('✅ User operation successful:', {
      id: supabaseUser.id,
      auth0_id: supabaseUser.auth0_id,
      email: supabaseUser.email,
      plan: supabaseUser.plan
    });

    return NextResponse.json({
      success: true,
      user: supabaseUser
    });

  } catch (error) {
    console.error('💥 Error ensuring user exists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('🔥 API /user/ensure GET called');
  
  try {
    // Get Auth0 user data from query parameters
    console.log('📋 Getting Auth0 user data from query...');
    const { searchParams } = new URL(request.url);
    const sub = searchParams.get('sub');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const picture = searchParams.get('picture');
    
    if (!sub) {
      console.log('❌ No Auth0 user sub provided');
      return NextResponse.json(
        { error: 'Auth0 user sub required' },
        { status: 400 }
      );
    }

    const auth0User = { 
      sub, 
      email: email || undefined, 
      name: name || undefined,
      picture: picture || undefined
    };
    console.log('✅ Auth0 user data received:', {
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      hasAllData: !!(auth0User.sub && auth0User.email)
    });
    
    // Ensure user exists in Supabase
    console.log('🔍 Checking/creating user in Supabase...');
    const supabaseUser = await findOrCreateUser({
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture
    });

    if (!supabaseUser) {
      console.log('❌ Failed to create or fetch user from Supabase');
      return NextResponse.json(
        { error: 'Failed to create or fetch user' },
        { status: 500 }
      );
    }

    console.log('✅ User operation successful:', {
      id: supabaseUser.id,
      auth0_id: supabaseUser.auth0_id,
      email: supabaseUser.email,
      plan: supabaseUser.plan
    });

    return NextResponse.json({
      success: true,
      user: supabaseUser
    });

  } catch (error) {
    console.error('💥 Error ensuring user exists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 