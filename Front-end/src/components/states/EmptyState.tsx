import type { ReactNode } from 'react'

import './states.css'

export type EmptyStateProps = {
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title = 'موردی یافت نشد',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-state">
      <h3 className="ui-state__title">{title}</h3>

      {description && (
        <p className="ui-state__message">{description}</p>
      )}

      {action && (
        <div className="ui-state__action-wrapper">
          {action}
        </div>
      )}
    </div>
  )
}