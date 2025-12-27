import mongoose from 'mongoose'

const BudgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    userId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['monthly', 'yearly', 'project'],
      default: 'monthly',
    },
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: any, value: Date) {
          return value > this.startDate
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true }
)

export default mongoose.models?.Budget || mongoose.model('Budget', BudgetSchema)
