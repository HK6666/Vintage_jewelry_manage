import { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Tag({ children, className = '', onClick }: TagProps) {
  return (
    <span
      className={`tag ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
