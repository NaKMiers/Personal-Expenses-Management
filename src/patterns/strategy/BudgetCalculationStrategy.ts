class MonthlyBudgetCalculation implements IBudgetCalculation {
  calculateRemaining(budget: any, transactions: any[]): number {
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return budget.amount - totalSpent;
  }
}

class YearlyBudgetCalculation implements IBudgetCalculation {
  calculateRemaining(budget: any, transactions: any[]): number {
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return budget.amount - totalSpent;
  }
}

class ProjectBudgetCalculation implements IBudgetCalculation {
  calculateRemaining(budget: any, transactions: any[]): number {
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return budget.amount - totalSpent;
  }
}

function getBudgetCalculationStrategy(type: string): IBudgetCalculation {
  switch (type) {
    case 'monthly':
      return new MonthlyBudgetCalculation();
    case 'yearly':
      return new YearlyBudgetCalculation();
    case 'project':
      return new ProjectBudgetCalculation();
    default:
      throw new Error('Loại ngân sách không hợp lệ!');
  }
}