# 设计系统速查（照抄，不要自由发挥）

## 1. 颜色 token

```
/* 品牌 */
--brand:         #EE4D2D      --brand-hover: #FF6F47     --brand-bg: #FFF5F0

/* 文本 */
--g8 (主文本):   #303844      --g7 (次要):   #7E8692
--g6 (更弱):     #959BA4      --g5 (占位):   #B5BBC6

/* 线条与底 */
--g4 (边框):     #E2E6EC      --g3 (分隔):   #ECF0F4
--g2 (画布):     #F5F6F9      --g1 (浅底):   #F9FAFC     白: #FFFFFF

/* 语义（文字 / 浅底） */
成功  #1CC461 / #ECFFF1     失败  #F32345 / #FFF0F0
警告  #FFB014 / #FFF8DB     信息  #3274F7 / #F0F7FF
信息2 #FF831D / #FEECE1
```

圆角：`2 / 4 / 8 px`，卡片默认 4，按钮 4，胶囊 10。
阴影：卡片 `0 1px 4px rgba(0,0,0,.12)`；浮层 `0 4px 12px rgba(0,0,0,.12)`。

## 2. 排版

| 用途 | 字号/字重 | 颜色 |
|---|---|---|
| 页面标题 | 20 / 600 | #303844 |
| 区块标题 | 14 / 600 | #303844 |
| 卡片标题 | 13.5 / 600 | #303844 |
| 正文 | 12.5 / 400 | #303844 |
| 次要说明 | 12 / 400 | #7E8692 |
| 极小标签（大写） | 10 / 600，letter-spacing .5px | #7E8692 |
| KPI 大数字 | 24-26 / 600，tabular-nums | #303844 |

字体：`Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif`（不要引 Google Fonts）。

## 3. 组件配方

### 页头

```html
<div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:18px">
  <div>
    <div style="font:600 20px/1.2 sans-serif;color:#303844">Sortation Path Designer</div>
    <div style="font:400 12.5px/1.5 sans-serif;color:#7E8692;margin-top:5px;max-width:760px">
      一句话说清这个页面解决什么问题
    </div>
  </div>
  <div style="display:flex;gap:8px;align-items:flex-start">
    <button class="btn-primary">Run optimization</button>
  </div>
</div>
```

### KPI 卡片

```html
<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px">
  <div style="position:relative;background:#fff;border:1px solid #E2E6EC;border-radius:4px;padding:13px 15px;overflow:hidden">
    <span style="position:absolute;left:0;top:0;bottom:0;width:3px;background:#1CC461"></span>
    <div style="display:flex;justify-content:space-between;gap:6px">
      <span style="font:600 10px/1.3 sans-serif;letter-spacing:.55px;text-transform:uppercase;color:#7E8692">Lanes covered</span>
      <span style="font:600 9.5px/1 sans-serif;padding:3px 6px;border-radius:3px;background:#ECFFF1;color:#0E8F45">ON TRACK</span>
    </div>
    <div style="display:flex;align-items:baseline;gap:5px;margin-top:9px">
      <b style="font:600 25px/1 sans-serif;color:#303844;font-variant-numeric:tabular-nums">92.6k</b>
      <span style="font:500 11.5px/1 sans-serif;color:#7E8692">of 1.08M</span>
    </div>
    <div style="font:400 10.5px/1.4 sans-serif;color:#7E8692;margin-top:8px">说明这数字意味着什么</div>
  </div>
</div>
```

左色条只给"有状态"的卡：正常绿 / 异常红 / 待处理橙；中性灰 `#B5BBC6`。

### 两栏工作区

```html
<div style="display:grid;grid-template-columns:360px minmax(0,1fr);gap:16px;align-items:stretch">
  <section style="background:#fff;border:1px solid #E2E6EC;border-radius:4px;display:flex;flex-direction:column;min-width:0">
    <div style="display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #ECF0F4">
      <span style="font:600 13.5px/1 sans-serif;color:#303844">Cases</span>
      <span style="font:600 10.5px/1 sans-serif;color:#7E8692;background:#F5F6F9;border-radius:9px;padding:2px 7px">4</span>
    </div>
    <div style="flex:1;min-height:0;overflow:auto;padding:6px"><!-- 列表项 --></div>
  </section>
  <section style="background:#fff;border:1px solid #E2E6EC;border-radius:4px;min-width:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #ECF0F4">
      <span style="font:600 13.5px/1 sans-serif;color:#303844">Lanes</span>
    </div>
    <div style="overflow:auto"><!-- 表格 --></div>
  </section>
</div>
```

### 表格

```html
<table style="width:100%;border-collapse:collapse">
  <thead><tr>
    <th style="text-align:left;padding:9px 12px;border-bottom:1px solid #E2E6EC;font:600 10px/1 sans-serif;
               letter-spacing:.5px;text-transform:uppercase;color:#7E8692">Lane</th>
  </tr></thead>
  <tbody>
    <tr style="cursor:pointer"><td style="padding:10px 12px;border-bottom:1px solid #ECF0F4;font-size:12px">SOC-SP2 → SP8</td></tr>
  </tbody>
</table>
```

### 状态胶囊

```html
<span style="display:inline-flex;align-items:center;gap:4px;font:600 10px/15px sans-serif;
             padding:1px 6px;border-radius:3px;background:#FFF0F0;color:#F32345">Breach</span>
```

### 空状态

居中图标 + 主文案（13/500）+ 辅助文案（12 灰），不要只留一行灰字。

## 4. 参考实现（直接读这两个页面的源码）

- Data Gov 页：`index.html` 里 `renderDataGov()` / `datasetsPanelHTML()` / `ticketsPanelHTML()` —— KPI 带、两栏、工单→数据集联动。
- LH Copilot 页：`renderCopilot()` / `cpAlertsHTML()` / `cpKpiStripHTML()` —— 告警卡、KPI 三卡带迷你条、真实工作台 iframe。

## 5. 正反例

| 反例 | 正例 |
|---|---|
| 紫蓝渐变、大圆角 12px、重阴影 | 白卡片 + 1px 灰边 + 4px 圆角 + 轻阴影 |
| 每个数字配一个彩色图标 | 数字大、标签小、状态用胶囊 |
| 表头用 14px 加粗黑 | 表头 10px 大写灰、行内容 12-12.5px |
| 用 emoji 当图标 | 内联 SVG 线性图标（stroke 1.5，currentColor） |
| 一屏塞 8 个图表 | 一屏 3-6 个 KPI + 一块主工作区 |
