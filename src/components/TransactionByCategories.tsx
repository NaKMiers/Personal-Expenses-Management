import React from 'react'
import { Progress } from './ui/progress'
import { formatCurrency } from '@/lib/utils'

interface TransactionByCategoriesProps {
  loading: boolean
  types: any
  userSettings: any
  exchangeRate: number
  className?: string
}

function TransactionByCategories({
  loading,
  types,
  userSettings,
  exchangeRate,
  className = '',
}: TransactionByCategoriesProps) {
  return (
    <div className={`grid grid-cols-1 gap-21/2 md:grid-cols-2 ${className}`}>
      {types?.income && !loading ? (
        <Category
          label="Incomes by category"
          categories={types.income}
          currency={userSettings?.currency}
          rate={exchangeRate}
          color="bg-emerald-500"
        />
      ) : (
        <SkeletonCategory />
      )}
      {types?.expense && !loading ? (
        <Category
          label="Expenses by category"
          categories={types.expense}
          currency={userSettings?.currency}
          rate={exchangeRate}
          color="bg-rose-500"
        />
      ) : (
        <SkeletonCategory />
      )}
    </div>
  )
}

interface CategoryProps {
  label: string
  currency: string
  rate: number
  categories: any[]
  color: string
}

function Category({ label, categories, currency, rate, color }: CategoryProps) {
  return (
    <div className="rounded-md border border-slate-200/30 bg-neutral-800/30 p-21">
      <p className="font-body text-lg font-bold uppercase tracking-wider text-neutral-500">{label}</p>

      <div className="mt-6 flex flex-col gap-3 md:mt-8">
        {categories.map(({ category, total }) => (
          <div key={category._id}>
            <div className="flex justify-between gap-2">
              <p className="text-sm font-semibold text-neutral-400">
                <span>{category.icon}</span> <span>{category.name} (50%)</span>
              </p>

              <p className="text-sm font-semibold text-neutral-400">
                {formatCurrency(currency, total, rate)}
              </p>
            </div>

            <Progress
              value={50}
              className="mt-2 bg-neutral-700"
              indicator={color}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonCategory() {
  return <div className="loading h-60 rounded-md border border-slate-200/30 p-21" />
}

export default TransactionByCategories
