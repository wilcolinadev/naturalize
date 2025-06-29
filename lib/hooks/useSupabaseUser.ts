import { useUser } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';
import { SupabaseUser } from '../supabase/users';

interface UseSupabaseUserReturn {
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseUser(): UseSupabaseUserReturn {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 useSupabaseUser effect triggered:', {
      auth0Loading,
      hasAuth0User: !!auth0User,
      auth0User: auth0User ? { 
        sub: auth0User.sub, 
        email: auth0User.email, 
        name: auth0User.name 
      } : null
    });

    if (auth0Loading) {
      console.log('⏳ Auth0 still loading, waiting...');
      return; // Wait for Auth0 to finish loading
    }

    if (!auth0User) {
      console.log('👤 No Auth0 user found, setting states to null');
      setLoading(false);
      setSupabaseUser(null);
      return;
    }

    console.log('🚀 Auth0 user found, ensuring Supabase user exists...');
    
    // User is authenticated, ensure they exist in Supabase
    const ensureUserExists = async () => {
      try {
        console.log('📞 Starting API call to /api/user/ensure');
        setLoading(true);
        setError(null);

        // Create query parameters with Auth0 user data
        const params = new URLSearchParams({
          sub: auth0User.sub,
          ...(auth0User.email && { email: auth0User.email }),
          ...(auth0User.name && { name: auth0User.name }),
          ...(auth0User.picture && { picture: auth0User.picture }),
        });

        const response = await fetch(`/api/user/ensure?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 API response received:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('❌ API error response:', errorData);
          throw new Error(errorData.error || 'Failed to ensure user exists');
        }

        const data = await response.json();
        console.log('✅ API success response:', {
          success: data.success,
          hasUser: !!data.user,
          userId: data.user?.id
        });
        
        setSupabaseUser(data.user);
      } catch (err) {
        console.error('💥 Error ensuring user exists:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
        console.log('🏁 API call completed');
      }
    };

    ensureUserExists();
  }, [auth0User, auth0Loading]);

  return {
    supabaseUser,
    loading: loading || auth0Loading,
    error,
  };
} 