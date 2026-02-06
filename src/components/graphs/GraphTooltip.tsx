interface GraphTooltipProps {
  content: string | null
  x: number
  y: number
}

export default function GraphTooltip({ content, x, y }: GraphTooltipProps) {
  if (!content) return null

  return (
    <div
      className="graph-tooltip"
      style={{
        display: 'block',
        left: `${x + 12}px`,
        top: `${y - 10}px`,
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
