import { useAppSelector } from '@/hooks'
import { cn, toUTC } from '@/lib/utils'
import { ICategory } from '@/models/CategoryModel'
import { IFullTransaction } from '@/models/TransactionModel'
import { AnimatePresence, motion } from 'framer-motion'
import { default as moment, default as momentTZ } from 'moment-timezone'
import { ReactNode, useEffect, useState } from 'react'
import Chart, { ChartDatum, ChartType } from './Chart'
import { Switch } from './ui/switch'

interface HistoryProps {
  from: Date
  to: Date
  typeGroups: any
  cateGroups: any
  loading: boolean
  className?: string
}

function History({ from, to, typeGroups, cateGroups, className = '' }: HistoryProps) {
  // store
  const { userSettings, exchangeRate } = useAppSelector(state => state.settings)

  // states
  const incomeCates = cateGroups?.income || []
  const [selectedIncomeCates, setSelectedIncomeCates] = useState<ICategory[]>(incomeCates)

  const expenseCates = cateGroups?.expense || []
  const [selectedExpenseCates, setSelectedExpenseCates] = useState<ICategory[]>(expenseCates)

  const investmentCates = cateGroups?.investment || []
  const [selectedInvestmentCates, setSelectedInvestmentCates] = useState<ICategory[]>(investmentCates)

  // chart data
  const [data, setData] = useState<any[]>([])
  const [chart, setChart] = useState<ChartType>('Line')
  const [showIncome, setShowIncome] = useState<boolean>(true)
  const [showExpense, setShowExpense] = useState<boolean>(true)
  const [showInvestment, setShowInvestment] = useState<boolean>(true)
  // values
  const charts: ChartType[] = ['Line', 'Bar', 'Area', 'Radar']
  const temp = [...typeGroups.income, ...typeGroups.expense, ...typeGroups.investment]
  const maxKey =
    temp.length > 0
      ? temp.reduce((max, transaction) => (transaction.amount > max.amount ? transaction : max)).type
      : 'income'

  // auto update chart data
  useEffect(() => {
    if (!typeGroups || !userSettings || !exchangeRate) return

    // filter transactions
    let filteredIncomeTransactions = typeGroups.income
    let filteredExpenseTransactions = typeGroups.expense
    let filteredInvestmentTransactions = typeGroups.investment

    // filter income transactions by categories
    filteredIncomeTransactions = filteredIncomeTransactions.filter((transaction: IFullTransaction) =>
      selectedIncomeCates.some(cate => transaction.category._id === cate._id)
    )

    // filter expense transactions by categories
    filteredExpenseTransactions = filteredExpenseTransactions.filter((transaction: IFullTransaction) =>
      selectedExpenseCates.some(cate => transaction.category._id === cate._id)
    )

    // filter investment transactions by categories
    filteredInvestmentTransactions = filteredInvestmentTransactions.filter(
      (transaction: IFullTransaction) =>
        selectedInvestmentCates.some(cate => transaction.category._id === cate._id)
    )

    // split data into columns
    // x = end date - start date
    // x > 1 years -> split charts into cols of years
    // 1 year >= x > 1 months -> split charts into cols of months
    // 1 month >= x > 1 days -> split charts into cols of days
    // 1 day >= x > 1 hours -> split charts into cols of hours

    const start = toUTC(momentTZ(from).startOf('day').toDate())
    const end = toUTC(momentTZ(to).endOf('day').toDate())

    const duration = momentTZ(end).diff(momentTZ(start), 'seconds')
    const oneDayInSeconds = 24 * 60 * 60

    let splitGranularity = 'years'
    if (duration > oneDayInSeconds * 366) {
      // > 1 year
      splitGranularity = 'years'
    } else if (duration > oneDayInSeconds * 62) {
      // > 2 months
      splitGranularity = 'months'
    } else if (duration > oneDayInSeconds) {
      // > 1 day
      splitGranularity = 'days'
    } else if (duration > 60 * 60) {
      // > 1 hour
      splitGranularity = 'hours'
    }

    // Initialize an empty data object
    const groupedData: ChartDatum[] = []
    const iterator = momentTZ(start)

    while (iterator.isBefore(end)) {
      const colStart = iterator.clone()
      let colEnd = colStart.clone().endOf(splitGranularity as moment.unitOfTime.StartOf)

      // Filter transactions in this range
      const chunkIncomeTransactions = filteredIncomeTransactions.filter(
        (transaction: IFullTransaction) => {
          const transactionDate = momentTZ(transaction.date).utc()
          return transactionDate.isBetween(colStart, colEnd, undefined, '[)')
        }
      )

      // Filter expense in this range
      const chunkExpenseTransactions = filteredExpenseTransactions.filter(
        (transaction: IFullTransaction) => {
          const transactionDate = momentTZ(transaction.date).utc()
          return transactionDate.isBetween(colStart, colEnd, undefined, '[)')
        }
      )

      const chunkInvestmentTransactions = filteredInvestmentTransactions.filter(
        (transaction: IFullTransaction) => {
          const transactionDate = momentTZ(transaction.date).utc()
          return transactionDate.isBetween(colStart, colEnd, undefined, '[)')
        }
      )
      // Calculate total value
      let totalIncomeTransactionValue = chunkIncomeTransactions.reduce(
        (total: number, transaction: any) => total + (transaction.amount || 0),
        0
      )

      // Calculate total value
      let totalExpenseTransactionValue = chunkExpenseTransactions.reduce(
        (total: number, transaction: any) => total + (transaction.amount || 0),
        0
      )

      let totalInvestmentTransactionValue = chunkInvestmentTransactions.reduce(
        (total: number, transaction: any) => total + (transaction.amount || 0),
        0
      )

      let dateFormat = 'DD'
      switch (splitGranularity) {
        case 'years':
          dateFormat = 'YYYY'
          break
        case 'months':
          dateFormat = 'MMM'
          break
        case 'days':
          dateFormat = 'MMM DD'
          break
        case 'hours':
          dateFormat = 'HH:00'
          break
        default:
          break
      }

      groupedData.push({
        name: colStart.format(dateFormat),
        income: totalIncomeTransactionValue,
        expense: totalExpenseTransactionValue,
        investment: totalInvestmentTransactionValue,
      })

      iterator.add(1, splitGranularity as moment.unitOfTime.DurationConstructor)
    }

    setData(groupedData)
  }, [
    from,
    to,
    typeGroups,
    exchangeRate,
    userSettings,
    selectedIncomeCates,
    selectedExpenseCates,
    selectedInvestmentCates,
  ])

  return (
    <div className={cn('rounded-lg border border-slate-200/30 bg-neutral-800/30', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 p-21">
        {/* Categories Selection */}
        <div className="flex items-center gap-4">
          <MultipleSelection
            trigger={
              <button className="trans-200 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-dark shadow-md">
                {selectedIncomeCates?.length ?? 0}{' '}
                {selectedIncomeCates?.length !== 1 ? 'categories' : 'category'}
              </button>
            }
            list={incomeCates}
            selected={selectedIncomeCates}
            onChange={(list: any[]) => setSelectedIncomeCates(list)}
          />

          <MultipleSelection
            trigger={
              <button className="trans-200 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-dark shadow-md">
                {selectedExpenseCates.length}{' '}
                {selectedExpenseCates.length !== 1 ? 'categories' : 'category'}
              </button>
            }
            list={expenseCates}
            selected={selectedExpenseCates}
            onChange={(list: any[]) => setSelectedExpenseCates(list)}
          />

          <MultipleSelection
            trigger={
              <button className="trans-200 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-dark shadow-md">
                {selectedInvestmentCates.length}{' '}
                {selectedInvestmentCates.length !== 1 ? 'categories' : 'category'}
              </button>
            }
            list={investmentCates}
            selected={selectedInvestmentCates}
            onChange={(list: any[]) => setSelectedInvestmentCates(list)}
          />
        </div>

        {/* Income and Expense ,Investment */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center gap-1.5 text-base font-semibold">
            <Switch
              checked={showIncome}
              onCheckedChange={() => setShowIncome(!showIncome)}
              className="bg-emerald-500/70"
            />
            Income
          </div>

          <div className="flex items-center justify-center gap-1.5 text-base font-semibold">
            <Switch
              checked={showExpense}
              onCheckedChange={() => setShowExpense(!showExpense)}
              className="bg-rose-500/70"
            />
            Expense
          </div>

          <div className="flex items-center justify-center gap-1.5 text-base font-semibold">
            <Switch
              checked={showInvestment}
              onCheckedChange={() => setShowInvestment(!showInvestment)}
              className="bg-yellow-500/70"
            />
            Investment
          </div>
          {/* Chart Selection */}
          <SingleSelection
            trigger={
              <button className="bg-dark-100 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-dark shadow-md">
                {chart}
              </button>
            }
            list={charts}
            selected={chart}
            onChange={value => setChart(value)}
          />
        </div>
      </div>

      <Chart
        shows={[showIncome, showExpense, showInvestment]}
        maxKey={maxKey}
        chart={chart}
        data={data}
        userSettings={userSettings}
        exchangeRate={exchangeRate}
        className="-ml-21 pr-21/2"
      />
    </div>
  )
}

export default History

interface SingleSelectionProps {
  trigger: ReactNode
  list: any[]
  selected: any
  onChange: (value: any) => void
}

function SingleSelection({ trigger, list, selected, onChange }: SingleSelectionProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {/* overlay */}
      {open && (
        <div
          className="fixed left-0 top-0 z-10 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-h-[400px] max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-y-auto rounded-md bg-neutral-800 shadow-md"
            onClick={() => setOpen(false)}
          >
            {list.map((type, index) => (
              <button
                className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-700 ${
                  selected === type ? 'border-l-2 border-primary pl-2' : ''
                }`}
                onClick={() => onChange(type)}
                key={index}
              >
                <p className="text-nowrap">{type}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MultiSelectionProps {
  trigger: ReactNode
  list: any[]
  selected: any[]
  onChange: (value: any) => void
}

export function MultipleSelection({ trigger, list, selected, onChange }: MultiSelectionProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)
  const isObjectItem = Array.isArray(list) && list?.[0] && typeof list[0] === 'object'

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className="fixed left-0 top-0 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-h-[400px] max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-y-auto rounded-md bg-neutral-800 shadow-md"
          >
            <button
              className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider text-light ${
                selected.length === list.length ? 'border-l-2 border-primary pl-2' : ''
              }`}
              onClick={selected.length === list.length ? () => onChange([]) : () => onChange(list)}
            >
              <span className="text-nowrap">All</span>
            </button>
            {list.map((item, index) => (
              <button
                className={`trans-200 trans-200 bg-neutral-800 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider text-light ${
                  (
                    isObjectItem
                      ? selected.some((ele: any) => ele._id.toString() === item._id.toString())
                      : selected.includes(item)
                  )
                    ? 'border-l-2 border-primary pl-2'
                    : ''
                }`}
                onClick={() => {
                  if (isObjectItem) {
                    if (selected.some((ele: any) => ele._id.toString() === item._id.toString())) {
                      return onChange(selected.filter(ele => ele._id.toString() !== item._id.toString()))
                    } else {
                      return onChange([...selected, item])
                    }
                  } else {
                    if (selected.includes(item)) {
                      return onChange(selected.filter(ele => ele !== item))
                    } else {
                      return onChange([...selected, item])
                    }
                  }
                }}
                key={index}
              >
                <p className="text-nowrap capitalize">{isObjectItem ? item.name : item}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
