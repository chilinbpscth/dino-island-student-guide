/** 寫字石板 — canvas / dot-trace 山水愛 */
(function () {
  const UI = window.GamesUI;
  const CHARS = [
    { char: "山", dots: [[0.5,0.18],[0.22,0.72],[0.5,0.55],[0.78,0.72]] },
    { char: "水", dots: [[0.5,0.2],[0.5,0.55],[0.28,0.42],[0.72,0.42],[0.25,0.78],[0.75,0.78]] },
    { char: "愛", dots: [[0.5,0.15],[0.35,0.35],[0.65,0.35],[0.5,0.5],[0.3,0.7],[0.7,0.7],[0.5,0.85]] }
  ];

  function drawGuide(ctx, w, h, charObj) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#F6F3EC";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#c5d4cb";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(20,107,77,0.12)";
    ctx.font = "bold " + Math.floor(w * 0.55) + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charObj.char, w / 2, h / 2);
    charObj.dots.forEach((d, i) => {
      const x = d[0] * w, y = d[1] * h;
      ctx.beginPath();
      ctx.fillStyle = "#b8923a";
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(String(i + 1), x, y + 1);
    });
  }

  window.DinoGames.write = {
    title: "寫字石板",
    emoji: "✍️",
    rounds: 3,
    start(panel, onComplete) {
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const charObj = CHARS[ri % CHARS.length];
        UI.prompt(p, "跟住金色點，寫「" + charObj.char + "」照顧小恐龍～");
        const wrap = document.createElement("div");
        wrap.className = "trace-wrap";
        const canvas = document.createElement("canvas");
        canvas.id = "traceCanvas";
        canvas.width = 320;
        canvas.height = 320;
        wrap.appendChild(canvas);
        const tools = document.createElement("div");
        tools.className = "trace-tools";
        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "ghost";
        clearBtn.textContent = "清除";
        const okBtn = document.createElement("button");
        okBtn.type = "button";
        okBtn.className = "secondary";
        okBtn.textContent = "寫好啦 ✓";
        tools.appendChild(clearBtn);
        tools.appendChild(okBtn);
        wrap.appendChild(tools);
        p.appendChild(wrap);

        const ctx = canvas.getContext("2d");
        let drawing = false;
        let ink = 0;
        const hit = new Array(charObj.dots.length).fill(false);

        function redraw() {
          drawGuide(ctx, canvas.width, canvas.height, charObj);
        }
        redraw();

        function pos(e) {
          const r = canvas.getBoundingClientRect();
          const t = e.touches ? e.touches[0] : e;
          return {
            x: ((t.clientX - r.left) / r.width) * canvas.width,
            y: ((t.clientY - r.top) / r.height) * canvas.height
          };
        }

        function checkHits(x, y) {
          charObj.dots.forEach((d, i) => {
            const dx = x - d[0] * canvas.width;
            const dy = y - d[1] * canvas.height;
            if (dx * dx + dy * dy < 28 * 28) hit[i] = true;
          });
        }

        function startDraw(e) {
          e.preventDefault();
          drawing = true;
          const pt = pos(e);
          ctx.strokeStyle = "#146b4d";
          ctx.lineWidth = 8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          checkHits(pt.x, pt.y);
        }
        function moveDraw(e) {
          if (!drawing) return;
          e.preventDefault();
          const pt = pos(e);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ink++;
          checkHits(pt.x, pt.y);
        }
        function endDraw() { drawing = false; }

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", moveDraw);
        canvas.addEventListener("mouseup", endDraw);
        canvas.addEventListener("mouseleave", endDraw);
        canvas.addEventListener("touchstart", startDraw, { passive: false });
        canvas.addEventListener("touchmove", moveDraw, { passive: false });
        canvas.addEventListener("touchend", endDraw);

        clearBtn.onclick = () => {
          ink = 0;
          hit.fill(false);
          redraw();
          UI.feedback(p, false, "");
        };
        okBtn.onclick = () => {
          const covered = hit.filter(Boolean).length;
          const need = Math.ceil(charObj.dots.length * 0.6);
          if (ink > 15 && covered >= need) {
            UI.feedback(p, true, "太靚字！小恐龍好開心 💚");
            doneRound(true);
          } else {
            UI.feedback(p, false, "試下跟住金色點寫多啲～");
            doneRound(false);
          }
        };
      }, onComplete);
    }
  };
})();
