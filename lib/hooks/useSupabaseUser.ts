'use client';

import { useState, useEffect, useCallback } from 'react';
import { findOrCreateUser } from '@/lib/supabase/users';
import type { SupabaseUser } from '@/lib/supabase/users';

export function useSupabaseUser() {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      // Get user data from server-side session
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setSupabaseUser(null);
        setLoading(false);
        return;
      }

      // Find or create Supabase user
      const user = await findOrCreateUser(data.user);
      setSupabaseUser(user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { supabaseUser, loading, error, refreshUser: loadUser };
} 