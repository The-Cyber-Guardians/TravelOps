import './ui.css'

export type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <nav
      className="ui-pagination"
      aria-label="صفحه‌بندی"
    >
      <button
        type="button"
        className="ui-pagination__button"
        disabled={!canGoPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        قبلی
      </button>

      <span className="ui-pagination__status">
        صفحه {page} از {totalPages}
      </span>

      <button
        type="button"
        className="ui-pagination__button"
        disabled={!canGoNext}
        onClick={() => onPageChange(page + 1)}
      >
        بعدی
      </button>
    </nav>
  )
}