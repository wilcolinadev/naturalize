import { createClient } from './server';

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
    free: 5,
    premium: Infinity
  };

  return usage.count < (limits[plan as keyof typeof limits] || limits.free);
} 