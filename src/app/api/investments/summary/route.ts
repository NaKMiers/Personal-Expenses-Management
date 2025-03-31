import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import TransactionModel from '@/models/TransactionModel'
import { InvestmentService } from '@/services/InvestmentService'

export const dynamic = 'force-dynamic'

// [GET] /api/investments/summary
export async function GET(req: NextRequest) {
  try {
    await connectDatabase()
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get all investment transactions
    const investments = await InvestmentService.getDecoratedInvestments(
      {},
      { withRiskAnalysis: false, withROICalculation: true, withPerformanceTracking: false }
    )

    // Calculate summary data
    let totalInvested = 0
    let totalValue = 0
    let activeInvestments = 0

    investments.forEach(investment => {
      const metrics = investment.getMetrics()
      const baseInvestment = investment.getInvestment()
      const transaction = baseInvestment.getTransaction()
      const state = baseInvestment.getState()

      totalInvested += transaction.amount
      totalValue += metrics.value || transaction.amount

      if (state.name === 'active') {
        activeInvestments++
      }
    })

    const totalROI = totalInvested > 0 ? (totalValue - totalInvested) / totalInvested : 0

    return NextResponse.json(
      {
        summary: {
          totalInvested,
          totalValue,
          totalROI,
          activeInvestments,
        },
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Error in API:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
