import Transaction from '@/patterns/prototypes/TransactionPrototype'

// Investment State Interface
export interface InvestmentState {
  name: string
  color: string
  icon: string
  calculateRisk(investment: Investment): number
  calculateROI(investment: Investment): number
  getNextAction(investment: Investment): string
}

// Investment Context Class
export class Investment {
  private state: InvestmentState
  private transaction: Transaction
  private metadata: Record<string, any>

  constructor(
    transaction: Transaction,
    initialState: InvestmentState,
    metadata: Record<string, any> = {}
  ) {
    this.transaction = transaction
    this.state = initialState
    this.metadata = metadata
  }

  public changeState(state: InvestmentState): void {
    this.state = state
  }

  public getState(): InvestmentState {
    return this.state
  }

  public getTransaction(): Transaction {
    return this.transaction
  }

  public getMetadata(): Record<string, any> {
    return this.metadata
  }

  public updateMetadata(key: string, value: any): void {
    this.metadata[key] = value
  }

  public calculateRisk(): number {
    return this.state.calculateRisk(this)
  }

  public calculateROI(): number {
    return this.state.calculateROI(this)
  }

  public getNextAction(): string {
    return this.state.getNextAction(this)
  }
}

// Concrete States

// Active Investment State
export class ActiveInvestmentState implements InvestmentState {
  public name = 'active'
  public color = 'bg-green-500'
  public icon = '🚀'

  public calculateRisk(investment: Investment): number {
    const transaction = investment.getTransaction()
    // Basic risk calculation for active investments
    return Math.min(transaction.amount / 10000, 0.8)
  }

  public calculateROI(investment: Investment): number {
    const metadata = investment.getMetadata()
    const initialValue = investment.getTransaction().amount
    const currentValue = metadata.currentValue || initialValue
    return (currentValue - initialValue) / initialValue
  }

  public getNextAction(investment: Investment): string {
    return 'Monitor performance'
  }
}

// Pending Investment State
export class PendingInvestmentState implements InvestmentState {
  public name = 'pending'
  public color = 'bg-yellow-500'
  public icon = '⏳'

  public calculateRisk(investment: Investment): number {
    // Pending investments have unknown risk
    return 0.5
  }

  public calculateROI(investment: Investment): number {
    // No ROI for pending investments
    return 0
  }

  public getNextAction(investment: Investment): string {
    return 'Confirm investment'
  }
}

// Completed Investment State
export class CompletedInvestmentState implements InvestmentState {
  public name = 'completed'
  public color = 'bg-blue-500'
  public icon = '✅'

  public calculateRisk(investment: Investment): number {
    // No risk for completed investments
    return 0
  }

  public calculateROI(investment: Investment): number {
    const metadata = investment.getMetadata()
    const initialValue = investment.getTransaction().amount
    const finalValue = metadata.finalValue || initialValue
    return (finalValue - initialValue) / initialValue
  }

  public getNextAction(investment: Investment): string {
    return 'Analyze results'
  }
}

// Losing Investment State
export class LosingInvestmentState implements InvestmentState {
  public name = 'losing'
  public color = 'bg-red-500'
  public icon = '📉'

  public calculateRisk(investment: Investment): number {
    // High risk for losing investments
    return 0.9
  }

  public calculateROI(investment: Investment): number {
    const metadata = investment.getMetadata()
    const initialValue = investment.getTransaction().amount
    const currentValue = metadata.currentValue || initialValue
    return (currentValue - initialValue) / initialValue
  }

  public getNextAction(investment: Investment): string {
    return 'Consider cutting losses'
  }
}
