export const ADMIN_TOKEN_KEY = 'radicon_admin_token'

export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token)
  document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY)
  document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax'
}
