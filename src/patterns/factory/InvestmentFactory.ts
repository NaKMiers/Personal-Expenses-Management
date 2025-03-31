import Transaction from '@/patterns/prototypes/TransactionPrototype'
import {
  Investment,
  InvestmentState,
  ActiveInvestmentState,
  PendingInvestmentState,
  CompletedInvestmentState,
  LosingInvestmentState,
} from '@/patterns/state/InvestmentState'
import {
  BaseInvestment,
  RiskAnalysisDecorator,
  ROICalculationDecorator,
  PerformanceTrackingDecorator,
  InvestmentComponent,
} from '@/patterns/decorator/InvestmentDecorator'

export class InvestmentFactory {
  // Create investment with appropriate state based on transaction data
  public static createInvestment(transaction: Transaction): Investment {
    const metadata = transaction.metadata || {}
    let state: InvestmentState

    // Determine the initial state based on transaction data
    if (metadata.status === 'completed') {
      state = new CompletedInvestmentState()
    } else if (metadata.status === 'pending') {
      state = new PendingInvestmentState()
    } else if (metadata.roi && metadata.roi < 0) {
      state = new LosingInvestmentState()
    } else {
      state = new ActiveInvestmentState()
    }

    // Create the investment with the determined state
    return new Investment(transaction, state, metadata)
  }

  // Create decorated investment with selected features
  public static createDecoratedInvestment(
    transaction: Transaction,
    options: {
      withRiskAnalysis?: boolean
      withROICalculation?: boolean
      withPerformanceTracking?: boolean
    } = {}
  ): InvestmentComponent {
    const investment = this.createInvestment(transaction)
    let component: InvestmentComponent = new BaseInvestment(investment)

    // Apply decorators based on options
    if (options.withRiskAnalysis) {
      component = new RiskAnalysisDecorator(component)
    }

    if (options.withROICalculation) {
      component = new ROICalculationDecorator(component)
    }

    if (options.withPerformanceTracking) {
      component = new PerformanceTrackingDecorator(component)
    }

    return component
  }
}
