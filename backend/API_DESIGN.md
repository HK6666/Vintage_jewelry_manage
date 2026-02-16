# Vintage Vault API 接口设计文档

> 基于前端页面功能的完整 RESTful API 设计
> Base URL: `/api/v1`
> 响应格式: JSON
> 认证方式: Bearer Token (JWT)

---

## 通用约定

### 请求格式

- `GET` / `DELETE` 参数通过 Query String 传递
- `POST` / `PUT` / `PATCH` 参数通过 JSON Body 传递

### 统一响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 分页参数 (适用于列表接口)

| 参数     | 类型   | 默认值 | 说明         |
| -------- | ------ | ------ | ------------ |
| page     | int    | 1      | 当前页码     |
| pageSize | int    | 20     | 每页条数     |
| sortBy   | string | id     | 排序字段     |
| order    | string | desc   | asc / desc   |

### 分页响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### 错误码

| 状态码 | 说明             |
| ------ | ---------------- |
| 200    | 成功             |
| 201    | 创建成功         |
| 400    | 请求参数错误     |
| 401    | 未认证           |
| 403    | 无权限           |
| 404    | 资源不存在       |
| 409    | 资源冲突(重复)   |
| 422    | 数据验证失败     |
| 500    | 服务器内部错误   |

---

## 1. 认证模块 `/api/v1/auth`

### 1.1 用户登录

```
POST /api/v1/auth/login
```

