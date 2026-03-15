const ADMIN_TOKEN_KEY = 'mofang-admin-token';

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('x-admin-token', token);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearAdminToken();
  }

  return response;
}
