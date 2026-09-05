/** 小偵探 — clue → need */
(function () {
  const UI = window.GamesUI;
  const CASES = [
    { clue: "小恐龍張口喘气、行得好慢", need: "水", emoji: "💧", ok: "可能口渴！" },
    { clue: "肚仔咕咕叫", need: "食物", emoji: "🥬", ok: "要食葉添肚！" },
    { clue: "眼仔合埋、打呵欠", need: "休息", emoji: "😴", ok: "該瞓覺啦" },
    { clue: "腳趾卡住石罅", need: "幫忙", emoji: "🆘", ok: "要小心幫手鬆開" },
    { clue: "泥漿沾滿身", need: "清潔", emoji: "🛁", ok: "沖一沖先舒服" }
  ];
  const NEEDS = [
    { label: "水", emoji: "💧" },
    { label: "食物", emoji: "🥬" },
    { label: "休息", emoji: "😴" },
    { label: "幫忙", emoji: "🆘" },
    { label: "清潔", emoji: "🛁" },
    { label: "唱歌", emoji: "🎵" }
  ];

  window.DinoGames.science = {
    title: "小偵探",
    emoji: "🔍",
    rounds: 3,
    start(panel, onComplete) {
      const deck = UI.shuffle(CASES);
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const c = deck[ri % deck.length];
        UI.prompt(p, "線索：" + c.clue + "\n小恐龍需要咩？");
        let opts = UI.shuffle(NEEDS).slice(0, 4);
        if (!opts.find((o) => o.label === c.need)) opts[3] = { label: c.need, emoji: c.emoji };
        opts = UI.shuffle(opts);
        let locked = false;
        UI.choiceGrid(p, opts, 2, (i, btn) => {
          if (locked) return;
          if (opts[i].label === c.need) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, c.ok + " 🔎");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再睇線索～");
          }
        });
      }, onComplete);
    }
  };
})();
