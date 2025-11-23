import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  clientId: process.env.AUTH0_CLIENT_ID,
  
  // Options are loaded from environment variables by default
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },
  
  // Redirect to dashboard after successful login
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  }
}); 