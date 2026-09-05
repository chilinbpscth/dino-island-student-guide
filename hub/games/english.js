/** 導賞音箱 — 只聽英文，唔顯示答案詞；撳圖配對 */
(function () {
  const UI = window.GamesUI;
  // label 只喺答啱後回饋用，選項畫面只顯示 emoji
  const ITEMS = [
    { word: "egg", emoji: "🥚" },
    { word: "water", emoji: "💧" },
    { word: "leaf", emoji: "🍃" },
    { word: "sun", emoji: "☀️" },
    { word: "nest", emoji: "🪺" },
    { word: "apple", emoji: "🍎" }
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
        // 選項唔帶英文字，逼小朋友聽
        const choices = UI.shuffle([target, ...distractors]).map((x) => ({
          word: x.word,
          emoji: x.emoji
        }));
        UI.prompt(p, "撳喇叭聽英文，再揀啱嘅圖照顧小恐龍！（唔使識睇字）");
        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "speak-btn";
        speakBtn.textContent = "🔊 聽一聽";
        speakBtn.setAttribute("aria-label", "聽英文詞");
        speakBtn.onclick = () => UI.speak(target.word, "en-US");
        p.appendChild(speakBtn);
        UI.speak(target.word, "en-US");
        let locked = false;
        UI.choiceGrid(p, choices, 2, (i, btn) => {
          if (locked) return;
          const pick = choices[i];
          if (pick.word === target.word) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, "聽得啱！係 " + target.word + " ✓");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再撳喇叭聽一次～");
            UI.speak(target.word, "en-US");
          }
        });
      }, onComplete);
    }
  };
})();
