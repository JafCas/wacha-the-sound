import type { AuthTokens } from "../types/auth";

const STORAGE_KEYS = {
  TOKENS: "auth_tokens",
  PKCE_VERIFIER: "pkce_verifier",
  OAUTH_STATE: "oauth_state",
  USER_DATA: "user_data",
} as const;

/**
 * Storage utility for authentication data
 */
export class AuthStorage {
  /**
   * Store authentication tokens
   */
  static setTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (error) {
      console.error("Failed to store auth tokens:", error);
      // TODO: Handle storage failure (e.g., notify user, fallback)
    }
  }

  /**
   * Retrieve authentication tokens
   */
  static getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error("Failed to retrieve auth tokens:", error);
      return null;
    }
  }

  /**
   * Store PKCE code verifier
   */
  static setPKCEVerifier(verifier: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PKCE_VERIFIER, verifier);
    } catch (error) {
      console.error("Failed to store PKCE verifier:", error);
    }
  }

  /**
   * Retrieve PKCE code verifier
   */
  static getPKCEVerifier(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.PKCE_VERIFIER);
    } catch (error) {
      console.error("Failed to retrieve PKCE verifier:", error);
      return null;
    }
  }

  /**
   * Store OAuth state parameter
   */
  static setOAuthState(state: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OAUTH_STATE, state);
    } catch (error) {
      console.error("Failed to store OAuth state:", error);
    }
  }

  /**
   * Retrieve OAuth state parameter
   */
  static getOAuthState(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.OAUTH_STATE);
    } catch (error) {
      console.error("Failed to retrieve OAuth state:", error);
      return null;
    }
  }

  /**
   * Store user data
   */
  static setUserData(user: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  }

  /**
   * Retrieve user data
   */
  static getUserData(): any | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear auth storage:", error);
    }
  }

  /**
   * Clear temporary OAuth data (verifier and state)
   */
  static clearTemporary(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PKCE_VERIFIER);
      localStorage.removeItem(STORAGE_KEYS.OAUTH_STATE);
    } catch (error) {
      console.error("Failed to clear temporary auth data:", error);
    }
  }

  /**
   * Check if tokens are expired
   */
  static areTokensExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;

    // Add a small buffer (5 minutes) to account for network delays
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const expirationTime = Date.now() + tokens.expiresIn * 1000 - bufferTime;

    return Date.now() >= expirationTime;
  }
}
