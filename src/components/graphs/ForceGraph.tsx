import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import type { GraphNode, GraphLink } from '../../data/graphData'

interface ForceGraphProps {
  nodes: GraphNode[]
  links: GraphLink[]
  groupColors: Record<string, string>
  width?: number
  height?: number
  linkDistance?: number
  chargeStrength?: number
  showZoomControls?: boolean
  /** If provided, show group label in tooltip */
  groupLabels?: Record<string, string>
  /** Link style - 'correlation' shows variable opacity/width by value, 'knowledge' uses flat style */
  variant?: 'correlation' | 'knowledge'
}

export default function ForceGraph({
  nodes: nodeData,
  links: linkData,
  groupColors,
  height = 500,
  linkDistance = 120,
  chargeStrength = -300,
  showZoomControls = false,
  groupLabels,
  variant = 'correlation',
}: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const buildGraph = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    // Clear existing
    container.querySelectorAll('svg').forEach((el) => el.remove())

    const width = container.clientWidth || container.getBoundingClientRect().width || 800
    if (width < 10) {
      // Container not yet laid out; retry shortly
      const retryTimer = setTimeout(() => buildGraph(), 100)
      return () => clearTimeout(retryTimer)
    }
    const nodes = nodeData.map((n) => ({ ...n }))
    const links = linkData.map((l) => ({ ...l }))

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height] as unknown as string)

    const g = svg.append('g')

    // Zoom
    let currentZoom = d3.zoomIdentity
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (e) => {
        g.attr('transform', e.transform.toString())
        currentZoom = e.transform
      })
    svg.call(zoom)

    if (showZoomControls) {
      const zoomInBtn = container.parentElement?.querySelector('[data-zoom="in"]')
      const zoomOutBtn = container.parentElement?.querySelector('[data-zoom="out"]')
      const resetBtn = container.parentElement?.querySelector('[data-zoom="reset"]')

      zoomInBtn?.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3)
      })
      zoomOutBtn?.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.75)
      })
      resetBtn?.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity)
      })
    }

    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((d: any) => d.id)
          .distance(linkDistance)
          .strength(variant === 'correlation' ? (d: any) => (d.value || 0.5) * 0.5 : undefined as any)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.r + (variant === 'knowledge' ? 5 : 8)))

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#C4872E')
      .attr('stroke-opacity', (d: any) =>
        variant === 'correlation' ? (d.value || 0.5) * 0.5 : 0.15
      )
      .attr('stroke-width', (d: any) =>
        variant === 'correlation' ? (d.value || 0.5) * 3 : 1.2
      )

    // Nodes
    const node = g
      .append('g')
      .selectAll<SVGGElement, typeof nodes[0]>('g')
      .data(nodes)
      .join('g')
      .call(
        d3
          .drag<SVGGElement, typeof nodes[0]>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    node
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => groupColors[d.group] || '#999')
      .attr('fill-opacity', variant === 'knowledge' ? 0.85 : 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', variant === 'knowledge' ? 1.5 : 2)
      .attr('class', 'node-circle')

    node
      .append('text')
      .text((d) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', (d) => Math.max(variant === 'knowledge' ? 8 : 10, d.r * (variant === 'knowledge' ? 0.55 : 0.45)))
      .attr('font-family', 'Noto Sans SC, sans-serif')
      .attr('font-weight', 500)
      .style('pointer-events', 'none')

    // Tooltip
    const tooltip = tooltipRef.current
    node
      .on('mouseover', (event, d) => {
        if (!tooltip) return
        const connected = new Set<string>()
        links.forEach((l: any) => {
          const sid = typeof l.source === 'object' ? l.source.id : l.source
          const tid = typeof l.target === 'object' ? l.target.id : l.target
          if (sid === d.id) connected.add(tid)
          if (tid === d.id) connected.add(sid)
        })

        if (variant === 'knowledge') {
          node.select('circle').attr('fill-opacity', (n) =>
            n.id === d.id || connected.has(n.id) ? 1 : 0.2
          )
          link.attr('stroke-opacity', (l: any) => {
            const sid = typeof l.source === 'object' ? l.source.id : l.source
            const tid = typeof l.target === 'object' ? l.target.id : l.target
            return sid === d.id || tid === d.id ? 0.6 : 0.05
          })
        }

        let html = `<strong>${d.id}</strong>`
        if (groupLabels) {
          html += `<br>类型: ${groupLabels[d.group] || d.group}`
        }
        html += `<br>关联: ${connected.size} 项`
        tooltip.innerHTML = html
        tooltip.style.display = 'block'
        tooltip.style.left = `${event.pageX + 12}px`
        tooltip.style.top = `${event.pageY - 10}px`
      })
      .on('mousemove', (event) => {
        if (!tooltip) return
        tooltip.style.left = `${event.pageX + 12}px`
        tooltip.style.top = `${event.pageY - 10}px`
      })
      .on('mouseout', () => {
        if (!tooltip) return
        if (variant === 'knowledge') {
          node.select('circle').attr('fill-opacity', 0.85)
          link.attr('stroke-opacity', 0.15)
        }
        tooltip.style.display = 'none'
      })

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodeData, linkData, groupColors, height, linkDistance, chargeStrength, showZoomControls, groupLabels, variant])

  useEffect(() => {
    const cleanup = buildGraph()

    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        buildGraph()
      }, 250)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cleanup?.()
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [buildGraph])

  return (
    <>
      <div ref={containerRef} className="w-full" style={{ height: `${height}px` }} />
      <div
        ref={tooltipRef}
        className="graph-tooltip"
        style={{ display: 'none', position: 'fixed' }}
      />
    </>
  )
}
