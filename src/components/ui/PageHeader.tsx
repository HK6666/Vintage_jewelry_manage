import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="px-6 md:px-8 pt-8 pb-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold text-ink-800">{title}</h2>
          <p className="text-ink-400 mt-1 text-sm">{subtitle}</p>
        </div>
        {actions}
      </div>
    </div>
  )
}
