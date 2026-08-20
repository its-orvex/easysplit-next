const AVATAR_COLOURS = [
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
]

export function avatarColour(index = 0): string {
  return AVATAR_COLOURS[Math.abs(index) % AVATAR_COLOURS.length]
}

