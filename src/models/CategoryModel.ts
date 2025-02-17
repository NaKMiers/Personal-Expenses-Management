import mongoose from 'mongoose'
import { ITransactionType } from './TransactionModel'
const Schema = mongoose.Schema

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      index: true,
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

CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true })

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel

export interface ICategory {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
  userId: string
  icon: string
  type: ITransactionType
}
