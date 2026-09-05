/**
 * 大螢幕即時榜 — Firebase RTDB onValue
 * Sort: zonesCompleted desc, then updatedAt asc (先完成排前)
 */
(function () {
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const setupEl = document.getElementById("setup");

  function showSetup() {
    statusEl.textContent = "未連接 Firebase";
    statusEl.className = "status warn";
    setupEl.classList.remove("hidden");
    setupEl.innerHTML =
      "<p><strong>大螢幕榜需要 Firebase Realtime Database</strong></p>" +
      "<p>1. 喺 Firebase Console 建立專案同 RTDB</p>" +
      "<p>2. 複製 <code>firebase-config.example.js</code> 做 <code>firebase-config.js</code></p>" +
      "<p>3. 填入 Web App config（特別係 <code>databaseURL</code>）</p>" +
      "<p>4. Hub 同 Board 用同一個設定，開放日先有即時同步</p>" +
      "<p style='margin-top:1rem'>未設定前，小朋友進度仍會存喺各部裝置嘅 localStorage。</p>";
    boardEl.innerHTML = '<li class="empty">🦕 等待設定 Firebase…</li>';
  }

  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || !cfg.databaseURL) {
    showSetup();
    return;
  }

  let db;
  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    db = firebase.database();
  } catch (e) {
    statusEl.textContent = "初始化失敗";
    statusEl.className = "status err";
    boardEl.innerHTML = '<li class="empty">Firebase 初始化錯誤</li>';
    console.error(e);
    return;
  }

  statusEl.textContent = "即時更新中 ●";
  statusEl.className = "status";

  function render(players) {
    const list = Object.keys(players || {}).map((id) => {
      const p = players[id] || {};
      return {
        id,
        name: String(p.name || "？").slice(0, 8),
        zonesCompleted: Number(p.zonesCompleted) || 0,
        updatedAt: Number(p.updatedAt) || 0,
        certReady: !!p.certReady
      };
    });

    list.sort((a, b) => {
      if (b.zonesCompleted !== a.zonesCompleted) return b.zonesCompleted - a.zonesCompleted;
      return a.updatedAt - b.updatedAt;
    });

    if (!list.length) {
      boardEl.innerHTML = '<li class="empty">🥚 未有探險家上島，等緊第一位…</li>';
      return;
    }

    const medals = ["🥇", "🥈", "🥉"];
    boardEl.innerHTML = list
      .slice(0, 40)
      .map((p, i) => {
        const top = i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "";
        const rank =
          i < 3
            ? '<span class="medal">' + medals[i] + "</span>"
            : String(i + 1);
        return (
          '<li class="row' +
          top +
          '">' +
          '<div class="rank">' +
          rank +
          "</div>" +
          '<div class="name">' +
          escapeHtml(p.name) +
          "</div>" +
          '<div class="zones"><span>' +
          p.zonesCompleted +
          "</span> 站</div>" +
          '<div class="cert">' +
          (p.certReady ? "🏆" : "") +
          "</div>" +
          "</li>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  db.ref("players").on(
    "value",
    (snap) => {
      render(snap.val());
      statusEl.textContent = "即時更新中 ● " + new Date().toLocaleTimeString("zh-HK");
    },
    (err) => {
      console.error(err);
      statusEl.textContent = "讀取失敗";
      statusEl.className = "status err";
      boardEl.innerHTML =
        '<li class="empty">無法讀取 players（檢查 RTDB 規則同 databaseURL）</li>';
    }
  );
})();
