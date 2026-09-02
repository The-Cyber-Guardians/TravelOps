import type { HTMLAttributes, ReactNode } from 'react'

import './ui.css'

export type StatusBadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: StatusBadgeVariant
}

export function StatusBadge({
  children,
  variant = 'default',
  className = '',
  ...props
}: StatusBadgeProps) {
  const classes = [
    'ui-status-badge',
    `ui-status-badge--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}