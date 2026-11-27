#!/usr/bin/env node
/**
 * build-standalone.mjs — bake the whole demo into ONE html file.
 *
 *   node tools/build-standalone.mjs                 # -> dist/middle-mile-demo.html
 *   node tools/build-standalone.mjs --out /tmp/x.html
 *
 * What it does
 *   * inlines modules/registry.js
 *   * inlines every module page (+ the LH Copilot workspace snapshot, the two
 *     explainer pages) as base64 inside the file, and hands the suite blob: URLs
 *     at runtime, so the iframes keep working with no sibling files
 *   * inlines local images / css url(...) inside those pages as data: URIs
 *   * rewrites the two hard-coded references (workspace iframe, topbar links)
 *
 * Any anchor it cannot find fails the build loudly: if index.html changes shape,
 * fix the script instead of shipping a silently half-inlined file.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const outArg = argv.indexOf('--out');
const OUT = outArg >= 0 ? resolve(argv[outArg + 1]) : join(ROOT, 'dist/middle-mile-demo.html');

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const fail = (msg) => { console.error('BUILD FAILED: ' + msg); process.exit(1); };

/* ---------- 1. which pages travel inside ---------- */

const registrySrc = read('modules/registry.js').replace(/\/\*[\s\S]*?\*\//g, '');   // drop the how-to comment
const registryMap = {};
for (const m of registrySrc.matchAll(/'([\w-]+)':\s*'([^']+)'/g)) registryMap[m[1]] = m[2];
if (Object.keys(registryMap).length !== 3) fail('unexpected registry entries: ' + JSON.stringify(registryMap));

const pages = [...new Set([
  ...Object.values(registryMap),
  'modules/lh-copilot-workspace.html',
  'user-flow.html',
  'architecture.html',
])];

/* ---------- 2. inline relative assets inside each page ---------- */

const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
               webp: 'image/webp', svg: 'image/svg+xml' };

function inlineLocalAssets(html, pagePath) {
  const dir = dirname(join(ROOT, pagePath));
  let hits = 0;

  const replaceRef = (url) => {
    if (/^(https?:|data:|blob:|#|\/\/)/i.test(url) || url.startsWith('${')) return url;
    const abs = join(dir, url.split('?')[0]);
    if (!existsSync(abs)) return url;                      // leave foreign refs alone
    const ext = (abs.split('.').pop() || '').toLowerCase();
    if (!MIME[ext]) return url;
    hits++;
    return 'data:' + MIME[ext] + ';base64,' + readFileSync(abs).toString('base64');
  };

  html = html.replace(/\b(src|href)="([^"]+)"/g, (all, attr, url) => attr + '="' + replaceRef(url) + '"');
  html = html.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g, (all, q, url) => 'url(' + q + replaceRef(url) + q + ')');
  return { html, hits };
}

const assets = {};
let inlinedFiles = 0;
for (const p of pages) {
  const raw = read(p);
  const { html, hits } = inlineLocalAssets(raw, p);
  inlinedFiles += hits;
  assets[p] = Buffer.from(html, 'utf8').toString('base64');
}

/* ---------- 3. rewrite index.html ---------- */

let html = read('index.html');

const once = (needle, replacement, label) => {
  const n = html.split(needle).length - 1;
  if (n !== 1) fail(label + ': expected 1 occurrence, found ' + n);
  html = html.replace(needle, replacement);
};

/* 3a. registry.js -> inline registry + asset payload + blob bootstrap */
const bootstrap = [
  '<script>',
  '/* inlined modules/registry.js */',
  registrySrc.trim(),
  '',
  '/* every module page is embedded below as base64; this turns each entry into a',
  '   blob: URL the iframes can load without any sibling file. */',
  'window.__DEMO_ASSETS__ = {',
  Object.entries(assets).map(([k, v]) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n'),
  '};',
  '(function () {',
  '  var data = window.__DEMO_ASSETS__, urls = {};',
  '  function blobUrl(b64) {',
  '    var bin = atob(b64), n = bin.length, u8 = new Uint8Array(n);',
  '    for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);',
  '    return URL.createObjectURL(new Blob([u8], { type: "text/html;charset=utf-8" }));',
  '  }',
  '  window.__demoAssetUrl = function (path) {',
  '    if (!data[path]) return path;',
  '    if (!urls[path]) urls[path] = blobUrl(data[path]);',
  '    return urls[path];',
  '  };',
  '  Object.keys(window.MODULE_PAGES || {}).forEach(function (k) {',
  '    window.MODULE_PAGES[k] = window.__demoAssetUrl(window.MODULE_PAGES[k]);',
  '  });',
  '})();',
  '</script>',
].join('\n');

once('<script src="modules/registry.js"></script>', bootstrap, 'registry script tag');

/* 3b. the two references hard-coded inside JS strings */
once('src="modules/lh-copilot-workspace.html"',
     'src="\' + window.__demoAssetUrl(\'modules/lh-copilot-workspace.html\') + \'"',
     'copilot workspace iframe');

for (const page of ['user-flow.html', 'architecture.html']) {
  once('href="' + page + '"',
       'href="\' + window.__demoAssetUrl(\'' + page + '\') + \'"',
       page + ' topbar link');
}

/* ---------- 4. guards + banner ---------- */

for (const leftover of ['src="modules/', 'href="user-flow.html', 'href="architecture.html', '<script src="modules/']) {
  if (html.includes(leftover)) fail('leftover external reference: ' + leftover);
}

const stamp = new Date().toISOString().slice(0, 10);
html = html.replace('<title>', '<!-- Middle-Mile Optimization · standalone build ' + stamp +
  ' — generated by tools/build-standalone.mjs, do not edit by hand. -->\n<title>');

/* ---------- 5. write ---------- */

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log('standalone build');
for (const [p, b64] of Object.entries(assets)) {
  console.log('  embedded  ' + p.padEnd(38) + kb(Buffer.from(b64, 'base64').length));
}
console.log('  inlined images: ' + inlinedFiles);
console.log('  output: ' + OUT + '  (' + kb(Buffer.byteLength(html)) + ')');
