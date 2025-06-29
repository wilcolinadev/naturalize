-- Create the users table for the U.S. Citizenship Practice App
-- This table stores user information and tracks their daily question usage

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  daily_question_usage JSONB NOT NULL DEFAULT '{"count": 0, "date": ""}'::jsonb,
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

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Example of inserting a test user (you can remove this)
-- INSERT INTO users (auth0_id, email, name, plan) 
-- VALUES ('auth0|test123', 'test@example.com', 'Test User', 'free')
-- ON CONFLICT (auth0_id) DO NOTHING; 