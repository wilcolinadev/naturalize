-- Create the users table for the U.S. Citizenship Practice App
-- This table stores user information and tracks their daily question usage

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  daily_question_usage JSONB NOT NULL DEFAULT '{"count": 0, "date": ""}'::jsonb,
  daily_quick_quiz_usage JSONB NOT NULL DEFAULT '{"count": 0, "date": ""}'::jsonb,
  practice_stats JSONB NOT NULL DEFAULT '{
    "full_exams_completed": 0,
    "quick_questions_answered": 0,
    "total_study_time_minutes": 0,
    "average_score": 0,
    "best_score": 0,
    "current_streak": 0,
    "longest_streak": 0,
    "last_practice_date": ""
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on auth0_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);

-- Create index on plan for analytics
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see and modify their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth0_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth0_id = auth.jwt() ->> 'sub');

-- Allow service role to insert users (for our API)
CREATE POLICY "Service role can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Create practice_sessions table for detailed session tracking
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('full_exam', 'quick_quiz')),
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  score_percentage DECIMAL(5,2),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  session_data JSONB, -- Store question IDs, answers, time per question, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_type ON practice_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_completed_at ON practice_sessions(completed_at);

-- Enable RLS for practice_sessions
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for practice_sessions
CREATE POLICY "Users can view own sessions" ON practice_sessions
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert own sessions" ON practice_sessions
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update own sessions" ON practice_sessions
    FOR UPDATE USING (user_id IN (
        SELECT id FROM users WHERE auth0_id = auth.jwt() ->> 'sub'
    ));

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT ALL ON practice_sessions TO authenticated;
GRANT ALL ON practice_sessions TO service_role;

-- Create function to update practice stats automatically
CREATE OR REPLACE FUNCTION update_user_practice_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update stats when session is completed
    IF NEW.completed_at IS NOT NULL AND (OLD.completed_at IS NULL OR OLD.completed_at != NEW.completed_at) THEN
        UPDATE users 
        SET practice_stats = practice_stats || jsonb_build_object(
            'full_exams_completed', 
            CASE 
                WHEN NEW.session_type = 'full_exam' THEN 
                    COALESCE((practice_stats->>'full_exams_completed')::int, 0) + 1
                ELSE 
                    COALESCE((practice_stats->>'full_exams_completed')::int, 0)
            END,
            'quick_questions_answered',
            CASE 
                WHEN NEW.session_type = 'quick_quiz' THEN 
                    COALESCE((practice_stats->>'quick_questions_answered')::int, 0) + NEW.questions_answered
                ELSE 
                    COALESCE((practice_stats->>'quick_questions_answered')::int, 0)
            END,
            'total_study_time_minutes',
            COALESCE((practice_stats->>'total_study_time_minutes')::int, 0) + CEIL(NEW.time_spent_seconds / 60.0),
            'best_score',
            GREATEST(
                COALESCE((practice_stats->>'best_score')::int, 0),
                COALESCE(NEW.score_percentage, 0)
            ),
            'last_practice_date',
            NEW.completed_at::date::text
        ),
        updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic stats updates
DROP TRIGGER IF EXISTS update_practice_stats ON practice_sessions;
CREATE TRIGGER update_practice_stats
    AFTER INSERT OR UPDATE ON practice_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_practice_stats();

-- Update existing users to have default practice_stats if they don't have them
UPDATE users 
SET practice_stats = '{
  "full_exams_completed": 0,
  "quick_questions_answered": 0,
  "total_study_time_minutes": 0,
  "average_score": 0,
  "best_score": 0,
  "current_streak": 0,
  "longest_streak": 0,
  "last_practice_date": ""
}'::jsonb
WHERE practice_stats IS NULL OR practice_stats = '{}'::jsonb;

-- Example of inserting a test user (you can remove this)
-- INSERT INTO users (auth0_id, email, name, plan) 
-- VALUES ('auth0|test123', 'test@example.com', 'Test User', 'free')
-- ON CONFLICT (auth0_id) DO NOTHING; 