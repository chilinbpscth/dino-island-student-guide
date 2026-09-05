/** 石頭彩路 — color / shape */
(function () {
  const UI = window.GamesUI;
  const COLORS = [
    { id: "red", hex: "#c45c4a", label: "紅" },
    { id: "green", hex: "#146b4d", label: "綠" },
    { id: "gold", hex: "#b8923a", label: "金" },
    { id: "blue", hex: "#3a7abf", label: "藍" }
  ];
  const SHAPES = [
    { id: "circle", label: "圓", radius: "50%" },
    { id: "square", label: "方", radius: "8px" },
    { id: "tri", label: "▲", radius: "8px" }
  ];

  window.DinoGames.art = {
    title: "石頭彩路",
    emoji: "🎨",
    rounds: 2,
    start(panel, onComplete) {
      UI.runRounds(panel, 2, (ri, p, doneRound) => {
        if (ri === 0) {
          const target = COLORS[UI.randInt(0, COLORS.length - 1)];
          UI.prompt(p, "小恐龍想要「" + target.label + "」色石頭，撳正確顏色！");
          const sw = document.createElement("div");
          sw.className = "color-swatches";
          let locked = false;
          COLORS.forEach((c) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "swatch";
            b.style.background = c.hex;
            b.setAttribute("aria-label", c.label);
            b.onclick = () => {
              if (locked) return;
              if (c.id === target.id) {
                locked = true;
                b.classList.add("selected");
                UI.feedback(p, true, "顏色啱晒！🎨");
                doneRound(true);
              } else {
                UI.feedback(p, false, "唔係呢隻色～");
              }
            };
            sw.appendChild(b);
          });
          p.appendChild(sw);
        } else {
          const want = COLORS[UI.randInt(0, 2)];
          UI.prompt(p, "用「" + want.label + "」色填滿三粒石頭！（先揀色，再撳形狀）");
          let selected = null;
          const sw = document.createElement("div");
          sw.className = "color-swatches";
          COLORS.forEach((c) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "swatch";
            b.style.background = c.hex;
            b.onclick = () => {
              selected = c;
              sw.querySelectorAll(".swatch").forEach((x) => x.classList.remove("selected"));
              b.classList.add("selected");
            };
            sw.appendChild(b);
          });
          p.appendChild(sw);
          const targets = document.createElement("div");
          targets.className = "art-targets";
          const filled = [false, false, false];
          SHAPES.forEach((sh, idx) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "art-shape";
            b.textContent = sh.label;
            b.style.borderRadius = sh.radius;
            b.onclick = () => {
              if (!selected) {
                UI.feedback(p, false, "先揀上面嘅顏色～");
                return;
              }
              if (selected.id !== want.id) {
                UI.feedback(p, false, "要用「" + want.label + "」色呀～");
                return;
              }
              b.classList.add("filled");
              b.style.background = selected.hex;
              b.style.borderColor = selected.hex;
              filled[idx] = true;
              if (filled.every(Boolean)) {
                UI.feedback(p, true, "彩路完成！✨");
                doneRound(true);
              }
            };
            targets.appendChild(b);
          });
          p.appendChild(targets);
        }
      }, onComplete);
    }
  };
})();
