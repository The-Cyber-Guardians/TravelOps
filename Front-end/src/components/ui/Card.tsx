import type { HTMLAttributes, ReactNode } from 'react'

import './ui.css'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  const classes = ['ui-card', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}