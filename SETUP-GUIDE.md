# User Creation Setup Guide

This guide explains how to set up automatic user creation in Supabase when users log in with Auth0.

## Overview

When users log in with Auth0, they are automatically created in your Supabase database with the following information:
- Auth0 ID (unique identifier)
- Email and name
- Free plan by default
- Daily question usage tracking

## Setup Steps

### 1. Supabase Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL script to create the users table and necessary policies

### 2. Environment Variables

Ensure you have these environment variables set in your `.env.local`:

```env
# Auth0
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Auth0 Configuration

Make sure your Auth0 application is configured with:
- **Application Type**: Regular Web Application
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback` (and your production URL)
- **Allowed Logout URLs**: `http://localhost:3000` (and your production URL)

### 4. Supabase RLS Policies

The SQL script creates Row Level Security policies that:
- Allow users to view and update only their own data
- Allow the service role to create new users
- Secure the database from unauthorized access

## How It Works

### User Flow
1. User clicks "Login" and authenticates with Auth0
2. User is redirected to a protected page
3. The `UserProvider` component automatically calls the `/api/user/ensure` endpoint
4. The API checks if the user exists in Supabase
5. If not, creates a new user with Auth0 data
6. User data is made available throughout the app via `useUserContext()`

### Key Components

#### API Route (`app/api/user/ensure/route.ts`)
- Handles GET/POST requests
- Extracts Auth0 user data from session
- Calls `findOrCreateUser()` to ensure user exists in Supabase

#### User Utilities (`lib/supabase/users.ts`)
- `findOrCreateUser()`: Main function to check and create users
- `updateUserDailyUsage()`: Track daily question usage
- `checkDailyLimit()`: Verify if user can ask more questions

#### User Provider (`components/user-provider.tsx`)
- React context that manages user state
- Automatically fetches/creates user on login
- Provides loading states and error handling

#### User Info Component (`components/user-info.tsx`)
- Example component showing how to use user data
- Displays user info, plan status, and daily usage

## Usage in Your Components

### Using the User Context

```tsx
'use client';
import { useUserContext } from '@/components/user-provider';

export function MyComponent() {
  const { supabaseUser, loading, error } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!supabaseUser) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {supabaseUser.name}!</h1>
      <p>Plan: {supabaseUser.plan}</p>
      <p>Daily questions used: {supabaseUser.daily_question_usage.count}</p>
    </div>
  );
}
```

### Checking Daily Limits

```tsx
import { checkDailyLimit } from '@/lib/supabase/users';

// In your quiz component
const canAskQuestion = await checkDailyLimit(user.auth0_id, user.plan);
if (!canAskQuestion) {
  // Show upgrade prompt or daily limit message
}
```

## Database Schema

The `users` table includes:
- `id`: UUID primary key
- `auth0_id`: Unique Auth0 user ID
- `email`: User's email address
- `name`: User's display name
- `plan`: 'free' or 'premium'
- `daily_question_usage`: JSON object with count and date
- `created_at` / `updated_at`: Timestamps

## Security Features

- **Row Level Security**: Users can only access their own data
- **Service Role Access**: API can create users but users can't create other users
- **Auto-timestamps**: Created/updated dates are automatically managed
- **Data Validation**: Plan field is constrained to valid values

## Testing

1. Start your development server: `npm run dev`
2. Go to a protected page and log in with Auth0
3. Check your Supabase database - you should see a new user record
4. The user info should display correctly on the protected page

## Troubleshooting

### Common Issues

1. **"User not created"**: Check Supabase service role key and RLS policies
2. **"Auth0 session not found"**: Verify Auth0 configuration and environment variables
3. **"Permission denied"**: Ensure RLS policies are correctly set up
4. **"Module not found"**: Make sure all imports are correct and packages are installed

### Debug Mode

Add console logs in:
- `/api/user/ensure/route.ts` to see Auth0 session data
- `lib/supabase/users.ts` to see database operations
- `components/user-provider.tsx` to see client-side state

## Production Deployment

1. Update environment variables with production values
2. Update Auth0 callback URLs for your production domain
3. Test the complete flow in production
4. Monitor Supabase logs for any issues

That's it! Your users will now be automatically created in Supabase when they first log in with Auth0. 