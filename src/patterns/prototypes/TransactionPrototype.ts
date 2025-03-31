import { toUTC } from '@/lib/utils'
import { ITransactionType } from '@/models/TransactionModel'
import toast from 'react-hot-toast'
import { TransactionApis } from '../proxies/TransactionApiProxy'
import Category from './CategoryPrototype'
import { IPrototype } from './IPrototype'

class Transaction implements IPrototype {
  public _id: string
  public createdAt: string
  public updatedAt: string

  public amount: number
  public description?: string
  public date: string
  public userId: string
  public type: ITransactionType
  public category: string | Category

  public metadata?: any

  constructor(
    _id: string,
    createdAt: string,
    updatedAt: string,
    amount: number,
    description: string,
    date: string,
    userId: string,
    type: ITransactionType,
    category: string | Category
  ) {
    this._id = _id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.amount = amount
    this.description = description
    this.date = date
    this.userId = userId
    this.type = type
    this.category = category
  }

  async clone() {
    toast.loading('Duplicate transaction...', { id: 'duplicate-transaction' })
    try {
      await TransactionApis.createTransactionApi({
        amount: this.amount,
        description: this.description + ' (copy)',
        type: this.type,
        category: typeof this.category === 'string' ? this.category : this.category._id,

        date: toUTC(new Date()),
      })

      toast.success('Duplicated transaction', { id: 'duplicate-transaction' })
    } catch (err: any) {
      toast.error('Failed to create category', { id: 'create-category' })
      console.error(err)
      throw err
    }
  }

  toString(): string {
    return (
      this.amount +
      ' ' +
      this.description +
      ' ' +
      this.date +
      ' ' +
      this.type +
      ' ' +
      (typeof this.category === 'string' ? this.category : this.category._id)
    )
  }
}

export default Transaction
