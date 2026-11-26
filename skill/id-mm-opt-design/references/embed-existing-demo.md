# 已有 demo 怎么搬进模块（快照嵌入 / 重画）

适用场景：你手上已经有一个能跑的交互 demo（单个 HTML、设计工具导出、原型），要把它变成 demo 套件里 `modules/<key>.html` 那个页面。

## 0. 先选路，别默认重画

| demo 现在的形态 | 走哪条 | 成本 |
|---|---|---|
| 单个 HTML，双击能开，交互都在里面 | **快照嵌入**（推荐） | 十几分钟 |
| 交互本身就是卖点（日历、甘特、拖拽、多页切换） | **快照嵌入** | 十几分钟 |
| 内网在线服务 URL（AIP / Streamlit / 有自己的 `/api/*` + 登录） | **薄壳 + iframe 框线上地址**（§1.6） | 十几分钟 |
| Streamlit 录屏 / 视频 / 只有截图 / 只是"信息结构参考" | **重画** | 半天 |

一句话判断：**要是 demo 的交互本身就是要展示的东西，就快照；页面只是要展示信息结构，就重画。**
两条路都要脱敏、都要自测，区别只是改的是"patch 原件"还是"照 design-system 重写"。

## 1. 快照嵌入：两个文件，都归你

```
modules/<key>.html        ← 薄壳。registry.js 已经指向它，不用改 registry
modules/<key>-app.html    ← 你的 demo 原件，只做下面 4 处 patch
```

两个文件同一个 PR 一起提。

### 1.1 薄壳（改 3 处：title、iframe 的 src、注释里的模块名）

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LH Planner · Middle-Mile Optimization</title>
<!-- Snapshot embed: the interactive demo lives in <key>-app.html and is patched
     (its own sidebar / breadcrumb / external fonts removed). See SKILL.md §4. -->
