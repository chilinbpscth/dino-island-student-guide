/**
 * 智取恐龍島 Hub — SPA (hash routes)
 * #/map  #/play/<id>  #/cert
 */
(function () {
  const LS_KEY = "dino-island-hub-v1";
  const CERT_NEED = 6;
  const ZONES = [
    { id: "write", name: "寫字石板", emoji: "✍️", subject: "中文",
      learn: "跟正確筆順寫常用字（山／水／木），連字義照顧小恐龍", play: "逐筆跟金色筆順描寫" },
    { id: "english", name: "導賞音箱", emoji: "🔊", subject: "英文",
      learn: "聽英文詞，用圖配對（照顧相關詞彙）", play: "聽完撳啱嘅圖" },
    { id: "putonghua", name: "普通話站", emoji: "🗣️", subject: "普通話",
      learn: "聽普通話詞，圖像配對", play: "聽一聽再揀圖" },
    { id: "math", name: "數蛋站", emoji: "🥚", subject: "數學",
      learn: "數數 1–10、比較多與少", play: "數蛋／揀邊邊多" },
    { id: "weather", name: "天氣小屋", emoji: "⛅", subject: "常識",
      learn: "天氣同生活照顧／安全連結", play: "睇天氣揀照顧方法" },
    { id: "science", name: "小偵探", emoji: "🔍", subject: "科學",
      learn: "觀察線索，簡單推論需要", play: "睇線索揀小恐龍需要咩" },
    { id: "human", name: "友情樹洞", emoji: "🌳", subject: "人文",
      learn: "同理心、分享輪流、禮貌", play: "情景揀友善做法" },
    { id: "art", name: "石頭彩路", emoji: "🎨", subject: "視藝",
      learn: "顏色同形狀辨認配對", play: "揀正確色／形鋪路" },
    { id: "music", name: "鼓石陣", emoji: "🥁", subject: "音樂",
      learn: "節奏聽辨、高低感知", play: "聽節奏跟住敲鼓" },
    { id: "pe", name: "熱身草地", emoji: "🏃", subject: "體育",
      learn: "跟指示做動作、大肌肉協調", play: "跟圖做動作，家長確認" },
    { id: "ict", name: "基地面板", emoji: "🖥️", subject: "資訊",
      learn: "記順序、按鈕因果（運算思維）", play: "記閃燈次序再開鎖" }
  ];

  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  let db = null;
  let playerId = null;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "null") || {
        name: "",
        playerId: "",
        zoneIds: [],
        updatedAt: 0
      };
    } catch {
      return { name: "", playerId: "", zoneIds: [], updatedAt: 0 };
    }
  }

  function saveState(state) {
    state.updatedAt = Date.now();
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    syncFirebase(state);
  }

  function initFirebase() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || !cfg.databaseURL) {
      db = null;
      return;
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      db = firebase.database();
    } catch (e) {
      console.warn("Firebase init failed", e);
      db = null;
    }
  }

  function ensurePlayerId(state) {
    if (!state.playerId) {
      state.playerId =
        "p_" +
        Math.random().toString(36).slice(2, 10) +
        Date.now().toString(36).slice(-4);
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
    playerId = state.playerId;
    return playerId;
  }

  function syncFirebase(state) {
    if (!db || !state.name) return;
    const id = ensurePlayerId(state);
    const zonesCompleted = state.zoneIds.length;
    const payload = {
      name: String(state.name).slice(0, 8),
      zonesCompleted,
      zoneIds: state.zoneIds.slice(),
      updatedAt: state.updatedAt || Date.now(),
      certReady: zonesCompleted >= CERT_NEED
    };
    db.ref("players/" + id).set(payload).catch((err) => {
      console.warn("Firebase sync error", err);
    });
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function markZoneDone(zoneId) {
    const state = loadState();
    if (!state.zoneIds.includes(zoneId)) {
      state.zoneIds.push(zoneId);
      saveState(state);
      toast("🦕 完成「" + zoneName(zoneId) + "」！");
    } else {
      saveState(state); // refresh timestamp
    }
  }

  function zoneName(id) {
    const z = ZONES.find((x) => x.id === id);
    return z ? z.name : id;
  }

  function parseRoute() {
    const h = (location.hash || "#/").replace(/^#/, "") || "/";
    const parts = h.split("/").filter(Boolean);
    if (parts[0] === "play" && parts[1]) return { page: "play", id: parts[1] };
    if (parts[0] === "cert") return { page: "cert" };
    if (parts[0] === "map") return { page: "map" };
    return { page: "home" };
  }

  function go(path) {
    location.hash = path;
  }

  /* —— Views —— */
  function renderWelcome() {
    app.innerHTML = `
      <section class="screen-welcome">
        <div class="dino-hero" aria-hidden="true">🦕</div>
        <h1>智取恐龍島</h1>
        <p class="hint">開放日探索站 · 照顧小恐龍</p>
        <div class="theme-q">
          點樣照顧恐龍島上嘅小恐龍，令佢哋<strong>安全、開心、學識生活</strong>？
        </div>
        <form class="nick-form" id="nickForm">
          <label class="hint" for="nick">輸入你嘅暱稱（最多 8 個字）</label>
          <input id="nick" name="nick" maxlength="8" autocomplete="off" placeholder="例如：小恐龍" required />
          <button type="submit">出發去島上！🌴</button>
        </form>
      </section>`;
    document.getElementById("nickForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("nick").value || "").trim().slice(0, 8);
      if (!name) return;
      const state = loadState();
      state.name = name;
      ensurePlayerId(state);
      saveState(state);
      go("/map");
    });
  }

  function topbar(state) {
    const n = state.zoneIds.length;
    return `
      <div class="topbar">
        <div class="who">👋 ${escapeHtml(state.name)}</div>
        <div class="progress-pill">${n} / ${ZONES.length} 站</div>
        <div class="actions">
          <button type="button" class="ghost" id="btnCert">證書</button>
          <button type="button" class="ghost" id="btnReset">換名</button>
        </div>
      </div>`;
  }

  function bindTopbar() {
    const c = document.getElementById("btnCert");
    const r = document.getElementById("btnReset");
    if (c) c.addEventListener("click", () => go("/cert"));
    if (r) {
      r.addEventListener("click", () => {
        if (confirm("換一個暱稱？進度會保留喺呢部裝置。")) {
          const state = loadState();
          state.name = "";
          saveState(state);
          go("/");
        }
      });
    }
  }

  function renderMap() {
    const state = loadState();
    if (!state.name) {
      renderWelcome();
      return;
    }
    const cards = ZONES.map((z) => {
      const done = state.zoneIds.includes(z.id);
      return `
        <button type="button" class="zone-card${done ? " done" : ""}" data-id="${z.id}">
          <span class="emoji">${z.emoji}</span>
          <span class="name">${z.name}</span>
          <span class="subject">${z.subject || ""}</span>
          <span class="learn">${z.learn || ""}</span>
          ${done ? '<span class="badge">✓ 完成</span>' : '<span class="badge">去玩</span>'}
        </button>`;
    }).join("");

    const ready = state.zoneIds.length >= CERT_NEED;
    app.innerHTML = `
      ${topbar(state)}
      <h2 class="map-title">恐龍島地圖</h2>
      <p class="map-sub">揀一站開始照顧小恐龍 · 完成 ${CERT_NEED} 站或以上可攞證書</p>
      <div class="zone-grid">${cards}</div>
      <div class="cert-cta">
        ${
          ready
            ? '<button type="button" class="ready" id="openCert">🏆 攞照顧證書！</button>'
            : `<p class="hint">再完成 ${CERT_NEED - state.zoneIds.length} 站就可以攞證書</p>`
        }
      </div>`;
    bindTopbar();
    app.querySelectorAll(".zone-card").forEach((btn) => {
      btn.addEventListener("click", () => go("/play/" + btn.dataset.id));
    });
    const oc = document.getElementById("openCert");
    if (oc) oc.addEventListener("click", () => go("/cert"));
  }

  function renderPlay(id) {
    const state = loadState();
    if (!state.name) {
      renderWelcome();
      return;
    }
    const zone = ZONES.find((z) => z.id === id);
    const game = window.DinoGames[id];
    if (!zone || !game) {
      app.innerHTML = `<p>搵唔到呢一站。</p><button type="button" id="back">返地圖</button>`;
      document.getElementById("back").onclick = () => go("/map");
      return;
    }
    const rounds = game.rounds || 1;
    app.innerHTML = `
      ${topbar(state)}
      <div class="play-shell">
        <div class="play-header">
          <button type="button" class="ghost" id="backMap">←</button>
          <h2>${zone.emoji} ${zone.name} <small>· ${zone.subject || ""}</small></h2>
        </div>
        <div class="learn-box">
          <div><b>學咩：</b>${zone.learn || ""}</div>
          <div><b>點玩：</b>${zone.play || ""}</div>
        </div>
        <div class="round-dots"></div>
        <div class="game-panel" id="gamePanel"></div>
      </div>`;
    bindTopbar();
    document.getElementById("backMap").onclick = () => go("/map");
    const panel = document.getElementById("gamePanel");
    game.start(panel, () => {
      markZoneDone(id);
      setTimeout(() => go("/map"), 900);
    });
  }

  function renderCert() {
    const state = loadState();
    if (!state.name) {
      renderWelcome();
      return;
    }
    const n = state.zoneIds.length;
    const ready = n >= CERT_NEED;
    app.innerHTML = `
      ${topbar(state)}
      <div class="cert-page">
        ${
          ready
            ? `<div class="cert-card">
                <h2>恐龍島照顧證書</h2>
                <p>茲證明</p>
                <div class="cert-name">${escapeHtml(state.name)}</div>
                <p class="cert-body">
                  已經喺智取恐龍島完成 <strong>${n}</strong> 個探索站，<br/>
                  學識點樣照顧小恐龍，令佢哋安全、開心、學識生活。
                </p>
                <p class="hint">🌿 智取恐龍島 · 開放日 🌿</p>
              </div>
              <p style="margin-top:1rem"><button type="button" class="secondary" id="backMap">返地圖繼續玩</button></p>`
            : `<div class="cert-locked">
                <div style="font-size:3rem">🥚</div>
                <p class="need">仲差 ${CERT_NEED - n} 站就可以攞證書</p>
                <p class="hint">而家完成咗 ${n} / ${ZONES.length} 站 · 目標至少 ${CERT_NEED} 站</p>
                <button type="button" id="backMap" style="margin-top:1rem">返地圖</button>
              </div>`
        }
      </div>`;
    bindTopbar();
    const b = document.getElementById("backMap");
    if (b) b.onclick = () => go("/map");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function route() {
    const r = parseRoute();
    const state = loadState();
    if (r.page !== "home" && !state.name) {
      renderWelcome();
      return;
    }
    if (r.page === "map") renderMap();
    else if (r.page === "play") renderPlay(r.id);
    else if (r.page === "cert") renderCert();
    else {
      if (state.name) go("/map");
      else renderWelcome();
    }
  }

  initFirebase();
  window.addEventListener("hashchange", route);
  route();
})();
