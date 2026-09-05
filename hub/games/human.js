/** 友情樹洞 — kind action */
(function () {
  const UI = window.GamesUI;
  const SCENES = [
    {
      q: "有隻小恐龍跌倒喊緊，你會？",
      good: "扶起佢同安慰",
      options: [
        { label: "扶起佢同安慰", emoji: "🤗" },
        { label: "笑佢蠢", emoji: "😜" },
        { label: "當睇唔到", emoji: "🙈" },
        { label: "推多佢一推", emoji: "😤" }
      ]
    },
    {
      q: "朋友想一齊玩滾球，但得一個球，你會？",
      good: "輪流玩／一齊玩",
      options: [
        { label: "輪流玩／一齊玩", emoji: "🤝" },
        { label: "自己獨玩", emoji: "😤" },
        { label: "搶走走佬", emoji: "🏃" },
        { label: "話佢唔準玩", emoji: "🚫" }
      ]
    },
    {
      q: "有人講「多謝你」，你最好點回應？",
      good: "講「唔使客氣」同微笑",
      options: [
        { label: "講「唔使客氣」同微笑", emoji: "😊" },
        { label: "轉頭走人", emoji: "🚶" },
        { label: "大聲鬧佢", emoji: "😠" },
        { label: "扮聽唔到", emoji: "🙉" }
      ]
    },
    {
      q: "排隊等水喝，你會？",
      good: "排好隊等",
      options: [
        { label: "排好隊等", emoji: "🧍" },
        { label: "插隊", emoji: "⚡" },
        { label: "推開前面嘅人", emoji: "💥" },
        { label: "搶水杯", emoji: "🫢" }
      ]
    }
  ];

  window.DinoGames.human = {
    title: "友情樹洞",
    emoji: "🌳",
    rounds: 3,
    start(panel, onComplete) {
      const deck = UI.shuffle(SCENES);
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const s = deck[ri % deck.length];
        UI.prompt(p, s.q);
        const opts = UI.shuffle(s.options.slice());
        let locked = false;
        UI.choiceGrid(p, opts, 2, (i, btn) => {
          if (locked) return;
          if (opts[i].label === s.good) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, "好有愛心！小恐龍交到朋友 💛");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "諗下點樣對朋友好啲～");
          }
        });
      }, onComplete);
    }
  };
})();
