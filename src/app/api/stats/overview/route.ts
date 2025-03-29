import { connectDatabase } from '@/config/database'
import { toUTC } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Transaction, Category
import '@/models/CategoryModel'
import '@/models/TransactionModel'
import TransactionModel from '@/models/TransactionModel'
import Category from '@/patterns/prototypes/CategoryPrototype'
import Transaction from '@/patterns/prototypes/TransactionPrototype'

export const dynamic = 'force-dynamic'

export type OverviewType = {
  income: number
  expense: number
  investment: number
  budget: number
  balance: number
}

// [GET] /stats/overview
export async function GET(req: NextRequest) {
  console.log('- Overview - ')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is logged in
    if (!user) {
      redirect('/sign-in')
    }

    const { searchParams } = new URL(req.nextUrl)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!from || !to) {
      return NextResponse.json({ message: 'Invalid date range' }, { status: 400 })
    }

    // MARK: Overview
    const transactions = await TransactionModel.find({
      userId: user.id,
      date: {
        $gte: toUTC(from),
        $lte: toUTC(to),
      },
    })
      .populate('category')
      .lean()

    const income = transactions.reduce(
      (total, trans) => (trans.type === 'income' ? total + trans.amount : total),
      0
    )
    const expense = transactions.reduce(
      (total, trans) => (trans.type === 'expense' ? total + trans.amount : total),
      0
    )
    const investment = transactions.reduce(
      (total, trans) => (trans.type === 'investment' ? total + trans.amount : total),
      0
    )
    const budget = transactions.reduce(
      (total, trans) => (trans.type === 'budget' ? total + trans.amount : total),
      0
    )

    const balance = income - expense - investment

    const overview: OverviewType = {
      income,
      expense,
      investment,
      budget,
      balance,
    }

    // MARK: Types
    // group transaction by type
    const types: any = {
      income: [],
      expense: [],
      investment: [],
      budget: [],
    }

    transactions.forEach((transaction: any) => {
      const { type } = transaction

      if (!types[type]) {
        types[type] = []
      }

      types[type].push(transaction)
    })

    const typeGroups: any = { ...types }

    // loop through each type then group transactions by category
    for (const type in types) {
      const transactions = types[type]
      const categoryGroups: any = {}

      transactions.forEach((transaction: Transaction) => {
        const { category } = transaction

        if (!categoryGroups[(category as Category).name]) {
          categoryGroups[(category as Category).name] = []
        }

        categoryGroups[(category as Category).name].push(transaction)
      })

      // calculate total for each category
      const categoryGroupsArray: { category: Category; total: number }[] = []

      for (const category in categoryGroups) {
        const transactions = categoryGroups[category]
        const total = transactions.reduce((acc: number, curr: any) => acc + curr.amount, 0)

        categoryGroupsArray.push({
          category: transactions[0].category,
          total,
        })
      }

      types[type] = categoryGroupsArray
    }

    // return response
    return NextResponse.json({ overview, types, typeGroups, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
