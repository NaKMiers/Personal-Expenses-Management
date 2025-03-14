import { ITransactionType } from '@/models/TransactionModel'
import toast from 'react-hot-toast'
import { CategoryApis } from '../proxies/CategoryApiProxy'
import { IPrototype } from './IPrototype'

class Category implements IPrototype {
  public _id: string
  public createdAt: string
  public updatedAt: string

  public name: string
  public userId: string
  public icon: string
  public type: ITransactionType

  constructor(
    _id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    userId: string,
    icon: string,
    type: ITransactionType
  ) {
    this._id = _id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.name = name
    this.userId = userId
    this.icon = icon
    this.type = type
  }

  async clone() {
    toast.loading('Duplicate category...', { id: 'duplicate-category' })

    try {
      await CategoryApis.createCategoryApi({
        name: this.name + ' (copy)',
        icon: this.icon,
        type: this.type,
      })

      toast.success('Duplicated category', { id: 'duplicate-category' })
    } catch (err: any) {
      toast.error('Failed to duplicate category', { id: 'duplicate-category' })
      console.error(err)
      throw err
    }
  }

  toString(): string {
    return this.name + ' ' + this.icon + ' ' + this.type
  }
}

export default Category