**请求体:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应:**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "avatar": "https://...",
      "role": "admin"
    }
  }
}
```

### 1.2 刷新 Token

```
POST /api/v1/auth/refresh
```

**请求体:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 1.3 退出登录

```
POST /api/v1/auth/logout
```

### 1.4 获取当前用户信息

```
GET /api/v1/auth/me
```

---

## 2. 藏品管理 `/api/v1/collections`

> 对应页面: 藏品录入 (EntryPage)、藏品列表 (ListPage)

### 2.1 获取藏品列表 (分页 + 筛选 + 搜索)

```
GET /api/v1/collections
```

**Query 参数:**

| 参数        | 类型   | 必填 | 说明                                   |
| ----------- | ------ | ---- | -------------------------------------- |
| page        | int    | 否   | 页码，默认 1                           |
| pageSize    | int    | 否   | 每页条数，默认 20                      |
| keyword     | string | 否   | 搜索关键字 (名称、描述模糊匹配)        |
| cat         | string | 否   | 品类筛选，如 "戒指"                    |
| era         | string | 否   | 年代筛选，如 "1920s"                   |
| material    | string | 否   | 材质筛选                               |
| brand       | string | 否   | 品牌筛选                               |
| colorScheme | string | 否   | 色系筛选                               |
| status      | string | 否   | 状态筛选: 完好/良好/一般/需修复         |
| priceMin    | number | 否   | 购入价格下限                           |
| priceMax    | number | 否   | 购入价格上限                           |
| valueMin    | number | 否   | 预估价值下限                           |
| valueMax    | number | 否   | 预估价值上限                           |
| dateFrom    | string | 否   | 入手日期起始 (YYYY-MM-DD)              |
| dateTo      | string | 否   | 入手日期结束 (YYYY-MM-DD)              |
| sortBy      | string | 否   | 排序字段: id/name/purchasePrice/estimatedValue/date |
| order       | string | 否   | asc / desc                             |

**响应 data.items 结构:**

```json
{
  "id": 1,
  "name": "Cartier Art Deco 钻石胸针",
  "era": "Art Deco · 1925",
  "cat": "胸针",
  "material": "铂金/钻石",
  "brand": "Cartier",
  "colorScheme": "白色系",
  "purchasePrice": 1200000,
  "estimatedValue": 1350000,
  "status": "完好",
  "description": "...",
  "source": "Christie's 纽约拍卖",
  "date": "2023-06-15",
  "tags": ["宫廷", "镶嵌", "Art Deco"],
  "images": [
    { "id": 1, "url": "/uploads/collections/1/img1.jpg", "sort": 0 }
  ],
  "createdAt": "2023-06-15T10:30:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```

### 2.2 获取单个藏品详情

```
GET /api/v1/collections/:id
```

### 2.3 创建藏品

```
POST /api/v1/collections
```

**请求体:**

```json
{
  "name": "Cartier Art Deco 钻石胸针",
  "era": "1920s",
  "cat": "胸针",
  "material": "铂金/钻石",
  "brand": "Cartier",
  "colorScheme": "白色系",
  "purchasePrice": 1200000,
  "estimatedValue": 1350000,
  "status": "完好",
  "description": "...",
  "source": "Christie's 纽约拍卖",
  "date": "2023-06-15",
  "tags": ["宫廷", "镶嵌", "Art Deco"]
}
```

### 2.4 更新藏品

```
PUT /api/v1/collections/:id
```

**请求体:** 同创建，所有字段可选 (仅传需要更新的字段)

### 2.5 删除藏品

```
DELETE /api/v1/collections/:id
```

### 2.6 批量删除藏品

```
DELETE /api/v1/collections/batch
```

**请求体:**

```json
{
  "ids": [1, 2, 3]
}
```

### 2.7 上传藏品图片

```
POST /api/v1/collections/:id/images
```

**请求:** `multipart/form-data`

| 字段   | 类型   | 说明                            |
| ------ | ------ | ------------------------------- |
| images | file[] | 图片文件，支持 JPG/PNG/WebP     |

**响应:**

```json
{
  "code": 201,
  "message": "上传成功",
  "data": {
    "images": [
      { "id": 10, "url": "/uploads/collections/1/img10.jpg", "sort": 2 }
    ]
  }
}
```

### 2.8 删除藏品图片

```
DELETE /api/v1/collections/:id/images/:imageId
```

### 2.9 调整图片排序

```
PUT /api/v1/collections/:id/images/sort
```

**请求体:**

```json
{
  "imageIds": [3, 1, 2]
}
```

### 2.10 获取最近录入

```
GET /api/v1/collections/recent?limit=10
```

> 对应首页 "最近录入" 区块

---

## 3. 年代管理 `/api/v1/eras`

> 对应页面: 年代管理 (EraManagePage)

### 3.1 获取年代列表

```
GET /api/v1/eras
```

**Query 参数:**

| 参数     | 类型   | 必填 | 说明                 |
| -------- | ------ | ---- | -------------------- |
| page     | int    | 否   | 页码 (不传则返回全部) |
| pageSize | int    | 否   | 每页条数             |
| keyword  | string | 否   | 搜索关键字           |

**响应 data 结构 (无分页时):**

```json
[
  {
    "id": 1,
    "name": "1830年代",
    "nameEn": "1830s",
    "period": "1830-1839",
    "description": "...",
    "count": 12,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 3.2 获取单个年代

```
GET /api/v1/eras/:id
```

### 3.3 创建年代

```
POST /api/v1/eras
```

**请求体:**

```json
{
  "name": "1830年代",
  "nameEn": "1830s",
  "period": "1830-1839",
  "description": "..."
}
```

### 3.4 更新年代

```
PUT /api/v1/eras/:id
```

### 3.5 删除年代

```
DELETE /api/v1/eras/:id
```

> 如果有藏品关联该年代，返回 409 冲突，提示先解除关联。

### 3.6 批量删除年代

```
DELETE /api/v1/eras/batch
```

**请求体:**

```json
{
  "ids": [1, 2]
}
```

---

## 4. 品类管理 `/api/v1/categories`

> 对应页面: 品类管理 (CategoryManagePage)

### 4.1 获取品类列表

```
GET /api/v1/categories
```

**Query 参数:**

| 参数    | 类型   | 必填 | 说明       |
| ------- | ------ | ---- | ---------- |
| keyword | string | 否   | 搜索关键字 |

**响应 data 结构:**

```json
[
  {
    "id": 1,
    "name": "戒指",
    "nameEn": "Ring",
    "description": "订婚戒、鸡尾酒戒、印章戒、永恒戒等",
    "count": 320,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 4.2 获取单个品类

```
GET /api/v1/categories/:id
```

### 4.3 创建品类

```
POST /api/v1/categories
```

**请求体:**

```json
{
  "name": "戒指",
  "nameEn": "Ring",
  "description": "..."
}
```

### 4.4 更新品类

```
PUT /api/v1/categories/:id
```

### 4.5 删除品类

```
DELETE /api/v1/categories/:id
```

> 有藏品关联时返回 409。

### 4.6 批量删除品类

```
DELETE /api/v1/categories/batch
```

---

## 5. 材质管理 `/api/v1/materials`

> 对应页面: 材质管理 (MaterialManagePage)

### 5.1 获取材质列表

```
GET /api/v1/materials
```

**Query 参数:**

| 参数     | 类型   | 必填 | 说明                                       |
| -------- | ------ | ---- | ------------------------------------------ |
| keyword  | string | 否   | 搜索关键字                                 |
| category | string | 否   | 材质分类: 贵金属/宝石/有机材质/工艺材质     |

**响应 data 结构:**

```json
[
  {
    "id": 1,
    "name": "黄金",
    "nameEn": "Gold",
    "category": "贵金属",
    "description": "...",
    "count": 580,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 5.2 获取单个材质

```
GET /api/v1/materials/:id
```

### 5.3 创建材质

```
POST /api/v1/materials
```

**请求体:**

```json
{
  "name": "黄金",
  "nameEn": "Gold",
  "category": "贵金属",
  "description": "..."
}
```

### 5.4 更新材质

```
PUT /api/v1/materials/:id
```

### 5.5 删除材质

```
DELETE /api/v1/materials/:id
```

### 5.6 批量删除材质

```
DELETE /api/v1/materials/batch
```

---

## 6. 品牌管理 `/api/v1/brands`

> 对应页面: 品牌管理 (BrandManagePage)

### 6.1 获取品牌列表

```
GET /api/v1/brands
```

**Query 参数:**

| 参数    | 类型   | 必填 | 说明                   |
| ------- | ------ | ---- | ---------------------- |
| keyword | string | 否   | 搜索关键字             |
| country | string | 否   | 国家/地区筛选，如 "法国" |

**响应 data 结构:**

```json
[
  {
    "id": 1,
    "name": "卡地亚",
    "nameEn": "Cartier",
    "country": "法国",
    "description": "...",
    "count": 85,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 6.2 获取单个品牌

```
GET /api/v1/brands/:id
```

### 6.3 创建品牌

```
POST /api/v1/brands
```

**请求体:**

```json
{
  "name": "卡地亚",
  "nameEn": "Cartier",
  "country": "法国",
  "description": "..."
}
```

### 6.4 更新品牌

```
PUT /api/v1/brands/:id
```

### 6.5 删除品牌

```
DELETE /api/v1/brands/:id
```

### 6.6 批量删除品牌

```
DELETE /api/v1/brands/batch
```

---

## 7. 色系管理 `/api/v1/colors`

> 对应页面: 色系管理 (ColorManagePage)

### 7.1 获取色系列表

```
GET /api/v1/colors
```

**Query 参数:**

| 参数    | 类型   | 必填 | 说明       |
| ------- | ------ | ---- | ---------- |
| keyword | string | 否   | 搜索关键字 |

**响应 data 结构:**

```json
[
  {
    "id": 1,
    "name": "金色系",
    "nameEn": "Gold",
    "hex": "#D4A853",
    "description": "...",
    "count": 380,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 7.2 获取单个色系

```
GET /api/v1/colors/:id
```

### 7.3 创建色系

```
POST /api/v1/colors
```

**请求体:**

```json
{
  "name": "金色系",
  "nameEn": "Gold",
  "hex": "#D4A853",
  "description": "..."
}
```

### 7.4 更新色系

```
PUT /api/v1/colors/:id
```

### 7.5 删除色系

```
DELETE /api/v1/colors/:id
```

### 7.6 批量删除色系

```
DELETE /api/v1/colors/batch
```

---

## 8. 首页概览 `/api/v1/dashboard`

> 对应页面: 首页 (HomePage)

### 8.1 获取统计卡片数据

```
GET /api/v1/dashboard/stats
```

**响应:**

```json
{
  "code": 200,
  "data": {
    "totalCount": 1284,
    "totalCountChange": 23,
    "totalValue": 8600000,
    "totalValueChangePercent": 12.3,
    "eraCount": 20,
    "eraNames": ["1830s", "1840s", "..."],
    "monthlyNew": 47,
    "monthlyNewChange": 8
  }
}
```

### 8.2 获取入库趋势数据

```
GET /api/v1/dashboard/intake-trend
```

**Query 参数:**

| 参数        | 类型   | 必填 | 说明                       |
| ----------- | ------ | ---- | -------------------------- |
| granularity | string | 否   | 粒度: monthly / quarterly  |
| year        | int    | 否   | 年份，默认当年             |

**响应:**

```json
{
  "code": 200,
  "data": {
    "labels": ["1月", "2月", "3月", "..."],
    "values": [32, 28, 45, 38, 52, 41, 55, 48, 62, 58, 47, 53]
  }
}
```

### 8.3 获取品类分布数据

```
GET /api/v1/dashboard/category-distribution
```

**响应:**

```json
{
  "code": 200,
  "data": [
    { "name": "戒指", "nameEn": "Ring", "count": 320 },
    { "name": "项链", "nameEn": "Necklace", "count": 215 }
  ]
}
```

### 8.4 获取年代藏量分布

```
GET /api/v1/dashboard/era-distribution
```

**响应:**

```json
{
  "code": 200,
  "data": [
    { "name": "1920年代", "nameEn": "1920s", "count": 120 },
    { "name": "1940年代", "nameEn": "1940s", "count": 110 }
  ]
}
```

---

## 9. 数据分析 `/api/v1/analytics`

> 对应页面: 数据分析 (AnalyticsPage)

### 9.1 获取汇总统计

```
GET /api/v1/analytics/summary
```

**响应:**

```json
{
  "code": 200,
  "data": {
    "avgValue": 67000,
    "maxValue": 2800000,
    "materialTypeCount": 28,
    "brandCount": 24
  }
}
```

### 9.2 估值分布 (按材质)

```
GET /api/v1/analytics/value-by-material
```

**响应:**

```json
{
  "code": 200,
  "data": [
    { "material": "钻石", "avgValue": 85000, "maxValue": 1200000 },
    { "material": "红宝石", "avgValue": 62000, "maxValue": 450000 }
  ]
}
```

### 9.3 年代 x 品类 热力图数据

```
GET /api/v1/analytics/era-category-heatmap
```

**响应:**

```json
{
  "code": 200,
  "data": {
    "eras": ["1920s", "1930s", "1940s"],
    "categories": ["戒指", "项链", "手链", "胸针", "耳饰", "吊坠"],
    "matrix": [
      [12, 8, 5, 18, 45, 15],
      [8, 15, 3, 22, 38, 12]
    ]
  }
}
```

### 9.4 保存状态分布

```
GET /api/v1/analytics/status-distribution
```

**响应:**

```json
{
  "code": 200,
  "data": [
    { "status": "完好", "count": 420 },
    { "status": "良好", "count": 510 },
    { "status": "一般", "count": 248 },
    { "status": "需修复", "count": 106 }
  ]
}
```

### 9.5 入手渠道分布

```
GET /api/v1/analytics/source-distribution
```

**响应:**

```json
{
  "code": 200,
  "data": [
    { "source": "Christie's/Sotheby's", "count": 380 },
    { "source": "古董商", "count": 310 },
    { "source": "遗产拍卖", "count": 265 },
    { "source": "私人藏家", "count": 185 },
    { "source": "线上平台", "count": 144 }
  ]
}
```

### 9.6 估值趋势 (近12月)

```
GET /api/v1/analytics/value-trend
```

**Query 参数:**

| 参数   | 类型 | 必填 | 说明               |
| ------ | ---- | ---- | ------------------ |
| months | int  | 否   | 回溯月数，默认 12  |

**响应:**

```json
{
  "code": 200,
  "data": {
    "labels": ["2025-03", "2025-04", "..."],
    "values": [6200000, 6500000, 6800000]
  }
}
```

---

## 10. 藏品关联 `/api/v1/correlations`

> 对应页面: 藏品关联 (CorrelationPage)

### 10.1 获取关联网络图数据

```
GET /api/v1/correlations/graph
```

**Query 参数:**

| 参数      | 类型   | 必填 | 说明                                    |
| --------- | ------ | ---- | --------------------------------------- |
| dimension | string | 否   | 关联维度: material/era/craft/brand      |
| era       | string | 否   | 年代筛选，如 "1920s"                    |

**响应:**

```json
{
  "code": 200,
  "data": {
    "nodes": [
      { "id": "钻石", "group": "material", "r": 28 },
      { "id": "Art Deco", "group": "era", "r": 30 }
    ],
    "links": [
      { "source": "钻石", "target": "Art Deco", "value": 0.92 },
      { "source": "铂金", "target": "Edwardian", "value": 0.87 }
    ],
    "groupColors": {
      "material": "#C4872E",
      "era": "#8B2240",
      "type": "#4A7C59"
    }
  }
}
```

### 10.2 获取强关联组

```
GET /api/v1/correlations/strong-pairs
```

**Query 参数:**

| 参数      | 类型   | 必填 | 说明                           |
| --------- | ------ | ---- | ------------------------------ |
| dimension | string | 否   | 关联维度                       |
| limit     | int    | 否   | 返回数量，默认 10              |
| threshold | float  | 否   | 关联强度阈值，默认 0.5         |

**响应:**

```json
{
  "code": 200,
  "data": [
    {
      "nodeA": "钻石",
      "nodeB": "Art Deco",
      "strength": 0.92,
      "sharedCount": 168,
      "insight": "Art Deco 时期大量使用钻石微镶工艺，几何造型为标志性设计语言"
    }
  ]
}
```

---

## 11. 知识图谱 `/api/v1/knowledge`

> 对应页面: 知识图谱 (KnowledgePage)

### 11.1 获取知识图谱数据

```
GET /api/v1/knowledge/graph
```

**Query 参数:**

| 参数   | 类型   | 必填 | 说明                                            |
| ------ | ------ | ---- | ----------------------------------------------- |
| depth  | int    | 否   | 展示深度层级，默认 2                             |
| center | string | 否   | 中心节点 ID (用于局部子图查询)                   |
| groups | string | 否   | 显示的节点类型，逗号分隔: item,era,material,craft,category |

**响应:**

```json
{
  "code": 200,
  "data": {
    "nodes": [
      { "id": "Cartier Art Deco 胸针", "group": "item", "r": 18 },
      { "id": "Art Deco", "group": "era", "r": 24 },
      { "id": "钻石", "group": "material", "r": 20 },
      { "id": "微镶", "group": "craft", "r": 14 },
      { "id": "胸针", "group": "category", "r": 16 }
    ],
    "links": [
      { "source": "Cartier Art Deco 胸针", "target": "Art Deco" },
      { "source": "Cartier Art Deco 胸针", "target": "钻石" },
      { "source": "Cartier Art Deco 胸针", "target": "胸针" }
    ],
    "groupColors": {
      "item": "#C4872E",
      "era": "#8B2240",
      "material": "#4A7C59",
      "craft": "#5B6ABF",
      "category": "#B8860B"
    },
    "groupLabels": {
      "item": "藏品",
      "era": "年代",
      "material": "材质",
      "craft": "工艺",
      "category": "品类"
    }
  }
}
```

---

## 12. 文件上传 `/api/v1/upload`

> 通用文件上传，用于藏品图片等

### 12.1 通用图片上传

```
POST /api/v1/upload/image
```

**请求:** `multipart/form-data`

| 字段  | 类型 | 说明                              |
| ----- | ---- | --------------------------------- |
| file  | file | 图片文件                          |
| usage | str  | 用途: collection / avatar / other |

**响应:**

```json
{
  "code": 201,
  "data": {
    "url": "/uploads/2024/03/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 245760,
    "mimeType": "image/jpeg"
  }
}
```

---

## 13. 标签管理 `/api/v1/tags`

> 用于藏品标签的自动补全和管理

### 13.1 获取标签列表 (自动补全)

```
GET /api/v1/tags
```

**Query 参数:**

| 参数    | 类型   | 必填 | 说明                   |
| ------- | ------ | ---- | ---------------------- |
| keyword | string | 否   | 前缀匹配搜索           |
| limit   | int    | 否   | 返回数量，默认 20      |

**响应:**

```json
{
  "code": 200,
  "data": [
    { "name": "宫廷", "count": 45 },
    { "name": "镶嵌", "count": 38 }
  ]
}
```

### 13.2 创建标签

```
POST /api/v1/tags
```

**请求体:**

```json
{
  "name": "新标签"
}
```

### 13.3 删除标签

```
DELETE /api/v1/tags/:name
```

---

## 14. 数据导出 `/api/v1/export`

### 14.1 导出藏品数据

```
GET /api/v1/export/collections
```

**Query 参数:**

| 参数   | 类型   | 必填 | 说明                    |
| ------ | ------ | ---- | ----------------------- |
| format | string | 否   | 格式: csv / xlsx / json |
| ids    | string | 否   | 指定 ID，逗号分隔       |
| 其他   |        |      | 同藏品列表筛选参数      |

**响应:** 文件流下载

---

## 接口总览

| 模块     | 路径前缀               | 接口数 | 方法                           |
| -------- | ---------------------- | ------ | ------------------------------ |
| 认证     | /api/v1/auth           | 4      | POST, GET                      |
| 藏品     | /api/v1/collections    | 10     | GET, POST, PUT, DELETE         |
| 年代     | /api/v1/eras           | 6      | GET, POST, PUT, DELETE         |
| 品类     | /api/v1/categories     | 6      | GET, POST, PUT, DELETE         |
| 材质     | /api/v1/materials      | 6      | GET, POST, PUT, DELETE         |
| 品牌     | /api/v1/brands         | 6      | GET, POST, PUT, DELETE         |
| 色系     | /api/v1/colors         | 6      | GET, POST, PUT, DELETE         |
| 首页     | /api/v1/dashboard      | 4      | GET                            |
| 分析     | /api/v1/analytics      | 6      | GET                            |
| 关联     | /api/v1/correlations   | 2      | GET                            |
| 知识图谱 | /api/v1/knowledge      | 1      | GET                            |
| 上传     | /api/v1/upload         | 1      | POST                           |
| 标签     | /api/v1/tags           | 3      | GET, POST, DELETE              |
| 导出     | /api/v1/export         | 1      | GET                            |
| **合计** |                        | **62** |                                |

---

## 数据库表设计参考

| 表名           | 说明     | 主要字段                                                          |
| -------------- | -------- | ----------------------------------------------------------------- |
| users          | 用户     | id, username, password_hash, avatar, role                         |
| collections    | 藏品     | id, name, era_id, category_id, material, brand_id, color_id, ... |
| eras           | 年代     | id, name, name_en, period, description                            |
| categories     | 品类     | id, name, name_en, description                                   |
| materials      | 材质     | id, name, name_en, category, description                          |
| brands         | 品牌     | id, name, name_en, country, description                           |
| colors         | 色系     | id, name, name_en, hex, description                               |
| tags           | 标签     | id, name                                                          |
| collection_tag | 藏品标签 | collection_id, tag_id                                             |
| images         | 图片     | id, collection_id, url, sort, created_at                          |
