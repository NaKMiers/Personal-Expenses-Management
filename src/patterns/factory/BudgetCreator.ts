import mongoose from 'mongoose';
import { Budget } from './Budget';
import { MonthlyBudget } from './MonthlyBudget';
import { YearlyBudget } from './YearlyBudget';
import { ProjectBudget } from './ProjectBudget';

export class BudgetCreator {
  static createBudget(
    type: 'monthly' | 'yearly' | 'project',
    name: string,
    categoryId: mongoose.Types.ObjectId,
    userId: string,
    amount: number,
    startDate: Date,
    endDate: Date,
    status: string = 'active'
  ): Budget {
    const BudgetTypes = { monthly: MonthlyBudget, yearly: YearlyBudget, project: ProjectBudget };
    if (!(type in BudgetTypes)) throw new Error('Invalid budget type');
    return new BudgetTypes[type](name, categoryId, userId, amount, startDate, endDate, status);
  }
}
