# ID MM Opt Design — 安装与使用

## 这是什么

一个 skill（技能包），让团队每个人的 personal agent（Claude Code / DSH 等）学会：
怎么拉 Middle-Mile Optimization demo 的代码、只改自己负责的那一个模块文件、套设计 token、本地自测、按合并原则提 PR，并确认 GitHub Pages 上线。

## 安装（一次性，30 秒）

把整个 `id-mm-opt-design/` 目录放到你 agent 的 skills 目录：

```bash
# Claude Code
mkdir -p ~/.claude/skills
cp -r id-mm-opt-design ~/.claude/skills/

# DSH（DeepSeek Harness）
mkdir -p ~/.dsh/skills
cp -r id-mm-opt-design ~/.dsh/skills/
```

放好后重启 agent 会话，让它列一下可用 skill，能看到 `id-mm-opt-design` 就装好了。

## 怎么用

直接在对话里说你要改哪个模块，agent 会自动加载这个 skill 并按流程走。示例：

> 用 id-mm-opt-design skill，我是 Network Optimization 的 PM，帮我把 `modules/network-opt.html`
> 改成 sortation path designer 页面（左侧中心列表 + 右侧路径表格），然后提 PR。

skill 会问你三件事：哪个模块、有没有仓库写权限、改已有页还是新建；然后按 §2-§8 走完。

## 文件说明

- `SKILL.md` —— 主流程（agent 读的就是这个）
- `references/repo-workflow.md` —— git / fork / PR / 回滚命令
- `references/merge-principles.md` —— 代码合并原则全文
- `references/design-system.md` —— 设计 token、组件配方、正反例
- `references/troubleshooting.md` —— 常见问题
- `assets/module-template.html` —— 空白模块页模板
- `assets/pr-template.md` —— PR 正文模板
