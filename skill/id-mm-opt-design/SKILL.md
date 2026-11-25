---
name: id-mm-opt-design
description: "把某个模块的页面设计并进 Middle-Mile Optimization demo（GitHub Pages 在线 demo，仓库 andyyu6227/middle-mile-demo，线上 https://andyyu6227.github.io/middle-mile-demo/）。用于 PM / 设计师 / 模块 owner 想要设计或更新中程优化套件里某个模块的页面（LH Planner、LH Copilot、Network Optimization Toolbox、Simulation Analysis、Data Gov），并把它合并进同一个 demo。覆盖：拉代码 / fork、按模块文件所有权改自己的一个 HTML、套设计 token、本地自测、分支 + PR 合并原则、Pages 自动发布校验。也覆盖"手上已有能跑的交互 demo，要原样搬进某个模块"（快照嵌入：modules/<key>-app.html + 薄壳，含脱敏与体积例外）。Do NOT use for：PPT / 汇报页、独立 HTML 报告、产品代码仓库改动。"
---

# ID MM Opt Design — 把模块设计并进同一个 demo

一个 demo，五个模块，每人只改自己那一个文件。这个 skill 负责把"我的设计稿"变成"线上 demo 里的一个页面"，并且不破坏别人的页面。

- 线上 demo：https://andyyu6227.github.io/middle-mile-demo/
- 代码仓库：https://github.com/andyyu6227/middle-mile-demo （public）
- 当前套件：Middle-Mile Optimization → LH Planner / LH Copilot / Network Optimization Toolbox / Simulation Analysis / Data Gov

## 0. 先做 scope 判断（一句话）

如果用户要的是"一个能点开看的模块页面，合进团队 demo"→ 用这个 skill。
如果用户要的是"给老板看的汇报页 / slide / 一次性 HTML 报告"→ 不要用这个 skill，走 `spx-html-report` / `slide-generator`。

## 1. 开工前必须先问清三件事

用 AskUserQuestion 一次问完，不要自己假设：

1. **哪个模块**：`lh-planner` / `lh-copilot` / `network-opt` / `simulation` / `datagov`（Data Gov 和 LH Copilot 已由 owner 维护，通常只有前三个模块需要别人做）。
2. **有没有写权限**：是 collaborator（能直接推分支）还是没有（走 fork + PR）。不确定就让用户去仓库 Settings → Collaborators 看，或直接按 fork 流程走。
3. **你手上有没有已经能跑的 demo**：
   - 有（单个 HTML、设计导出、双击能开、交互是重点）→ 走**快照嵌入**，读 `references/embed-existing-demo.md`；
   - 没有 → 三个待接入模块已有骨架（`modules/<key>.html`），在骨架里画内容。

如果用户没说是哪个模块，按它们的定位反推再确认：
`lh-planner` = 班次/发车计划与 vendor、truck 主数据；`network-opt` = 分拣路径与干线路由优化；`simulation` = 全链路仿真与 what-if。

## 2. 拉代码（不要在他们没有权限时直接 push）

有写权限：

```bash
git clone https://github.com/andyyu6227/middle-mile-demo.git
cd middle-mile-demo
git checkout -b feat/<module-key>-<短描述>
```

没有写权限（fork 流程）：

```bash
# 先在网页上 Fork，或者用 gh：
gh repo fork andyyu6227/middle-mile-demo --clone
cd middle-mile-demo
git checkout -b feat/<module-key>-<短描述>
git remote add upstream https://github.com/andyyu6227/middle-mile-demo.git
```

分支命名统一 `feat/<module-key>-<短描述>` 或 `fix/<module-key>-<短描述>`，一个分支只做一件事。

## 3. 文件所有权：只改自己那一个文件

| 模块 | 需要改的文件 | 菜单 key |
|---|---|---|
| LH Planner | `modules/lh-planner.html` | `lh-planner` |
| Network Optimization Toolbox | `modules/network-opt.html` | `network-opt` |
| Simulation Analysis | `modules/simulation.html` | `simulation` |
| LH Copilot | `index.html` 内的 `renderCopilot()` + `modules/lh-copilot-workspace.html` | `lh-copilot` |
| Data Gov | `index.html` 内的 Data Gov 相关函数 | `datagov` |

