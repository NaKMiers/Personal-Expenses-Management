import { Budget } from './Budget';
import mongoose from 'mongoose';

export class ProjectBudget extends Budget {
  constructor(
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ) {
    super(name, categoryId, userId, amount, 'project', startDate, endDate);
  }

  async calculateRemaining(): Promise<number> {
    const totalExpenses = await mongoose.models.Transaction.aggregate([
      {
        $match: {
          budgetId: this._id, // Lọc theo budgetId
          categoryId: this.categoryId // Lọc theo categoryId
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    return this.amount - totalSpent;
  }

  isActive(): boolean {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }
}