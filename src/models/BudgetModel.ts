import mongoose from 'mongoose'
import { ITransactionType } from './TransactionModel'

const Schema = mongoose.Schema

const BudgetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
  },
  { timestamps: true }
)

BudgetSchema.index({ userId: 1, categoryId: 1, month: 1, year: 1 }, { unique: true })

const BudgetModel = mongoose.models.budget || mongoose.model('budget', BudgetSchema)
export default BudgetModel

export interface IBudget {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
  userId: string
  categoryId: string
  amount: number
  month: number
  year: number
  icon: string
  type: ITransactionType
}
