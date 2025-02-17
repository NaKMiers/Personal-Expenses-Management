'use client'

import { TransactionType } from '@/lib/types'
import { ICategory } from '@/models/CategoryModel'
import { deleteCategoryApi, getUserCategoriesApi } from '@/requests/categoryRequests'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuChevronsUpDown, LuSearch, LuSprout, LuSquarePlus, LuX } from 'react-icons/lu'
import CreateCategoryDialog from './CreateCategoryDialog'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'

interface CategoryPickerProps {
  type: TransactionType
  onChange: (value: string) => void
  className?: string
}

function CategoryPicker({ type, onChange, className = '' }: CategoryPickerProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

  const [getting, setGetting] = useState<boolean>(true)
  const [deleting, setDeleting] = useState<string>('')
  const [filterText, setFilterText] = useState<string>('')

  // get user categories
  const getUserCategories = useCallback(async () => {
    // start loading
    setGetting(true)

    try {
      const { categories } = await getUserCategoriesApi()

      console.log('categories:', categories)

      setCategories(categories)
      setFilteredCategories(categories)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setGetting(false)
    }
  }, [])

  // initially get user categories
  useEffect(() => {
    getUserCategories()
  }, [getUserCategories])

  // filter categories
  useEffect(() => {
    if (!categories.length) return
    if (!filterText.trim()) {
      setFilteredCategories(categories)
      return
    }

    const results = categories.filter(
      category =>
        category.name.toLowerCase().trim().includes(filterText.toLowerCase().trim()) ||
        category.icon.toLowerCase().trim().includes(filterText.toLowerCase().trim())
    )

    setFilteredCategories(results)
  }, [categories, filterText])

  // delete category
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      if (!id) return

      // start loading
      setDeleting(id)

      try {
        const { deletedCategory, message } = await deleteCategoryApi(id)

        setCategories(categories.filter(category => category._id !== deletedCategory._id))
        setFilteredCategories(
          filteredCategories.filter(category => category._id !== deletedCategory._id)
        )
        if (selectedCategory?._id === deletedCategory._id) setSelectedCategory(null)

        toast.success(message, { id: 'delete-category' })
      } catch (err: any) {
        toast.error(err.message, { id: 'delete-category' })
        console.log(err)
      } finally {
        // stop loading
        setDeleting('')
      }
    },
    [selectedCategory, categories, filteredCategories]
  )

  return (
    <div className={`relative ${className}`}>
      {getting ? (
        <div className="loading h-9 rounded-md" />
      ) : (
        <button
          className="px-21/2 flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 text-start text-sm font-semibold"
          onClick={() => setOpen(!open)}
        >
          {selectedCategory ? (
            <p>
              <span>😉</span> {selectedCategory?.name}
            </p>
          ) : (
            'Select category'
          )}

          <LuChevronsUpDown size={18} />
        </button>
      )}

      {open && (
        <div
          className="fixed left-0 top-0 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-full w-full overflow-hidden rounded-md bg-neutral-950"
          >
            <div className="flex h-10 items-center border-b border-slate-200/30">
              <div className="flex h-8 w-10 flex-shrink-0 items-center justify-center">
                <LuSearch
                  className="text-slate-300"
                  size={16}
                />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Filter currency..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-sm placeholder:text-slate-300"
              />
            </div>

            <CreateCategoryDialog
              type={type}
              refetch={getUserCategories}
              trigger={
                <button className="trans-200 flex h-10 w-full items-center border-b border-slate-200/30 hover:bg-slate-200/30">
                  <div className="flex h-8 w-10 flex-shrink-0 items-center justify-center">
                    <LuSquarePlus
                      className="text-slate-300"
                      size={16}
                    />
                  </div>
                  <span className="text-sm text-slate-300">Create new</span>
                </button>
              }
            />

            <div className="flex max-h-[120px] flex-col overflow-y-auto p-1">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <div
                    className="flex gap-1"
                    key={category._id}
                  >
                    <button
                      className="trans-200 px-21/2 w-full rounded-md bg-neutral-950 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                      onClick={() => {
                        setOpen(false)
                        setSelectedCategory(category)
                        onChange(category._id)
                      }}
                      disabled={false}
                    >
                      <span>{category.icon}</span> {category.name}
                    </button>
                    <ConfirmDialog
                      label="Delete category"
                      subLabel={`Are you sure you want to delete ${category.name} category?`}
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      onConfirm={() => handleDeleteCategory(category._id)}
                      disabled={deleting === category._id}
                      trigger={
                        <button className="trans-200 px-21/2 flex-shrink-0 rounded-md bg-neutral-950 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30">
                          {deleting === category._id ? (
                            <RiDonutChartFill
                              size={16}
                              className="animate-spin text-slate-400"
                            />
                          ) : (
                            <LuX size={16} />
                          )}
                        </button>
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="p-21 flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-slate-300">Category not found</p>
                  <p className="mt-1 text-xs text-slate-300/80">Create new category now!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoryPicker
