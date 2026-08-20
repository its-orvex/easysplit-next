import { avatarColour } from '@/utils/avatar'

interface Props {
  name: string
  index: number
  size?: 'xs' | 'sm' | 'md'
}

export default function MemberAvatar({ name, index, size = 'md' }: Props) {
  const colour = avatarColour(index)
  const sizeClass =
    size === 'xs' ? 'w-5 h-5 text-[10px]' :
    size === 'sm' ? 'w-6 h-6 text-xs' :
    'w-8 h-8 text-sm'

  return (
    <div className={`${sizeClass} ${colour} rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
