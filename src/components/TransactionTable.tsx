import { useAppSelector } from '@/hooks'
import { TransactionType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { IFullTransaction } from '@/models/TransactionModel'
import { Separator } from '@radix-ui/react-select'
import moment from 'moment'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { LuChevronDown, LuChevronUp, LuMinus, LuPen, LuSearch, LuTrash } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import { MultipleSelection } from './History'
import { Checkbox } from './ui/checkbox'
import { Switch } from './ui/switch'
import { deleteTransactionsApi } from '@/requests'
import toast from 'react-hot-toast'
import EditTransactionDialog from './EditTransactionDialog'

interface ITransactionTableProps {
  data: IFullTransaction[]
}
function TransactionTable({ data: transactions }: ITransactionTableProps) {
  // store
  const { userSettings, exchangeRate } = useAppSelector(state => state.settings)

  // values
  const columns = ['category', 'description', 'date', 'amount']

  // states
  const [data, setData] = useState<IFullTransaction[]>(transactions)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns)
  const [filterText, setFilterText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IFullTransaction[]>(transactions)
  const [sort, setSort] = useState<{ column: string; order: 'asc' | 'desc' }>({
    column: 'date',
    order: 'desc',
  })
  const [shows, setShows] = useState({
    income: true,
    expense: true,
  })
  const [deleting, setDeleting] = useState<string[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  // filter data
  useEffect(() => {
    let newData = [...data]

    newData = newData.sort((a, b) => {
      if (sort.column === 'category') {
        return sort.order === 'asc'
          ? a.category.name.localeCompare(b.category.name)
          : b.category.name.localeCompare(a.category.name)
      }
      if (sort.column === 'description') {
        return sort.order === 'asc'
          ? (a.description || '').localeCompare(b.description || '')
          : (b.description || '').localeCompare(a.description || '')
      }
      if (sort.column === 'date') {
        return sort.order === 'asc' ? moment(a.date).diff(b.date) : moment(b.date).diff(a.date)
      }
      if (sort.column === 'amount') {
        return sort.order === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })

    if (filterText.trim()) {
      newData = newData.filter(({ description, category: { name, icon }, amount, type }) => {
        let text = ''
        if (selectedColumns.includes('category')) text += `${name} ${icon}`
        if (selectedColumns.includes('description')) text += ` ${description}`
        if (selectedColumns.includes('amount'))
          text += ` ${formatCurrency(userSettings.currency, amount, exchangeRate)}`
        return text.toLowerCase().includes(filterText.toLowerCase())
      })
    }

    setFilteredData(newData)
  }, [data, sort, filterText, exchangeRate, userSettings.currency, selectedColumns])

  // delete transaction
  const handleDeleteTransactions = useCallback(async (ids: string[]) => {
    // start loading
    setDeleting(ids)

    toast.loading('Deleting transactions...', { id: 'delete-transactions' })

    try {
      const { deletedTransactions, message } = await deleteTransactionsApi(ids)

      // update transactions
      setFilteredData(prevData => prevData.filter(item => !ids.includes(item._id)))

      toast.success(message, { id: 'delete-transactions' })
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, { id: 'delete-transactions' })
    } finally {
      // stop loading
      setDeleting([])
    }
  }, [])

  return (
    <div>
      <div className="mb-2 flex flex-col items-end justify-between gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="flex w-full overflow-hidden rounded-md border border-white md:max-w-[300px]">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-white">
            <LuSearch
              size={16}
              className="text-dark"
            />
          </div>
          <input
            type="text"
            placeholder="Find..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full bg-neutral-800/50 px-21/2 font-body text-sm tracking-wide outline-none"
          />
        </div>

        {/* Shows & Select Columns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-base font-semibold">
              <Switch
                checked={shows.income}
                onCheckedChange={() => setShows({ ...shows, income: !shows.income })}
                className="bg-emerald-500/70"
              />
              Income
            </div>
            <div className="flex items-center justify-center gap-1.5 text-base font-semibold">
              <Switch
                checked={shows.expense}
                onCheckedChange={() => setShows({ ...shows, expense: !shows.expense })}
                className="bg-rose-500/70"
              />
              Expense
            </div>
          </div>

          <MultipleSelection
            trigger={
              <button className="bg-dark-100 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-dark shadow-md">
                Columns
              </button>
            }
            list={columns}
            selected={selectedColumns}
            onChange={(list: any[]) => setSelectedColumns(list)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <div className="flex min-w-max flex-col gap-1.5">
          <HeaderRow
            sort={sort}
            setSort={setSort}
            columns={selectedColumns}
            handleDeleteTransactions={handleDeleteTransactions}
            deleting={deleting}
            setSelectedTransactions={setSelectedTransactions}
            selectedTransactions={selectedTransactions}
            transactions={filteredData}
          />
          {/* Income */}
          {shows.income && (
            <>
              {filteredData
                .filter(item => item.type === 'income')
                .map(item => (
                  <Row
                    data={item}
                    columns={selectedColumns}
                    handleDeleteTransactions={handleDeleteTransactions}
                    deleting={deleting}
                    setSelectedTransactions={setSelectedTransactions}
                    selectedTransactions={selectedTransactions}
                    key={item._id}
                  />
                ))}
              <FooterRow
                data={filteredData.filter(item => item.type === 'income')}
                columns={columns}
                type="income"
              />
            </>
          )}

          <Separator />

          {/* Expense */}
          {shows.expense && (
            <>
              {filteredData
                .filter(item => item.type === 'expense')
                .map(item => (
                  <Row
                    data={item}
                    columns={selectedColumns}
                    handleDeleteTransactions={handleDeleteTransactions}
                    deleting={deleting}
                    setSelectedTransactions={setSelectedTransactions}
                    selectedTransactions={selectedTransactions}
                    key={item._id}
                  />
                ))}
              <FooterRow
                data={filteredData.filter(item => item.type === 'expense')}
                columns={columns}
                type="expense"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionTable

export function SkeletonTransactionTable() {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2 flex flex-col items-end justify-between gap-3 md:flex-row md:items-center">
        <div className="loading h-8 w-full rounded-md md:max-w-[300px]" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="loading h-8 w-24 rounded-md" />
            <div className="loading h-8 w-24 rounded-md" />
          </div>

          <div className="loading h-8 w-20 rounded-md" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}

        <Separator />

        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  )
}

function SkeletonRow() {
  return <div className="loading flex h-9 rounded-md bg-neutral-800/50" />
}

interface HeaderRowProps {
  sort: { column: string; order: 'asc' | 'desc' }
  setSort: Dispatch<{ column: string; order: 'asc' | 'desc' }>
  columns: string[]
  handleDeleteTransactions: (ids: string[]) => void
  deleting: string[]
  setSelectedTransactions: Dispatch<string[]>
  selectedTransactions: string[]
  transactions: IFullTransaction[]
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

interface RowProps {
  data: IFullTransaction
  handleDeleteTransactions: (ids: string[]) => void
  deleting: string[]
  columns: string[]
  setSelectedTransactions: Dispatch<SetStateAction<string[]>>
  selectedTransactions: string[]
}
function Row({
  data: transaction,
  columns,
  handleDeleteTransactions,
  deleting,
  setSelectedTransactions,
  selectedTransactions,
}: RowProps) {
  // store
  const { userSettings, exchangeRate } = useAppSelector(state => state.settings)

  // states
  const [data, setData] = useState<IFullTransaction>(transaction)

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
          <span>{data.category.icon}</span>{' '}
          <p className="line-clamp-2 overflow-hidden text-ellipsis">{data.category.name}</p>
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
            {formatCurrency(userSettings.currency, data.amount, exchangeRate)}
          </p>
        </div>
      )}

      <div className="flex flex-1 items-center justify-end gap-1">
        <EditTransactionDialog
          trigger={
            <button className="trans-200 rounded-md p-1 hover:bg-slate-200/30">
              <LuPen size={16} />
            </button>
          }
          transaction={data}
          update={(transaction: IFullTransaction) => {
            setData(transaction)
            console.log('update', transaction)
          }}
        />

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

interface FooterRowProps {
  data: IFullTransaction[]
  columns: string[]
  type: TransactionType
}
function FooterRow({ data, columns, type }: FooterRowProps) {
  // store
  const { userSettings, exchangeRate } = useAppSelector(state => state.settings)

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
              data.reduce((total, item) => total + item.amount, 0),
              exchangeRate
            )}
          </p>
        </div>
      )}
      <div className="flex flex-1 items-center justify-end" />
    </div>
  )
}
