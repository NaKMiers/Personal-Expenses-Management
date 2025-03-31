import mongoose from 'mongoose';
import { BudgetCreator } from './BudgetCreator';
import { MonthlyBudget } from './MonthlyBudget';

export class MonthlyBudgetCreator extends BudgetCreator {
  createBudget(
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ) {
    return new MonthlyBudget(name, categoryId, userId, amount, startDate, endDate);
  }
}
