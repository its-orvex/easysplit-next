const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateInviteCode() {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, byte => ALPHABET[byte % ALPHABET.length]).join('')
}

export function generateShareToken() {
  return crypto.randomUUID()
}

