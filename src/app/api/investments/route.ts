import { connectDatabase } from '@/config/database'
import TransactionModel from '@/models/TransactionModel'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category, Transaction, User Settings
import '@/models/CategoryModel'
import '@/models/TransactionModel'
import '@/models/UserSettingsModel'

export const dynamic = 'force-dynamic'

// [GET] /api/investments
export async function GET(req: NextRequest) {
  try {
    await connectDatabase()
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const investments = await TransactionModel.find({ type: 'investment', userId: user.id }).populate(
      'category'
    )

    // const { searchParams } = new URL(req.url)
    // const filters: Record<string, any> = {}

    // // Parse filters from query parameters
    // if (searchParams.has('minAmount')) {
    //   filters.minAmount = parseFloat(searchParams.get('minAmount') as string)
    // }

    // if (searchParams.has('maxAmount')) {
    //   filters.maxAmount = parseFloat(searchParams.get('maxAmount') as string)
    // }

    // if (searchParams.has('category')) {
    //   filters.category = searchParams.get('category')
    // }

    // if (searchParams.has('from') && searchParams.has('to')) {
    //   filters.dateRange = {
    //     from: new Date(searchParams.get('from') as string),
    //     to: new Date(searchParams.get('to') as string),
    //   }
    // }

    // const withRiskAnalysis = searchParams.get('withRiskAnalysis') === 'true'
    // const withROICalculation = searchParams.get('withROICalculation') === 'true'
    // const withPerformanceTracking = searchParams.get('withPerformanceTracking') === 'true'

    // // Get investments with decorators based on query parameters
    // const investments = await InvestmentService.getDecoratedInvestments(filters, {
    //   withRiskAnalysis,
    //   withROICalculation,
    //   withPerformanceTracking,
    // })

    return NextResponse.json({ investments }, { status: 200 })
  } catch (err: any) {
    console.error('Error in API:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

// [PUT] /api/investments/update-state
export async function PUT(req: NextRequest) {
  try {
    await connectDatabase()
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, newState, metadata } = await req.json()

    // Validate input
    if (!transactionId || !newState) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Find the transaction
    const transaction = await TransactionModel.findById(transactionId)

    if (!transaction) {
      return NextResponse.json({ message: 'Investment not found' }, { status: 404 })
    }

    // Update transaction metadata
    transaction.metadata = {
      ...transaction.metadata,
      status: newState,
      ...metadata,
    }

    await transaction.save()

    return NextResponse.json(
      {
        message: 'Investment state updated',
        transaction,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Error in API:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
