# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vintage Vault** — 西方古董珠宝藏品管理系统。前端 React SPA + 后端 Flask REST API，通过 Docker Compose 部署在同一台服务器上（nginx 容器托管前端 + 反代 API，backend 容器跑 gunicorn）。

## Repository Structure

```
├── src/                  # React 前端源码
│   ├── api/              # API 层 (client, services, hooks, types)
│   ├── pages/            # 12 个页面组件 (含 LoginPage)
│   ├── components/       # 复用组件 (layout, charts, graphs, ui)
│   └── data/             # Chart.js 配置 & 图表颜色常量
├── dist/                 # 前端构建产物 (提交到 Git)
├── backend/              # Flask 后端
│   ├── app/
│   │   ├── api/          # 14 个 Blueprint 模块 (REST 路由)
│   │   ├── models/       # 8 个 SQLAlchemy 模型
│   │   ├── seeds/        # 种子数据 (eras, categories, materials, brands, colors)
│   │   └── utils/        # response 封装, pagination, decorators
│   ├── Dockerfile        # 后端容器镜像
│   ├── run.py            # Flask 入口
│   ├── requirements.txt  # Python 依赖
│   └── .env.example      # 环境变量模板
├── docker/
│   └── nginx.conf        # nginx 容器配置 (前端静态文件 + API 反代)
├── docker-compose.yml    # 编排: nginx + backend 两个容器
└── .env.production       # 前端构建 API 地址 (不提交, 值为 /api/v1)
```

## Build & Dev Commands

```bash
# 前端
npm run dev          # Vite 开发服务器 (localhost:5173, 自动代理 /api → localhost:5000)
npm run build        # TypeScript 检查 + Vite 生产构建 (输出到 dist/)
npx tsc -b           # 仅类型检查

# 后端本地开发 (在 backend/ 目录下)
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

## Deployment (Docker Compose)

服务器地址: `43.247.134.107`，访问端口 `9527`。

### Docker 架构

```
docker-compose.yml
├── nginx 容器 (端口 9527:80)
│   ├── 托管 dist/ 前端静态文件
│   └── 反代 /api/ → backend:5000
└── backend 容器 (内部端口 5000)
    ├── gunicorn + Flask
    └── SQLite 数据库 (Docker volume 持久化)
```

### 首次部署 (服务器上从零开始)

```bash
# 1. 安装 Docker (如果没有)
curl -fsSL https://get.docker.com | sh

# 2. 克隆代码
git clone https://github.com/HK6666/Vintage_jewelry_manage.git
cd Vintage_jewelry_manage

# 3. 创建后端 .env
cd backend
SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=${SECRET}
JWT_SECRET_KEY=${JWT_SECRET}
DATABASE_URL=sqlite:////app/vintage_vault.db
UPLOAD_FOLDER=uploads
EOF
cd ..

# 4. 启动容器
docker compose up -d --build

# 5. 初始化数据库和种子数据
docker compose exec backend flask init-db
docker compose exec backend flask seed

# 6. 防火墙放行 9527 端口 (如果需要)
ufw allow 9527/tcp 2>/dev/null || true
```

部署完成后访问: `http://43.247.134.107:9527`
登录账号: `admin` / `admin123321`

### 更新前端代码

```bash
# 本地
npm run build
git add dist
git commit -m "deploy: rebuild dist"
git push

# 服务器
cd ~/Vintage_jewelry_manage
git fetch --all && git reset --hard origin/main
docker compose restart nginx
```

### 更新后端代码

```bash
# 本地 push 代码后，服务器执行:
cd ~/Vintage_jewelry_manage
git fetch --all && git reset --hard origin/main
docker compose up -d --build backend
```

如果改了数据库模型 (加了字段/表):
```bash
docker compose exec backend flask init-db
docker compose restart backend
```

如果加了新 Python 依赖 (requirements.txt):
```bash
docker compose up -d --build backend
```

### 前后端同时更新

```bash
# 本地
npm run build
git add .
git commit -m "feat: xxx"
git push

# 服务器
cd ~/Vintage_jewelry_manage
git fetch --all && git reset --hard origin/main
docker compose up -d --build
```

### 常用运维命令

```bash
docker compose ps                          # 查看容器状态
docker compose logs -f backend             # 后端实时日志
docker compose logs -f nginx               # nginx 实时日志
docker compose restart                     # 重启所有容器
docker compose down                        # 停止并移除容器
docker compose down -v                     # 停止并移除容器+数据卷(会丢数据库!)
docker compose exec backend flask seed     # 重新写入种子数据
```

### Credentials
- Admin: `admin` / `admin123321`
- JWT tokens stored in `localStorage['jwt_token']`
- Server `backend/.env` contains SECRET_KEY and JWT_SECRET_KEY
