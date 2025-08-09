import { encode as base64UrlEncode } from "js-base64";
import type { PKCETokens, AuthConfig, AuthError } from "../types/auth";

/**
 * Synchronous version that returns a Promise
 */
export async function generatePKCETokensAsync(): Promise<PKCETokens> {
  // Generate a random code verifier
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64UrlEncode(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Generate code challenge using SHA256
  const sha256 = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );
  const codeChallenge = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(sha256))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return {
    codeVerifier,
    codeChallenge,
  };
}

/**
 * Generates a random state parameter for OAuth security
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(String.fromCharCode(...array));
}

/**
 * Builds the authorization URL for OAuth flow
 */
export function buildAuthorizationUrl(
  config: AuthConfig,
  codeChallenge: string,
  state: string
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    ...(config.scope && { scope: config.scope }),
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token
 */
export async function exchangeCodeForToken(
  config: AuthConfig,
  code: string,
  codeVerifier: string,
  state: string
): Promise<any> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    code,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
    state,
  });

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || "Token exchange failed");
  }

  return response.json();
}

/**
 * Refreshes access token using refresh token
 */
export async function refreshAccessToken(
  config: AuthConfig,
  refreshToken: string
  // we could build a type for the response, but for now we keep it generic
): Promise<any> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || "Token refresh failed");
  }

  return response.json();
}

/**
 * Parses OAuth callback URL parameters
 */
export function parseCallbackUrl(url: string): {
  code?: string;
  state?: string;
  error?: AuthError;
} {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  const error = params.get("error");
  if (error) {
    return {
      error: {
        error,
        errorDescription: params.get("error_description") || undefined,
        errorUri: params.get("error_uri") || undefined,
      },
    };
  }

  return {
    code: params.get("code") || undefined,
    state: params.get("state") || undefined,
  };
}
