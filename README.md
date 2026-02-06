# Vintage Jewelry Manage

A React-based Western vintage jewelry collection management system for antique dealers and collectors.

## Features

- 📊 **Dashboard** - Collection statistics, inventory trends, and category distribution
- 📈 **Analytics** - Multi-dimensional data visualization with Chart.js
- ➕ **Add Items** - Multi-step form for adding new jewelry pieces
- 📋 **Collection List** - Category filtering and detailed item display
- 🔗 **Correlation Graph** - D3 force-directed graph showing item relationships
- 🧠 **Knowledge Graph** - Interactive network of eras, brands, and styles

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS
- **图表**: Chart.js + react-chartjs-2
- **图谱**: D3.js
- **路由**: react-router-dom v6

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── charts/        # Chart.js components
  │   ├── graphs/        # D3 graph components
  │   ├── layout/        # Layout components
  │   └── ui/            # UI components
  ├── data/              # Static mock data
  ├── pages/             # Page components
  └── index.css          # Global styles
```

## License

MIT
