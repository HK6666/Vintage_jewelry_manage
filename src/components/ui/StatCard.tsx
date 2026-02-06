import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  icon: ReactNode
  iconBg?: string
  trend?: ReactNode
}

export default function StatCard({ label, value, icon, iconBg = 'bg-primary-50', trend }: StatCardProps) {
  return (
    <div className="stat-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-ink-400 text-sm">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-ink-800 font-heading">{value}</p>
      {trend && <div className="mt-1">{trend}</div>}
    </div>
  )
}
