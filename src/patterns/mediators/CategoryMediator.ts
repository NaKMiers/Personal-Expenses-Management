import { FieldValues } from 'react-hook-form'
import toast from 'react-hot-toast'
import Category from '../prototypes/CategoryPrototype'
import { CategoryApis } from '../proxies/CategoryApiProxy'
import { IMediator } from './IMediator'

interface CategoryMediator extends IMediator {
  create(data: FieldValues, refresh?: () => void, update?: (category: Category) => void): Promise<void>
  edit(categoryId: string, data: FieldValues, update: (category: Category) => void): Promise<void>
  validate(
    data: FieldValues,
    setError: (field: string, error: { type: string; message: string }) => void
  ): boolean
}

class ConcreteCategoryMediator implements CategoryMediator {
  async create(
    data: FieldValues,
    refresh?: () => void,
    update?: (category: Category) => void
  ): Promise<void> {
    toast.loading('Creating category...', { id: 'create-category' })
    try {
      const { category, message } = await CategoryApis.createCategoryApi(data)
      toast.success(message, { id: 'create-category' })
      if (refresh) refresh()
      if (update) update(category)
    } catch (err: any) {
      toast.error('Failed to create category', { id: 'create-category' })
      console.error(err)
      throw err
    }
  }

  async edit(
    categoryId: string,
    data: FieldValues,
    update: (category: Category) => void
  ): Promise<void> {
    toast.loading('Updating category...', { id: 'update-category' })
    try {
      const { updatedCategory, message } = await CategoryApis.editCategoryApi(categoryId, data)

      toast.success(message, { id: 'update-category' })
      update(updatedCategory)
    } catch (err: any) {
      toast.error('Failed to update category', { id: 'update-category' })
      console.error(err)
      throw err
    }
  }

  validate(
    data: FieldValues,
    setError: (field: string, error: { type: string; message: string }) => void
  ): boolean {
    let isValid = true

    // type is required
    if (!data.type) {
      setError('type', {
        type: 'manual',
        message: 'Type is required',
      })
      isValid = false
    }

    // name is required
    if (!data.name) {
      setError('name', {
        type: 'manual',
        message: 'Name is required',
      })
      isValid = false
    }

    return isValid
  }
}

export const categoryMediator: CategoryMediator = new ConcreteCategoryMediator()
