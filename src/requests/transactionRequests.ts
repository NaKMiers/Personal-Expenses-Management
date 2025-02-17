// Transaction

import { ITransaction } from '@/models/TransactionModel'

// [GET]: /transactions
export const getUserTransactionsApi = async (option: RequestInit = { next: { revalidate: 0 } }) => {
  const res = await fetch(`/api/transactions`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /transactions/create
export const createTransactionApi = async (data: any) => {
  const res = await fetch(`/api/transactions/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /transactions/:id/edit
export const editTransactionApi = async (id: string, data: ITransaction) => {
  const res = await fetch(`/api/transactions/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /transactions/:id/delete
export const deleteTransactionApi = async (id: string) => {
  const res = await fetch(`/api/transactions/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
