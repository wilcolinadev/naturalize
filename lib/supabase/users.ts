import { createClient } from './server';

export interface PracticeStats {
  full_exams_completed: number;
  quick_questions_answered: number;
  total_study_time_minutes: number;
  average_score: number;
  best_score: number;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string;
}

export interface SessionData {
  question_ids: number[];
  user_answers: (number | null)[];
  correct_answers: number[];
  time_per_question: number[]; // Time spent on each question in seconds
  question_categories?: string[]; // Optional categorization
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_type: 'full_exam' | 'quick_quiz';
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  score_percentage: number | null;
  time_spent_seconds: number;
  started_at: string;
  completed_at: string | null;
  session_data: SessionData | null;
  created_at: string;
}

export interface SupabaseUser {
  id: string;
  auth0_id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium';
  daily_question_usage: {
    count: number;
    date: string;
  };
  daily_quick_quiz_usage: {
    count: number;
    date: string;
  };
  practice_stats: PracticeStats;
  created_at: string;
  updated_at: string;
}

interface Auth0UserData {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export async function findOrCreateUser(auth0User: Auth0UserData): Promise<SupabaseUser | null> {
  console.log('🔍 findOrCreateUser called with:', {
    sub: auth0User.sub,
    email: auth0User.email,
    name: auth0User.name
  });

  const supabase = await createClient();
  console.log('📊 Supabase client created');
  
  if (!auth0User.sub) {
    console.log('❌ Auth0 user missing sub (subject)');
    throw new Error('Auth0 user missing sub (subject)');
  }

  // First, try to find existing user
  console.log('🔎 Searching for existing user with auth0_id:', auth0User.sub);
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('auth0_id', auth0User.sub)
    .single();

  console.log('🔍 Search result:', {
    found: !!existingUser,
    error: findError?.message,
    errorCode: findError?.code
  });

  if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('💥 Error finding user:', findError);
    throw findError;
  }

  if (existingUser) {
    console.log('✅ Existing user found:', {
      id: existingUser.id,
      email: existingUser.email,
      plan: existingUser.plan,
      created_at: existingUser.created_at
    });
    return existingUser;
  }

  // User doesn't exist, create new one
  console.log('👤 Creating new user...');
  const newUser = {
    auth0_id: auth0User.sub,
    email: auth0User.email || '',
    name: auth0User.name || auth0User.email || 'User',
    plan: 'free' as const,
    daily_question_usage: {
      count: 0,
      date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    },
    daily_quick_quiz_usage: {
      count: 0,
      date: new Date().toISOString().split('T')[0]
    },
    practice_stats: {
      full_exams_completed: 0,
      quick_questions_answered: 0,
      total_study_time_minutes: 0,
      average_score: 0,
      best_score: 0,
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: ''
    },
  };

  console.log('📝 New user data:', newUser);

  const { data: createdUser, error: createError } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (createError) {
    console.error('💥 Error creating user:', createError);
    console.error('💥 Create error details:', {
      message: createError.message,
      code: createError.code,
      details: createError.details,
      hint: createError.hint
    });
    throw createError;
  }

  console.log('✅ Created new user successfully:', {
    id: createdUser.id,
    auth0_id: createdUser.auth0_id,
    email: createdUser.email,
    plan: createdUser.plan
  });
  return createdUser;
}

export async function updateUserDailyUsage(auth0Id: string): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Get current user
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('daily_question_usage')
    .eq('auth0_id', auth0Id)
    .single();

  if (fetchError) {
    console.error('Error fetching user for usage update:', fetchError);
    return false;
  }

  const currentUsage = user.daily_question_usage;
  let newUsage;

  // Reset count if it's a new day
  if (currentUsage.date !== today) {
    newUsage = { count: 1, date: today };
  } else {
    newUsage = { count: currentUsage.count + 1, date: today };
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ daily_question_usage: newUsage })
    .eq('auth0_id', auth0Id);

  if (updateError) {
    console.error('Error updating user usage:', updateError);
    return false;
  }

  return true;
}

export async function getUserDailyUsage(auth0Id: string): Promise<{ count: number; date: string } | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('daily_question_usage')
    .eq('auth0_id', auth0Id)
    .single();

  if (error) {
    console.error('Error fetching user usage:', error);
    return null;
  }

  return user.daily_question_usage;
}

