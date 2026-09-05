# 智取恐龍島 · 開放日 Hub

靜態網站（GitHub Pages 就緒）：小朋友用 `hub/` 玩 11 個探索站，大螢幕用 `board/` 睇即時榜。

**主題問題：** 點樣照顧恐龍島上嘅小恐龍，令佢哋安全、開心、學識生活？

目標 repo：`chilinbpscth/dino-island-student-guide`（把本目錄內容放到 repo 後，Pages 路徑為 `/hub/`、`/board/`）。

## 目錄

```
dino-hub/
  README.md
  hub/
    index.html
    styles.css
    app.js
    games-ui.js
    firebase-config.js          # 預設 null（可安全 commit）
    firebase-config.example.js
    games/
      write.js english.js putonghua.js math.js
      weather.js science.js human.js art.js
      music.js pe.js ict.js
  board/
    index.html
    board.css
    board.js
    firebase-config.js
    firebase-config.example.js
```

## 本機預覽

需要以 **HTTP** 開啟（唔好用 `file://`，部分瀏覽器會限制語音／模組行為）：

```bash
cd dino-hub
python3 -m http.server 8080
```

- Hub：http://localhost:8080/hub/
- Board：http://localhost:8080/board/

Hash 路由：`#/map`、`#/play/<id>`、`#/cert`。

## 推上 GitHub Pages

1. 將 `hub/`、`board/`（同本 README 如需要）放進 `dino-island-student-guide` repo。
2. Settings → Pages → 由 `main`（或選定 branch）根目錄／`docs` 發佈。
3. 訪客網址類似：
   - `https://chilinbpscth.github.io/dino-island-student-guide/hub/`
   - `https://chilinbpscth.github.io/dino-island-student-guide/board/`

**唔需要 build step**；純靜態 + CDN Firebase compat。

## Firebase（可選，開日即時榜用）

未設定時：

- Hub 進度只存 **localStorage**（換裝置唔會跟）
- Board 顯示設定提示

設定步驟：

1. Firebase Console 建立專案 → Realtime Database（建議 `asia-southeast1`）
2. 新增 Web App，複製 config
3. 將 `hub/firebase-config.example.js` 複製為 `hub/firebase-config.js` 並貼上真實值  
   （`board/` 同樣做一份，**同一個專案**）
4. 發佈前確認 `databaseURL` 正確

### 範例 RTDB Rules

開放日用（公開讀；寫入 `players` 有基本驗證）。**活動完後請收緊或關閉。**

```json
{
  "rules": {
    ".read": true,
    "players": {
      "$uid": {
        ".write": true,
        ".validate": "newData.hasChildren(['name','zonesCompleted','zoneIds','updatedAt','certReady'])",
        "name": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 8" },
        "zonesCompleted": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 11" },
        "zoneIds": { ".validate": "newData.hasChildren() || newData.val() == null || newData.isString() || true" },
        "updatedAt": { ".validate": "newData.isNumber()" },
        "certReady": { ".validate": "newData.isBoolean()" }
      }
    }
  }
}
```

資料形狀：`/players/{id}` →

```json
{
  "name": "小恐龍",
  "zonesCompleted": 6,
  "zoneIds": ["write","math","pe", "..."],
  "updatedAt": 1690000000000,
  "certReady": true
}
```

## 產品行為（已鎖定）

| 項目 | 行為 |
|------|------|
| 登入 | 無 Google；開場輸入暱稱（最多約 8 字） |
| 進度 | localStorage + 有 config 時 sync Firebase |
| 證書 | 完成 **≥ 6 / 11** 站 |
| 榜 | Board `onValue` 即時；按站數降序，同分按 `updatedAt` 升序 |
| UI | zh-Hant-HK、觸控優先、cream / forest / gold |

### 11 站

1. write 寫字石板 — canvas 描「山水愛」
2. english 導賞音箱 — 英文語音 + 撳圖
3. putonghua — 普通話語音 + 撳圖
4. math 數蛋站 — 數／比較 1–10
5. weather 天氣小屋 — 天氣→照顧
6. science 小偵探 — 線索→需要
7. human 友情樹洞 — 友善行動
8. art 石頭彩路 — 色／形
9. music 鼓石陣 — 節奏（Web Audio）
10. pe 熱身草地 — 家長撳「做到啦」
11. ict 基地面板 — 按鈕序列記憶

## 設計簡化（刻意）

- 單一 Hub SPA（hash），無 bundler / 無框架
- Firebase **compat CDN**，方便 Pages 直開
- 遊戲各 1–3 回合、對錯即時回饋；唔做帳戶系統
- PE 站信任家長確認（適合幼童／開放日）
- 語音依賴瀏覽器 `speechSynthesis`（裝置差異正常）
- `firebase-config.js` 預設 `null`，避免誤交真實 key；example 用假 key

## Visual tokens（clbps.app）

- Cream `#F6F3EC`
- Forest `#146b4d` / `#26734b`
- Gold `#b8923a`
