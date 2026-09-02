import type { InputHTMLAttributes, ReactNode } from 'react'

import './ui.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  helperText?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  required,
  ...props
}: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className={`ui-field ${className}`.trim()}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        className={`ui-input ${error ? 'ui-input--error' : ''}`}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        {...props}
      />

      {error ? (
        <p
          id={`${inputId}-error`}
          className="ui-field__error"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="ui-field__helper">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}