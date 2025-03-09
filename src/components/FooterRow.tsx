import { useAppSelector } from '@/hooks'
import { TransactionType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Transaction from '@/patterns/prototypes/TransactionPrototype'

interface FooterRowProps {
  data: Transaction[]
  columns: string[]
  type: TransactionType
}
function FooterRow({ data, columns, type }: FooterRowProps) {
  // store
  const { userSettings } = useAppSelector(state => state.settings)

  return (
    <div
      className={`flex h-9 flex-nowrap items-center gap-2 rounded-md border-l-2 ${type === 'income' ? 'border-emerald-500' : 'border-rose-500'} bg-white/10 px-21/2 py-1 text-sm font-semibold tracking-wider`}
    >
      <div className="w-[18px]" />
      {columns.includes('category') && (
        <div className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis pl-2">{data.length}</p>
        </div>
      )}
      {columns.includes('description') && (
        <div className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis">{data.length}</p>
        </div>
      )}
      {columns.includes('date') && (
        <div className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis">{data.length}</p>
        </div>
      )}
      {columns.includes('amount') && (
        <div className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis">
            {formatCurrency(
              userSettings.currency,
              data.reduce((total, item) => total + item.amount, 0)
            )}
          </p>
        </div>
      )}
      <div className="flex flex-1 items-center justify-end" />
    </div>
  )
}

export default FooterRow
