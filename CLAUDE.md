# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev        # Start Vite dev server (default http://localhost:5173)
npm run build      # TypeScript check + Vite production build (tsc -b && vite build)
npm run preview    # Preview production build locally
npx tsc -b         # TypeScript type-check only (no emit)
```

No test framework is configured.

## Architecture

This is a **Vite + React 18 + TypeScript** SPA for managing a Western vintage jewelry collection ("珍藏阁"). UI language is Chinese; data content is European/American vintage jewelry (Victorian, Art Deco, Edwardian, etc.).

**Routing** (react-router-dom v6, 6 pages):
- `/` HomePage - dashboard with stat cards and Chart.js charts
- `/analytics` AnalyticsPage - detailed chart analytics (7 charts)
- `/entry` EntryPage - multi-step form for adding items
- `/list` ListPage - table view with category filters
- `/correlation` CorrelationPage - D3 force-directed correlation graph
- `/knowledge` KnowledgePage - D3 knowledge graph with zoom/pan

**State management**: Local useState only (sidebar open/close in App.tsx). No Redux/Zustand. Navigation callbacks passed as props from App.

**Styling**: Tailwind CSS v3 with custom color palette defined in `tailwind.config.js`:
- `primary` (gold #C4872E) - main brand color
- `accent` (wine #8B2240) - secondary
- `ivory` / `ink` - neutral palette
- Glass morphism effects via CSS classes in `index.css` (`.glass-card`, `.stat-card`, `.btn-primary`, `.input-field`)

**Fonts**: Google Fonts loaded in `index.html` - Cormorant/Noto Serif SC (headings), Montserrat/Noto Sans SC (body).

## Key Patterns

**ChartWrapper** (`src/components/charts/ChartWrapper.tsx`): Every Chart.js chart must be wrapped in this component. It provides a fixed-height container with `position: relative` to prevent Chart.js from growing infinitely when using `responsive: true` + `maintainAspectRatio: false`. This is the fix for the original chart infinite-growth bug.

**ForceGraph** (`src/components/graphs/ForceGraph.tsx`): A single reusable D3 force-directed graph component with two variants:
- `variant="correlation"` - link opacity/width varies by `value` property (correlation strength)
- `variant="knowledge"` - flat link styling with hover highlighting of connected nodes

The component manages its own SVG lifecycle, zoom behavior, drag handlers, and tooltip. It rebuilds on resize via a debounced window listener.

**Data layer** (`src/data/`): All data is static mock data, no API calls.
- `chartConfig.ts` - Chart.js global defaults, color constants, shared scale configs
- `collections.ts` - Collection items array and filter categories
- `graphData.ts` - Node/link datasets for both D3 graphs, group colors, labels
