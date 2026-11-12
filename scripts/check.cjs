const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sandbox = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'dist/cafes.js'),'utf8'),sandbox);
const rows = sandbox.window.CAFES;
assert(Array.isArray(rows) && rows.length >= 153,'第一版 153 筆不可遺失');
const keys = ['id','name','district','address','status','sourceIndex','sourceLabel','sourceUrl','sourceUpdated','checkedAt'];
const ids = new Set();
const indices = new Set();
const statuses = ['unverified','temporary-closed','permanently-closed','removed'];
function dateValid(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
for (const c of rows) {
  assert.deepEqual(Object.keys(c).sort(),[...keys].sort(),`${c.id}: 僅允許基本資料欄位，不可加入心得或評分`);
  for (const key of ['id','name','sourceLabel','sourceUrl','checkedAt']) assert(typeof c[key] === 'string' && c[key].trim(),`${c.id}: ${key} 必填`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) && !ids.has(c.id),'ID 必須唯一且為 kebab-case'); ids.add(c.id);
  assert(statuses.includes(c.status),'無效的來源狀態');
  for (const key of ['district','address']) assert(c[key] === null || (typeof c[key] === 'string' && c[key].trim()),'缺漏資料須用 null');
  if(c.address && c.district) assert(c.address.includes(c.district),'地址與行政區須一致');
  if(c.sourceIndex !== null){ assert(Number.isInteger(c.sourceIndex) && c.sourceIndex >= 1 && c.sourceIndex <= 153 && !indices.has(c.sourceIndex),'第一版序號不可重複或變更'); indices.add(c.sourceIndex); }
  assert(new URL(c.sourceUrl).protocol === 'https:','來源須為 HTTPS');
  assert(dateValid(c.checkedAt),'查閱日期錯誤');
  assert(c.sourceUpdated === null || dateValid(c.sourceUpdated),'來源更新日期錯誤');
}
assert.equal(indices.size,153,'第一版清單須完整保留');
const baseline = fs.readFileSync(path.join(root,'data/first-edition.tsv'),'utf8').trimEnd().split(/\r?\n/).slice(1);
assert.equal(baseline.length,153,'第一版快照應為 153 筆');
const template = JSON.parse(fs.readFileSync(path.join(root,'templates/cafe.json'),'utf8').replace(/^\uFEFF/,''));
assert.deepEqual(Object.keys(template).sort(),[...keys].sort(),'模板與資料契約不同步');
for(const file of ['index.html','app.js','styles.css','cafes.js']) assert(fs.existsSync(path.join(root,'dist',file)),`缺少 ${file}`);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert(fs.existsSync(path.join(root,'dist',match[1])),`失效資源 ${match[1]}`);
for(const id of ['search','district','status','cards','pagination','previous','next','page-label','detail','map-context','edition-count']) assert(html.includes(`id="${id}"`),`缺少介面 ${id}`);
console.log(`PASS: ${rows.length} places; 153 baseline entries; basic-data-only schema; source URLs; valid dates; template and local assets.`);
console.log(JSON.stringify({addresses:rows.filter(c=>c.address).length,unknownAddresses:rows.filter(c=>!c.address).length,statuses:Object.fromEntries(statuses.map(s=>[s,rows.filter(c=>c.status===s).length]))}));
