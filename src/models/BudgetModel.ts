import mongoose from 'mongoose'
import { ITransactionType } from './TransactionModel'

const Schema = mongoose.Schema

const BudgetSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    userId: {
      type: String,
      index: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
)

BudgetSchema.index(
  { userId: 1, type: 1, categoryId: 1, startDate: 1, endDate: 1 },
  { unique: true }
)

const BudgetModel = mongoose.models.budget || mongoose.model('budget', BudgetSchema)
export default BudgetModel

export interface IBudget {
  _id: string
  createdAt: string
  updatedAt: string

  type: ITransactionType
  categoryId: string
  userId: string
  amount: number
  startDate: string
  endDate: string
}