<style>
  html, body { height: 100%; margin: 0; background: #F5F6F9; }
  body { display: flex; flex-direction: column; overflow: hidden; }
  .app-frame { flex: 1 1 auto; min-height: 0; width: 100%; border: 0; display: block; }
</style>
</head>
<body>
  <iframe class="app-frame" src="lh-planner-app.html" title="LH Planner · Ops Console"></iframe>
</body>
</html>
```

两个坑：

- `src` 写 **`<key>-app.html`**，不要写 `modules/<key>-app.html`。薄壳自己就在 `modules/` 目录下，写全路径会变成 `modules/modules/...` → 白屏。
- 高度用 `flex:1; min-height:0`，不要写死 `height:calc(...)`：套件的 `.module-frame` 已经是 `calc(100vh - 104px)`，这里再算一次就会出现双滚动条或底部被切。

### 1.2 先体检 demo 自身（决定能不能搬、要不要改）

```bash
# 1) 外部依赖：有没有 CDN / 外链字体 / 外链图（有就不能断网开）
grep -nE "https?://" modules/<key>-app.html | grep -vE "w3\.org|reactjs\.org|schema\.org" | head -20

# 2) 会不会操作父窗口（只允许 postMessage）
grep -n "window.parent\|window.top\|top.location\|parent.location" modules/<key>-app.html

# 3) 有没有真实业务数据（.xlsx / workbook / 真实站点码）
grep -nE "\.xlsx|\.csv|workbook|sheet\"?:" modules/<key>-app.html | head -20
```

再**断网实测一次**（DevTools → Network → Offline，或直接关 Wi-Fi 后双击文件）：能开 → 自包含，可以搬；白屏 → 先把依赖内联，否则搬进去就是白屏。

### 1.3 对 demo 原件做 4 处 patch（改完在文件末尾留一段注释说明改了什么）

1. **删掉它自己的 sidebar**（套件左边已经有一条导航，两条并排很怪）。
2. **删掉它自己的 breadcrumb 行**（`LineHaul / LH Planner / ...` 那种，套件顶栏已经提供）。
3. **删掉外部字体** `<link ...fonts.googleapis.com...>`，字体回落到 `Roboto, -apple-system, ...` 系统栈。
4. **确认它不会操作父窗口**（见 §1.2 第 2 条）；只允许 `postMessage` 通知，任何改 `location` 的调用 patch 成 `return false;`（参考 `modules/lh-copilot-workspace.html` 里 `hostNavigate` / `hostSetParams`）。

1–3 用 CSS 就能做完，不用改结构（这段在 LH Planner demo 上实测可用，`.sc-host` 是设计工具导出的根节点，换成你的 demo 时用 DevTools 右键 → Copy selector 拿真实选择器）：

```python
import io, re
p = 'modules/<key>-app.html'
s = io.open(p, encoding='utf-8').read()

# 1) 删外链字体
s = re.sub(r'<link rel="preconnect"[^>]*>', '', s)
s = re.sub(r'<link[^>]*fonts\.googleapis\.com[^>]*>', '', s)

# 2) 隐藏 demo 自带的 sidebar + breadcrumb（追加到文件末尾，CSS 一样生效）
s += '''
<!-- SUITE EMBED PATCH: own sidebar + breadcrumb hidden (suite shell provides both),
     external fonts removed. Appended at EOF on purpose - some exports have no </body>. -->
<style>
  .sc-host > div > div:first-child { display: none !important; }
  .sc-host > div > div:nth-child(2) > div:first-child { display: none !important; }
  html, body { height: 100%; }
</style>
'''
io.open(p, 'w', encoding='utf-8').write(s)
```

两个实测踩过的坑：

- **别用 `[style*="width:190px"]` 这种选择器**。设计工具导出的 runtime 会把 inline style 重新序列化成 `width: 190px;`（有空格、`flex` 变 `0 0 auto`），源文件里怎么写、DOM 里就怎么变，属性选择器直接失效。用结构选择器（`.sc-host > div > div:first-child`）或 DevTools 里 copy 出来的选择器。
- **很多导出文件没有 `</body>`**，`replace('</body>', ...)` 会静默什么都不做。patch 一律**追加到文件末尾**。

第 5 件事（会来问你，别自己决定）：**demo 有多页、原来靠自己的 sidebar 切换怎么办**。
默认只搬第一页；要保住第二页，就在页面顶部放一小段 segmented tab，而不是把 sidebar 加回来。

### 1.4 脱敏（public 仓库，硬性）

demo 里通常内嵌一段数据（`window.LH_STATIC = {...}` 这种几十 KB 的 JSON），里面往往是真的跑批结果：真实 workbook 文件名、真实市场、真实站点代号、件量。

做法：**保留结构，替换数值和名称。**

```bash
# 先找出可疑的地方
grep -noE "\.xlsx|\.csv|\.xls|workbook|sheet|operator|market\"?: ?\"[A-Z]{2}" modules/<key>-app.html | head -40
```

- 真实站点码（`SOC-BKK-01`）→ 虚构码（`SOC-A01` / `SOC-B01`）
- 真实文件名（`Copy of TH LH Model .xlsx`）→ 删掉这个字段或写 `synthetic run`
- 量级（1.53M、85%）可以留，看起来才像真业务
- 自测完再 grep 一遍，必须干净：`grep -niE "\.xlsx|\.csv|confidential|internal use" modules/<key>-app.html`

### 1.5 体积

- 普通模块页：**< 300 KB**。
- 快照例外：**≤ 1.5 MB**（现有 `modules/lh-copilot-workspace.html` 是 1.1 MB 的真实组件快照，就是这条路）。
- PR 描述里写一句：`Snapshot exception: 448 KB, source = LH Planner demo export`。

### 1.6 已经在线跑的工具（有后端 / 要登录）——框它，不要抄它

如果对方给你的不是一个能双击开的 HTML，而是一个**内网在线服务的 URL**（AIP / Streamlit / Flask + 自己的 `/api/*` + SSO），
**不要走快照**。实测：把页面 HTML 拷下来本地打开，壳子还在，但每个面板都报 `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
——它调的是自己域名下的 `/api/meta`，拷走就等于把后端拷丢了。

正确做法是薄壳 + 一个指向线上地址的 iframe，再加三层兜底（`modules/network-opt.html` 就是这个写法）：

```html
<div class="bar">  <!-- 36px 细条：状态 + 永远留一个"新标签打开" -->
  <span class="dot"></span><span id="statusText">Live from the internal AI platform</span>
  <a class="btn primary" href="http://…/feedback-network/" target="_blank" rel="noopener">Open in new tab</a>
</div>
<div class="stage"><iframe id="frame"></iframe></div>
<script>
  var LIVE = 'http://…/feedback-network/';
  if (location.protocol === 'https:') {            // 1) https 页面框 http 应用 = 混合内容，浏览器直接拦
    showPanel({ title: 'Open it in its own tab', steps: ['Connect VPN', 'Sign in', '…'] });
  } else {
    frame.src = LIVE;                              // 2) 正常：铺满
    fetch(LIVE, { mode: 'no-cors', cache: 'no-store' }).catch(function () {
      showPanel({ title: 'Cannot reach …', retry: true });   // 3) 没连 VPN → 检查 / 再试一次
    });
  }
</script>
```

三条要注意的：

- 先确认对方没有禁止被框：`curl -sI <url> | grep -i "x-frame-options\|content-security-policy"`，有 `frame-ancestors` / `DENY` 就老实做链接卡片。
- 探活用 `mode:'no-cors'`：读不到响应也够用，401（要登录）也算"通"，只有网络层失败才会 reject。给它 9 秒超时。
- 登录常常是死结：Google SSO 在 iframe 里基本登不上，所以细条上**永远**保留「Open in new tab」；能改成内网账号密码登录的工具，在 iframe 里才真正可用。
- 这类页面不受 300 KB 限制（只有一个壳，10 KB 出头），但也不能算"自包含 demo"——README 里要写清楚它需要 VPN。

## 2. 重画

demo 只当信息架构参考，按 `references/design-system.md` 的 token 和 `assets/module-template.html` 的骨架重写。
好处是风格完全统一、体积小；坏处是交互要重做，工作量按页面复杂度算。

## 3. 自测（在通用清单之外加 4 条）

- [ ] 从 `index.html` 进模块，iframe 里能点（日历能选、tab 能切、图能 hover）
- [ ] 只有一层滚动条 —— 滚的是套件内容区，不是 iframe 里再滚一层
- [ ] 窗口缩到 1024，iframe 内不出现横向溢出
- [ ] 断网重开，交互仍在（证明没依赖外部字体 / CDN）

## 4. 常见坑

| 现象 | 原因 | 修法 |
|---|---|---|
| 模块页白屏 | 薄壳 iframe `src` 写成 `modules/xxx-app.html` | 改成同目录相对路径 `xxx-app.html` |
| 左侧出现两条导航 | 没删 demo 自带的 sidebar | 按 §1.3 第 1 条删 |
| 页面上下都被切 | iframe 高度用 `100vh` 又套了一层 | 用 `flex:1; min-height:0` |
| 拷下来的页面满屏 `Unexpected token '<'` | 它要调自己域名下的 `/api/*`，后端拷不走 | 别快照，按 §1.6 框线上地址 |
| https 页面上 iframe 一片灰 / 被拦 | http 应用 + 混合内容 | 按 `location.protocol` 分支，https 时给"新标签打开"卡片 |
| 出现双滚动条 | `body` 没 `overflow:hidden` | 加 `overflow:hidden`，滚动交给 iframe 内部 |
| 断网后字体变丑 | 还留着 Google Fonts 链接 | 按 §1.3 第 3 条删 |
| console 有 `__dc_booted` 之类 message | demo 向父页 postMessage | 正常，父页面忽略即可 |
