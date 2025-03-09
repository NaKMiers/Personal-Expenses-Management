import { useAppSelector } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import Category from '@/patterns/prototypes/CategoryPrototype'
import Transaction from '@/patterns/prototypes/TransactionPrototype'
import { TransactionApis } from '@/patterns/proxies/TransactionApiProxy'
import { Separator } from '@radix-ui/react-select'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuSearch } from 'react-icons/lu'
import FooterRow from './FooterRow'
import HeaderRow from './HeaderRow'
import { MultipleSelection } from './History'
import Row from './Row'
import { Switch } from './ui/switch'

interface ITransactionTableProps {
  data: Transaction[]
  refresh?: () => void
}
function TransactionTable({ data, refresh }: ITransactionTableProps) {
  // store
  const { userSettings } = useAppSelector(state => state.settings)

  // values
  const columns = ['category', 'description', 'date', 'amount']

  // states
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns)
  const [filterText, setFilterText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<Transaction[]>(data)
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

  // MARK: filter data
  useEffect(() => {
    let newData: Transaction[] = [...data]

    newData = newData.sort((a, b) => {
      if (sort.column === 'category') {
        return sort.order === 'asc'
          ? (a.category as Category).name.localeCompare((b.category as Category).name)
          : (b.category as Category).name.localeCompare((a.category as Category).name)
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
      newData = newData.filter(({ description, category, amount, type }) => {
        let text = ''
        const categoryData: Category = category as Category
        if (selectedColumns.includes('category')) text += `${categoryData.name} ${categoryData.icon}`
        if (selectedColumns.includes('description')) text += ` ${description}`
        if (selectedColumns.includes('amount'))
          text += ` ${formatCurrency(userSettings.currency, amount)}`
        return text.toLowerCase().includes(filterText.toLowerCase())
      })
    }

    setFilteredData(newData)
  }, [data, sort, filterText, userSettings.currency, selectedColumns])

  // MARK: delete transaction
  const handleDeleteTransactions = useCallback(
    async (ids: string[]) => {
      // start loading
      setDeleting(ids)

      toast.loading('Deleting transactions...', { id: 'delete-transactions' })

      try {
        const { message } = await TransactionApis.deleteTransactionsApi(ids)

        // update transactions
        setFilteredData(prevData => prevData.filter(item => !ids.includes(item._id)))

        toast.success(message, { id: 'delete-transactions' })

        if (refresh) refresh()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message, { id: 'delete-transactions' })
      } finally {
        // stop loading
        setDeleting([])
      }
    },
    [refresh]
  )

  return (
    <div>
      <div className="mb-2 flex flex-col items-end justify-between gap-3 md:flex-row md:items-center">
        {/* MARK: Search */}
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

        {/* MARK: Shows & Select Columns */}
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
          {/* MARK: Header */}
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
          {/* MARK: Income */}
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
                    refresh={refresh}
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

          {/* MARK: Expense */}
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
                    refresh={refresh}
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

// MARK: Table Skeleton
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
