import { useAppSelector } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import Category from '@/patterns/prototypes/CategoryPrototype'
import Transaction from '@/patterns/prototypes/TransactionPrototype'
import moment from 'moment'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { LuCopy, LuLoader, LuPen, LuTrash } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import EditTransactionDialog from './EditTransactionDialog'
import { Checkbox } from './ui/checkbox'

interface RowProps {
  data: Transaction
  handleDeleteTransactions: (ids: string[]) => void
  deleting: string[]
  columns: string[]
  setSelectedTransactions: Dispatch<SetStateAction<string[]>>
  selectedTransactions: string[]
  refresh?: () => void
}

function Row({
  data,
  columns,
  handleDeleteTransactions,
  deleting,
  setSelectedTransactions,
  selectedTransactions,
  refresh,
}: RowProps) {
  // store
  const { userSettings } = useAppSelector(state => state.settings)

  // states
  const [duplicating, setDuplicating] = useState<boolean>(false)

  const handleDuplicateTransaction = useCallback(async () => {
    // start loading
    setDuplicating(true)

    try {
      await data.clone()

      if (refresh) refresh()
    } catch (err: any) {
      toast.error(err.message, { id: 'duplicate-transaction' })
      console.log(err)
    } finally {
      // stop loading
      setDuplicating(false)
    }
  }, [data, refresh])

  return (
    <div
      className={`flex h-9 flex-nowrap items-center gap-2 rounded-md border-l-2 ${data.type === 'income' ? 'border-emerald-500' : 'border-rose-500'} bg-neutral-800/50 px-21/2 py-1 text-sm font-semibold`}
    >
      <div className="w-[18px]">
        <Checkbox
          checked={selectedTransactions.includes(data._id)}
          onCheckedChange={checked => {
            setSelectedTransactions(prev =>
              checked ? [...prev, data._id] : prev.filter(id => id !== data._id)
            )
          }}
          className="flex h-[14px] w-[14px] items-center justify-center border-2"
        />
      </div>

      {columns.includes('category') && (
        <div className="flex w-[150px] flex-shrink-0 items-center gap-1">
          <span>{(data.category as Category).icon}</span>{' '}
          <p className="line-clamp-2 overflow-hidden text-ellipsis">
            {(data.category as Category).name}
          </p>
        </div>
      )}

      {columns.includes('description') && (
        <div className="flex w-[150px] flex-shrink-0 items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis">{data.description}</p>
        </div>
      )}

      {columns.includes('date') && (
        <div className="flex w-[150px] flex-shrink-0 items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis">
            {moment(data.date).format('DD/MM/YYYY')}
          </p>
        </div>
      )}

      {columns.includes('amount') && (
        <div className="is flex w-[150px] flex-shrink-0 items-center gap-1">
          <p className="line-clamp-2 overflow-hidden text-ellipsis text-nowrap">
            {formatCurrency(userSettings.currency, data.amount)}
          </p>
        </div>
      )}

      <div className="flex flex-1 items-center justify-end gap-1">
        <button
          className="trans-200 rounded-md p-1 hover:bg-slate-200/30"
          onClick={handleDuplicateTransaction}
          disabled={duplicating}
        >
          {!duplicating ? (
            <LuCopy size={16} />
          ) : (
            <LuLoader
              size={16}
              className="animate-spin"
            />
          )}
        </button>

        <div>
          <EditTransactionDialog
            trigger={
              <button className="trans-200 rounded-md p-1 hover:bg-slate-200/30">
                <LuPen size={16} />
              </button>
            }
            transaction={data}
            update={() => {
              if (refresh) refresh()
            }}
          />
        </div>

        <div>
          <ConfirmDialog
            label="Delete category"
            subLabel={`Are you sure you want to delete Salary category?`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => handleDeleteTransactions([data._id])}
            disabled={deleting.includes(data._id)}
            trigger={
              <button className="trans-200 rounded-md p-1 hover:bg-slate-200/30">
                <LuTrash size={16} />
              </button>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Row
