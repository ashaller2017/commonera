// Kids sign in with a username, not an email. Supabase auth requires an email,
// so we map usernames onto a reserved synthetic domain that real users can
// never register on.

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/

export const KID_EMAIL_DOMAIN = 'kids.bmitzvah.app'

export const normalizeUsername = (raw: string): string => raw.trim().toLowerCase()

export const isValidUsername = (username: string): boolean => USERNAME_PATTERN.test(username)

export const kidEmailFor = (username: string): string => `${username}@${KID_EMAIL_DOMAIN}`
