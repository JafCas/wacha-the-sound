import type { AuthConfig } from '../types/auth';

/**
 * Authentication service configuration
 * Replace these values with your actual OAuth provider settings
 */
export const authConfig: AuthConfig = {
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID || 'your-client-id',
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`,
  authorizationEndpoint: import.meta.env.VITE_OAUTH_AUTH_ENDPOINT || 'https://your-oauth-provider.com/oauth/authorize',
  tokenEndpoint: import.meta.env.VITE_OAUTH_TOKEN_ENDPOINT || 'https://your-oauth-provider.com/oauth/token',
  scope: import.meta.env.VITE_OAUTH_SCOPE || 'read write',
};

/**
 * Auth service factory
 */
export class AuthService {
  private static instance: AuthService | null = null;
  private config: AuthConfig;

  private constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Get singleton instance of AuthService
   */
  static getInstance(config?: AuthConfig): AuthService {
    if (!AuthService.instance) {
      if (!config) {
        throw new Error('AuthService config is required for initialization');
      }
      AuthService.instance = new AuthService(config);
    }
    return AuthService.instance;
  }

  /**
   * Get current configuration
   */
  getConfig(): AuthConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AuthConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Validate configuration
   */
  validateConfig(): boolean {
    const requiredFields: (keyof AuthConfig)[] = [
      'clientId',
      'redirectUri',
      'authorizationEndpoint',
      'tokenEndpoint'
    ];

    return requiredFields.every(field => {
      const value = this.config[field];
      return value && value.trim() !== '' && value !== 'your-client-id';
    });
  }

  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean {
    return import.meta.env.DEV || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }
}

/**
 * Initialize auth service with default config
 */
export const authService = AuthService.getInstance(authConfig);
