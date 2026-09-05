/**
 * Shared UI helpers for zone mini-games.
 * Each game exports window.DinoGames[id] = { title, emoji, rounds, start(panel, onComplete) }
 */
window.DinoGames = window.DinoGames || {};
window.GamesUI = {
  clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },

  prompt(panel, text) {
    const p = document.createElement("p");
    p.className = "game-prompt";
    p.textContent = text;
    panel.appendChild(p);
    return p;
  },

  feedback(panel, ok, msg) {
    let f = panel.querySelector(".feedback");
    if (!f) {
      f = document.createElement("div");
      f.className = "feedback";
      panel.appendChild(f);
    }
    f.className = "feedback " + (ok ? "ok" : "bad");
    f.textContent = msg;
    return f;
  },

  choiceGrid(panel, items, cols, onPick) {
    const grid = document.createElement("div");
    grid.className = "choice-grid" + (cols === 3 ? " cols-3" : "");
    items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.dataset.i = String(i);
      if (item.emoji) {
        const big = document.createElement("span");
        big.className = "big";
        big.textContent = item.emoji;
        btn.appendChild(big);
      }
      if (item.label) {
        const lab = document.createElement("span");
        lab.textContent = item.label;
        btn.appendChild(lab);
      }
      btn.addEventListener("click", () => onPick(i, btn, grid));
      grid.appendChild(btn);
    });
    panel.appendChild(grid);
    return grid;
  },

  /** Run N rounds; each roundFactory(roundIndex, panel, doneRound) */
  runRounds(panel, total, roundFactory, onAllDone) {
    let round = 0;
    const dotsHost = panel.parentElement && panel.parentElement.querySelector(".round-dots");

    const paintDots = () => {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const s = document.createElement("span");
        if (i < round) s.className = "ok";
        else if (i === round) s.className = "on";
        dotsHost.appendChild(s);
      }
    };

    const next = () => {
      if (round >= total) {
        onAllDone();
        return;
      }
      paintDots();
      this.clear(panel);
      const cheer = document.createElement('div');
      cheer.className = 'in-game-buddy';
      cheer.innerHTML = '<img src="img/buddy.gif" alt="恐龍同探險小朋友" /><div class="buddy-say">恐龍同探險小隊陪住你，加油！</div>';
      panel.appendChild(cheer);
      roundFactory(round, panel, (ok) => {
        if (!ok) {
          // stay on same round; roundFactory should re-enable
          return;
        }
        round += 1;
        setTimeout(next, 650);
      });
    };
    next();
  },

  speak(text, lang) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (_) { /* ignore */ }
  },

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
};
