export interface AuthConfig {
  clientId: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope?: string;
}

export interface PKCETokens {
  codeVerifier: string;
  codeChallenge: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  scope?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthError {
  error: string;
  errorDescription?: string;
  errorUri?: string;
}
