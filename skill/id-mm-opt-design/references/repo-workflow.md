# 仓库与 Git 操作手册（可直接抄命令）

仓库：`https://github.com/andyyu6227/middle-mile-demo`（public，main 分支发布到 GitHub Pages）
线上：`https://andyyu6227.github.io/middle-mile-demo/`

## 1. 两种权限、两条路径

### A. 我是 collaborator（能直接推分支）

```bash
git clone https://github.com/andyyu6227/middle-mile-demo.git
cd middle-mile-demo
git checkout -b feat/network-opt-my-design
```

做完改动后：

```bash
git add modules/network-opt.html
git commit -m "feat(network-opt): sortation path designer"
git push -u origin feat/network-opt-my-design
```

然后到 GitHub 上开 PR（base: `main`）。**不要直接 push 到 main。**

### B. 我没有权限（fork + PR）

```bash
# 网页 Fork，或用 gh
gh repo fork andyyu6227/middle-mile-demo --clone
cd middle-mile-demo
git remote add upstream https://github.com/andyyu6227/middle-mile-demo.git
git checkout -b feat/network-opt-my-design
```

做完后推到自己的 fork，再向 `andyyu6227/middle-mile-demo` 的 `main` 开 PR：

```bash
git push -u origin feat/network-opt-my-design
gh pr create --repo andyyu6227/middle-mile-demo --base main \
  --title "feat(network-opt): sortation path designer" \
  --body-file assets/pr-template.md
```

没有 `gh` 就在网页上点 "Compare & pull request"。

## 2. 保持和 main 同步

```bash
# collaborator
git fetch origin && git rebase origin/main

# fork
git fetch upstream && git rebase upstream/main
git push --force-with-lease    # 只 force 自己的特性分支，绝不 force main
```

冲突通常只会出现在 `modules/registry.js`（如果两人同时新增模块）。解法：保留双方的行，按模块 key 字母序放，不要删别人的。

## 3. 提交信息格式

```
feat(<module-key>): <做了什么>        # 新页面 / 新功能
fix(<module-key>): <修了什么>          # 修 bug / 修样式
docs(<module-key>): <文档>             # 只改注释/README
```

`<module-key>` 取值：`lh-planner` / `lh-copilot` / `network-opt` / `simulation` / `datagov` / `shell`（涉及外壳时）。

## 4. 开 PR

- base 分支必须是 `main`，head 是你的特性分支。
- 一个 PR 只做一件事、只动一个模块。
- 正文用 `assets/pr-template.md`，必须含：改了什么、截图（本地 1440 宽度）、自测清单、影响面声明。
- 提 PR 后在群里 @ demo owner（Huaian）review。

## 5. 合并后

1. 合并（squash merge 即可，保持 main 历史干净）。
2. 等 1 分钟左右，Pages 自动重建。
3. 打开线上地址 + 强刷（Cmd+Shift+R），进你的模块确认。
4. 若线上没变：仓库 `Settings → Pages` 看 Latest build；或 `Actions` 里看 workflow 状态。

## 6. 回滚

```bash
# 在 GitHub 上找到那个 PR → Revert
# 或本地：
git revert <merge-commit-sha>
git push origin main
```

不要用"再推一个紧急修复"掩盖问题——先 revert 回到可用状态，再慢慢修。

## 7. 不要提交的东西

`.DS_Store`、`node_modules/`、设计源文件（figma 导出大图）、录屏、真实业务数据导出、任何 `.env`。
仓库已经在 `.gitignore` 里忽略了常见项；如果 `git status` 里出现奇怪的大文件，先别 `git add -A`，用 `git add <具体文件>`。
