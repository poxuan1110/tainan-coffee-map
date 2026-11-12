# 巷裡喝一杯｜台南咖啡廳地圖

[瀏覽網站](https://poxuan1110.github.io/tainan-coffee-map/) · [Repository](https://github.com/poxuan1110/tainan-coffee-map) · [AGENTS.md](AGENTS.md) · [繳交草稿](SUBMISSION.md)

## 第一版 v1.0
以使用者指定的 [Google 地圖共用清單](https://maps.app.goo.gl/2gwzTaym2dCbxW796) 作為第一版基礎，依原順序收錄全部 153 個地點，只整理店名、地址、來源狀態與查閱日期。不使用清單作者的心得、Google 評論、評分、消費描述或照片。

2026-11-12 核對結果：150 筆有地址、3 筆地址未提供；來源標示 12 筆暫時關閉、13 筆永久歇業、2 筆地點已不存在，其餘 126 筆不等於已確認營業中。沒有刪除停歇業紀錄，也沒有替缺漏地址猜測地點。店名去除部分宣傳或營業提醒，地址移除郵遞區號並整理排列。清單包含咖啡、甜點、茶館等地點，不把全部店家改標為咖啡店。

先前三間店只是技術示範，已由此清單取代。出現在兩者的有邑家保留既有 `home-from-home` 識別碼。

## 網站功能
- 店名、地址搜尋；行政區與來源狀態篩選。
- 每頁 8 筆，依原清單順序顯示；篩選後回第一頁。
- 瀏覽器收藏，僅儲存在 localStorage。
- Google 地圖搜尋及可分享的基本資料頁，例如 `#cafe/cafe-001`。
- 停歇業標示、缺漏地址提示與來源連結。

## 本機使用與驗證
直接開啟 dist/index.html，或在專案根目錄執行 `node scripts/serve.cjs` 後瀏覽 http://127.0.0.1:4173 。不需安裝套件，外部地圖需要網路。

執行 `node scripts/check.cjs` 及 `node --check dist/app.js`。檢查器驗證 153 筆第一版序號完整、ID 唯一、僅允許基本資料欄位、日期與 HTTPS 來源、模板一致與資源存在。

## 新增與更新內容
先閱讀 [AGENTS.md](AGENTS.md)，再複製 templates/cafe.json 填入經查閱的基本資料，加到 dist/cafes.js。新地點使用唯一英文 slug，sourceIndex 填 null；第一版原序號不可重編。未知欄位用 null，無明確停歇業證據時 status 用 unverified。不要新增心得、評分或推薦標籤。

範例提示詞：「依 AGENTS.md 新增一間台南咖啡廳，只使用官方基本資料；地址不明填 null，不使用評論與心得。更新 CHANGELOG，執行資料檢查並驗證搜尋、篩選與詳情頁。」

`data/first-edition.tsv` 是第一版整理快照，不是第二份上線資料來源。後續更新現況只修改 cafes.js，並在 CHANGELOG.md 記錄依據，不回寫歷史快照。

## 部署
Repository 已啟用 GitHub Pages，Source 為 GitHub Actions。推送 main 後，`.github/workflows/pages.yml` 先執行資料與語法檢查，再部署 dist/。所有本機資源使用相對路徑以支援 Repository 子路徑。

## 資料限制
來源狀態是查閱當日的標示，不是即時營業資訊。營業時間、低消、價格與設施須洽店家；地圖採店名與地址搜尋，無地址者僅用店名加台南，請確認結果。CSS 咖啡插圖非店家實景照片。