- **默认只改你负责的那一个 `modules/*.html`。** 它是自包含页面，改它不会碰到任何人。
- **快照嵌入时多一个文件**：`modules/<key>-app.html` 放你的 demo 原件，`modules/<key>.html` 变成薄壳。两个文件都归你，同一个 PR 提。
- **`modules/registry.js`**：只有一件事可改——把你模块的那一行指向你的文件；新增模块才加一行。不要动别人的行。
- **`index.html`**：套件外壳 + Data Gov + LH Copilot 页面，属于 demo owner。除非任务明确要求改壳（导航、顶栏、全局样式），否则不要动；要动就先跟 owner 说清楚影响面，并且单独开一个 PR。
- `user-flow.html`、`architecture.html` 同理：改之前先问。

## 4. 设计与技术约束（这些是硬性的）

1. **单文件自包含**：CSS / JS 全部内联；不引外部 CDN、字体、图片、外链。页面要能双击 `file://` 直接打开。
2. **只画内容区**：不要在页面里画 sidebar / 顶栏 / 面包屑，这些由 `index.html` 提供。你的页面会被 iframe 嵌入到内容区里。
3. **UI 文案英文**；不要写内部敏感信息——仓库是 public，所有数字、名称、站点、车辆、客户都必须是虚构的。
4. **用套件设计 token**，不要发明新颜色（表见下 §5）。
5. **文件大小**：单个页面 < 300KB；图片一律内联 SVG 或 data-URI，不要放大图、不要放视频。
   例外：**快照嵌入**的 `modules/<key>-app.html` 可以到 1.5MB（现有 `modules/lh-copilot-workspace.html` 就是 1.1MB），PR 里写一句 `Snapshot exception: <大小>, source = <来源>`。
   快照这条路（薄壳代码、要 patch 的 4 处、脱敏）见 `references/embed-existing-demo.md`。
6. **不要碰全局**：不改 `index.html` 的 `:root`、不改公共 class 的行为。你的样式写在页面自己的 `<style>` 里，类名前缀用你自己的模块缩写（例如 `.nopt-*`），避免和别的页面撞。

## 5. 设计 token 与组件语言（照这个抄，别自由发挥）

```
品牌 #EE4D2D（hover #FF6F47 / 浅底 #FFF5F0）
文本 #303844  次要 #7E8692  更弱 #959BA4  占位 #B5BBC6
边框 #E2E6EC  分隔 #ECF0F4  画布 #F5F6F9  浅底 #F9FAFC  白 #FFFFFF
成功 #1CC461 / #ECFFF1    失败 #F32345 / #FFF0F0
警告 #FFB014 / #FFF8DB    信息 #3274F7 / #F0F7FF    信息2 #FF831D / #FEECE1
圆角 2 / 4 / 8 px（默认 4）  阴影 0 1px 4px rgba(0,0,0,.12)
字体 Roboto + 系统栈；页面标题 20/600，卡片标题 13.5/600，正文 12.5，辅助 11
```

组件模式（三种都用得上）：

- **页头**：标题 20/600 + 一行说明 12.5 灰 + 右侧操作按钮（32px 高，主按钮品牌橙）。
- **KPI 带**：白卡 + 1px 边框 + 4 圆角，左上小写标签（10-11px 大写灰）、右上状态 chip、24px 大数字、一行说明；异常卡左侧加 3px 色条。
- **两栏工作区**：左列表（工单/任务卡）+ 右明细（表格），两栏等高，右栏头部有搜索和筛选。
- **表格**：表头 10px 大写灰、行高 ~44-50、hover 浅灰、行内状态用 `.badge` 风格的小胶囊。

现成参考：Data Gov 页（KPI 带 + 双栏 + 工单联动）、LH Copilot 页（告警卡 + KPI 三卡 + 工作台）。要更多细节读 `references/design-system.md`。

## 6. 本地自测（必须做完才能提 PR）

```bash
# 方式一：直接双击 index.html（零依赖）
open index.html

# 方式二：本地 http（更接近线上）
python3 -m http.server 8000
# http://localhost:8000/
```

自测清单：

