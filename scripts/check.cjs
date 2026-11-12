const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'dist/cafes.js'),'utf8'),sandbox);
const rows=sandbox.window.CAFES;
assert(Array.isArray(rows)&&rows.length>0,'至少一間店家');
const ids=new Set();
for(const c of rows){
 for(const key of ['id','name','district','address','summary','sourceUrl','checkedAt','note'])assert(typeof c[key]==='string'&&c[key].trim(),`${c.id}: ${key} 必填`);
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id)&&!ids.has(c.id),'ID 必須唯一且為 kebab-case');ids.add(c.id);
 assert(c.address.includes(c.district),'地址與行政區須一致');
 assert(Array.isArray(c.tags)&&c.tags.length>=1&&c.tags.length<=3&&c.tags.every(t=>typeof t==='string'&&t.trim()),'標籤 1–3 個');
 assert(new URL(c.sourceUrl).protocol==='https:','來源須為 HTTPS');
 for(const date of [c.checkedAt,c.sourceUpdated])if(date!==null)assert(/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date)),'日期格式錯誤');
 assert(Object.hasOwn(c,'sourceUpdated'),'須填來源更新日期或 null');
}
for(const f of ['index.html','app.js','styles.css','cafes.js'])assert(fs.existsSync(path.join(root,'dist',f)),`缺少 ${f}`);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))assert(fs.existsSync(path.join(root,'dist',m[1])),`失效資源 ${m[1]}`);
console.log(`PASS: ${rows.length} cafes, unique IDs, required fields, dates, sources, local assets.`);
