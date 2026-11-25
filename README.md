# Middle-Mile Optimization · Demo

一个自包含的 HTML demo：中程优化套件（Middle-Mile Optimization）下 5 个模块的统一入口，含 Data Gov 与 LH Copilot 的可用页面，其余模块留了可替换的页面骨架，方便各模块 owner 各自设计后并进同一个 demo。

**在线地址**：`https://<org-or-user>.github.io/<repo>/`（首次部署后自动生成，见下方「部署」）

## 里面有什么

| 二级模块 | 状态 | 文件 |
|---|---|---|
| LH Planner | 待接入（页面骨架） | `modules/lh-planner.html` |
| LH Copilot | 可用（复刻 dashboard tab） | `index.html` 内置 |
| Network Optimization Toolbox | 待接入（页面骨架） | `modules/network-opt.html` |
| Simulation Analysis | 待接入（页面骨架） | `modules/simulation.html` |
| Data Gov | 可用（KPI + 工单 + 数据集单页） | `index.html` 内置 |

另外 `user-flow.html`（用户流程）和 `architecture.html`（产品架构）是两张说明图，在 Data Gov 页顶栏可点开。

## 目录结构

```
index.html                 ← 套件外壳 + Data Gov + LH Copilot
modules/registry.js        ← 菜单 key → 模块页面 的映射（共用的唯一一个文件）
modules/<module>.html      ← 每个模块一个自包含页面，owner 自己改
user-flow.html             ← 用户流程图
architecture.html          ← 产品架构图
.github/workflows/pages.yml ← push to main 自动发布到 GitHub Pages
```

## 本地打开

直接双击 `index.html` 即可（零依赖、无构建、不联网）。想用 http 预览：

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

## 把你的模块设计并进来

每个模块 **一个自包含 HTML 文件**，你不用改 `index.html`，不会和别人冲突。

1. 复制 `modules/lh-planner.html` 成 `modules/<your-module>.html`（或直接改你负责的那个文件）。
   - 页面只画内容区：没有 sidebar / 顶栏（外壳由 `index.html` 提供）。
   - CSS / JS 内联，不要引外部 CDN、字体、图片（demo 要能离线打开）。
   - 文案统一英文。
2. 确认 `modules/registry.js` 里有你的映射（只有你负责的行需要改）：
   ```js
   window.MODULE_PAGES = {
     'lh-planner':  'modules/lh-planner.html',
     'network-opt': 'modules/network-opt.html',
     'simulation':  'modules/simulation.html'
   };
   ```
3. 本地打开 `index.html` 点你的模块看一下，然后开 PR。合并到 `main` 后 Pages 自动更新。

页面骨架里写了 `<!-- HOW THIS FILE WORKS -->` 注释和一套设计 token（品牌色、灰阶、间距），照着用即可。

## 设计规范

- 品牌色 `#EE4D2D`，文本 `#303844`，次要文本 `#7E8692`，边框 `#E2E6EC`，画布 `#F5F6F9`，卡片白底 + 4px 圆角 + 1px 边框。
- 语义色：成功 `#1CC461` / 失败 `#F32345` / 警告 `#FFB014` / 信息 `#3274F7` / 信息2 `#FF831D`。
- 字体：Roboto + 系统字体栈；字号：页面标题 20/600，卡片标题 13.5/600，正文 12.5，辅助 11。
- 版式参考 Data Gov 页：顶部 KPI 卡片带 → 下方「左列表 / 右明细」两栏。LH Copilot 页可参考 KPI 三卡 + 图表 + 列表的结构。

## 部署

仓库已带 `.github/workflows/pages.yml`，需要一次性在仓库设置里把 Pages 的 Source 改成 **GitHub Actions**：

```
Settings → Pages → Build and deployment → Source: GitHub Actions
```

之后每次 push 到 `main` 都会自动发布，地址在 Actions 的 deploy 步骤里（`https://<owner>.github.io/<repo>/`）。
