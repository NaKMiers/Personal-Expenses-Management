'use client'

import { TransactionType } from '@/lib/types'
import Category from '@/patterns/prototypes/CategoryPrototype'
import { CategoryApis } from '@/patterns/proxies/CategoryApiProxy'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuChevronsUpDown, LuCopy, LuSearch, LuSquarePlus, LuX } from 'react-icons/lu'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import CreateCategoryDialog from './CreateCategoryDialog'

interface CategoryPickerProps {
  type: TransactionType
  onChange: (value: string) => void
  initCategory?: Category
  className?: string
}

function CategoryPicker({ type, onChange, initCategory, className = '' }: CategoryPickerProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initCategory || null)

  const [getting, setGetting] = useState<boolean>(true)
  const [deleting, setDeleting] = useState<string>('')
  const [filterText, setFilterText] = useState<string>('')

  // get user categories
  const getUserCategories = useCallback(async () => {
    // start loading
    setGetting(true)

    try {
      const { categories } = await CategoryApis.getUserCategoriesApi(type, { noCache: true })
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

      setCategories(data)
      setFilteredCategories(data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setGetting(false)
    }
  }, [type])

  // initially get user data
  useEffect(() => {
    getUserCategories()
  }, [getUserCategories])

  // filter categories
  useEffect(() => {
    if (!categories?.length) return
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
        const { deletedCategory, message } = await CategoryApis.deleteCategoryApi(id)

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
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold"
          onClick={() => setOpen(!open)}
        >
          {selectedCategory ? (
            <p>
              <span>{selectedCategory.icon}</span> {selectedCategory?.name}
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
              refresh={getUserCategories}
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
              {filteredCategories?.length > 0 ? (
                filteredCategories.map(category => (
                  <div
                    className="flex items-center justify-center gap-1"
                    key={category._id}
                  >
                    <button
                      className="trans-200 flex-1 rounded-md bg-neutral-950 px-21/2 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                      onClick={() => {
                        setOpen(false)
                        setSelectedCategory(category)
                        onChange(category._id)
                      }}
                      disabled={false}
                    >
                      <span>{category.icon}</span> {category.name}
                    </button>

                    <button
                      className="trans-200 flex h-6 flex-shrink-0 items-center rounded-sm bg-neutral-950 px-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                      onClick={async () => {
                        await category.clone()
                        getUserCategories()
                      }}
                    >
                      <LuCopy size={12} />
                    </button>

                    <ConfirmDialog
                      label="Delete category"
                      subLabel={`Are you sure you want to delete ${category.name} category?`}
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      onConfirm={() => handleDeleteCategory(category._id)}
                      disabled={deleting === category._id}
                      className="!h-auto !w-auto"
                      trigger={
                        <button className="trans-200 items-center5 flex h-6 flex-shrink-0 items-center rounded-sm bg-neutral-950 px-1 text-start text-sm font-semibold hover:bg-slate-200/30">
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
