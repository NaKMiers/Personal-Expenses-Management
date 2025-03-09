import { toUTC } from '@/lib/utils'
import { IFullTransaction } from '@/models/TransactionModel'
import { createTransactionApi, editTransactionApi } from '@/requests'
import { FieldValues } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IMediator } from './IMediator'

interface TransactionMediator extends IMediator {
  create(data: FieldValues, refresh?: () => void): Promise<void>
  edit(
    transactionId: string,
    data: FieldValues,
    update: (transaction: IFullTransaction) => void
  ): Promise<void>
  validate(
    data: FieldValues,
    setError: (field: string, error: { type: string; message: string }) => void
  ): boolean
}

class ConcreteTransactionMediator implements TransactionMediator {
  async create(data: FieldValues, refresh?: () => void): Promise<void> {
    toast.loading('Creating transaction...', { id: 'create-transaction' })
    try {
      const { message } = await createTransactionApi({
        ...data,
        date: toUTC(data.date),
        amount: data.amount,
      })
      toast.success(message, { id: 'create-transaction' })
      if (refresh) refresh()
    } catch (err: any) {
      toast.error('Failed to create transaction', { id: 'create-transaction' })
      console.error(err)
      throw err
    }
  }

  async edit(
    transactionId: string,
    data: FieldValues,
    update: (transaction: IFullTransaction) => void
  ): Promise<void> {
    toast.loading('Updating transaction...', { id: 'update-transaction' })
    try {
      const { updatedTransaction, message } = await editTransactionApi(transactionId, {
        ...data,
        date: toUTC(data.date),
        amount: data.amount,
      })
      toast.success(message, { id: 'update-transaction' })
      update(updatedTransaction)
    } catch (err: any) {
      toast.error('Failed to update transaction', { id: 'update-transaction' })
      console.error(err)
      throw err
    }
  }

  validate(
    data: FieldValues,
    setError: (field: string, error: { type: string; message: string }) => void
  ): boolean {
    let isValid = true

    if (!data.amount) {
      setError('amount', { type: 'manual', message: 'Amount is required' })
      isValid = false
    } else if (data.amount < 0) {
      setError('amount', { type: 'manual', message: 'Amount must be greater than or equal to 0' })
      isValid = false
    }

    if (!data.category) {
      setError('category', { type: 'manual', message: 'Category is required' })
      isValid = false
    }

    if (!data.date) {
      setError('date', { type: 'manual', message: 'Date is required' })
      isValid = false
    }

    return isValid
  }
}

export const transactionMediator: TransactionMediator = new ConcreteTransactionMediator()
