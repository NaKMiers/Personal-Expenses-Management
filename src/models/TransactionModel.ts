import mongoose from 'mongoose'
const Schema = mongoose.Schema

export type ITransactionType = 'income' | 'expense'

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
      enum: ['income', 'expense'],
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
