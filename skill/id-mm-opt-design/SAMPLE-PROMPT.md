# 分享给团队：让 agent 把「你手上的 demo」并进套件

## 第一步：装 skill（一次性）

```bash
# Claude Code
mkdir -p ~/.claude/skills && cp -r id-mm-opt-design ~/.claude/skills/

# DSH
mkdir -p ~/.dsh/skills && cp -r id-mm-opt-design ~/.dsh/skills/
```

重启会话，让 agent 列一下 skill，看到 `id-mm-opt-design` 就成了。

## 第二步：主场景 —— 把我的 LH Planner 交互 demo 放进 lh-planner 模块

下面这段是实际用过的 prompt（我把自己的 LH Planner demo 并进套件时用的）。你要搬自己的 demo，只改开头三行路径和中间"要搬的是什么"。

```
用 id-mm-opt-design skill。

我是 Huaian，LH Planner 的 PM，menu key 是 lh-planner。
仓库：https://github.com/andyyu6227/middle-mile-demo （public）
我的 demo：~/work_base/projects/lh-planner-demo/dist/lh-planner-demo.html
  —— 单个 HTML，448 KB，双击就能开，交互全在里面。

要搬的是它第一页 Ops Console：
- 顶部黄色提示条：September — 3 of 24 units have no sealed version yet，右侧 chip "3 units to seal"
- 4 个 KPI 卡：Forecast ADO for tomorrow 1.53M / 当前版本 V3（built for 78.0k）/
  Expected loading rate 85%（target ≥75%）/ Expected OTT 96.4%（target ≥95%）
- 月历主区：每格 = 日期 + 预测件量（如 74.2k）+ 版本徽标 V1–V5；
  today / published / manually set / 封版后变更等级，各有不同样式
- 右侧 DAY DETAIL：点日历任意一天，显示这一天为什么是这个版本（预测件量、分配版本、band、解释、Manually overwrite）
- 底部图例：V1 Very low → V5 Peak，加三种状态标记

不要搬：
- 它自带的 SPX / LH Planner 左侧栏 —— 套件已经有左侧导航，两条并排很怪
- 它自带的 breadcrumb —— 套件顶栏已经有

两件事按 skill 的规矩处理，别自己拍：
1. demo 里内嵌了一段真实跑批数据（window.LH_STATIC，含真实 workbook 文件名和 TH 站点），
   public 仓库不能放 → 结构保留，数值和站点名换成虚构的。
2. 文件 448 KB，超过 skill 里 300 KB 的上限 → 我倾向走快照嵌入
   （modules/lh-planner-app.html + modules/lh-planner.html 薄壳）。
   你要是觉得该重画进套件设计里，先说，别直接动手。

另外 demo 还有第二页 Planning Workspace（筛选条 + 空表格，数据没接），这页先不搬。

按 skill 流程走：先告诉我落地方式（快照 / 重画）和会改哪几个文件；
我确认后你再拉代码、开 feat 分支、改文件、本地自测、出 PR 描述。先别 push。
```

## 第三步：agent 应该这样回你

1. **先给判断，不动手**：这个 demo 有交互（日历选天、DAY DETAIL），走快照嵌入；要改两个文件，`modules/lh-planner.html`（薄壳）和 `modules/lh-planner-app.html`（快照），`registry.js` 不动。
2. **说清会 patch 哪 4 处**：删自带 sidebar、删自带 breadcrumb、删 Google Fonts 链接、确认没有操作父窗口的代码（只有两条 postMessage 通知，父页面忽略即可）。
3. **脱敏清单**：改掉真实 workbook 名和站点码，报"改了 N 处，grep 干净"。
4. **自测回报**：index.html 进模块能点日历、只有一层滚动条、1024 不溢版、断网能开、console 干净。
5. **给 PR 描述草稿**，你点头才 push。

这条路径的完整操作手册在 `references/embed-existing-demo.md`（薄壳代码、4 处 patch、脱敏命令、体积例外、常见坑都在里面）。

## 第四步：验收三条

- 线上 https://andyyu6227.github.io/middle-mile-demo/ 进 LH Planner，点日历能出 DAY DETAIL（强制刷新 Cmd+Shift+R）
- `git status` / PR diff 里只有你那两个文件
- 断网双击 `index.html` 也能点

## 换成你自己的 demo，只改三处

1. `menu key` 和 `modules/<key>.html`：`lh-planner` / `network-opt` / `simulation`
2. 你的 demo 路径和它长什么样（有几个页面、哪一页要搬、点了会发生什么）
3. 有没有写权限（collaborator 直接推分支；不在里面就让 agent 走 fork + PR）

## 另外两个常见场景

**从骨架画一个新页**（没有现成 demo）

> 用 id-mm-opt-design skill。我是 Network Optimization 的 PM，menu key `network-opt`，仓库 andyyu6227/middle-mile-demo。
> 把 `modules/network-opt.html` 改成：顶部 4 个 KPI（中心数 / 超载路径数 / 平均 transit delta / 已存场景）、
> 中间左右两栏（左：分拣中心列表；右：该中心的路径表格，列为 inbound dock / outbound dock / 峰值负载 / 状态）、
> 右上角 "Run optimization" 主按钮。全部假数据，英文文案。做完自测并把 PR 描述给我。

**我是 demo owner，要合别人的 PR**

> 用 id-mm-opt-design skill。帮我看这个 PR：<PR 链接>。
> 按 references/merge-principles.md 的评审清单逐条核：有没有越界改别人的模块、有没有外部依赖、
> 有没有真实业务数据、1440 宽度会不会溢版。给结论 + 需要作者改的点。

## 提醒

- 一定说清 **menu key**，agent 靠它定位文件。
- 一定说清 **有没有写权限**，否则 agent 可能默认直接 push 到 main。
- 已有 demo 就照抄上面主场景的写法：**结构描述 + 不要搬什么 + 数据/体积这两个坑自己先表态**，产出最接近你要的。
- agent 做完会先给你本地截图和 PR 描述，**review 完再 push** 是默认节奏。
