/** 天氣小屋 — weather → care */
(function () {
  const UI = window.GamesUI;
  const SCENES = [
    { weather: "☀️ 大太陽", need: "水", emoji: "💧", why: "好熱，要飲水！" },
    { weather: "🌧️ 落大雨", need: "遮擋", emoji: "☂️", why: "淋濕會凍親" },
    { weather: "❄️ 凍冰冰", need: "保暖", emoji: "🧣", why: "要保暖先舒服" },
    { weather: "💨 大風", need: "避風", emoji: "🏠", why: "返巢避風最安全" },
    { weather: "🌫️ 大霧", need: "慢行", emoji: "🐢", why: "睇唔清，慢慢行" }
  ];
  const ALL_CARE = [
    { label: "水", emoji: "💧" },
    { label: "遮擋", emoji: "☂️" },
    { label: "保暖", emoji: "🧣" },
    { label: "避風", emoji: "🏠" },
    { label: "慢行", emoji: "🐢" },
    { label: "跑步", emoji: "🏃" }
  ];

  window.DinoGames.weather = {
    title: "天氣小屋",
    emoji: "⛅",
    rounds: 3,
    start(panel, onComplete) {
      const deck = UI.shuffle(SCENES);
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const s = deck[ri % deck.length];
        UI.prompt(p, "而家天氣係：" + s.weather + "\n小恐龍需要咩照顧？");
        const choices = UI.shuffle(
          ALL_CARE.filter((c) => c.label === s.need || Math.random() > 0.3)
        ).slice(0, 4);
        if (!choices.find((c) => c.label === s.need)) {
          choices[0] = { label: s.need, emoji: s.emoji };
        }
        const opts = UI.shuffle(choices);
        let locked = false;
        UI.choiceGrid(p, opts, 2, (i, btn) => {
          if (locked) return;
          if (opts[i].label === s.need) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, s.why + " ✓");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再諗下天氣同需要～");
          }
        });
      }, onComplete);
    }
  };
})();
