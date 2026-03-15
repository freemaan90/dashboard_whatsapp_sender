import Cookies from 'js-cookie';

export const TOKEN_KEY = 'whatsapp_token';

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