export async function checkDailyLimit(auth0Id: string, plan: string = 'free'): Promise<boolean> {
  const usage = await getUserDailyUsage(auth0Id);
  if (!usage) return false;

  const today = new Date().toISOString().split('T')[0];
  
  // Reset if different day
  if (usage.date !== today) {
    return true; // Can use questions (count resets)
  }

  // Check limits based on plan
  const limits = {
    free: 10,        // Increased from 5 to 10 for free users
    premium: Infinity
  };

  return usage.count < (limits[plan as keyof typeof limits] || limits.free);
}

// Practice Session Tracking Functions

export async function startPracticeSession(
  auth0Id: string, 
  sessionType: 'full_exam' | 'quick_quiz',
  totalQuestions: number
): Promise<string | null> {
  const supabase = await createClient();
  
  // Get user ID from auth0_id
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth0_id', auth0Id)
    .single();

  if (userError || !user) {
    console.error('Error finding user for session start:', userError);
    return null;
  }

  // Create new practice session
  const { data: session, error: sessionError } = await supabase
    .from('practice_sessions')
    .insert([{
      user_id: user.id,
      session_type: sessionType,
      total_questions: totalQuestions,
      started_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating practice session:', sessionError);
    return null;
  }

  return session.id;
}

export async function updatePracticeSession(
  sessionId: string,
  updates: {
    questions_answered?: number;
    correct_answers?: number;
    time_spent_seconds?: number;
    session_data?: SessionData;
  }
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('practice_sessions')
    .update(updates)
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating practice session:', error);
    return false;
  }

  return true;
}

export async function completePracticeSession(
  sessionId: string,
  finalData: {
    questions_answered: number;
    correct_answers: number;
    time_spent_seconds: number;
    session_data: SessionData;
  }
): Promise<boolean> {
  const supabase = await createClient();

  const scorePercentage = finalData.questions_answered > 0 
    ? (finalData.correct_answers / finalData.questions_answered) * 100 
    : 0;

  const { error } = await supabase
    .from('practice_sessions')
    .update({
      ...finalData,
      score_percentage: scorePercentage,
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error completing practice session:', error);
    return false;
  }

  return true;
}

export async function getUserPracticeSessions(
  auth0Id: string, 
  limit: number = 10
): Promise<PracticeSession[]> {
  const supabase = await createClient();
  
  const { data: sessions, error } = await supabase
    .from('practice_sessions')
    .select(`
      *,
      users!inner(auth0_id)
    `)
    .eq('users.auth0_id', auth0Id)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching practice sessions:', error);
    return [];
  }

  return sessions as PracticeSession[];
}

// Quick Quiz Usage Tracking Functions

export async function updateQuickQuizUsage(auth0Id: string): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Get current user
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('daily_quick_quiz_usage')
    .eq('auth0_id', auth0Id)
    .single();

  if (fetchError) {
    console.error('Error fetching user for quick quiz usage update:', fetchError);
    return false;
  }

  const currentUsage = user.daily_quick_quiz_usage || { count: 0, date: today };
  let newUsage;

  // Reset count if it's a new day
  if (currentUsage.date !== today) {
    newUsage = { count: 1, date: today };
  } else {
    newUsage = { count: currentUsage.count + 1, date: today };
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ daily_quick_quiz_usage: newUsage })
    .eq('auth0_id', auth0Id);

  if (updateError) {
    console.error('Error updating quick quiz usage:', updateError);
    return false;
  }

  return true;
}

export async function getQuickQuizUsage(auth0Id: string): Promise<{ count: number; date: string } | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('daily_quick_quiz_usage')
    .eq('auth0_id', auth0Id)
    .single();

  if (error) {
    console.error('Error fetching quick quiz usage:', error);
    return null;
  }

  return user.daily_quick_quiz_usage || { count: 0, date: new Date().toISOString().split('T')[0] };
}

export async function checkQuickQuizLimit(auth0Id: string, plan: string = 'free'): Promise<boolean> {
  const usage = await getQuickQuizUsage(auth0Id);
  if (!usage) return false;

  const today = new Date().toISOString().split('T')[0];
  
  // Reset if different day
  if (usage.date !== today) {
    return true; // Can use quick quiz (count resets)
  }

  // Check limits based on plan
  const limits = {
    free: 1,        // 1 quick quiz per day for free users
    premium: Infinity // Unlimited for premium
  };

  return usage.count < (limits[plan as keyof typeof limits] || limits.free);
} 