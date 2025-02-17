// Category

import { ICategory } from '@/models/CategoryModel'

// [GET]: /categories
export const getUserCategoriesApi = async (option: RequestInit = { next: { revalidate: 0 } }) => {
  const res = await fetch(`/api/categories`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /categories/create
export const createCategoryApi = async (data: any) => {
  const res = await fetch(`/api/categories/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /categories/:id/edit
export const editCategoryApi = async (id: string, data: ICategory) => {
  const res = await fetch(`/api/categories/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /categories/:id/delete
export const deleteCategoryApi = async (id: string) => {
  const res = await fetch(`/api/categories/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
