// Category

import { TransactionType } from '@/lib/types'

// [GET]: /categories
export const getUserCategoriesApi = async (
  type?: TransactionType,
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  let query = '?'
  if (type) query += `type=${type}`
  const res = await fetch(`/api/categories${query}`, option)

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
export const editCategoryApi = async (id: string, data: any) => {
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
