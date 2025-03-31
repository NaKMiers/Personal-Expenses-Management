import mongoose from 'mongoose';
import { Budget } from './Budget';

export class ProjectBudget extends Budget {
  constructor(
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date,
    status: string = 'active'
  ) {
    super(name, categoryId, userId, amount, startDate, endDate, 'project', status);
  }

  async calculateRemaining(): Promise<number> {
    const totalExpenses = await mongoose.models.Transaction.aggregate([
      { $match: { budgetId: this._id, categoryId: this.categoryId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return this.amount - (totalExpenses[0]?.total || 0);
  }

  isActive(): boolean {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }
}
