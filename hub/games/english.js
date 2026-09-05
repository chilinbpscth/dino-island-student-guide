/** 導賞音箱 — SpeechSynthesis en + tap picture */
(function () {
  const UI = window.GamesUI;
  const ITEMS = [
    { word: "egg", emoji: "🥚", label: "egg" },
    { word: "water", emoji: "💧", label: "water" },
    { word: "leaf", emoji: "🍃", label: "leaf" },
    { word: "sun", emoji: "☀️", label: "sun" },
    { word: "friend", emoji: "🤝", label: "friend" },
    { word: "nest", emoji: "🪺", label: "nest" }
  ];

  window.DinoGames.english = {
    title: "導賞音箱",
    emoji: "🔊",
    rounds: 3,
    start(panel, onComplete) {
      const deck = UI.shuffle(ITEMS);
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const target = deck[ri % deck.length];
        const distractors = UI.shuffle(ITEMS.filter((x) => x.word !== target.word)).slice(0, 3);
        const choices = UI.shuffle([target, ...distractors]);
        UI.prompt(p, "聽英文，撳正確圖片照顧小恐龍！");
        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "speak-btn";
        speakBtn.textContent = "🔊 聽：「" + target.word + "」";
        speakBtn.onclick = () => UI.speak(target.word, "en-US");
        p.appendChild(speakBtn);
        UI.speak(target.word, "en-US");
        let locked = false;
        UI.choiceGrid(p, choices, 2, (i, btn, grid) => {
          if (locked) return;
          const pick = choices[i];
          if (pick.word === target.word) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, "Great! " + target.word + " ✓");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再聽一次啦～");
            UI.speak(target.word, "en-US");
          }
        });
      }, onComplete);
    }
  };
})();
