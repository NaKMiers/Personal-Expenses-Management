import { TransactionType } from '@/lib/types'

class CategoryApi {
  private receiveResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    return await res.json()
  }

  // [GET]: /categories
  getUserCategoriesApi = async (type?: TransactionType) => {
    let query = '?'
    if (type) query += `type=${type}`
    const res = await fetch(`/api/categories${query}`)

    return await this.receiveResponse(res)
  }

  // [POST]: /categories/create
  createCategoryApi = async (data: any) => {
    const res = await fetch(`/api/categories/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return await this.receiveResponse(res)
  }

  // [PUT]: /categories/:id/edit
  editCategoryApi = async (id: string, data: any) => {
    const res = await fetch(`/api/categories/${id}/edit`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    return await this.receiveResponse(res)
  }

  // [DELETE]: /categories/:id/delete
  deleteCategoryApi = async (id: string) => {
    const res = await fetch(`/api/categories/${id}/delete`, {
      method: 'DELETE',
    })

    return await this.receiveResponse(res)
  }
}

class CategoryApiProxy {
  private realApi: CategoryApi
  private cache: Map<string, any>

  constructor() {
    this.realApi = new CategoryApi()
    this.cache = new Map()
  }

  getUserCategoriesApi = async (
    type?: TransactionType,
    option: { noCache: boolean } = { noCache: false }
  ) => {
    const key = `getUserCategoriesApi-${type}`
    if (!option.noCache && this.cache.has(key)) {
      return this.cache.get(key)
    }

    const res = await this.realApi.getUserCategoriesApi(type)
    this.cache.set(key, res)
    return res
  }

  createCategoryApi = async (data: any) => {
    this.clearCache()
    return await this.realApi.createCategoryApi(data)
  }

  editCategoryApi = async (id: string, data: any) => {
    this.clearCache()
    return await this.realApi.editCategoryApi(id, data)
  }

  deleteCategoryApi = async (id: string) => {
    this.clearCache()
    return await this.realApi.deleteCategoryApi(id)
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const CategoryApis = new CategoryApiProxy()
export default CategoryApiProxy
