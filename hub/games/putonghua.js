/** 普通話站 — SpeechSynthesis zh-CN + tap picture */
(function () {
  const UI = window.GamesUI;
  const ITEMS = [
    { word: "恐龙", emoji: "🦕", label: "恐龍" },
    { word: "下雨", emoji: "🌧️", label: "下雨" },
    { word: "朋友", emoji: "💛", label: "朋友" },
    { word: "苹果", emoji: "🍎", label: "蘋果" },
    { word: "睡觉", emoji: "😴", label: "睡覺" },
    { word: "走路", emoji: "👣", label: "走路" }
  ];

  window.DinoGames.putonghua = {
    title: "普通話站",
    emoji: "🗣️",
    rounds: 3,
    start(panel, onComplete) {
      const deck = UI.shuffle(ITEMS);
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const target = deck[ri % deck.length];
        const distractors = UI.shuffle(ITEMS.filter((x) => x.word !== target.word)).slice(0, 3);
        const choices = UI.shuffle([target, ...distractors]);
        UI.prompt(p, "聽普通話，撳正確圖片！");
        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "speak-btn";
        speakBtn.textContent = "🔊 聽一聽";
        speakBtn.onclick = () => UI.speak(target.word, "zh-CN");
        p.appendChild(speakBtn);
        UI.speak(target.word, "zh-CN");
        let locked = false;
        UI.choiceGrid(p, choices, 2, (i, btn) => {
          if (locked) return;
          if (choices[i].word === target.word) {
            locked = true;
            btn.classList.add("correct");
            UI.feedback(p, true, "真棒！「" + target.label + "」✓");
            doneRound(true);
          } else {
            btn.classList.add("wrong");
            UI.feedback(p, false, "再聽一次～");
            UI.speak(target.word, "zh-CN");
          }
        });
      }, onComplete);
    }
  };
})();
