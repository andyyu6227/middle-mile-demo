# 代码合并原则（团队约定，按这个评审）

这套 demo 的目的：**五个模块在一个 demo 里并排展示，但五个人可以并行改，互不打架。**
做到这一点靠的不是流程重，而是文件所有权清晰。

## 1. 所有权：一个模块 = 一个文件 = 一个 owner

| 文件 | owner | 别人能不能改 |
|---|---|---|
| `modules/lh-planner.html` | LH Planner PM | 不能 |
| `modules/network-opt.html` | Network Optimization PM | 不能 |
| `modules/simulation.html` | Simulation PM | 不能 |
| `modules/registry.js` | 每人只改自己那一行 | 只加/改自己的映射 |
| `index.html` | Huaian（demo owner） | 不能，除非 owner 同意 |
| `modules/lh-copilot-workspace.html` | LH Copilot owner | 不能 |
| `user-flow.html` / `architecture.html` | Huaian | 不能，除非 owner 同意 |

**判定标准**：PR 里出现不属于自己的模块文件 = 直接打回，不解释。

## 2. 合并粒度

- 一个 PR 一个模块；一个 PR 一个目的（新页面 / 修样式 / 修交互分三个 PR）。
- 单个 PR 的 diff 尽量 < 400 行；超过就拆。
- 不夹带"顺手修一下别处"的改动——那会让 review 失效，也让回滚变难。

## 3. 外壳与全局：默认冻结

`index.html` 承载套件外壳（侧边栏、面包屑、顶栏）、Data Gov 和 LH Copilot。它默认冻结，因为改它影响所有人。

需要改外壳的场景（加模块、改导航、改全局 token）→ 单独开一个 `feat(shell): ...` PR，PR 描述里必须写清楚：
1. 改了哪个函数/哪段 CSS；
2. 对另外四个模块分别有什么影响；
3. 四个模块都点过一遍（截图）。

## 4. 技术红线（不满足就不合）

1. 单文件自包含：无 CDN / 无外链字体 / 无外链图片 / 无外部 iframe。
2. 双击 `file://` 能打开（团队成员本地就是这么看的）。
3. 只画内容区，不自带 sidebar / 顶栏。
4. 不改公共 token、不覆盖公共 class 行为；自己的样式用模块前缀。
5. 单文件 < 300KB。
6. 英文 UI 文案。
7. **不含任何真实业务数据**（public 仓库）：站点、车辆、客户、供应商、运价一律用虚构值。

## 5. 评审清单（reviewer 用）

- [ ] diff 只涉及该模块文件（+ registry.js 一行）
- [ ] 本地截图与描述一致
- [ ] console 干净（PR 里声明）
- [ ] 1440 / 1280 下无溢出、无截断
- [ ] 无外部依赖（grep `http://` `https://` `@import` `src=`）
- [ ] 无真实数据 / 内部敏感信息
- [ ] 没改别人的模块、没改 index.html（除非 PR 就是 shell PR）
- [ ] 命名与提交信息符合约定

## 6. Definition of Done

一个模块的改动算"完成"，需要同时满足：

1. demo 里能点开、能看、主要交互可用；
2. 三个宽度（1440/1280/1024）不破版；
3. 离线可开、console 无报错；
4. PR 描述含截图 + 自测清单 + 影响面声明；
5. 合并后线上地址确认过新版本。

## 7. 冲突处理

- 只在自己文件内解决冲突。
- `registry.js` 冲突：两边的行都保留，按 key 排序。
- **永远不要** `git push --force` 到 `main`。
- 冲突后必须重新本地自测一遍再推。

## 8. 分支与发布

- `main` = 线上分支，必须永远可运行。
- 实验性设计放特性分支或 draft PR，不要合进 main 给团队看半成品。
- Pages 由 `main` 自动发布，不需要手动部署。
