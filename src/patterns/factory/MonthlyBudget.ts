
import mongoose from 'mongoose';
import { Budget } from '@/patterns/factory/Budget'

export class MonthlyBudget extends Budget {
  constructor(
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ) {
    super(name, categoryId, userId, amount, 'monthly', startDate, endDate);
  }

  async calculateRemaining(): Promise<number> {
    const totalExpenses = await mongoose.models.Transaction.aggregate([
      {
        $match: {
          budgetId: this._id,
          categoryId: this.categoryId
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    return this.amount - totalSpent;
  }
}