import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_SUPABASE_URL is not set in environment variables'
      }, { status: 500 });
    }
    
    if (!supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is set'
      }, { status: 500 });
    }

    console.log('✅ Environment variables found');
    console.log('📍 Supabase URL:', supabaseUrl);
    console.log('🔑 Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON');

    // Create Supabase client
    const supabase = await createClient();
    console.log('✅ Supabase client created');

    // Test 1: Fetch all users
    console.log('📊 Fetching users...');
    const { data: users, error: usersError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch users',
        details: usersError.message,
        hint: usersError.hint,
        code: usersError.code
      }, { status: 500 });
    }

    console.log(`✅ Successfully fetched ${users?.length || 0} users`);

    // Test 2: Fetch practice sessions
    console.log('📊 Fetching practice sessions...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('practice_sessions')
      .select('*')
      .limit(10);

    if (sessionsError) {
      console.error('⚠️ Warning fetching sessions:', sessionsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful! 🎉',
      data: {
        environment: {
          supabaseUrl,
          keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'
        },
        users: {
          count: count || users?.length || 0,
          data: users?.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            plan: u.plan,
            auth0_id: u.auth0_id,
            created_at: u.created_at,
            practice_stats: u.practice_stats
          }))
        },
        practice_sessions: {
          count: sessions?.length || 0,
          sample: sessions?.slice(0, 3)
        }
      }
    });

  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

