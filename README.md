# Middle-Mile Optimization · Demo

一个自包含的 HTML demo：中程优化套件（Middle-Mile Optimization）下 5 个模块的统一入口，含 Data Gov 与 LH Copilot 的可用页面，其余模块留了可替换的页面骨架，方便各模块 owner 各自设计后并进同一个 demo。

**在线地址**：https://andyyu6227.github.io/middle-mile-demo/
**仓库**：https://github.com/andyyu6227/middle-mile-demo （public）

## 里面有什么

| 二级模块 | 状态 | 文件 |
|---|---|---|
| LH Planner | 待接入（页面骨架） | `modules/lh-planner.html` |
| LH Copilot | 可用（dashboard tab，按真实组件 1:1 复刻） | `index.html` + `modules/lh-copilot-workspace.html` |
| Network Optimization Toolbox | 待接入（页面骨架） | `modules/network-opt.html` |
| Simulation Analysis | 待接入（页面骨架） | `modules/simulation.html` |
| Data Gov | 可用（KPI + 工单 + 数据集单页，右上角 + 可新增 dataset / 校验规则） | `index.html` 内置 |

另外 `user-flow.html`（用户流程）和 `architecture.html`（产品架构）是两张说明图，在 Data Gov 页顶栏可点开。

## 目录结构

```
index.html                      ← 套件外壳 + Data Gov + LH Copilot
modules/registry.js             ← 菜单 key → 模块页面 的映射（共用的唯一一个文件）
modules/<module>.html           ← 每个模块一个自包含页面，owner 自己改
modules/lh-copilot-workspace.html ← LH Copilot 站点工作台（从真实 app 抓取的静态快照）
user-flow.html                  ← 用户流程图
architecture.html               ← 产品架构图
.github/workflows/pages.yml     ← push to main 自动发布到 GitHub Pages
```

`modules/lh-copilot-workspace.html` 是 LH Copilot 真实 dashboard 里那块 iframe（case list + dock chart + lane heatmap）的整页快照，所以视觉 1:1；它偏大（约 1.2MB，含 84 条 lane × 71 个时段的渲染数据）。要更新它，用真实 app 重新抓一次 iframe 的 HTML 覆盖这个文件即可，`index.html` 不需要动。

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

## 团队用的 skill（ID MM Opt Design）

仓库里带了一份给团队 agent 用的 skill：`skill/id-mm-opt-design/`。

装法（一次性）：

```bash
mkdir -p ~/.claude/skills && cp -r skill/id-mm-opt-design ~/.claude/skills/
# DSH: cp -r skill/id-mm-opt-design ~/.dsh/skills/
```

然后在对话里说「用 id-mm-opt-design skill，我是 <模块> owner，把 modules/<文件>.html 改成 <页面描述>」，
它就会按 skill 的流程走：拉代码 → 只改自己的文件 → 套 token → 本地自测 → 提 PR。
用法示例见 `skill/id-mm-opt-design/SAMPLE-PROMPT.md`，合并原则见 `skill/id-mm-opt-design/references/merge-principles.md`。

## 团队协作

仓库是 public，所以：

- **只想看**：直接打开上面的在线地址，不需要账号。
- **想改自己负责的模块**：fork 仓库 → 改 `modules/<你的模块>.html`（必要时在 `modules/registry.js` 加一行）→ 提 PR；或者让 owner 把你加成 collaborator，直接推分支。
- 改之前先 `git pull`，`modules/` 下每个文件都是独立所有人的，冲突面只有 `registry.js` 那一行。

## 部署

Pages 走分支发布，已经开好：

```
Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root)
```

push 到 `main` 后 GitHub 会自动重建，1 分钟左右生效。改完本地自测（双击 `index.html`）再推。
