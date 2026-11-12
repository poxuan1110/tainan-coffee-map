const cafes = window.CAFES;
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const statusLabels = {unverified:'營業現況請洽店家','temporary-closed':'來源標示：暫時關閉','permanently-closed':'來源標示：永久歇業',removed:'來源標示：地點已不存在'};
const pageSize = 8;
let page = 1;
let onlySaved = false;
let selectedCafeId = null;
let saved = new Set();
try {
  const data = JSON.parse(localStorage.getItem('tainan-coffee-saved') || '[]');
  if (Array.isArray(data)) saved = new Set(data.filter(id => cafes.some(c => c.id === id)));
} catch { /* 儲存不可用時仍可瀏覽。 */ }
const districtText = c => c.district || '行政區待確認';
const query = c => encodeURIComponent(c.name + ' ' + (c.address || '台南'));
const mapUrl = c => 'https://www.google.com/maps/search/?api=1&query=' + query(c);
const badge = c => `<span class="status-badge ${c.status === 'unverified' ? '' : 'status-warning'}">${esc(statusLabels[c.status])}</span>`;
function setMap(c) {
  selectedCafeId = c ? c.id : null;
  $('#map-title').textContent = c ? c.name : '台南咖啡廳地圖';
  $('#map').title = c ? `${c.name}的位置地圖` : '台南咖啡廳位置地圖';
  $('#map-address').textContent = c ? (c.address || '地址待確認') : '';
  $('#map-context').textContent = c ? `${districtText(c)} · ${statusLabels[c.status]}${c.address ? '' : ' · 地址待確認，僅供名稱搜尋'}` : '選擇一個地點，查看 Google 地圖搜尋結果。';
  const src = 'https://maps.google.com/maps?q=' + (c ? query(c) : encodeURIComponent('台南 咖啡廳')) + '&output=embed';
  if ($('#map').getAttribute('src') !== src) $('#map').src = src;
  document.querySelectorAll('[data-cafe]').forEach(card => {
    const selected = card.dataset.cafe === selectedCafeId;
    card.classList.toggle('is-selected', selected);
    card.querySelector('.cafe-select').setAttribute('aria-pressed', String(selected));
    card.querySelector('.map-button').textContent = selected ? '地圖顯示中 ✓' : '在地圖上查看 ↗';
  });
}
for (const district of [...new Set(cafes.map(c => c.district).filter(Boolean))]) {
  const option = document.createElement('option'); option.value = district; option.textContent = district; $('#district').append(option);
}
if (cafes.some(c => !c.district)) {
  const option = document.createElement('option'); option.value = 'unknown'; option.textContent = '行政區待確認'; $('#district').append(option);
}
$('#total').textContent = `${cafes.length} 個清單地點`;
function filteredRows() {
  const term = $('#search').value.trim().toLocaleLowerCase();
  const district = $('#district').value;
  const status = $('#status').value;
  return cafes.filter(c => (!district || (district === 'unknown' ? !c.district : c.district === district)) && (!status || c.status === status) && (!onlySaved || saved.has(c.id)) && [c.name,c.address || '',c.district || ''].join(' ').toLocaleLowerCase().includes(term));
}
function render() {
  const rows = filteredRows();
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  page = Math.min(page, pages);
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);
  $('#count').textContent = rows.length ? `找到 ${rows.length} 個地點 · 顯示 ${(page-1)*pageSize+1}–${Math.min(page*pageSize,rows.length)} 筆 · 依原清單順序` : '找到 0 個地點';
  $('#cards').innerHTML = visible.length ? visible.map(c => `<article class="card" data-cafe="${esc(c.id)}"><div class="card-top"><span class="number">${c.sourceIndex === null ? 'NEW' : String(c.sourceIndex).padStart(3,'0')} / ${esc(districtText(c))}</span><button class="save" data-save="${esc(c.id)}" aria-label="收藏 ${esc(c.name)}" aria-pressed="${saved.has(c.id)}">${saved.has(c.id)?'♥':'♡'}</button></div><h3><button class="cafe-select" data-select="${esc(c.id)}" aria-label="在地圖顯示 ${esc(c.name)}" aria-pressed="false">${esc(c.name)}</button></h3>${badge(c)}<p>⌖ ${esc(c.address || '地址待確認')}</p><div class="card-actions"><button class="map-button" data-map="${esc(c.id)}">在地圖上查看 ↗</button><a href="${mapUrl(c)}" target="_blank" rel="noopener noreferrer">Google 地圖 ↗</a><a href="#cafe/${esc(c.id)}">基本資料 →</a></div></article>`).join('') : '<div class="empty">沒有符合的地點。<br>試試其他關鍵字，或按「重設」。</div>';
  $('#pagination').hidden = !rows.length;
  $('#page-label').textContent = `第 ${page} / ${pages} 頁`;
  $('#previous').disabled = page === 1; $('#next').disabled = page === pages;
  setMap(visible.find(c => c.id === selectedCafeId) || visible[0]);
}
function filterChanged() { page = 1; render(); }
$('#search').addEventListener('input',filterChanged);
$('#district').addEventListener('change',filterChanged);
$('#status').addEventListener('change',filterChanged);
$('#favorites').addEventListener('click',()=>{onlySaved=!onlySaved;$('#favorites').setAttribute('aria-pressed',onlySaved);filterChanged();});
$('#reset').addEventListener('click',()=>{$('#search').value='';$('#district').value='';$('#status').value='';onlySaved=false;$('#favorites').setAttribute('aria-pressed','false');filterChanged();});
for (const [id,delta] of [['previous',-1],['next',1]]) {
  $('#'+id).addEventListener('click',()=>{page+=delta;render();$('#count').focus();$('#explore').scrollIntoView({block:'start'});});
}
$('#cards').addEventListener('click',event=>{
  const save=event.target.closest('[data-save]');
  if(save){saved.has(save.dataset.save)?saved.delete(save.dataset.save):saved.add(save.dataset.save);try{localStorage.setItem('tainan-coffee-saved',JSON.stringify([...saved]));}catch{}render();const restored=$('#cards').querySelector(`[data-save="${save.dataset.save}"]`);(restored||$('#favorites')).focus();return;}
  const map=event.target.closest('[data-map]');
  const select=event.target.closest('[data-select]');
  const card=event.target.closest('[data-cafe]');
  if(map || select || (card && !event.target.closest('a,button'))){
    setMap(cafes.find(c=>c.id===card.dataset.cafe));
    if(map) $('.map-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
});
function route(){
  const isDetail=location.hash.startsWith('#cafe/');$('.hero').hidden=isDetail;$('#explore').hidden=isDetail;$('#detail').hidden=!isDetail;
  if(!isDetail){document.title='巷裡喝一杯｜台南咖啡廳地圖';return;}
  const c=cafes.find(c=>c.id===location.hash.slice(6));
  if(c) setMap(c);
  $('#detail').innerHTML=c?`<a href="#explore">← 返回咖啡地圖</a><p class="eyebrow">PLACE DETAILS / ${esc(districtText(c))}</p><h1>${esc(c.name)}</h1>${badge(c)}<dl class="place-facts"><dt>地址</dt><dd>${esc(c.address || '來源未提供可核對地址')}</dd><dt>清單序號</dt><dd>${c.sourceIndex===null?'後續新增':String(c.sourceIndex).padStart(3,'0')+' · 第一版'}</dd><dt>資料查閱日</dt><dd>${esc(c.checkedAt)}</dd></dl><p>${c.status==='unverified'?'清單未標示停歇業，不代表現在營業中；出發前請確認店家最新公告。':'以上為查閱當日的來源標示，並非即時查證；保留此筆以維持第一版清單完整。'}</p><a class="primary" href="${mapUrl(c)}" target="_blank" rel="noopener noreferrer">${c.address?'開啟 Google 地圖':'以店名搜尋 Google 地圖'} ↗</a><p class="details-meta">資料來源：<a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(c.sourceLabel)} ↗</a><br>來源更新日期：${esc(c.sourceUpdated||'未提供')}<br>營業時間、低消與設施請洽店家。本頁不收錄心得、評分或評論。</p>`:'<h2>找不到這個地點</h2><p>這個地點可能不在目前的第一版清單中。</p><a href="#explore">返回列表</a>';
  document.title=c?c.name+'｜巷裡喝一杯':'找不到地點｜巷裡喝一杯';$('#detail').focus();
}
window.addEventListener('hashchange',route);render();route();