- [ ] 点左侧菜单进你的模块，页面正常渲染，没有落到 placeholder
- [ ] 页面没有横向滚动条（1440 和 1280 两个宽度都看）
- [ ] 文字没有截断 / 重叠 / 意外换行
- [ ] 浏览器 console 无报错
- [ ] 断网状态下打开依然正常（证明没有外部依赖）
- [ ] 窗口从 1440 缩到 1024，布局不崩（允许变成单列，但不能溢出）
- [ ] 你的页面里没有任何真实业务数据 / 内部代号
- [ ] `git status` 里只有你负责的文件（+ 必要时 registry.js 一行）
- [ ] 快照嵌入额外 4 条：iframe 内能点、只有一层滚动条、1024 不横向溢出、断网交互还在（见 `references/embed-existing-demo.md` §3）

## 7. 提交、PR、合并

```bash
git add modules/<你的文件>.html
git commit -m "feat(<module-key>): <一句话，做了什么>"
git push -u origin feat/<module-key>-<短描述>
```

PR 标题：`feat(<module-key>): <做了什么>`；正文用 `assets/pr-template.md` 的模板（改了什么 / 截图 / 自测清单 / 影响面）。

PR 规则（合并原则的浓缩版，完整版见 `references/merge-principles.md`）：

1. 一个 PR 一个模块，不混装。
2. PR 描述里必须有本地截图，且声明"未触碰其他模块 / 未改 index.html"。
3. 必须先 `git pull upstream main`（或 rebase main）再推，保证能干净合并；冲突只在自己文件里解决。
4. 不允许 force push 到 `main`；不允许直接改别人的模块文件。
5. 合并到 `main` 后 GitHub Pages 约 1 分钟自动重建，合并人（或你）去线上地址点一遍你的模块确认。
6. 出问题就 revert PR，不要用"再推一个 fix"掩盖。

## 8. 合并后确认线上

- 打开 https://andyyu6227.github.io/middle-mile-demo/ ，进你的模块，确认是**新版本**（不是缓存：强制刷新 Cmd+Shift+R）。
- 如果 5 分钟后线上没变：去仓库 Actions / Settings → Pages 看最近一次 build，或让 owner 看。

## 9. 绝对不要做的事

- 不要改 `index.html` 的套件外壳 / 全局样式 / Data Gov 与 LH Copilot 逻辑（除非任务明确 + 已和 owner 对齐）。
- 不要为了自己的页面去改公共 token 或公共 class。
- 不要引外部依赖（CDN、Google Fonts、外链图片、iframe 外站）。
- 不要提交真实业务数据、真实人名、真实客户/供应商信息（repo 是 public）。
- 不要在一个 PR 里"顺手"重构别人的文件。
- 不要把 `node_modules` / 大图 / 录屏提交进仓库。
- 不要直接把实验分支推成 `main`——线上地址就是 main。

## 10. Definition of Done

- [ ] 页面在 demo 里能点开、能看、能交互
- [ ] 1440 / 1280 / 1024 三个宽度都不破版
- [ ] console 干净、离线可开、无外部依赖
- [ ] 只改了自己的文件（+ registry.js 一行）
- [ ] PR 描述完整（改了什么、截图、自测清单、影响面）
- [ ] 合并且线上确认过

## 11. 参考文件

- `references/repo-workflow.md` —— 完整的 git / fork / PR / 冲突 / 回滚步骤，命令可直接抄。
- `references/design-system.md` —— 完整 token、字号、组件 HTML 片段、正反例。
- `references/merge-principles.md` —— 代码合并原则全文（所有权、冲突、评审、DoD）。
- `references/troubleshooting.md` —— 常见问题（页面空白、iframe 不显示、线上没更新、冲突等）。
- `assets/module-template.html` —— 空白模块页模板（页头 + KPI 带 + 两栏 + 表格骨架），从它开始改最快。
- `assets/pr-template.md` —— PR 正文模板。
- `references/embed-existing-demo.md` —— 手上已有 demo 时怎么搬进模块（快照嵌入 vs 重画、薄壳代码、4 处 patch、脱敏、体积例外）。
- `SAMPLE-PROMPT.md` —— 可以直接发给团队照着填的 prompt（主场景：把 LH Planner 交互 demo 并进 `lh-planner` 模块）。
