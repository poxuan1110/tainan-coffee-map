# 巷裡喝一杯｜台南咖啡廳地圖

[瀏覽網站](https://poxuan1110.github.io/tainan-coffee-map/) · [Repository](https://github.com/poxuan1110/tainan-coffee-map) · [繳交草稿](SUBMISSION.md)

以 AGENTS.md 驅動擴充的靜態網站。提供店家搜尋、行政區篩選、瀏覽器收藏、Google 地圖與可分享的店家筆記（例如 `#cafe/narrow-door`）。

## 本機使用
直接開啟 dist/index.html 即可使用；Google 地圖需要網路。亦可在專案根目錄執行 `node scripts/serve.cjs`，瀏覽 http://localhost:4173 。不需安裝套件。

檢查：`node scripts/check.cjs` 和 `node --check dist/app.js`。

## 新增內容
先閱讀 [AGENTS.md](AGENTS.md)，複製 templates/cafe.json 的欄位，查證來源後加入 dist/cafes.js。共用程式自動產生卡片、分類選項與店家詳情，不需新增 HTML。欄位規格變更時同步更新檢查器和模板。

範例提示詞：「請依 AGENTS.md 新增一間台南咖啡廳。先查閱可信來源，保留查閱日期，不填未確認設施，完成後執行檢查並列出待確認事項。」

## GitHub Pages
在 poxuan1110 帳號建立公開的 tainan-coffee-map Repository，將本資料夾完整上傳至 main。到 Settings → Pages → Build and deployment，Source 選 GitHub Actions，再執行 Check and deploy Pages workflow。成功後以部署輸出的網址為準。網站使用相對資源路徑，支援 Repository 子路徑。

## 資料與限制
第一版三間店整理自台南旅遊網，各店的來源與日期保存在 cafes.js 並顯示於詳情。來源更新較舊，不能當成目前營業的保證；未聲稱親訪、評分、價格或設施。地圖使用 Google 地址搜尋，結果可能不精確，應核對店名與地址。地圖服務無法載入時，仍可讀取店家並開啟外部搜尋連結。收藏僅存在目前瀏覽器。咖啡插圖由 CSS 繪製，無店家照片授權問題。
