# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vintage Vault** — 西方古董珠宝藏品管理系统。前端 React SPA 部署在 GitHub Pages，后端 Flask REST API 部署在独立服务器。

## Repository Structure

```
├── src/                  # React 前端源码
│   ├── api/              # API 层 (client, services, hooks, types)
│   ├── pages/            # 12 个页面组件 (含 LoginPage)
│   ├── components/       # 复用组件 (layout, charts, graphs, ui)
│   └── data/             # Chart.js 配置 & 图表颜色常量
├── dist/                 # 前端构建产物 (提交到 Git, GitHub Pages 直接托管)
├── backend/              # Flask 后端
│   ├── app/
│   │   ├── api/          # 14 个 Blueprint 模块 (REST 路由)
│   │   ├── models/       # 8 个 SQLAlchemy 模型
│   │   ├── seeds/        # 种子数据 (eras, categories, materials, brands, colors)
│   │   └── utils/        # response 封装, pagination, decorators
│   ├── run.py            # Flask 入口
│   ├── requirements.txt  # Python 依赖
│   ├── deploy.sh         # 服务器一键部署脚本
│   └── .env.example      # 环境变量模板
├── .env.production       # 前端生产构建 API 地址 (不提交到 Git)
└── .env.production.example
```

## Build & Dev Commands

```bash
# 前端
npm run dev          # Vite 开发服务器 (localhost:5173, 自动代理 /api → localhost:5000)
npm run build        # TypeScript 检查 + Vite 生产构建 (输出到 dist/)
npx tsc -b           # 仅类型检查

# 后端 (在 backend/ 目录下)
source venv/bin/activate
export FLASK_APP=run.py
flask init-db        # 创建数据库表
flask seed           # 写入种子数据
python run.py        # 启动开发服务器 (localhost:5000)
```

No test framework is configured.

## Architecture

### Frontend (Vite + React 18 + TypeScript)

**Routing** (react-router-dom v6, 12 pages):
- LoginPage — 登录 (未认证时显示, 非路由)
- `/` HomePage — 仪表盘, StatCard + Chart.js 图表
- `/analytics` AnalyticsPage — 6 个分析图表
- `/entry` EntryPage — 多步骤藏品录入表单
- `/list` ListPage — 分页列表, 搜索 + 品类筛选
- `/correlation` CorrelationPage — D3 力导向关联图
- `/knowledge` KnowledgePage — D3 知识图谱
- `/era-manage` `/category-manage` `/material-manage` `/brand-manage` `/color-manage` — 基础数据 CRUD 管理页

**Auth flow** (App.tsx):
- 启动时检查 localStorage 中的 JWT token, 调用 `GET /auth/me` 验证
- 未认证 → 显示 LoginPage; 已认证 → 显示主应用 + Sidebar
- 登录调用 `POST /auth/login`, token 存入 localStorage
- Sidebar 底部有退出按钮, 调用 `POST /auth/logout` 并清除 token

**API layer** (`src/api/`):
- `client.ts` — fetch 封装, 自动注入 Bearer token, 解析 `response.data`
- `services.ts` — 按模块分组的 API 函数 (authApi, dashboardApi, collectionsApi, etc.)
- `hooks.ts` — `useFetch<T>(fetchFn, deps)` hook, 管理 data/loading/error/refetch
- `types.ts` — 所有 API 响应类型定义
- API base URL: `import.meta.env.VITE_API_BASE || '/api/v1'`

**Styling**: Tailwind CSS v3 with custom palette in `tailwind.config.js`:
- `primary` (gold #C4872E), `accent` (wine #8B2240), `ivory` / `ink` neutrals
- Glass morphism: `.glass-card`, `.stat-card`, `.btn-primary`, `.input-field` in `index.css`

### Backend (Flask 3.1 + SQLAlchemy + SQLite)

**API prefix**: `/api/v1` (registered in `app/api/__init__.py`)

**Auth**: Flask-JWT-Extended, access token 2h, refresh token 30d. All write endpoints require `@jwt_required()`.

**Response format**: All endpoints return `{ code, message, data }` via `app/utils/response.py`

**Pagination**: `collectionsApi.list()` returns `{ items, total, page, pageSize, totalPages }`

**Models**: User, Collection, Era, Category, Material, Brand, Color, Tag. Collection has foreign keys to Era, Category, Brand, Color. Many-to-many with Tag via `collection_tag` table.

**Key routes**:
- `POST /auth/login` `POST /auth/logout` `POST /auth/refresh` `GET /auth/me`
- `GET/POST /collections` `GET/PUT/DELETE /collections/<id>` `GET /collections/recent`
- `GET/POST /eras|categories|materials|brands|colors` `PUT/DELETE /<resource>/<id>`
- `GET /dashboard/stats|intake-trend|category-distribution|era-distribution`
- `GET /analytics/summary|value-by-material|era-category-heatmap|status-distribution|source-distribution|value-trend`
- `GET /correlations/graph|strong-pairs`
- `GET /knowledge/graph`
- `GET /tags`

## Key Patterns

**ChartWrapper** (`src/components/charts/ChartWrapper.tsx`): Every Chart.js chart must be wrapped in this component. It provides a fixed-height container with `position: relative` to prevent infinite growth.

**ForceGraph** (`src/components/graphs/ForceGraph.tsx`): Reusable D3 force-directed graph with `variant="correlation"` (link strength varies) and `variant="knowledge"` (hover highlighting).

**Management pages pattern**: All 5 management pages follow the same structure — `useFetch` to load list → inline form for create/edit → `refetch()` after mutation.

## Deployment

### Frontend — GitHub Pages
- Base path: `/Vintage_jewelry_manage/` (in `vite.config.ts`)
- `dist/` folder is committed to Git and served directly
- Production API address configured in `.env.production`:
  ```
  VITE_API_BASE=http://43.247.134.107:8000/api/v1
  ```

### Backend — Ubuntu Server (43.247.134.107:8000)
- Gunicorn + systemd service (`vintage-vault`)
- SQLite database at `backend/vintage_vault.db`

**Deploy/update flow**:
```bash
# 服务器上
cd ~/zhongu/Vintage_jewelry_manage
git fetch --all && git reset --hard origin/main
cd backend
chmod +x deploy.sh && ./deploy.sh
```

**Manual commands**:
```bash
systemctl status vintage-vault     # 查看状态
systemctl restart vintage-vault    # 重启
systemctl stop vintage-vault       # 停止
journalctl -u vintage-vault -f     # 实时日志
```

**Deploy new frontend changes**:
```bash
# 本地
npm run build
git add dist
git commit -m "deploy: rebuild dist"
git push
# GitHub Pages 自动更新 (1-2 分钟)
```

**Deploy backend changes**:
```bash
# 本地: push 代码后
# 服务器:
cd ~/zhongu/Vintage_jewelry_manage
git fetch --all && git reset --hard origin/main
systemctl restart vintage-vault
```

### Credentials
- Admin: `admin` / `admin123321`
- JWT tokens stored in `localStorage['jwt_token']`
- Server `.env` contains SECRET_KEY and JWT_SECRET_KEY (auto-generated by deploy.sh)
