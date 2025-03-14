import { OverviewType } from '@/app/api/stats/overview/route'
import { useAppSelector } from '@/hooks'
import { formatSymbol } from '@/lib/utils'
import { ReactNode } from 'react'
import CountUp from 'react-countup'
import { LuTrendingDown, LuTrendingUp, LuWallet } from 'react-icons/lu'

interface StatCardsProps {
  loading: boolean
  className?: string
  overview?: OverviewType | null
}

function StatCards({ loading, overview = null, className = '' }: StatCardsProps) {
  // store
  const { userSettings } = useAppSelector(state => state.settings)

  return (
    <div className={`grid grid-cols-1 gap-21/2 md:grid-cols-3 md:gap-21 ${className}`}>
      {overview && !loading ? (
        <Card
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-emerald-500 bg-emerald-950">
              <LuTrendingUp size={24} />
            </div>
          }
          title="Income"
          value={overview.income || 0}
          currency={userSettings?.currency || 'USD'}
        />
      ) : (
        <SkeletonCard />
      )}

      {overview && !loading ? (
        <Card
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-rose-500 bg-rose-950">
              <LuTrendingDown size={24} />
            </div>
          }
          title="Expense"
          value={overview.expense || 0}
          currency={userSettings?.currency || 'USD'}
        />
      ) : (
        <SkeletonCard />
      )}

      {overview && !loading ? (
        <Card
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-rose-500 bg-rose-950">
              <LuTrendingDown size={24} />
            </div>
          }
          title="Investment"
          value={overview.investment || 0}
          currency={userSettings?.currency || 'USD'}
        />
      ) : (
        <SkeletonCard />
      )}

      {overview && !loading ? (
        <Card
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-violet-500 bg-violet-400/10">
              <LuWallet size={24} />
            </div>
          }
          title="Balance"
          value={overview.balance || 0}
          currency={userSettings?.currency || 'USD'}
        />
      ) : (
        <SkeletonCard />
      )}
    </div>
  )
}

interface CardProps {
  icon: ReactNode
  title: string
  value: number
  currency: string
  className?: string
}
function Card({ icon, title, value, currency, className = '' }: CardProps) {
  return (
    <div
      className={`flex h-24 w-full items-center gap-21/2 rounded-lg border border-slate-200/30 bg-neutral-800/30 p-21 ${className}`}
    >
      {icon}
      <div className="flex flex-col">
        <p className="font-body tracking-wider">{title}</p>

        <CountUp
          start={0}
          end={value}
          duration={2}
          separator=","
          decimals={2}
          decimal="."
          prefix={formatSymbol(currency) + ' '}
          className="text-xl font-semibold"
        />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return <div className="loading h-24 w-full rounded-lg border border-slate-200/30 p-21" />
}

export default StatCards
