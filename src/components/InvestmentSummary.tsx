'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppSelector } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { LuTrendingUp, LuArrowUpRight } from 'react-icons/lu'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface InvestmentSummaryProps {
  className?: string
  refresh?: number
}

function InvestmentSummary({ className = '', refresh }: InvestmentSummaryProps) {
  const { userSettings } = useAppSelector(state => state.settings)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalValue: 0,
    totalROI: 0,
    activeInvestments: 0,
  })
  const [performanceData, setPerformanceData] = useState<any[]>([])

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/investments/summary')
      if (!response.ok) {
        throw new Error('Failed to fetch investment summary')
      }
      const data = await response.json()
      setSummary({
        totalInvested: Number(data.summary.totalInvested),
        totalValue: Number(data.summary.totalValue),
        totalROI: Number(data.summary.totalROI),
        activeInvestments: Number(data.summary.activeInvestments),
      })
    } catch (error) {
      console.error('Error fetching investment summary:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPerformanceData = useCallback(async () => {
    // Giả lập dữ liệu, thay bằng API thực tế như /api/investments/performance
    const mockData = [
      { date: '2025-01-01', value: 100000 },
      { date: '2025-02-01', value: 105000 },
      { date: '2025-03-01', value: 110000 },
    ]
    setPerformanceData(mockData)
  }, [])

  useEffect(() => {
    fetchSummary()
    fetchPerformanceData()
  }, [fetchSummary, fetchPerformanceData, refresh])

  const chartData = {
    labels: performanceData.map(data => data.date),
    datasets: [
      {
        label: 'Portfolio Value',
        data: performanceData.map(data => data.value),
        borderColor: 'rgba(34, 197, 94, 1)', // Màu xanh
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
      },
    ],
  }

  return (
    <div className={`rounded-lg border border-slate-200/30 bg-neutral-800/30 p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
            <LuTrendingUp size={18} />
          </div>
          <h3 className="text-lg font-bold">Investment Performance</h3>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-md bg-neutral-700/50"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-slate-200/10 bg-neutral-900 p-3">
              <p className="text-xs text-gray-400">Total Invested</p>
              <p className="text-lg font-semibold">
                {formatCurrency(userSettings?.currency || 'USD', summary.totalInvested)}
              </p>
            </div>
            <div className="rounded-md border border-slate-200/10 bg-neutral-900 p-3">
              <p className="text-xs text-gray-400">Current Value</p>
              <p className="text-lg font-semibold">
                {formatCurrency(userSettings?.currency || 'USD', summary.totalValue)}
              </p>
            </div>
            <div className="rounded-md border border-slate-200/10 bg-neutral-900 p-3">
              <p className="text-xs text-gray-400">Overall ROI</p>
              <p
                className={`text-lg font-semibold ${summary.totalROI >= 0 ? 'text-green-500' : 'text-rose-500'}`}
              >
                {(summary.totalROI * 100).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-md border border-slate-200/10 bg-neutral-900 p-3">
              <p className="text-xs text-gray-400">Active Investments</p>
              <p className="text-lg font-semibold">{summary.activeInvestments}</p>
            </div>
          </div>

          {performanceData.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-semibold text-gray-400">Portfolio Value Over Time</h4>
              <div className="h-64">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Date' } },
                      y: { title: { display: true, text: 'Value' } },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InvestmentSummary
