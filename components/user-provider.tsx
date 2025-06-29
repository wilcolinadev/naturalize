'use client';

import { useSupabaseUser } from '@/lib/hooks/useSupabaseUser';
import { useUser } from '@auth0/nextjs-auth0';
import { createContext, useContext, ReactNode } from 'react';
import { SupabaseUser } from '@/lib/supabase/users';

interface UserContextType {
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  error: string | null;
  auth0User: any | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: auth0User } = useUser();
  
  const { supabaseUser, loading, error } = useSupabaseUser();

  console.log('🔄 UserProvider render:', {
    hasAuth0User: !!auth0User,
    hasSupabaseUser: !!supabaseUser,
    loading,
    error
  });

  const value = {
    supabaseUser,
    loading,
    error,
    auth0User,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

// Loading component for when user is being created/fetched
export function UserLoadingWrapper({ children }: { children: ReactNode }) {
  const { loading, error, auth0User } = useUserContext();

  if (loading && auth0User) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center text-red-600">
          <p className="text-sm">Error setting up your account: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 