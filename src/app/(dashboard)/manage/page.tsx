'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import CreateCategoryDialog from '@/components/CreateCategoryDialog'
import CurrencyBox from '@/components/CurrencyBox'
import EditCategoryDialog from '@/components/EditCategoryDialog'
import { TransactionType } from '@/lib/types'
import { ICategory } from '@/models/CategoryModel'
import { deleteCategoryApi, getUserCategoriesApi } from '@/requests'
import { LucidePlusSquare } from 'lucide-react'
import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuPen, LuTrash, LuTrendingDown, LuTrendingUp } from 'react-icons/lu'

function ManagePage() {
  // states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [deleting, setDeleting] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getUserCategoriesByType = async () => {
      setLoading(true)

      try {
        const { categories } = await getUserCategoriesApi()
        setCategories((categories as ICategory[]).sort((a, b) => a.name.localeCompare(b.name)))
      } catch (err: any) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getUserCategoriesByType()
  }, [])

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
          deleting={deleting}
          setDeleting={setDeleting}
          loading={loading}
          type="income"
          categories={categories.filter(category => category.type === 'income')}
          setCategories={setCategories}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-emerald-500 bg-emerald-950">
              <LuTrendingUp size={24} />
            </div>
          }
          label="Income Categories"
        />

        <UserCategories
          deleting={deleting}
          setDeleting={setDeleting}
          loading={loading}
          type="expense"
          categories={categories.filter(category => category.type === 'expense')}
          setCategories={setCategories}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-rose-500 bg-rose-950">
              <LuTrendingDown size={24} />
            </div>
          }
          label="Expense Categories"
        />
      </div>

      <div className="pt-40" />
    </>
  )
}

export default ManagePage

interface UserCategoriesProps {
  loading: boolean
  deleting: string
  setDeleting: (id: string) => void
  categories: ICategory[]
  setCategories: Dispatch<SetStateAction<ICategory[]>>
  type: TransactionType
  icon: ReactNode
  label: string
}

function UserCategories({
  loading,
  deleting,
  categories,
  setDeleting,
  setCategories,
  type,
  icon,
  label,
}: UserCategoriesProps) {
  // delete category
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      if (!id) return

      // start loading
      setDeleting(id)
      toast.loading('Deleting category...', { id: 'delete-category' })

      try {
        const { deletedCategory, message } = await deleteCategoryApi(id)
        setCategories(categories.filter(category => category._id !== deletedCategory._id))
        toast.success(message, { id: 'delete-category' })
      } catch (err: any) {
        toast.error(err.message, { id: 'delete-category' })
        console.log(err)
      } finally {
        // stop loading
        setDeleting('')
      }
    },
    [categories, setCategories, setDeleting]
  )

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
          update={(category: ICategory) =>
            setCategories([category, ...categories].sort((a, b) => a.name.localeCompare(b.name)))
          }
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
            <div
              className="w-1/3 p-1"
              key={category._id}
            >
              <div className="flex flex-col rounded-lg border border-slate-200/30">
                <div className="flex w-full flex-col items-center justify-center gap-1 p-4">
                  <span className="text-3xl">{category.icon}</span>
                  <p className="font-body text-base font-semibold">{category.name}</p>
                </div>
                <div className="flex h-9 w-full items-center justify-center gap-1 bg-neutral-600/50 p-1 text-slate-300">
                  <ConfirmDialog
                    label="Delete category"
                    subLabel={`Are you sure you want to delete Salary category?`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={() => handleDeleteCategory(category._id)}
                    disabled={deleting === category._id}
                    trigger={
                      <button className="trans-200 flex h-full w-full items-center justify-center gap-2 rounded-md hover:bg-neutral-600">
                        <LuTrash />
                        <span className="text-sm">Remove</span>
                      </button>
                    }
                  />
                  <EditCategoryDialog
                    category={category}
                    className="flex h-full w-full items-center justify-center"
                    trigger={
                      <button className="trans-200 flex h-full w-full items-center justify-center gap-2 rounded-md hover:bg-neutral-600">
                        <LuPen />
                        <span className="text-sm">Edit</span>
                      </button>
                    }
                    update={(category: ICategory) =>
                      setCategories(prev =>
                        prev.map(cate => (cate._id === category._id ? category : cate))
                      )
                    }
                  />
                </div>
              </div>
            </div>
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
