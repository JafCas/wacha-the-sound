import { ref, computed, onMounted } from "vue";
import type { AuthConfig, AuthState, AuthTokens, User } from "../types/auth";
import {
  generatePKCETokensAsync,
  generateState,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  parseCallbackUrl,
} from "../utils/pkce";
import { AuthStorage } from "../utils/storage";

/**
 * Vue composable for PKCE authentication
 * _This is the equivalent of React's hooks for managing authentication state_
 * _This could be split into smaller composables if needed_
 */
export function useAuth(config: AuthConfig) {
  // Reactive state
  const isAuthenticated = ref(false);
  const tokens = ref<AuthTokens | null>(null);
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const authState = computed<AuthState>(() => ({
    isAuthenticated: isAuthenticated.value,
    tokens: tokens.value,
    user: user.value,
    isLoading: isLoading.value,
    error: error.value,
  }));

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = async () => {
    try {
      isLoading.value = true;

      // Check for stored tokens
      const storedTokens = AuthStorage.getTokens();
      const storedUser = AuthStorage.getUserData();

      if (storedTokens && !AuthStorage.areTokensExpired()) {
        tokens.value = storedTokens;
        user.value = storedUser;
        isAuthenticated.value = true;
      } else if (storedTokens?.refreshToken) {
        // Try to refresh expired tokens
        await handleTokenRefresh();
      } else {
        // Clear any invalid stored data
        AuthStorage.clearAll();
      }
    } catch (err) {
      console.error("Failed to initialize auth:", err);
      error.value = "Failed to initialize authentication";
      AuthStorage.clearAll();
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Start the OAuth authorization flow
   */
  const login = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Generate PKCE tokens and state
      const pkceTokens = await generatePKCETokensAsync();
      const state = generateState();

      // Store PKCE verifier and state for later use
      AuthStorage.setPKCEVerifier(pkceTokens.codeVerifier);
      AuthStorage.setOAuthState(state);

      // Build authorization URL and redirect
      const authUrl = buildAuthorizationUrl(
        config,
        pkceTokens.codeChallenge,
        state
      );
      window.location.href = authUrl;
    } catch (err) {
      console.error("Login failed:", err);
      error.value = "Failed to start login process";
      isLoading.value = false;
    }
  };

  /**
   * Handle OAuth callback
   */
  const handleCallback = async (callbackUrl?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Parse callback URL (use current URL if not provided)
      const url = callbackUrl || window.location.href;
      const { code, state, error: oauthError } = parseCallbackUrl(url);

      if (oauthError) {
        throw new Error(oauthError.errorDescription || oauthError.error);
      }

      if (!code || !state) {
        throw new Error("Missing authorization code or state parameter");
      }

      // Verify state parameter
      const storedState = AuthStorage.getOAuthState();
      if (state !== storedState) {
        throw new Error("Invalid state parameter - possible CSRF attack");
      }

      // Get stored PKCE verifier
      const codeVerifier = AuthStorage.getPKCEVerifier();
      if (!codeVerifier) {
        throw new Error("Missing PKCE code verifier");
      }

      // Exchange code for tokens
      const tokenResponse = await exchangeCodeForToken(
        config,
        code,
        codeVerifier,
        state
      );

      // Store tokens and update state
      const authTokens: AuthTokens = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenType: tokenResponse.token_type || "Bearer",
        expiresIn: tokenResponse.expires_in || 3600,
        scope: tokenResponse.scope,
      };

      tokens.value = authTokens;
      AuthStorage.setTokens(authTokens);

      // Fetch user information if needed
      await fetchUserInfo();

      isAuthenticated.value = true;

      // Clear temporary OAuth data
      AuthStorage.clearTemporary();

      // Clean up URL parameters
      if (typeof window !== "undefined") {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (err) {
      console.error("Callback handling failed:", err);
      error.value =
        err instanceof Error ? err.message : "Authentication failed";
      AuthStorage.clearAll();
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh access token using refresh token
   */
  const handleTokenRefresh = async () => {
    try {
      const currentTokens = tokens.value || AuthStorage.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const tokenResponse = await refreshAccessToken(
        config,
        currentTokens.refreshToken
      );

      const newTokens: AuthTokens = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || currentTokens.refreshToken,
        tokenType: tokenResponse.token_type || "Bearer",
        expiresIn: tokenResponse.expires_in || 3600, // Default to 1 hour
        scope: tokenResponse.scope,
      };

      tokens.value = newTokens;
      AuthStorage.setTokens(newTokens);
      isAuthenticated.value = true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      await logout();
      throw err;
    }
  };

  /**
   * Fetch user information using access token
   */
  const fetchUserInfo = async () => {
    // This is a placeholder - implement based on your API
    // You would typically make a request to a /userinfo endpoint
    try {
      if (!tokens.value?.accessToken) return;

      // Example implementation:
      // const response = await fetch(`${config.userInfoEndpoint}`, {
      //   headers: {
      //     'Authorization': `${tokens.value.tokenType} ${tokens.value.accessToken}`,
      //   },
      // });
      // const userData = await response.json();
      // user.value = userData;
      // AuthStorage.setUserData(userData);

      // For now, create a placeholder user
      const userData: User = {
        id: "user-id",
        email: "user@example.com",
        name: "User Name",
      };

      user.value = userData;
      AuthStorage.setUserData(userData);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      // Don't throw here - auth can still work without user info
    }
  };

  /**
   * Logout user and clear all auth data
   */
  const logout = async () => {
    try {
      isLoading.value = true;

      // Clear all stored auth data
      AuthStorage.clearAll();

      // Reset reactive state
      isAuthenticated.value = false;
      tokens.value = null;
      user.value = null;
      error.value = null;

      // Optional: Revoke tokens on the server
      // if (tokens.value?.accessToken) {
      //   await revokeToken(tokens.value.accessToken);
      // }
    } catch (err) {
      console.error("Logout failed:", err);
      error.value = "Failed to logout";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get authorization header for API requests
   */
  const getAuthHeader = (): string | null => {
    if (!tokens.value?.accessToken) return null;
    return `${tokens.value.tokenType} ${tokens.value.accessToken}`;
  };

  /**
   * Make authenticated API request
   */
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      throw new Error("No access token available");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: authHeader,
      },
    });

    // Handle token expiration
    if (response.status === 401 && tokens.value?.refreshToken) {
      try {
        await handleTokenRefresh();
        // Retry request with new token
        const newAuthHeader = getAuthHeader();
        if (newAuthHeader) {
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: newAuthHeader,
            },
          });
        }
      } catch (refreshError) {
        console.error("Token refresh failed during API request:", refreshError);
        await logout();
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  };

  // Initialize on mount
  onMounted(() => {
    initializeAuth();
  });

  return {
    // State
    authState,
    isAuthenticated: computed(() => isAuthenticated.value),
    tokens: computed(() => tokens.value),
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    login,
    logout,
    handleCallback,
    handleTokenRefresh,
    getAuthHeader,
    apiRequest,
    initializeAuth,
  };
}
