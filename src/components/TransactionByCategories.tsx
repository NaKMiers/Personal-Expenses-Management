import { useAppSelector } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import { Progress } from './ui/progress'

interface TransactionByCategoriesProps {
  loading: boolean
  types: any
  className?: string
}

function TransactionByCategories({ loading, types, className = '' }: TransactionByCategoriesProps) {
  // store
  const { userSettings } = useAppSelector(state => state.settings)

  return (
    <div className={`grid grid-cols-1 gap-21/2 md:grid-cols-2 ${className}`}>
      {types?.income && !loading ? (
        <Category
          label="Incomes by category"
          categories={types.income}
          currency={userSettings?.currency}
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
  categories: any[]
  color: string
}

function Category({ label, categories, currency, color }: CategoryProps) {
  const allTotal = categories.reduce((acc, category) => acc + (category.total || 0), 0)

  return (
    <div className="rounded-md border border-slate-200/30 bg-neutral-800/30 p-21">
      <p className="font-body text-lg font-bold uppercase tracking-wider text-neutral-500">{label}</p>

      <div className="mt-6 flex flex-col gap-3 md:mt-8">
        {categories.length ? (
          categories.map(({ category, total }) => (
            <div key={category._id}>
              <div className="flex justify-between gap-2">
                <p className="text-sm font-semibold text-neutral-400">
                  <span>{category.icon}</span>{' '}
                  <span>
                    {category.name} ({((total / allTotal) * 100).toFixed(0)}% )
                  </span>
                </p>

                <p className="text-sm font-semibold text-neutral-400">
                  {formatCurrency(currency, total)}
                </p>
              </div>

              <Progress
                value={(total / allTotal) * 100}
                className="mt-2 bg-neutral-700"
                indicator={color}
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center border-t border-slate-200/30 px-21 pt-21/2 text-xl font-bold text-neutral-500">
            No Category Found
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonCategory() {
  return <div className="loading h-60 rounded-md border border-slate-200/30 p-21" />
}

export default TransactionByCategories
