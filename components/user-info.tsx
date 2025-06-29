'use client';

import { useUserContext } from './user-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function UserInfo() {
  const { supabaseUser, loading, error } = useUserContext();

  if (loading) {
    return null; // Loading is handled by UserLoadingWrapper
  }

  if (error) {
    return null; // Error is handled by UserLoadingWrapper
  }

  if (!supabaseUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>No user data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const isToday = supabaseUser.daily_question_usage.date === today;
  const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
  const maxQuestions = supabaseUser.plan === 'premium' ? '∞' : '5';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {supabaseUser.name}!</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Email:</p>
          <p className="text-sm text-gray-600">{supabaseUser.email}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Plan:</p>
          <Badge variant={supabaseUser.plan === 'premium' ? 'default' : 'secondary'}>
            {supabaseUser.plan.charAt(0).toUpperCase() + supabaseUser.plan.slice(1)}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium">Today&apos;s Questions:</p>
          <p className="text-sm text-gray-600">
            {dailyCount} / {maxQuestions} questions used
          </p>
          {supabaseUser.plan === 'free' && dailyCount >= 5 && (
            <p className="text-sm text-red-600 mt-1">
              Daily limit reached. Upgrade to Premium for unlimited questions!
            </p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">Member since:</p>
          <p className="text-sm text-gray-600">
            {new Date(supabaseUser.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 