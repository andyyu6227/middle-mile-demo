# 分享给团队：怎么让 agent 用这个 skill

## 第一步：装 skill（一次性）

把 `id-mm-opt-design/` 整个目录放到你 agent 的 skills 目录：

```bash
# Claude Code
mkdir -p ~/.claude/skills && cp -r id-mm-opt-design ~/.claude/skills/

# DSH
mkdir -p ~/.dsh/skills && cp -r id-mm-opt-design ~/.dsh/skills/
```

重启会话，让 agent 列一下 skill，看到 `id-mm-opt-design` 就成了。

## 第二步：复制下面这段 prompt 给 agent（把 <> 里换成你的信息）

```
用 id-mm-opt-design skill。

我是 <你的名字>，负责 <模块名>，menu key 是 <lh-planner | network-opt | simulation>。
仓库：https://github.com/andyyu6227/middle-mile-demo
我的 GitHub 账号：<你的账号>（如果不在 collaborator 里，走 fork + PR）

这次要做的页面：
- 页面叫什么：<例：Sortation Path Designer>
- 一句话目标：<例：按分拣中心设计 inbound → outbound dock 路径，并和 baseline 对比>
- 页面结构：<例：顶部 4 个 KPI；下面左右两栏，左边中心列表、右边路径表格；右上角一个 "Run optimization" 主按钮>
- 交互：<例：点左边中心，右边表格切换；点表格行展开详情>
- 不要做什么：<例：不要真的接后端，全部用假数据>

请按 skill 的流程走：拉代码 → 开 feat 分支 → 只改 modules/<你的模块>.html → 用设计 token →
本地自测（1440/1280 无溢出、console 干净、离线可开）→ 生成 PR 描述。

先做到自测通过、把本地截图和 PR 描述给我看；我确认后你再 push。
```

## 三个真实示例

**A. 换掉骨架（最常见）**

> 用 id-mm-opt-design skill。我是 Network Optimization 的 PM，menu key `network-opt`，仓库 andyyu6227/middle-mile-demo。
> 把 `modules/network-opt.html` 改成 3 个区域：顶部 4 个 KPI（中心数 / 超载路径数 / 平均 transit delta / 已存场景）、
> 中间左右两栏（左：分拣中心列表；右：该中心的路径表格，列为 inbound dock / outbound dock / 峰值负载 / 状态）、
> 右上角 "Run optimization" 主按钮。全部用假数据，英文文案。做完自测并把 PR 描述给我。

**B. 只是微调已有页**

> 用 id-mm-opt-design skill 改 `modules/simulation.html`：现在骨架里三张卡片的内容换成
> "Scenario A / B / C 的对比"，加一行 KPI（Total cost / Avg transit / On-time %）。
> 别改别的文件。

**C. 我是 demo owner，要合别人的 PR**

> 用 id-mm-opt-design skill。帮我看这个 PR：<PR 链接>。
> 按 references/merge-principles.md 的评审清单逐条核，diff 里有没有越界改别人的模块、有没有外部依赖、
> 有没有真实业务数据、1440 宽度会不会溢版。给出结论 + 需要作者改的点。

## 给 agent 的提醒（用户自己看）

- 一定要说清 **menu key**，agent 靠它定位文件。
- 一定要说清 **有没有写权限**，否则 agent 可能默认直接 push 到 main。
- 页面结构描述得越具体，产出越接近你要的；描述里带上"有什么卡片、什么列、点什么会发生什么"。
- agent 做完会先给你本地截图和 PR 描述，**review 完再 push** 是这个流程的默认节奏。
