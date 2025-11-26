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
          <p className="text-sm font-medium">Member since:</p>
          <p className="text-sm text-gray-600">
            {new Date(supabaseUser.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 