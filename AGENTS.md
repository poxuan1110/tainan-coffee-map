# 巷裡喝一杯：AI 協作規則

## 目的與第一版基準
這是一個繁體中文的台南咖啡廳探索網站。核心是資料與共用版型分離，讓 AI 能依同一套規則持續新增內容。使用原生 HTML、CSS、JavaScript，dist/ 可直接部署 GitHub Pages，不使用秘密金鑰或建置框架。

第一版 v1.0 以使用者指定的共用清單為準：https://maps.app.goo.gl/2gwzTaym2dCbxW796 。共 153 個地點，依原清單順序收錄，包含甜點店、茶館等，不自行假設全部都是咖啡店。先前三間示範資料不是第一版；只有同樣出現在指定清單的有邑家保留原 id。

**不得使用、複製、改寫或摘要清單作者心得、Google 評論、評分、消費描述。也不得把它們改成店家標籤、推薦理由或設施資訊。** 不抓取或提交整頁含心得的原始內容。只整理店名、地址、來源狀態和查閱日期。不得使用來源中的帳號個資。

## 檔案結構
- dist/index.html：首頁、篩選器、分頁與詳情共用容器。
- dist/styles.css：設計變數、版面與手機樣式。
- dist/cafes.js：唯一上線資料來源，window.CAFES 陣列；新增店家修改這裡。
- dist/app.js：搜尋、行政區/來源狀態篩選、分頁、收藏、地圖與 hash 路由。
- data/first-edition.tsv：第一版店名與地址的整理快照，作為完整性核對依據；不是額外的執行時資料。
- templates/cafe.json：新增資料模板，不可直接當真實店家發布。
- scripts/check.cjs：欄位、來源、第一版完整性及本機資源檢查。
- scripts/serve.cjs：本機預覽伺服器。
- .github/workflows/pages.yml：檢查後部署 dist/。
- README.md、SUBMISSION.md、CHANGELOG.md：使用說明、繳交草稿與版本紀錄。

## 店家資料契約
每筆恰有 id、name、district、address、status、sourceIndex、sourceLabel、sourceUrl、sourceUpdated、checkedAt 十個欄位。
- id：唯一 ASCII kebab-case。第一版 cafe-001 等數字是穩定識別碼，發布後不可因排序改變而重編。home-from-home 延續既有連結。之後新增店家使用有意義的英文 slug。
- name：可辨識的店名，可刪除宣傳詞、SEO 關鍵字或營業提醒；不得改成另一家店，也不得加入心得。
- district / address：依實際查閱的基本資料。缺少資料填 null，介面顯示待確認，不猜測。地址可移除郵遞區號、統一排列，不能擅改門牌或樓層。
- status：只允許 unverified、temporary-closed、permanently-closed、removed。unverified 代表尚未確認營業現況，絕不等於營業中。其餘狀態必須有來源明確標示。
- sourceIndex：第一版原順序 1–153，唯一且固定；之後新增的地點填 null，排在陣列最後。
- sourceLabel / sourceUrl：真實來源名稱與 HTTPS 連結。第一版使用指定共用清單；後續可用店家官方資料或可信公開基本資料。
- sourceUpdated：來源明載的 YYYY-MM-DD 更新日期，未提供填 null。
- checkedAt：實際查閱的 YYYY-MM-DD 日期，不代表實地確認。
不使用 summary、note、review、rating、tags 等主觀描述欄位；第一版沒有個人心得欄位。

## 來源與資料更新
保留暫時關閉、永久歇業及地點已不存在的紀錄，不可無聲刪除，也不可把缺漏地址填成其他相似店家。營業時間、低消、Wi-Fi、插座、價格等不在第一版資料範圍。地圖以店名加地址搜尋；無地址時只用店名加台南，必須標示定位待確認，不虛構座標。
更新現有店家時，核對新來源後修改 cafes.js 和查閱日期，並在 CHANGELOG.md 留下依據；data/first-edition.tsv 是歷史快照，不隨現況改寫。第一版完整性檢查驗證固定序號仍齊全，不要求地址永遠不變。

## 視覺與結構
繁體中文、奶油白背景、深咖啡文字、陶土紅重點與墨綠輔色。顏色集中於 CSS :root，禁止各卡片另設風格。保留頁首、介紹、篩選、列表與地圖。首頁不放第一版說明區塊或關於區塊；來源資訊留在店家基本資料與專案文件。點選店名或卡片空白處須更新地圖並標示選中卡片，基本資料另以連結開啟；收藏不可將地圖重設回第一間。選中店家不在目前頁面時才回到該頁第一間。咖啡插圖中的文字必須完整落在外框內，不可被圓角裁切。每頁 8 筆，搜尋/切換篩選回第一頁。桌面雙欄、手機單欄。使用語意 HTML、明確 label、鍵盤焦點、aria-live 與 aria-pressed；不得水平溢出。外部地圖失效仍可閱讀資料並使用外連。插圖以 CSS 繪製；新增照片須確認授權並提供 alt。

## 新增一個地點的流程
1. 先讀本文件、templates/cafe.json 及現有 cafes.js，確認不是重複店家。
2. 查閱店家基本資料，複製模板填寫十個欄位；未知地址、行政區及來源更新日期用 null，無明確停歇業證據時 status 用 unverified；sourceIndex 用 null。
3. 加入 dist/cafes.js 陣列末尾，不複製卡片 HTML。列表、行政區選項與 #cafe/<id> 詳情自動產生。
4. 執行 node scripts/check.cjs、node --check dist/app.js。
5. 用 node scripts/serve.cjs 預覽，測試新店搜尋、行政區和狀態篩選、詳情直連、返回列表與地圖；確認零結果、跨頁、收藏與手機寬度。
6. 更新 CHANGELOG.md；回報修改檔案、已做檢查及未確認資訊。不要把未執行的檢查寫成通過。

## 修改程式與擴充頁面
文字使用 textContent 或跳脫後插入；不可直接渲染外部 HTML。外連加 rel="noopener noreferrer"。本機資源使用相對路徑，以支援 GitHub Pages 子路徑。新增欄位必須同步修改模板、檢查器與此文件，且仍不可擅自加入使用者排除的心得。新頁面沿用導覽和共用 CSS，不重新複製設計。收藏僅存於 localStorage，儲存失效不妨礙瀏覽。不得收集位置或個資，不能提交憑證。發布前完成檢查，確認部署成功後才能宣稱已上線。

