import mongoose from 'mongoose'
import { ICategory } from './CategoryModel'
const Schema = mongoose.Schema

export type ITransactionType = 'income' | 'expense' | 'investment'

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'investment'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
  },
  { timestamps: true }
)

const TransactionModel = mongoose.models.transaction || mongoose.model('transaction', TransactionSchema)
export default TransactionModel

export interface ITransaction {
  _id: string
  createdAt: string
  updatedAt: string

  amount: number
  description?: string
  date: string
  userId: string
  type: ITransactionType
  category: string
}

// transaction interface after populate to category
export interface IFullTransaction extends Omit<ITransaction, 'category'> {
  category: ICategory
}
