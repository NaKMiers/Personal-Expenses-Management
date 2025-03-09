import Transaction from '@/patterns/prototypes/TransactionPrototype'
import { Dispatch } from 'react'
import { LuChevronDown, LuChevronUp, LuTrash } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import { Checkbox } from './ui/checkbox'

interface HeaderRowProps {
  sort: { column: string; order: 'asc' | 'desc' }
  setSort: Dispatch<{ column: string; order: 'asc' | 'desc' }>
  columns: string[]
  handleDeleteTransactions: (ids: string[]) => void
  deleting: string[]
  setSelectedTransactions: Dispatch<string[]>
  selectedTransactions: string[]
  transactions: Transaction[]
  refresh?: () => void
}
function HeaderRow({
  sort,
  setSort,
  columns,
  handleDeleteTransactions,
  deleting,
  setSelectedTransactions,
  selectedTransactions,
  transactions,
}: HeaderRowProps) {
  return (
    <div
      className={`flex h-9 flex-nowrap items-center gap-2 rounded-md border-2 border-slate-200/30 bg-white/10 px-21/2 py-1 text-sm font-bold tracking-wider`}
    >
      <div className="w-[18px]">
        <Checkbox
          checked={selectedTransactions.length === transactions.length}
          onCheckedChange={checked =>
            setSelectedTransactions(checked ? transactions.map(item => item._id) : [])
          }
          className="flex h-[14px] w-[14px] items-center justify-center border-2"
        />
      </div>

      {columns.includes('category') && (
        <div
          className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1"
          onClick={() => setSort({ column: 'category', order: sort.order === 'asc' ? 'desc' : 'asc' })}
        >
          <p className="line-clamp-2 overflow-hidden text-ellipsis">Category</p>
          <div
            className={`flex items-center justify-center ${sort.column === 'category' ? 'text-primary' : ''}`}
          >
            {sort.column === 'category' && sort.order === 'asc' ? (
              <LuChevronDown size={18} />
            ) : (
              <LuChevronUp size={18} />
            )}
          </div>
        </div>
      )}

      {columns.includes('description') && (
        <div
          className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1"
          onClick={() =>
            setSort({ column: 'description', order: sort.order === 'asc' ? 'desc' : 'asc' })
          }
        >
          <p className="line-clamp-2 overflow-hidden text-ellipsis">Description</p>
          <div
            className={`flex items-center justify-center ${sort.column === 'description' ? 'text-primary' : ''}`}
          >
            {sort.column === 'description' && sort.order === 'asc' ? (
              <LuChevronDown size={18} />
            ) : (
              <LuChevronUp size={18} />
            )}
          </div>
        </div>
      )}

      {columns.includes('date') && (
        <div
          className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1"
          onClick={() => setSort({ column: 'date', order: sort.order === 'asc' ? 'desc' : 'asc' })}
        >
          <p className="line-clamp-2 overflow-hidden text-ellipsis">Date</p>
          <div
            className={`flex items-center justify-center ${sort.column === 'date' ? 'text-primary' : ''}`}
          >
            {sort.column === 'date' && sort.order === 'asc' ? (
              <LuChevronDown size={18} />
            ) : (
              <LuChevronUp size={18} />
            )}
          </div>
        </div>
      )}

      {columns.includes('amount') && (
        <div
          className="flex w-[150px] flex-shrink-0 cursor-pointer select-none items-center gap-1"
          onClick={() => setSort({ column: 'amount', order: sort.order === 'asc' ? 'desc' : 'asc' })}
        >
          <p className="line-clamp-2 overflow-hidden text-ellipsis">Amount</p>
          <div
            className={`flex items-center justify-center ${sort.column === 'amount' ? 'text-primary' : ''}`}
          >
            {sort.column === 'amount' && sort.order === 'asc' ? (
              <LuChevronDown size={18} />
            ) : (
              <LuChevronUp size={18} />
            )}
          </div>
        </div>
      )}
      <div className="flex flex-1 items-center justify-end">
        <div>
          <ConfirmDialog
            label="Delete category"
            subLabel={`Are you sure you want to delete Salary category?`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => handleDeleteTransactions(selectedTransactions)}
            disabled={deleting.length > 0}
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

export default HeaderRow
