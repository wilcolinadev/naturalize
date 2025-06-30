-- Add practice_stats column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS practice_stats JSONB NOT NULL DEFAULT '{
  "full_exams_completed": 0,
  "quick_questions_answered": 0,
  "total_study_time_minutes": 0,
  "average_score": 0,
  "best_score": 0,
  "current_streak": 0,
  "longest_streak": 0,
  "last_practice_date": ""
}'::jsonb;

-- Add daily_quick_quiz_usage column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_quick_quiz_usage JSONB NOT NULL DEFAULT '{"count": 0, "date": ""}'::jsonb;

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

-- Grant permissions
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