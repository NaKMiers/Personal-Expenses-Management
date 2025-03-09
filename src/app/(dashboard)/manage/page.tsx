'use client'

import CategoryItem from '@/components/CategoryItem'
import CreateCategoryDialog from '@/components/CreateCategoryDialog'
import CurrencyBox from '@/components/CurrencyBox'
import { TransactionType } from '@/lib/types'
import Category from '@/patterns/prototypes/CategoryPrototype'
import { getUserCategoriesApi } from '@/requests'
import { LucidePlusSquare } from 'lucide-react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { LuTrendingDown, LuTrendingUp } from 'react-icons/lu'

function ManagePage() {
  // states
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getUserCategoriesByType = useCallback(async () => {
    setLoading(true)

    try {
      const { categories } = await getUserCategoriesApi()

      const data: Category[] = []
      for (const category of categories) {
        const c = new Category(
          category._id,
          category.createdAt,
          category.updatedAt,
          category.name,
          category.userId,
          category.icon,
          category.type
        )
        data.push(c)
      }

      setCategories(data.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // init fetching
  useEffect(() => {
    getUserCategoriesByType()
  }, [getUserCategoriesByType])

  return (
    <>
      <div className="border-b border-slate-200/30 bg-neutral-800/50">
        <div className="container px-21 py-8">
          <p className="text-xl font-bold">Manage</p>
          <p className="text-slate-300/80">Manage your account settings and categories</p>
        </div>
      </div>

      <div className="container mt-21/2 flex flex-col gap-21/2 px-21/2 md:mt-21 md:gap-21 md:px-21">
        <CurrencyBox />

        <UserCategories
          loading={loading}
          type="income"
          categories={categories}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-emerald-500 bg-emerald-950">
              <LuTrendingUp size={24} />
            </div>
          }
          label="Income Categories"
          refresh={getUserCategoriesByType}
        />

        <UserCategories
          loading={loading}
          type="expense"
          categories={categories}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-rose-500 bg-rose-950">
              <LuTrendingDown size={24} />
            </div>
          }
          label="Expense Categories"
          refresh={getUserCategoriesByType}
        />
      </div>

      <div className="pt-40" />
    </>
  )
}

export default ManagePage

interface UserCategoriesProps {
  loading: boolean
  type: TransactionType
  categories: Category[]
  icon: ReactNode
  label: string
  refresh?: () => void
}

function UserCategories({ refresh, categories, loading, type, icon, label }: UserCategoriesProps) {
  return loading ? (
    <SkeletonUserCategories />
  ) : (
    <div className="w-full rounded-lg border border-slate-200/30 bg-neutral-800/50">
      <div className="flex items-center gap-21/2 border-b border-slate-200/30 p-21">
        {icon}
        <div className="flex flex-1 flex-col">
          <p className="text-base font-semibold md:text-2xl">{label}</p>
          <p className="text-sm font-semibold text-neutral-500/80">Sorted by name</p>
        </div>
        <CreateCategoryDialog
          type={type}
          update={() => refresh && refresh()}
          trigger={
            <button className="flex h-10 flex-shrink-0 items-center gap-1.5 rounded-md bg-white px-2 text-sm font-semibold text-dark md:px-4">
              <LucidePlusSquare size={20} />
              New Category
            </button>
          }
        />
      </div>

      <div className="flex flex-wrap p-1">
        {categories.length > 0 ? (
          categories.map(category => (
            <CategoryItem
              category={category}
              key={category._id}
              refresh={refresh}
            />
          ))
        ) : (
          <div className="flex w-full items-center justify-center p-21/2 text-center text-xl font-semibold text-slate-400 md:p-21">
            No categories found!
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonUserCategories() {
  return <div className="loading h-[240px] w-full rounded-lg border border-slate-200/30" />
}
