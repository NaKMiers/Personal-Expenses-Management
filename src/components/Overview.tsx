'use client'

import { OverviewType } from '@/app/api/stats/overview/route'
import { toUTC } from '@/lib/utils'
import Category from '@/patterns/prototypes/CategoryPrototype'
import Transaction from '@/patterns/prototypes/TransactionPrototype'
import { StatApis } from '@/patterns/proxies/StatApiProxy'
import { differenceInDays } from 'date-fns'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuRotateCcw } from 'react-icons/lu'
import History from './History'
import StatCards from './StatCards'
import TransactionByCategories from './TransactionByCategories'
import { DateRangePicker } from './ui/DateRangePicker'
import { BudgetCard } from '@/components/BudgetCard'

function Overview() {
  // states
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: moment().startOf('month').toDate(),
    to: moment().toDate(),
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [overview, setOverview] = useState<OverviewType | null>(null)
  const [types, setTypes] = useState<any>(null)
  const [typeGroups, setTypeGroups] = useState<any>(null)
  const [cateGroups, setCateGroups] = useState<any>(null)
  const [budgets, setBudgets] = useState<any[]>([])

  // get overview
  const getOverview = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      const { overview, types, typeGroups } = await StatApis.getOverviewApi(
        toUTC(dateRange.from),
        toUTC(dateRange.to)
      )
      const budgetsResponse = await fetch('/api/budgets');
      const { budgets } = await budgetsResponse.json();

      console.log("Budgets data received:", budgets);

      setOverview(overview)
      setTypes(types)
      setTypeGroups(typeGroups)
      setBudgets(budgets)

      // extract categories
      const incomeCategories = typeGroups.income.map((transaction: Transaction) => transaction.category)
      const uniqueIncomeCategories: any[] = Array.from(
        new Map(incomeCategories.map((category: Category) => [category._id, category])).values()
      )

      const expenseCategories = typeGroups.expense.map(
        (transaction: Transaction) => transaction.category
      )
      const uniqueExpenseCategories: any[] = Array.from(
        new Map(expenseCategories.map((category: Category) => [category._id, category])).values()
      )

      const investmentCategories = typeGroups.investment.map(
        (transaction: Transaction) => transaction.category
      )
      const uniqueInvestmentCategories: any[] = Array.from(
        new Map(investmentCategories.map((category: Category) => [category._id, category])).values()
      )

      const budgetCategories = typeGroups?.budget
        ? typeGroups.budget.map((transaction: Transaction) => transaction.category)
        : [];

      const uniqueBudgetCategories: any[] = Array.from(
        new Map(budgetCategories.map((category: Category) => [category._id, category])).values()
      );


      setCateGroups({
        income: uniqueIncomeCategories,
        expense: uniqueExpenseCategories,
        investment: uniqueInvestmentCategories,
        budget: uniqueBudgetCategories,
      })

    } catch (err: any) {
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [dateRange])

  // initially get stats
  useEffect(() => {
    getOverview()
  }, [getOverview])

  return (
    <>
      {/* Date Range */}
      <div className="flex flex-wrap items-end justify-between gap-2 px-21/2 py-6 md:px-21">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="flex gap-3">
          <button
            className="group flex w-10 items-center justify-center rounded-full bg-neutral-700"
            onClick={getOverview}
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

      {/* Stats */}
      <div className="px-21/2 md:px-21">
        <StatCards
          loading={loading}
          overview={overview}
        />
      </div>

      {/* Transaction By Categories */}
      <div className="mt-21/2 px-21/2 md:mt-21 md:px-21">
        <TransactionByCategories
          loading={loading}
          types={types}
        />
      </div>

      {/* Budget list */}
      <div className="mt-6 px-6">
        <h2 className="text-2xl font-bold mb-4">Danh sách Ngân Sách</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-md border border-slate-200/30 bg-gray-800 animate-pulse h-36" />
            ))}
          </div>
        ) : budgets.length > 0 ? (
          <div className="grid gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={{
                  ...budget,
                  startDate: new Date(budget.startDate),
                  endDate: new Date(budget.endDate)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-800">
            <p className="text-gray-400">Chưa có ngân sách nào được tạo</p>
          </div>
        )}
      </div>


      <div className="mt-21/2 px-21/2 md:mt-21 md:px-21">
        <div className="py-6">
          <h2 className="text-2xl font-bold">History</h2>
        </div>

        {typeGroups && cateGroups && !loading ? (
          <History
            from={dateRange.from}
            to={dateRange.to}
            typeGroups={typeGroups}
            cateGroups={cateGroups}
            loading={loading}
          />
        ) : (
          <HistorySkeleton />
        )}
      </div>
    </>
  )
}

export default Overview

function HistorySkeleton() {
  return (
    <div className="loading h-[500px] rounded-lg border border-slate-200/30 bg-neutral-800/30 pr-21/2" />
  )
}
