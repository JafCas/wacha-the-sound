# PKCE Authentication Implementation

This document provides a comprehensive guide for implementing PKCE (Proof Key for Code Exchange) authentication in your Vue.js application.

## Overview

PKCE is a security extension to OAuth 2.0 for public clients (like single-page applications) that prevents authorization code interception attacks. This implementation provides a modular, scalable authentication system.

## Architecture

```
src/
├── types/
│   └── auth.ts                 # TypeScript interfaces
├── utils/
│   ├── pkce.ts                # PKCE utilities
│   └── storage.ts             # Local storage management
├── composables/
│   └── useAuth.ts             # Vue composable for auth state
├── services/
│   └── auth.ts                # Auth service configuration
└── components/
    ├── auth/
    │   ├── AuthStatus.vue     # Auth status display
    │   └── AuthCallback.vue   # OAuth callback handler
    └── buttons/
        ├── LoginButton.vue    # Login button component
        └── LogoutButton.vue   # Logout button component
```

## Setup Steps

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure your OAuth provider settings:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
VITE_OAUTH_CLIENT_ID=your-actual-client-id
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OAUTH_AUTH_ENDPOINT=https://your-oauth-provider.com/oauth/authorize
VITE_OAUTH_TOKEN_ENDPOINT=https://your-oauth-provider.com/oauth/token
VITE_OAUTH_SCOPE=read write
```

### 2. OAuth Provider Configuration

Register your application with your OAuth provider and configure:

- **Redirect URI**: Must match `VITE_OAUTH_REDIRECT_URI`
- **Grant Type**: Authorization Code with PKCE
- **Response Type**: `code`
- **Code Challenge Method**: `S256`

### 3. Using the Authentication System

#### Basic Usage

```vue
<script setup lang="ts">
import { useAuth } from './composables/useAuth';
import { authConfig } from './services/auth';

const {
  isAuthenticated,
  isLoading,
  error,
  user,
  login,
  logout,
  handleCallback,
} = useAuth(authConfig);
</script>

<template>
  <div v-if="isAuthenticated">
    <h1>Welcome, {{ user?.name }}!</h1>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <button @click="login">Login</button>
  </div>
</template>
```

#### Making Authenticated API Requests

```typescript
import { useAuth } from './composables/useAuth';

const { apiRequest } = useAuth(authConfig);

// Make authenticated request
const fetchUserData = async () => {
  try {
    const response = await apiRequest('/api/user');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('API request failed:', error);
  }
};
```

## API Reference

### useAuth Composable

#### Returns

- `isAuthenticated`: Boolean indicating auth status
- `isLoading`: Boolean indicating loading state
- `error`: Current error message (if any)
- `user`: Current user data
- `tokens`: Current auth tokens
- `login()`: Start OAuth flow
- `logout()`: Clear auth data and logout
- `handleCallback()`: Process OAuth callback
- `apiRequest()`: Make authenticated API requests
- `getAuthHeader()`: Get authorization header string

#### Configuration

```typescript
interface AuthConfig {
  clientId: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope?: string;
}
```

### Storage Utilities

The `AuthStorage` class provides secure local storage management:

```typescript
import { AuthStorage } from './utils/storage';

// Store/retrieve tokens
AuthStorage.setTokens(tokens);
const tokens = AuthStorage.getTokens();

// Check token expiration
const expired = AuthStorage.areTokensExpired();

// Clear all auth data
AuthStorage.clearAll();
```

### PKCE Utilities

```typescript
import { 
  generatePKCETokensAsync,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  parseCallbackUrl 
} from './utils/pkce';

// Generate PKCE tokens
const { codeVerifier, codeChallenge } = await generatePKCETokensAsync();

// Build auth URL
const authUrl = buildAuthorizationUrl(config, codeChallenge, state);

// Exchange code for tokens
const tokens = await exchangeCodeForToken(config, code, codeVerifier, state);
```

## Security Features

### PKCE Implementation
- Cryptographically secure code verifier generation
- SHA256 code challenge method
- Base64URL encoding without padding

### State Parameter
- Random state generation for CSRF protection
- State validation during callback

### Token Management
- Secure local storage
- Automatic token refresh
- Token expiration checking
- Automatic cleanup on logout

### Error Handling
- Comprehensive error states
- User-friendly error messages
- Automatic retry mechanisms
- Graceful degradation

## Customization

### Custom OAuth Provider

To integrate with a specific OAuth provider, update `src/services/auth.ts`:

```typescript
// Example: Spotify OAuth
export const authConfig: AuthConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/callback`,
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scope: 'user-read-private user-read-email',
};
```

### Custom User Info Endpoint

Update the `fetchUserInfo` function in `useAuth.ts`:

```typescript
const fetchUserInfo = async () => {
  if (!tokens.value?.accessToken) return;

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${tokens.value.accessToken}`,
    },
  });
  
  const userData = await response.json();
  user.value = userData;
  AuthStorage.setUserData(userData);
};
```

### Styling Components

All components use scoped CSS and can be customized:

```vue
<style scoped>
.auth-button {
  /* Custom button styles */
  background: your-brand-color;
  border-radius: your-border-radius;
}
</style>
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure redirect URI matches exactly in OAuth provider settings
   - Check for trailing slashes and protocol (http vs https)

2. **"PKCE verification failed"**
   - Check that code verifier is properly stored and retrieved
   - Ensure code challenge method is set to S256

3. **Token refresh fails**
   - Verify refresh token is included in token response
   - Check token endpoint supports refresh_token grant type

4. **CORS errors**
   - Configure OAuth provider to allow your domain
   - Consider using a proxy for token requests in development

### Development Tips

1. **Testing Locally**
   ```bash
   # Use localhost for redirect URI in development # Actually, you might want to use the url that is being exposed as http.
   VITE_OAUTH_REDIRECT_URI=http://{{localhost:5173}}/auth/callback
   ```

2. **Debugging Auth Flow**
   ```typescript
   // Enable debug logging in development
   if (import.meta.env.DEV) {
     console.log('Auth state:', authState.value);
   }
   ```

3. **Mock Authentication**
   ```typescript
   // Create mock auth for development
   const mockAuth = () => {
     if (import.meta.env.DEV) {
       // Set mock tokens and user
     }
   };
   ```

## Production Considerations

### Security
- Use HTTPS in production
- Implement Content Security Policy (CSP)
- Regular security audits
- Token rotation policies

### Performance
- Lazy load auth components
- Minimize bundle size
- Implement proper caching strategies

### Monitoring
- Log authentication events
- Monitor token refresh rates
- Track authentication errors

## License

This implementation is provided as-is for educational and development purposes.
