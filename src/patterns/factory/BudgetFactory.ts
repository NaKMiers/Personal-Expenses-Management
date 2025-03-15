import { MonthlyBudget } from '@/patterns/factory/MonthlyBudget'
import mongoose from 'mongoose'
import { YearlyBudget } from '@/patterns/factory/YearlyBudget'
import { ProjectBudget } from '@/patterns/factory/ProjectBudget'


export class BudgetFactory {
  static createBudget(
    type: string,
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ) {
    switch (type) {
      case 'monthly':
        return new MonthlyBudget(name, categoryId, userId, amount, startDate, endDate);
      case 'yearly':
        return new YearlyBudget(name, categoryId, userId, amount, startDate, endDate);
      case 'project':
        return new ProjectBudget(name, categoryId, userId, amount, startDate, endDate);
      default:
        throw new Error('Invalid budget type');
    }
  }
}