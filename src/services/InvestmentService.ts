import Transaction from '@/patterns/prototypes/TransactionPrototype'
import { TransactionApis } from '@/patterns/proxies/TransactionApiProxy'
import { InvestmentTransactionCollection, Iterator } from '@/patterns/iterator/InvestmentIterator'
import {
  Investment,
  ActiveInvestmentState,
  PendingInvestmentState,
  CompletedInvestmentState,
  LosingInvestmentState,
} from '@/patterns/state/InvestmentState'
import { InvestmentFactory } from '@/patterns/factory/InvestmentFactory'

export class InvestmentService {
  // Get all investment transactions
  public static async getAllInvestments(
    filters: Record<string, any> = {}
  ): Promise<InvestmentTransactionCollection> {
    try {
      // Fix the error by providing a specific date instead of undefined
      const { transactions } = await TransactionApis.getUserTransactionsApi(new Date(), new Date(), {
        noCache: true,
      })

      // Filter only investment transactions
      const investmentTransactions = transactions.filter(
        (transaction: Transaction) => transaction.type === 'investment'
      )

      // Create a collection with the transactions
      const collection = new InvestmentTransactionCollection(investmentTransactions)
      collection.setFilters(filters)

      return collection
    } catch (error) {
      console.error('Error fetching investments:', error)
      throw error
    }
  }

  // Get decorated investments with applied states
  public static async getDecoratedInvestments(
    filters: Record<string, any> = {},
    decoratorOptions = {
      withRiskAnalysis: true,
      withROICalculation: true,
      withPerformanceTracking: false,
    }
  ) {
    const collection = await this.getAllInvestments(filters)
    const iterator = collection.createIterator()
    const decoratedInvestments = []

    while (iterator.hasNext()) {
      const transaction = iterator.next()
      if (transaction) {
        const decorated = InvestmentFactory.createDecoratedInvestment(transaction, decoratorOptions)
        decoratedInvestments.push(decorated)
      }
    }

    return decoratedInvestments
  }

  // Update investment state based on performance
  public static async updateInvestmentStates(investments: Investment[]): Promise<Investment[]> {
    return investments.map(investment => {
      const roi = investment.calculateROI()
      const metadata = investment.getMetadata()

      // Update state based on ROI and other metrics
      if (metadata.status === 'completed') {
        investment.changeState(new CompletedInvestmentState())
      } else if (roi < -0.1) {
        // If losing more than 10%
        investment.changeState(new LosingInvestmentState())
      } else if (roi > 0) {
        investment.changeState(new ActiveInvestmentState())
      }

      return investment
    })
  }
}
