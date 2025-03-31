class BudgetObserver {
  private observers: Function[] = [];

  public addObserver(observer: Function) {
    this.observers.push(observer);
  }

  public notify(budget: any) {
    this.observers.forEach(observer => observer(budget));
  }
}

const budgetObserver = new BudgetObserver();

budgetObserver.addObserver((budget: any) => {
  if (budget.status === 'active' && new Date(budget.endDate) < new Date()) {
    console.log(`Ngân sách "${budget.name}" đã hết hạn!`);
  }
});

export default budgetObserver;