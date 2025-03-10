'use client'

import { TransactionType } from '@/lib/types'
import { capitalize, formatCurrency } from '@/lib/utils'
import { memo, useCallback } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'

export type ChartDatum = {
  name: string
  income: number
  expense: number
  investment: number
}

export type ChartType = 'Line' | 'Bar' | 'Area' | 'Radar'

interface ChartProps {
  shows: boolean[]
  maxKey: TransactionType
  chart: ChartType
  data: any[]
  className?: string
  userSettings: any
  exchangeRate: number
}

function Chart({
  shows,
  chart,
  data = [],
  maxKey,
  userSettings,
  exchangeRate,
  className = '',
}: ChartProps) {
  const formatTooltip = useCallback(
    (value: number, name: string) => {
      const formattedValue = formatCurrency(userSettings.currency, value as number, exchangeRate)
      return [`${capitalize(name as string)}: ${formattedValue}`]
    },
    [userSettings, exchangeRate]
  )

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer
        width="100%"
        height={500}
      >
        {chart === 'Line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={'name'}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey={maxKey}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            {shows[0] && (
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {shows[1] && (
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={{ stroke: '#F43F5E', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {shows[2] && (
              <Line
                type="monotone"
                dataKey="investment"
                stroke="#EAB308"
                strokeWidth={2}
                dot={{ stroke: '#EAB308', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            <Tooltip formatter={formatTooltip} />
          </LineChart>
        ) : chart === 'Bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey={maxKey}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            {shows[0] && (
              <Bar
                dataKey="income"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
            )}
            {shows[1] && (
              <Bar
                dataKey="expense"
                fill="#F43F5E"
                radius={[6, 6, 0, 0]}
              />
            )}
            {shows[2] && (
              <Bar
                dataKey="investment"
                fill="#EAB308"
                radius={[6, 6, 0, 0]}
              />
            )}
            <Tooltip formatter={formatTooltip} />
          </BarChart>
        ) : chart === 'Area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey={maxKey}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            {shows[0] && (
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                fill="#10B98120"
              />
            )}
            {shows[1] && (
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#F43F5E"
                strokeWidth={2}
                fill="#F43F5E20"
              />
            )}
            {shows[2] && (
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#EAB308"
                strokeWidth={2}
                fill="#EAB30820"
              />
            )}
            <Tooltip formatter={formatTooltip} />
          </AreaChart>
        ) : (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="name"
              fontSize={12}
            />
            <PolarRadiusAxis />
            {shows[0] && (
              <Radar
                dataKey="income"
                stroke="#10B981"
                fill="#10B98180"
                fillOpacity={0.6}
              />
            )}
            {shows[1] && (
              <Radar
                dataKey="expense"
                stroke="#F43F5E"
                fill="#F43F5E80"
                fillOpacity={0.6}
              />
            )}
            {shows[2] && (
              <Radar
                dataKey="investment"
                stroke="#EAB308"
                fill="#EAB30880"
                fillOpacity={0.6}
              />
            )}
            <Tooltip formatter={formatTooltip} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default memo(Chart)
