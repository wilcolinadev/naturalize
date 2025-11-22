-- Add daily_quick_quiz_usage column to users table
-- This column tracks the daily usage of the quick quiz feature

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS daily_quick_quiz_usage JSONB NOT NULL DEFAULT '{"count": 0, "date": ""}'::jsonb;

-- Update existing users to have the default value
UPDATE users 
SET daily_quick_quiz_usage = '{"count": 0, "date": ""}'::jsonb
WHERE daily_quick_quiz_usage IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'daily_quick_quiz_usage';

