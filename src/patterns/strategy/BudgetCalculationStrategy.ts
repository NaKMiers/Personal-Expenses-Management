interface BudgetCalculationStrategy {
  calculateRemaining(budget: any, transactions: any[]): number;
}

class MonthlyBudgetCalculation implements BudgetCalculationStrategy {
  calculateRemaining(budget: any, transactions: any[]): number {
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return budget.amount - totalSpent;
  }
}

class YearlyBudgetCalculation implements BudgetCalculationStrategy {
  calculateRemaining(budget: any, transactions: any[]): number {
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return budget.amount - totalSpent;
  }
}

const budget = { amount: 1000000, type: 'monthly' };
const transactions = [{ amount: 200000 }, { amount: 300000 }];

let strategy: BudgetCalculationStrategy;
if (budget.type === 'monthly') {
  strategy = new MonthlyBudgetCalculation();
} else {
  strategy = new YearlyBudgetCalculation();
}

const remainingAmount = strategy.calculateRemaining(budget, transactions);
console.log(`Số tiền còn lại: ${remainingAmount}`);