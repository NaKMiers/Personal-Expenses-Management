// Transaction

// [GET]: /transactions
export const getUserTransactionsApi = async (
  from: Date | string,
  to: Date | string,
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/transactions?from=${from}&to=${to}`, option)

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
export const editTransactionApi = async (id: string, data: any) => {
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

// [DELETE]: /transactions/delete
export const deleteTransactionsApi = async (ids: string[]) => {
  const res = await fetch(`/api/transactions/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
