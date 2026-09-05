/** 餵食數數 — 幾種食物混一碟，數指定嗰種（約 1–5） */
(function () {
  const UI = window.GamesUI;
  const FOODS = [
    { id: "apple", emoji: "🍎", name: "蘋果" },
    { id: "leaf", emoji: "🥬", name: "菜葉" },
    { id: "berry", emoji: "🫐", name: "漿果" },
    { id: "corn", emoji: "🌽", name: "粟米" },
    { id: "fish", emoji: "🐟", name: "小魚" }
  ];

  function buildPlate(kinds) {
    // kinds: [{food, count}]
    const bag = [];
    kinds.forEach((k) => {
      for (let i = 0; i < k.count; i++) bag.push(k.food);
    });
    return UI.shuffle(bag);
  }

  window.DinoGames.math = {
    title: "餵食數數",
    emoji: "🥗",
    rounds: 3,
    start(panel, onComplete) {
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        // 每關揀 3 種食物，每種 1–5 件，問其中一種有幾多
        const trio = UI.shuffle(FOODS).slice(0, 3);
        const counts = trio.map((f) => ({
          food: f,
          count: UI.randInt(1, 5)
        }));
        // 確保唔會全部一樣多，減低亂估
        if (counts[0].count === counts[1].count && counts[1].count === counts[2].count) {
          counts[0].count = Math.min(5, counts[0].count + 1);
        }
        const ask = counts[UI.randInt(0, 2)];
        const plate = buildPlate(counts);

        UI.prompt(
          p,
          "小恐龍肚餓啦！碟入面有三種食物。\n數吓有幾多「" + ask.food.name + "」" + ask.food.emoji + "？"
        );

        const tray = document.createElement("div");
        tray.className = "food-tray";
        tray.setAttribute("role", "img");
        tray.setAttribute(
          "aria-label",
          counts.map((c) => c.count + "個" + c.food.name).join("，")
        );
        plate.forEach((f) => {
          const span = document.createElement("span");
          span.className = "food-bit";
          span.textContent = f.emoji;
          tray.appendChild(span);
        });
        p.appendChild(tray);

        const legend = document.createElement("p");
        legend.className = "hint";
        legend.style.textAlign = "center";
        legend.textContent = counts
          .map((c) => c.food.emoji + c.food.name)
          .join("　");
        p.appendChild(legend);

        const nums = new Set([ask.count]);
        while (nums.size < 4) nums.add(UI.randInt(1, 5));
        const opts = UI.shuffle([...nums]).map((v) => ({
          label: String(v) + " 隻",
          value: v
        }));

        let locked = false;
        UI.choiceGrid(p, opts, 2, (i, btn) => {
          if (locked) return;
          if (opts[i].value === ask.count) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(
              p,
              true,
              "數得啱！有 " + ask.count + " 隻" + ask.food.name + "，餵飽小恐龍 💚"
            );
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再慢慢數「" + ask.food.name + "」～");
          }
        });
      }, onComplete);
    }
  };
})();
