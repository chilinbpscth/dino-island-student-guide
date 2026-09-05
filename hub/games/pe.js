/** 熱身草地 — parent taps「做到啦」 */
(function () {
  const UI = window.GamesUI;
  const MOVES = [
    { title: "伸懶腰", emoji: "🙆", desc: "雙手向上伸，數到 5" },
    { title: "踏步跑", emoji: "🏃", desc: "原地踏步 10 下" },
    { title: "輕輕跳", emoji: "🦘", desc: "雙腳輕輕跳 5 下" },
    { title: "轉圓圈", emoji: "🌀", desc: "慢慢轉一圈（小心周圍）" },
    { title: "拍手操", emoji: "👏", desc: "頭上拍手 8 下" }
  ];

  window.DinoGames.pe = {
    title: "熱身草地",
    emoji: "🏃",
    rounds: 2,
    start(panel, onComplete) {
      const deck = UI.shuffle(MOVES);
      UI.runRounds(panel, 2, (ri, p, doneRound) => {
        const m = deck[ri % deck.length];
        UI.prompt(p, "同家長一齊做動作，做完撳「做到啦」！");
        const box = document.createElement("div");
        box.className = "pe-big";
        const moves = document.createElement("div");
        moves.className = "moves";
        moves.innerHTML = m.emoji + "<br/>" + m.title;
        const hint = document.createElement("p");
        hint.className = "hint";
        hint.textContent = m.desc;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "done-btn secondary";
        btn.textContent = "做到啦！✓";
        btn.onclick = () => {
          UI.feedback(p, true, "好嘢！身體暖晒啦 🔥");
          doneRound(true);
        };
        box.appendChild(moves);
        box.appendChild(hint);
        box.appendChild(btn);
        p.appendChild(box);
      }, onComplete);
    }
  };
})();
