'use client'

import InvestmentManagement from '@/components/InvestmentManagement'
import InvestmentSummary from '@/components/InvestmentSummary'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function InvestmentsPage() {
  const [refresh, setRefresh] = useState<number>(Date.now())
  const [investments, setInvestments] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?type=investment')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      toast.error('Error fetching categories')
      console.error(error)
    }
  }

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments')
      if (!response.ok) {
        throw new Error('Failed to fetch investments')
      }
      const data = await response.json()
      setInvestments(data.investments)

      console.log('Dữ liệu investments', data)
    } catch (error) {
      toast.error('Error fetching investments')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchInvestments()
  }, [refresh])

  return (
    <div className="min-h-screen p-6 pt-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Investments</h1>
          <p className="text-gray-400">Manage and track your investment portfolio</p>
        </div>

        <InvestmentManagement
          investments={investments}
          categories={categories}
          refresh={() => setRefresh(Date.now())}
        />

        <div className="mt-8">
          <InvestmentSummary refresh={refresh} />
        </div>
      </div>
    </div>
  )
}

export default InvestmentsPage
