'use client'

import { TransactionType } from '@/lib/types'
import { ICategory } from '@/models/CategoryModel'
import { getUserCategoriesApi } from '@/requests/categoryRequests'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuChevronsUpDown, LuSearch, LuSprout, LuSquarePlus } from 'react-icons/lu'
import CreateCategoryDialog from './CreateCategoryDialog'

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

  return (
    <div className={`relative ${className}`}>
      {getting ? (
        <div className="loading h-9 rounded-md" />
      ) : (
        <button
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold"
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
                  <button
                    className="trans-200 rounded-md bg-neutral-950 px-21/2 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                    onClick={() => {
                      setOpen(false)
                      setSelectedCategory(category)
                      onChange(category._id)
                    }}
                    disabled={false}
                    key={category._id}
                  >
                    <span>{category.icon}</span> {category.name}
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-21">
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
