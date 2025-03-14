'use client'

import TransactionTable, { SkeletonTransactionTable } from '@/components/TransactionTable'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { toUTC } from '@/lib/utils'
import Transaction from '@/patterns/prototypes/TransactionPrototype'
import { TransactionApis } from '@/patterns/proxies/TransactionApiProxy'
import { differenceInDays } from 'date-fns'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuRotateCcw } from 'react-icons/lu'

function TransactionsPage() {
  // states
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: moment().startOf('month').toDate(),
    to: moment().toDate(),
  })

  const getUserTransactions = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      const { transactions } = await TransactionApis.getUserTransactionsApi(
        toUTC(dateRange.from),
        toUTC(dateRange.to),
        { noCache: true }
      )

      const data: Transaction[] = []
      for (const tx of transactions) {
        const t = new Transaction(
          tx._id,
          tx.createdAt,
          tx.updatedAt,
          tx.amount,
          tx.description,
          tx.date,
          tx.userId,
          tx.type,
          tx.category
        )

        data.push(t)
      }

      setTransactions(data)
    } catch (err: any) {
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [dateRange])

  // get user transactions
  useEffect(() => {
    getUserTransactions()
  }, [getUserTransactions])

  return (
    <>
      <div className="border-b border-slate-200/30 bg-neutral-800/50">
        <div className="container flex flex-wrap items-center justify-between gap-3 px-21 py-8">
          <p className="text-xl font-bold">Transactions History</p>
          <div className="flex gap-2">
            <button
              className="group flex w-10 items-center justify-center rounded-full bg-neutral-700"
              onClick={getUserTransactions}
            >
              <LuRotateCcw
                size={18}
                className="trans-500 group-hover:-rotate-[360deg]"
              />
            </button>

            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
              onUpdate={values => {
                const { from, to } = values.range

                if (!from || !to) return
                if (differenceInDays(to, from) > +process.env.NEXT_PUBLIC_MAX_DATE_RANGE!) {
                  toast.error(
                    `The selected date range is too large. Max allowed range is ${process.env.NEXT_PUBLIC_MAX_DATE_RANGE} days!`
                  )
                  return
                }

                setDateRange({ from, to })
              }}
            />
          </div>
        </div>
      </div>

      <div className="container p-21/2 md:p-21">
        {!loading ? (
          <TransactionTable
            data={transactions}
            refresh={getUserTransactions}
          />
        ) : (
          <SkeletonTransactionTable />
        )}
      </div>
    </>
  )
}

export default TransactionsPage
