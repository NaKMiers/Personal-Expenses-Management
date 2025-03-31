import { Investment } from '@/patterns/state/InvestmentState'

// Base Investment Decorator Interface
export interface InvestmentComponent {
  getInvestment(): Investment
  getDescription(): string
  getValue(): number
  getRisk(): number
  getMetrics(): Record<string, any>
}

// Base Investment Concrete Component
export class BaseInvestment implements InvestmentComponent {
  private investment: Investment

  constructor(investment: Investment) {
    this.investment = investment
  }

  public getInvestment(): Investment {
    return this.investment
  }

  public getDescription(): string {
    return this.investment.getTransaction().description || 'Investment'
  }

  public getValue(): number {
    return this.investment.getTransaction().amount
  }

  public getRisk(): number {
    return this.investment.calculateRisk()
  }

  public getMetrics(): Record<string, any> {
    return {
      value: this.getValue(),
      risk: this.getRisk(),
    }
  }
}

// Base Decorator
export abstract class InvestmentDecorator implements InvestmentComponent {
  protected component: InvestmentComponent

  constructor(component: InvestmentComponent) {
    this.component = component
  }

  public getInvestment(): Investment {
    return this.component.getInvestment()
  }

  public getDescription(): string {
    return this.component.getDescription()
  }

  public getValue(): number {
    return this.component.getValue()
  }

  public getRisk(): number {
    return this.component.getRisk()
  }

  public getMetrics(): Record<string, any> {
    return this.component.getMetrics()
  }
}

// Concrete Decorators

// Risk Analysis Decorator
export class RiskAnalysisDecorator extends InvestmentDecorator {
  constructor(component: InvestmentComponent) {
    super(component)
  }

  public getDescription(): string {
    return `${this.component.getDescription()} (with Risk Analysis)`
  }

  public getRisk(): number {
    const baseRisk = this.component.getRisk()
    // Enhanced risk calculation
    const investment = this.getInvestment()
    const metadata = investment.getMetadata()
    const volatility = metadata.volatility || 0.1
    const marketCondition = metadata.marketCondition || 0.5

    return baseRisk * (1 + volatility) * marketCondition
  }

  public getMetrics(): Record<string, any> {
    const metrics = this.component.getMetrics()
    metrics.risk = this.getRisk()
    metrics.riskBreakdown = {
      baseRisk: this.component.getRisk(),
      adjustedRisk: this.getRisk(),
      riskFactor: this.getRisk() / this.component.getRisk(),
    }
    return metrics
  }
}

// ROI Calculation Decorator
export class ROICalculationDecorator extends InvestmentDecorator {
  constructor(component: InvestmentComponent) {
    super(component)
  }

  public getDescription(): string {
    return `${this.component.getDescription()} (with ROI Calculation)`
  }

  public getValue(): number {
    // Calculate value including estimated ROI
    const investment = this.getInvestment()
    const roi = investment.calculateROI()
    const initialValue = this.component.getValue()
    return initialValue * (1 + roi)
  }

  public getMetrics(): Record<string, any> {
    const metrics = this.component.getMetrics()
    const investment = this.getInvestment()
    const roi = investment.calculateROI()

    metrics.value = this.getValue()
    metrics.roi = roi
    metrics.projectedReturn = this.component.getValue() * roi

    return metrics
  }
}

// Performance Tracking Decorator
export class PerformanceTrackingDecorator extends InvestmentDecorator {
  constructor(component: InvestmentComponent) {
    super(component)
  }

  public getDescription(): string {
    return `${this.component.getDescription()} (with Performance Tracking)`
  }

  public getMetrics(): Record<string, any> {
    const metrics = this.component.getMetrics()
    const investment = this.getInvestment()
    const metadata = investment.getMetadata()

    // Add historical performance data
    metrics.performance = {
      trend: metadata.performanceTrend || 'stable',
      historicalReturns: metadata.historicalReturns || [],
      volatilityIndex: metadata.volatility || 0.1,
      marketCorrelation: metadata.marketCorrelation || 0.5,
    }

    return metrics
  }
}
