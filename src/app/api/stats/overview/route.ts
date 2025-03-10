import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import TransactionModel, { IFullTransaction } from '@/models/TransactionModel'
import { toUTC } from '@/lib/utils'

// Models: Transaction, Category
import '@/models/TransactionModel'
import '@/models/CategoryModel'
import { ICategory } from '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

export type OverviewType = {
  income: number
  expense: number
  investment: number
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
    const balance = income - expense - investment

    const overview: OverviewType = {
      income,
      expense,
      investment,
      balance,
    }

    // MARK: Types
    // group transaction by type
    const types: any = {
      income: [],
      expense: [],
      investment: [],
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

      transactions.forEach((transaction: IFullTransaction) => {
        const { category } = transaction

        if (!categoryGroups[category.name]) {
          categoryGroups[category.name] = []
        }

        categoryGroups[category.name].push(transaction)
      })

      // calculate total for each category
      const categoryGroupsArray: { category: ICategory; total: number }[] = []

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

    // type: {
    //   [key: string]: {
    //     category: ICategory
    //     total: number
    //   }[]
    // }

    // MARK: CHART

    console.log('types:', types)
    console.log('typeGroups:', typeGroups)

    // return response
    return NextResponse.json({ overview, types, typeGroups, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
