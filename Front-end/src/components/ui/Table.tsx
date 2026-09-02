import type { ReactNode } from 'react'

import './ui.css'

export type TableColumn<T> = {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
}

export type TableProps<T> = {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string | number
  emptyMessage?: string
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'داده‌ای برای نمایش وجود ندارد.',
}: TableProps<T>) {
  return (
    <div className="ui-table-wrapper">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="ui-table__empty"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}