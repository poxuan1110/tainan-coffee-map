# 巷裡喝一杯：AI 協作規則

## 目的與範圍
這是一個繁體中文的台南咖啡廳地圖，協助讀者依行政區探索店家。核心是可持續擴充的資料與共用版型，不是一次性的展示頁。以原生 HTML、CSS、JavaScript 實作，dist/ 可直接部署 GitHub Pages，不使用建置框架或秘密金鑰。

## 檔案結構
- dist/index.html：首頁與店家詳情共用容器。
- dist/styles.css：設計變數、版面與響應式規則。
- dist/cafes.js：唯一店家資料來源，window.CAFES 陣列。
- dist/app.js：搜尋、行政區篩選、收藏、地圖與 hash 路由。
- templates/cafe.json：新增店家資料模板，不能直接當真實店家發佈。
- scripts/check.cjs：資料與必要檔案檢查。
- .github/workflows/pages.yml：檢查後部署 dist/。
- README.md、SUBMISSION.md：開發說明與作業繳交草稿。

## 視覺與頁面規則
使用繁體中文；奶油白背景、深咖啡文字、陶土紅重點、墨綠輔色。顏色集中在 CSS :root，禁止每張卡片另設風格。保留頁首、介紹、搜尋篩選、店家列表、地圖與資料說明。桌面雙欄、窄螢幕單欄；不可出現水平溢出。使用語意標籤、明確 label、可見鍵盤焦點；狀態訊息用 aria-live。圖片若新增，須記錄授權並有 alt，不可盜用店家照片。

## 店家資料契約
每筆必填 id、name、district、address、summary、tags、sourceUrl、sourceUpdated、checkedAt、note。id 為唯一英文 kebab-case，發布後不可任意更改。district 使用來源中的行政區名稱；tags 為 1–3 個短標籤。summary 為自己撰寫的簡介，不得虛構親訪心得或評分。sourceUrl 必須是 https 來源連結；sourceUpdated 是來源更新日期，未知用 null；checkedAt 為實際查閱來源的 YYYY-MM-DD 日期，不代表店家現況已確認。

## 事實與來源
優先使用店家官方資訊、政府旅遊資料。查詢來源後才新增真實店家，保留來源連結與查閱日期。舊來源必須明確標示現況待確認。不得推測營業中、低消、價格、插座、Wi-Fi 或寵物政策；未確認者不填。不要捏造經緯度；地圖使用店名加完整地址查詢，顯示結果仍應供使用者確認。停業須有來源，未確認不可直接刪除或宣稱營業。

## 新增一間店的標準流程
1. 讀本文件及現有 cafes.js，核對來源與重複店家。
2. 複製 templates/cafe.json 的欄位，填入經查證資料，加入 dist/cafes.js。
3. 不要複製 HTML 卡片；列表、行政區選項與 #cafe/<id> 詳情頁由資料自動生成。
4. 執行 node scripts/check.cjs、node --check dist/app.js。
5. 在瀏覽器檢查新店搜尋、行政區篩選、詳情直連、返回列表與地圖查詢；檢查手機寬度、鍵盤操作與零結果狀態。
6. 更新 README 或繳交說明中受影響的資訊，回報修改檔案、測試結果與未確認資料。

## 修改程式與擴充頁面
資料文字用 textContent 或跳脫後插入，不可把外部 HTML 直接渲染。外連加 rel="noopener noreferrer"。所有本機資源使用相對路徑，避免 GitHub Pages 子路徑失效。新增欄位時同步更新模板、檢查器與此文件；新增內容頁沿用共用 CSS 與導覽。收藏僅存在瀏覽器 localStorage，失效時仍可瀏覽；不可收集使用者位置或個資。不要提交憑證、node_modules 或私人資料。發布前先完成檢查，不得宣稱尚未成功的部署已上線。
