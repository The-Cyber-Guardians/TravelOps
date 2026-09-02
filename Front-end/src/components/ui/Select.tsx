import type { ReactNode, SelectHTMLAttributes } from 'react'

import './ui.css'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  helperText?: ReactNode
  children: ReactNode
}

export function Select({
  label,
  error,
  helperText,
  children,
  id,
  className = '',
  required,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name

  return (
    <div className={`ui-field ${className}`.trim()}>
      {label && (
        <label className="ui-field__label" htmlFor={selectId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <select
        id={selectId}
        className={`ui-select ${error ? 'ui-select--error' : ''}`}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${selectId}-error`
            : helperText
              ? `${selectId}-helper`
              : undefined
        }
        {...props}
      >
        {children}
      </select>

      {error ? (
        <p
          id={`${selectId}-error`}
          className="ui-field__error"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="ui-field__helper">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}