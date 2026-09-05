/** 基地面板 — button sequence memory */
(function () {
  const UI = window.GamesUI;
  const KEYS = [
    { id: "A", emoji: "🟢", color: "#26734b" },
    { id: "B", emoji: "🟡", color: "#b8923a" },
    { id: "C", emoji: "🔵", color: "#3a7abf" },
    { id: "D", emoji: "🟠", color: "#c47a3a" },
    { id: "E", emoji: "🟣", color: "#7a4a9e" },
    { id: "F", emoji: "⚪", color: "#8a9a90" }
  ];

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  window.DinoGames.ict = {
    title: "基地面板",
    emoji: "🖥️",
    rounds: 2,
    start(panel, onComplete) {
      UI.runRounds(panel, 2, (ri, p, doneRound) => {
        const len = ri === 0 ? 3 : 4;
        const seq = [];
        for (let i = 0; i < len; i++) seq.push(KEYS[UI.randInt(0, 5)].id);

        UI.prompt(p, "記住閃燈次序，再開鎖！");
        const display = document.createElement("div");
        display.className = "seq-display";
        display.textContent = "準備…";
        p.appendChild(display);

        const pad = document.createElement("div");
        pad.className = "seq-pad";
        const btnMap = {};
        KEYS.forEach((k) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = k.emoji;
          b.style.background = k.color;
          b.disabled = true;
          btnMap[k.id] = b;
          pad.appendChild(b);
        });
        p.appendChild(pad);

        let input = [];
        let accepting = false;
        let locked = false;

        async function showSeq() {
          accepting = false;
          input = [];
          display.textContent = "睇清楚…";
          Object.values(btnMap).forEach((b) => (b.disabled = true));
          await sleep(500);
          for (const id of seq) {
            const b = btnMap[id];
            b.classList.add("lit");
            display.textContent = KEYS.find((k) => k.id === id).emoji;
            await sleep(550);
            b.classList.remove("lit");
            await sleep(220);
          }
          display.textContent = "輪到你！";
          Object.values(btnMap).forEach((b) => (b.disabled = false));
          accepting = true;
        }

        KEYS.forEach((k) => {
          btnMap[k.id].onclick = () => {
            if (!accepting || locked) return;
            input.push(k.id);
            display.textContent = input.map((id) => KEYS.find((x) => x.id === id).emoji).join("");
            btnMap[k.id].classList.add("lit");
            setTimeout(() => btnMap[k.id].classList.remove("lit"), 180);
            if (input.length === seq.length) {
              accepting = false;
              const ok = input.every((v, i) => v === seq[i]);
              if (ok) {
                locked = true;
                UI.feedback(p, true, "基地解鎖成功！🖥️");
                doneRound(true);
              } else {
                UI.feedback(p, false, "次序錯咗，再睇一次～");
                setTimeout(showSeq, 800);
              }
            }
          };
        });

        const replay = document.createElement("button");
        replay.type = "button";
        replay.className = "ghost";
        replay.textContent = "再睇示範";
        replay.style.display = "block";
        replay.style.margin = "1rem auto 0";
        replay.onclick = () => {
          if (!locked) showSeq();
        };
        p.appendChild(replay);
        showSeq();
      }, onComplete);
    }
  };
})();
