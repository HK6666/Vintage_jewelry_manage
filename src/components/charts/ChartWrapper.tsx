import { ReactNode } from 'react'

interface ChartWrapperProps {
  children: ReactNode
  height?: number
}

/**
 * Fixed-height chart container that prevents Chart.js infinite growth bug.
 * Chart.js with responsive: true + maintainAspectRatio: false needs a parent
 * with an explicit height and position: relative.
 */
export default function ChartWrapper({ children, height = 300 }: ChartWrapperProps) {
  return (
    <div style={{ position: 'relative', height: `${height}px` }}>
      {children}
    </div>
  )
}
