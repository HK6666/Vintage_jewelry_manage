# 系统设置页面 - 下拉选项动态管理

## 目标

将所有页面中硬编码的下拉选项提取到统一的设置页面，支持动态增删改，使用 React Context + localStorage 持久化。

## 需要管理的下拉选项组（5 组）

| 组名 | 当前使用位置 | 默认选项 |
|------|-------------|---------|
| 年代 (eras) | EntryPage, CorrelationPage | Georgian (1714-1837), Victorian (1837-1901), Art Nouveau (1890-1910), Edwardian (1901-1915), Art Deco (1920-1935), Retro (1935-1950), Mid-Century (1950-1970) |
| 品类 (categories) | EntryPage, ListPage (filterCategories) | 戒指, 项链, 手链, 胸针, 耳饰, 吊坠, 冠冕, 套件, 其他 |
| 材质 (materials) | EntryPage | 黄金, 铂金, 纯银, 钻石, 红宝石, 蓝宝石, 祖母绿, 珍珠, 蛋白石, 珐琅, 其他 |
| 保存状态 (conditions) | EntryPage | 完好, 良好, 一般, 需修复 |
| 关联维度 (dimensions) | CorrelationPage | 材质, 年代, 工艺, 品牌 |

## 技术方案

### 1. 创建 OptionsContext (`src/contexts/OptionsContext.tsx`)

- React Context 存储所有选项组
- 提供 `addOption(group, value)` / `removeOption(group, index)` / `updateOption(group, index, value)` / `reorderOption(group, fromIndex, toIndex)` 方法
- 数据持久化到 localStorage（key: `zhonggu-options`）
- 首次加载使用默认值

```typescript
interface OptionsState {
  eras: string[]
  categories: string[]
  materials: string[]
  conditions: string[]
  dimensions: string[]
}
```

### 2. 创建设置页面 (`src/pages/SettingsPage.tsx`)

- 每个选项组一个 GlassCard 区块
- 每个选项显示为可编辑的行：文本 + 删除按钮
- 每个区块底部有「添加」输入框 + 按钮
- 支持行内编辑（点击文本变为输入框）
- 使用已有的 GlassCard 组件保持风格一致

### 3. 添加路由和导航

- `App.tsx`: 添加 `/settings` 路由 → `SettingsPage`
- `Sidebar.tsx`: 在导航列表底部添加「系统设置」（齿轮图标），用分割线与功能页面分隔

### 4. 更新消费页面

- `EntryPage.tsx`: 从 Context 读取 eras, categories, materials, conditions
- `CorrelationPage.tsx`: 从 Context 读取 eras, dimensions
- `ListPage.tsx`: 从 Context 读取 categories（替代 `filterCategories` 导入）
- `App.tsx`: 在 `<BrowserRouter>` 内包裹 `<OptionsProvider>`

## 实施步骤

1. 创建 `src/contexts/OptionsContext.tsx` — Context + Provider + hook
2. 创建 `src/pages/SettingsPage.tsx` — 设置页面 UI
3. 更新 `src/App.tsx` — 添加 Provider 包裹 + 路由
4. 更新 `src/components/layout/Sidebar.tsx` — 添加设置导航项
5. 更新 `src/pages/EntryPage.tsx` — 使用 Context 选项
6. 更新 `src/pages/CorrelationPage.tsx` — 使用 Context 选项
7. 更新 `src/pages/ListPage.tsx` — 使用 Context 选项
8. 验证构建 `npx tsc --noEmit && npx vite build`

## 验证方式

1. 打开设置页面，确认 5 组选项正确显示默认值
2. 添加/删除/编辑选项后刷新页面，确认 localStorage 持久化生效
3. 切换到录入页面，确认下拉框使用动态选项
4. 切换到关联页面，确认筛选下拉框使用动态选项
5. 切换到列表页面，确认筛选标签使用动态选项
