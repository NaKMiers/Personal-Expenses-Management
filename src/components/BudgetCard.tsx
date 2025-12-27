import { useState } from 'react'
import { Progress } from './ui/progress'

interface BudgetCardProps {
  budget: {
    _id: string
    name: string
    amount: number
    type: string
    startDate: string | Date
    endDate: string | Date
    categoryId: string
    spentAmount?: number
  }
}

export function BudgetCard({ budget }: BudgetCardProps) {
  // const [spentAmount, setSpentAmount] = useState(0)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchSpentAmount = async () => {
  //     try {
  //       const startDateUTC = new Date(budget.startDate).toISOString()
  //       const endDateUTC = new Date(budget.endDate).toISOString()

  //       console.log('🔄 Fetching spent amount for:', budget._id)
  //       console.log('📆 Start Date (UTC):', startDateUTC)
  //       console.log('📆 End Date (UTC):', endDateUTC)

  //       const response = await fetch(
  //         `/api/budgets/spent?categoryId=${budget.categoryId}&startDate=${startDateUTC}&endDate=${endDateUTC}`
  //       )

  //       const data = await response.json()
  //       console.log('✅ API Response:', data)

  //       setSpentAmount(data.spentAmount)
  //     } catch (error) {
  //       console.error('❌ Error fetching spent amount:', error)
  //     }
  //   }

  //   fetchSpentAmount()
  // }, [budget])

  console.log('🔄 Budget changed:', budget)

  const spentAmount = budget.spentAmount || 0
  const remainingAmount = budget.amount - spentAmount
  const progressPercentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0

  return (
    <div className="space-y-3 rounded-md border border-slate-200/30 bg-neutral-800/30 p-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold">{budget.name}</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            remainingAmount >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
          }`}
        >
          {remainingAmount >= 0 ? 'Còn lại' : 'Vượt ngân sách'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total:</span>
          <span>{budget.amount} VND</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Spent:</span>
          <span>{spentAmount} VND</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-400">Left:</span>
          <span className={remainingAmount >= 0 ? 'text-green-400' : 'text-red-400'}>
            {Math.abs(remainingAmount)} VND
          </span>
        </div>
      </div>

      <Progress
        value={progressPercentage}
        className="h-2 bg-gray-600"
      />

      <div className="flex justify-between text-xs text-gray-400">
        <span>{new Date(budget.startDate).toLocaleDateString()}</span>
        <span>{new Date(budget.endDate).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
