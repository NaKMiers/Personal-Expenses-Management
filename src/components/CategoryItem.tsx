import ConfirmDialog from '@/components/ConfirmDialog'
import EditCategoryDialog from '@/components/EditCategoryDialog'
import Category from '@/patterns/prototypes/CategoryPrototype'
import { deleteCategoryApi } from '@/requests'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { LuCopy, LuLoader, LuPen, LuTrash } from 'react-icons/lu'

interface CategoryItemProps {
  category: Category
  refresh?: () => void
}

function CategoryItem({ category, refresh }: CategoryItemProps) {
  // states
  const [duplicating, setDuplicating] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const handleDuplicateCategory = useCallback(async () => {
    // start loading
    setDuplicating(true)

    try {
      await category.clone()

      if (refresh) refresh()
    } catch (err: any) {
      toast.error(err.message, { id: 'duplicate-category' })
      console.log(err)
    } finally {
      // stop loading
      setDuplicating(false)
    }
  }, [category, refresh])

  // delete category
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      if (!id) return

      // start loading
      setDeleting(true)
      toast.loading('Deleting category...', { id: 'delete-category' })

      try {
        const { message } = await deleteCategoryApi(id)
        toast.success(message, { id: 'delete-category' })

        refresh && refresh()
      } catch (err: any) {
        toast.error(err.message, { id: 'delete-category' })
        console.log(err)
      } finally {
        // stop loading
        setDeleting(false)
      }
    },
    [setDeleting, refresh]
  )

  return (
    <div className="w-1/3 p-1">
      <div className="flex flex-col rounded-lg border border-slate-200/30">
        <div className="flex w-full flex-col items-center justify-center gap-1 p-4">
          <span className="text-3xl">{category.icon}</span>
          <p className="font-body text-base font-semibold">{category.name}</p>
        </div>
        <div className="flex h-9 w-full items-center justify-center gap-1 bg-neutral-600/50 p-1 text-slate-300">
          <button
            className="trans-200 flex h-full w-full items-center justify-center gap-2 rounded-md hover:bg-neutral-600"
            onClick={handleDuplicateCategory}
            disabled={duplicating}
          >
            {!duplicating ? (
              <LuCopy size={16} />
            ) : (
              <LuLoader
                size={16}
                className="animate-spin"
              />
            )}
          </button>

          <ConfirmDialog
            label="Delete category"
            subLabel={`Are you sure you want to delete Salary category?`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => handleDeleteCategory(category._id)}
            disabled={deleting}
            trigger={
              <button className="trans-200 flex h-full w-full items-center justify-center gap-2 rounded-md hover:bg-neutral-600">
                <LuTrash />
                <span className="hidden text-sm md:block">Remove</span>
              </button>
            }
          />

          <EditCategoryDialog
            category={category}
            className="flex h-full w-full items-center justify-center"
            trigger={
              <button className="trans-200 flex h-full w-full items-center justify-center gap-2 rounded-md hover:bg-neutral-600">
                <LuPen />
                <span className="hidden text-sm md:block">Edit</span>
              </button>
            }
            update={() => refresh && refresh()}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryItem
