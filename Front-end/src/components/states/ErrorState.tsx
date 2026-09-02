import './states.css'

export type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'خطایی رخ داد',
  message = 'دریافت اطلاعات با مشکل مواجه شد.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="ui-state" role="alert">
      <h3 className="ui-state__title">{title}</h3>

      <p className="ui-state__message">{message}</p>

      {onRetry && (
        <button
          type="button"
          className="ui-state__action"
          onClick={onRetry}
        >
          تلاش دوباره
        </button>
      )}
    </div>
  )
}