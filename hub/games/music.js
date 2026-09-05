/** 鼓石陣 — rhythm / Web Audio */
(function () {
  const UI = window.GamesUI;
  let audioCtx = null;

  function ctx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function beep(freq, dur, type) {
    try {
      const c = ctx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || "triangle";
      o.frequency.value = freq;
      g.gain.value = 0.18;
      o.connect(g);
      g.connect(c.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.stop(c.currentTime + dur);
    } catch (_) { /* ignore */ }
  }

  const DRUMS = [
    { id: "low", emoji: "🥁", freq: 120, label: "低" },
    { id: "mid", emoji: "🪘", freq: 220, label: "中" },
    { id: "hi", emoji: "🔔", freq: 440, label: "高" }
  ];

  const PATTERNS = [
    ["low", "mid", "low"],
    ["hi", "low", "hi"],
    ["mid", "mid", "hi", "low"],
    ["low", "hi", "mid"]
  ];

  window.DinoGames.music = {
    title: "鼓石陣",
    emoji: "🥁",
    rounds: 2,
    start(panel, onComplete) {
      UI.runRounds(panel, 2, (ri, p, doneRound) => {
        const pattern = PATTERNS[ri % PATTERNS.length];
        const labels = pattern.map((id) => DRUMS.find((d) => d.id === id).emoji).join(" ");
        UI.prompt(p, "跟節奏敲鼓！聽完再照樣敲");
        const hint = document.createElement("div");
        hint.className = "pattern-hint";
        hint.textContent = labels;
        p.appendChild(hint);

        const playBtn = document.createElement("button");
        playBtn.type = "button";
        playBtn.className = "secondary";
        playBtn.textContent = "▶ 聽示範";
        playBtn.style.display = "block";
        playBtn.style.margin = "0 auto 1rem";
        p.appendChild(playBtn);

        let playing = false;
        playBtn.onclick = async () => {
          if (playing) return;
          playing = true;
          for (const id of pattern) {
            const d = DRUMS.find((x) => x.id === id);
            beep(d.freq, 0.25);
            await new Promise((r) => setTimeout(r, 420));
          }
          playing = false;
        };
        // auto play once
        setTimeout(() => playBtn.click(), 400);

        const row = document.createElement("div");
        row.className = "drum-row";
        const tapped = [];
        let locked = false;

        DRUMS.forEach((d) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "drum";
          b.textContent = d.emoji;
          b.setAttribute("aria-label", d.label);
          b.onclick = () => {
            if (locked) return;
            beep(d.freq, 0.2);
            tapped.push(d.id);
            hint.textContent = tapped.map((id) => DRUMS.find((x) => x.id === id).emoji).join(" ");
            if (tapped.length === pattern.length) {
              const ok = tapped.every((v, i) => v === pattern[i]);
              if (ok) {
                locked = true;
                UI.feedback(p, true, "節奏啱！小恐龍跳起舞 💃");
                doneRound(true);
              } else {
                UI.feedback(p, false, "唔啱，再聽示範～");
                tapped.length = 0;
                hint.textContent = labels;
              }
            }
          };
          row.appendChild(b);
        });
        p.appendChild(row);
      }, onComplete);
    }
  };
})();
