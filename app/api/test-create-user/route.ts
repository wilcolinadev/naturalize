import { NextResponse } from 'next/server';
import { findOrCreateUser } from '@/lib/supabase/users';

export async function GET() {
  try {
    console.log('🧪 Testing user creation...');
    
    // Mock Auth0 user data
    const mockAuth0User = {
      sub: 'auth0|test-user-' + Date.now(),
      email: 'test@naturalizeus.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    };

    console.log('📝 Creating user with data:', mockAuth0User);

    // Try to create/find user
    const user = await findOrCreateUser(mockAuth0User);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create user - returned null'
      }, { status: 500 });
    }

    console.log('✅ User created successfully:', user.id);

    return NextResponse.json({
      success: true,
      message: 'User created successfully! 🎉',
      data: {
        user: {
          id: user.id,
          auth0_id: user.auth0_id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          created_at: user.created_at,
          practice_stats: user.practice_stats,
          daily_question_usage: user.daily_question_usage,
          daily_quick_quiz_usage: user.daily_quick_quiz_usage
        }
      }
    });

  } catch (error: any) {
    console.error('💥 Error creating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

