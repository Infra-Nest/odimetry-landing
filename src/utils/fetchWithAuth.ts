import { refreshAccessToken, logoutUser, getAuthToken } from '../services/authService';

interface FetchWithAuthOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Fetch wrapper that automatically handles
 401 errors and refreshes the token
 * 
 * Usage: Same as fetch(), but automatically adds Authorization header and handles token refresh
 */
export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuthRefresh, headers = {}, ...restOptions } = options;

  // Add Authorization header if token exists
  const token = getAuthToken();
  const authHeaders: HeadersInit = token
    ? { ...headers, Authorization: `Bearer ${token}` }
    : { ...headers };

  // First attempt
  let response = await fetch(url, {
    ...restOptions,
    headers: authHeaders,
    credentials: 'include',
  });

  // If not 401 or skipAuthRefresh is true, return response as-is
  if (response.status !== 401 || skipAuthRefresh) {
    return response;
  }

  // Prevent multiple simultaneous refresh requests
  let refreshOk = false;

  if (isRefreshing && refreshPromise) {
    refreshOk = await refreshPromise;
  } else {
    isRefreshing = true;
    refreshPromise = refreshAccessToken();
    
    try {
      refreshOk = await refreshPromise;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  if (!refreshOk) {
    return response;
  }

  // Retry with new token
  const newToken = getAuthToken();
  
  if (!newToken) {
    logoutUser();
    // Don't redirect here to avoid circular dependencies
    // Let the component/context handle it
    return response; // Return original 401
  }

  const newAuthHeaders: HeadersInit = {
    ...headers,
    Authorization: `Bearer ${newToken}`,
  };
  
  return fetch(url, {
    ...restOptions,
    headers: newAuthHeaders,
    credentials: 'include',
  });
}
