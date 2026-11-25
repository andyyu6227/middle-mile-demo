# 常见问题

## 我在 demo 里点自己的模块，还是显示 "Awaiting module link"

1. 确认 `modules/registry.js` 里有你模块那一行，路径拼写正确：
   ```js
   window.MODULE_PAGES = { 'network-opt': 'modules/network-opt.html' };
   ```
2. 确认文件真的存在、大小写一致（Linux/Pages 区分大小写，本地 macOS 不区分，容易踩）。
3. 强制刷新（Cmd+Shift+R）。

## 页面一片空白

- 打开浏览器 console 看第一个报错。
- 常见原因：`<style>` / `<script>` 标签没闭合；模板里的 `{{ }}` 没被替换；JSON/JS 语法错误。
- 用 `node --check` 检查内联 JS：把 script 内容存成 `.js` 再 `node --check`。

## 本地双击能开，线上不行

- 检查是否引用了本地绝对路径（`/Users/...`）或相对路径跳出了 `modules/`。
- Pages 上路径大小写敏感。
- 确认没引用外部域名（public 仓库 + 外链可能在别人网络下被墙）。

## 线上没更新

1. 确认 PR 已经合并进 `main`（不是合并进别的分支）。
2. 仓库 `Settings → Pages` 看 Latest build 状态；`Actions` 里看失败原因。
3. 等待 1-2 分钟，强制刷新。
4. 还不行：看是不是 `.nojekyll` / 文件名以 `_` 开头导致 Jekyll 忽略（本项目用分支发布，避免用下划线开头的目录名）。

## `modules/registry.js` 冲突

手工解决：两边行都保留，按 key 排序：

```js
window.MODULE_PAGES = {
  'lh-planner':  'modules/lh-planner.html',
  'network-opt': 'modules/network-opt.html',
  'simulation':  'modules/simulation.html'
};
```

## 我的样式影响了别的模块

不可能——每个模块页面在 iframe 里，CSS 不会外泄。除非你改了 `index.html`。如果改了 `index.html`，立刻回滚并改为只改自己的文件。

## 页面在 iframe 里高度不对 / 出现双滚动条

内容区高度由外壳控制（`calc(100vh - 104px)`）。你的页面内部要自己处理滚动：
`html, body { height: 100% }`，滚动容器用 `overflow:auto`，不要让 body 无限长。

## 需要放图

- 优先内联 SVG。
- 小图标用 data-URI。
- 不要放大 PNG/JPG（单文件 < 300KB 是硬线）。需要截图演示就用代码画出来。

## 我误改了别人的文件

```bash
git checkout -- modules/<别人的文件>.html
```
如果已经 commit：`git revert <sha>` 或交互式 rebase 撤掉那个 commit，再推。
