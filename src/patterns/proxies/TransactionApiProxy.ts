class TransactionApi {
  private receiveResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    return await res.json()
  }

  // [GET]: /transactions
  getUserTransactionsApi = async (from: Date | string, to: Date | string) => {
    const res = await fetch(`/api/transactions?from=${from}&to=${to}`)
    return await this.receiveResponse(res)
  }

  // [POST]: /transactions/create
  createTransactionApi = async (data: any) => {
    const res = await fetch(`/api/transactions/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return await this.receiveResponse(res)
  }

  // [PUT]: /transactions/:id/edit
  editTransactionApi = async (id: string, data: any) => {
    const res = await fetch(`/api/transactions/${id}/edit`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return await this.receiveResponse(res)
  }

  // [DELETE]: /transactions/delete
  deleteTransactionsApi = async (ids: string[]) => {
    const res = await fetch(`/api/transactions/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    })
    return await this.receiveResponse(res)
  }
}

class TransactionApiProxy {
  private realApi: TransactionApi
  private cache: Map<string, any>

  constructor() {
    this.realApi = new TransactionApi()
    this.cache = new Map()
  }

  async getUserTransactionsApi(
    from: Date | string,
    to: Date | string,
    option: { noCache: boolean } = { noCache: false }
  ) {
    const key = `${from}-${to}`
    if (!option.noCache && this.cache.has(key)) {
      console.log('Get User Transactions from cache')
      return this.cache.get(key)
    }

    console.log('Get User Transactions from ' + from + ' to ' + to)

    const result = await this.realApi.getUserTransactionsApi(from, to)
    this.cache.set(key, result)
    return result
  }

  async createTransactionApi(data: any) {
    this.clearCache()
    return this.realApi.createTransactionApi(data)
  }

  async editTransactionApi(id: string, data: any) {
    this.clearCache()
    return this.realApi.editTransactionApi(id, data)
  }

  async deleteTransactionsApi(ids: string[]) {
    this.clearCache()
    return this.realApi.deleteTransactionsApi(ids)
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const TransactionApis = new TransactionApiProxy()
export default TransactionApiProxy
