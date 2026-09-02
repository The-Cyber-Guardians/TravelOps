import type { ReactNode } from 'react'

import './ui.css'

export type ModalProps = {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="ui-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ui-modal-title' : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ui-modal__header">
          {title && (
            <h2 id="ui-modal-title" className="ui-modal__title">
              {title}
            </h2>
          )}

          <button
            type="button"
            className="ui-modal__close"
            onClick={onClose}
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  )
}