/** 數蛋站 — count / compare 1–10 */
(function () {
  const UI = window.GamesUI;

  window.DinoGames.math = {
    title: "數蛋站",
    emoji: "🥚",
    rounds: 3,
    start(panel, onComplete) {
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        let locked = false;
        if (ri % 2 === 0) {
          const n = UI.randInt(3, 9);
          UI.prompt(p, "巢裏面有幾多隻蛋？");
          const show = document.createElement("div");
          show.style.cssText =
            "text-align:center;font-size:2rem;margin-bottom:1rem;line-height:1.4;";
          show.textContent = "🥚".repeat(n);
          p.appendChild(show);
          const nums = new Set([n]);
          while (nums.size < 4) nums.add(UI.randInt(1, 10));
          const opts = UI.shuffle([...nums]).map((v) => ({ label: String(v), value: v }));
          UI.choiceGrid(p, opts, 2, (i, btn) => {
            if (locked) return;
            if (opts[i].value === n) {
              locked = true;
              btn.classList.add("correct");
              UI.feedback(p, true, "數得啱！💚");
              doneRound(true);
            } else {
              btn.classList.add("wrong");
              UI.feedback(p, false, "再數一次～");
            }
          });
        } else {
          const a = UI.randInt(2, 8);
          const b = UI.randInt(1, 9);
          UI.prompt(p, "邊邊蛋多啲？");
          const show = document.createElement("div");
          show.style.cssText =
            "text-align:center;font-size:1.6rem;margin-bottom:1rem;line-height:1.5;";
          show.textContent = "左：" + "🥚".repeat(a) + "　右：" + "🥚".repeat(b);
          p.appendChild(show);
          let ans = "一樣多";
          if (a > b) ans = "左邊多";
          else if (b > a) ans = "右邊多";
          const choices = [
            { label: "左邊多", emoji: "👈" },
            { label: "右邊多", emoji: "👉" },
            { label: "一樣多", emoji: "🤝" }
          ];
          UI.choiceGrid(p, choices, 3, (i, btn) => {
            if (locked) return;
            if (choices[i].label === ans) {
              locked = true;
              btn.classList.add("correct");
              UI.feedback(p, true, "比較啱！✓");
              doneRound(true);
            } else {
              btn.classList.add("wrong");
              UI.feedback(p, false, "再睇清楚～");
            }
          });
        }
      }, onComplete);
    }
  };
})();
