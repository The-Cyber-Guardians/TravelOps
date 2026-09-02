import './states.css'

export type LoadingStateProps = {
  message?: string
}

export function LoadingState({
  message = 'در حال بارگذاری...',
}: LoadingStateProps) {
  return (
    <div
      className="ui-state"
      role="status"
      aria-live="polite"
    >
      <div className="ui-state__spinner" aria-hidden="true" />
      <p className="ui-state__message">{message}</p>
    </div>
  )
}