/** 寫字石板 — 《香港小學學習字詞表》常用字＋正確筆順描寫 */
(function () {
  const UI = window.GamesUI;
  // 筆畫／中線資料源自 Make Me a Hanzi（與教育局字詞表筆順示範一致之常用字形）
  // 用字：第一學習階段常見獨體字，主題扣「照顧恐龍島」
  const STROKE_DATA = {"山":{"strokes":["M 536 209 Q 546 407 552 587 Q 556 633 562 664 Q 569 691 574 710 Q 578 723 554 740 Q 512 762 484 767 Q 465 771 456 760 Q 447 751 457 734 Q 488 688 489 655 Q 499 444 488 200 C 487 170 534 179 536 209 Z","M 796 244 Q 657 232 536 209 L 488 200 Q 379 182 284 155 Q 256 148 263 180 Q 267 253 272 329 Q 275 357 263 373 Q 220 416 190 409 Q 178 403 188 382 Q 224 309 215 236 Q 211 166 182 133 Q 161 112 170 96 Q 183 78 203 66 Q 219 57 230 67 Q 243 83 283 99 Q 440 151 606 182 Q 757 210 789 197 C 819 193 826 247 796 244 Z","M 789 197 Q 783 166 774 145 Q 756 118 785 55 Q 795 36 809 49 Q 837 73 846 173 Q 868 386 890 427 Q 900 443 889 460 Q 867 479 831 501 Q 816 510 802 503 Q 793 499 796 484 Q 823 435 796 244 L 789 197 Z"],"medians":[[[472,748],[525,700],[514,235],[493,208]],[[196,398],[217,379],[239,340],[243,263],[233,126],[282,127],[380,155],[575,197],[710,218],[772,221],[788,237]],[[810,490],[826,477],[849,433],[798,57]]]},"水":{"strokes":["M 535 506 Q 538 699 560 762 Q 578 793 520 817 Q 486 836 465 830 Q 447 823 463 799 Q 485 771 486 736 Q 490 697 478 121 Q 477 97 463 88 Q 454 81 432 88 Q 407 94 382 99 Q 348 111 351 100 Q 352 93 373 78 Q 440 24 457 -5 Q 476 -41 493 -42 Q 508 -43 524 -7 Q 543 41 541 117 Q 531 294 534 470 L 535 506 Z","M 154 501 Q 141 501 139 492 Q 138 485 153 477 Q 199 452 227 461 Q 333 489 343 489 Q 359 486 347 456 Q 296 326 249 262 Q 201 190 114 119 Q 99 106 110 103 Q 120 102 141 113 Q 217 153 281 224 Q 342 288 419 454 Q 429 478 441 489 Q 456 501 447 511 Q 437 524 399 537 Q 378 549 336 530 Q 270 509 154 501 Z","M 590 446 Q 630 476 766 584 Q 787 603 814 615 Q 838 627 825 647 Q 809 666 779 681 Q 752 696 738 692 Q 723 691 729 675 Q 735 639 659 553 Q 620 508 577 459 C 557 436 566 428 590 446 Z","M 577 459 Q 555 484 535 506 C 515 528 516 494 534 470 Q 756 161 817 160 Q 898 169 967 175 Q 995 178 996 185 Q 997 192 964 205 Q 810 253 753 295 Q 690 346 590 446 L 577 459 Z"],"medians":[[[473,814],[500,795],[521,770],[508,455],[507,91],[485,42],[442,56],[371,91],[369,98],[358,98]],[[147,491],[209,482],[354,512],[381,505],[392,495],[384,459],[353,387],[280,261],[187,160],[113,110]],[[737,682],[750,671],[766,637],[721,583],[591,461],[590,452]],[[539,500],[550,465],[618,387],[729,271],[782,229],[820,207],[990,185]]]},"木":{"strokes":["M 524 533 Q 537 536 755 560 Q 768 557 779 573 Q 780 586 754 600 Q 709 627 634 603 Q 526 582 524 580 L 479 572 Q 404 563 234 546 Q 200 542 226 521 Q 265 491 291 494 Q 309 503 446 521 L 524 533 Z","M 524 580 Q 524 682 544 758 Q 559 783 532 802 Q 516 814 485 833 Q 460 851 439 834 Q 433 828 440 813 Q 474 762 476 711 Q 477 647 479 572 L 477 458 Q 474 208 466 155 Q 442 46 456 5 Q 460 -7 466 -21 Q 473 -40 481 -43 Q 488 -50 495 -41 Q 504 -37 514 -15 Q 524 10 523 44 Q 522 90 523 480 L 524 580 Z","M 446 521 Q 368 337 127 132 Q 114 119 124 117 Q 134 113 146 119 Q 276 176 403 344 Q 472 450 477 458 C 528 538 464 563 446 521 Z","M 523 480 Q 607 338 716 186 Q 737 159 774 157 Q 901 147 942 150 Q 954 151 957 157 Q 957 164 941 173 Q 773 251 721 302 Q 628 398 523 532 Q 523 533 524 533 L 524 533 C 506 558 508 506 523 480 Z"],"medians":[[[228,534],[280,522],[695,584],[728,584],[766,574]],[[453,825],[506,771],[498,218],[486,-29]],[[474,519],[459,504],[447,460],[404,389],[332,297],[244,206],[179,154],[130,124]],[[528,513],[549,470],[641,344],[749,220],[789,200],[951,159]]]}};
  const LESSONS = [
    { char: '山', tip: '島上有山：跟筆順寫「山」', meaning: '山' },
    { char: '水', tip: '俾小恐龍飲水：跟筆順寫「水」', meaning: '水' },
    { char: '木', tip: '摘樹葉餵龍：跟筆順寫「木」', meaning: '木' }
  ];

  function mapPt(pt, size, pad) {
    const s = size - pad * 2;
    return {
      x: pad + (pt[0] / 1024) * s,
      y: pad + (pt[1] / 1024) * s
    };
  }

  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** makemeahanzi 中線有時方向反；直筆改成上→下，橫筆左→右（幼兒筆順） */
  function normalizeMedian(med) {
    if (!med || med.length < 2) return (med || []).slice();
    const a = med[0], b = med[med.length - 1];
    const dx = Math.abs(b[0] - a[0]);
    const dy = Math.abs(b[1] - a[1]);
    let out = med.slice();
    if (dy >= dx) {
      // 直筆／斜直：畫面 y 愈大愈下面 → 起點應較上（y 較細）
      if (a[1] > b[1]) out = out.slice().reverse();
    } else {
      // 橫筆：左 → 右
      if (a[0] > b[0]) out = out.slice().reverse();
    }
    return out;
  }

  window.DinoGames.write = {
    title: '寫字石板',
    emoji: '✍️',
    rounds: 3,
    start(panel, onComplete) {
      UI.runRounds(panel, 3, (ri, p, doneRound) => {
        const lesson = LESSONS[ri % LESSONS.length];
        const raw0 = STROKE_DATA[lesson.char];
        if (!raw0) {
          UI.prompt(p, '搵唔到「' + lesson.char + '」筆順資料');
          doneRound(false);
          return;
        }
        const raw = {
          strokes: raw0.strokes,
          medians: raw0.medians.map(normalizeMedian)
        };

        UI.prompt(p, lesson.tip + '（第 ' + (ri + 1) + '／3 字 · 由「起」寫到「止」）');

        const say = p.querySelector('.buddy-say');
        if (say) say.textContent = '跟金色線，由「起」寫到「止」（直筆由上寫落）！';

        const wrap = document.createElement('div');
        wrap.className = 'trace-wrap';
        const meta = document.createElement('div');
        meta.style.cssText = 'text-align:center;font-weight:800;color:#146b4d;margin-bottom:8px;font-size:18px';
        meta.textContent = '而家寫第 1／' + raw.medians.length + ' 筆（上→下／左→右）';
        wrap.appendChild(meta);

        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
        canvas.style.touchAction = 'none';
        wrap.appendChild(canvas);

        const tools = document.createElement('div');
        tools.className = 'trace-tools';
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'ghost';
        clearBtn.textContent = '重寫呢一筆';
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'secondary';
        okBtn.textContent = '呢一筆寫好啦 ✓';
        tools.appendChild(clearBtn);
        tools.appendChild(okBtn);
        wrap.appendChild(tools);
        const skipHint = document.createElement('div');
        skipHint.style.cssText = 'width:100%;text-align:center;font-size:13px;color:#60756d;margin-top:6px';
        skipHint.textContent = '來源：香港小學學習字詞表常用字 · 正確筆順';
        wrap.appendChild(skipHint);
        p.appendChild(wrap);

        const ctx = canvas.getContext('2d');
        const pad = 28;
        const size = canvas.width;
        let strokeIndex = 0;
        let hitMask = [];
        let drawing = false;
        let inkStroke = [];

        function medianPts(si) {
          return raw.medians[si].map((pt) => mapPt(pt, size, pad));
        }

        function resetStrokeProgress() {
          const pts = medianPts(strokeIndex);
          hitMask = new Array(pts.length).fill(false);
          inkStroke = [];
        }

        function drawFrame(userPath) {
          ctx.clearRect(0, 0, size, size);
          ctx.fillStyle = '#F6F3EC';
          ctx.fillRect(0, 0, size, size);
          ctx.strokeStyle = '#c5d4cb';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(pad / 2, pad / 2, size - pad, size - pad);
          ctx.beginPath();
          ctx.moveTo(size / 2, pad / 2);
          ctx.lineTo(size / 2, size - pad / 2);
          ctx.moveTo(pad / 2, size / 2);
          ctx.lineTo(size - pad / 2, size / 2);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.strokeStyle = 'rgba(20,107,77,0.18)';
          ctx.lineWidth = 14;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          raw.medians.forEach((med) => {
            const pts = med.map((pt) => mapPt(pt, size, pad));
            ctx.beginPath();
            pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
          });

          ctx.strokeStyle = '#146b4d';
          ctx.lineWidth = 12;
          for (let si = 0; si < strokeIndex; si++) {
            const pts = medianPts(si);
            ctx.beginPath();
            pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
          }

          if (strokeIndex < raw.medians.length) {
            const pts = medianPts(strokeIndex);
            ctx.strokeStyle = '#b8923a';
            ctx.lineWidth = 10;
            ctx.setLineDash([10, 8]);
            ctx.beginPath();
            pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
            ctx.setLineDash([]);
            // 起 = 筆順起點（上方／左方），止 = 終點
            [[pts[0], '起'], [pts[pts.length - 1], '止']].forEach(([pt, label], idx) => {
              ctx.beginPath();
              ctx.fillStyle = idx === 0 ? '#b8923a' : '#146b4d';
              ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 12px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, pt.x, pt.y + 1);
            });
          }

          if (userPath && userPath.length > 1) {
            ctx.strokeStyle = '#0d4f38';
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.beginPath();
            userPath.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
          }
        }

        function coveredRatio() {
          const n = hitMask.length || 1;
          return hitMask.filter(Boolean).length / n;
        }

        function markHits(pt) {
          const pts = medianPts(strokeIndex);
          const thresh = 44;
          pts.forEach((m, i) => {
            if (dist(pt, m) < thresh) hitMask[i] = true;
          });
        }

        function directionOk() {
          const pts = medianPts(strokeIndex);
          if (inkStroke.length < 2 || pts.length < 2) return true;
          const nearStart = hitMask.slice(0, Math.max(1, Math.ceil(pts.length * 0.3))).some(Boolean);
          const nearEnd = hitMask.slice(Math.floor(pts.length * 0.7)).some(Boolean);
          return nearStart && nearEnd;
        }

        function finishStrokeOrChar() {
          if (coveredRatio() < 0.35 || !directionOk()) {
            UI.feedback(p, false, '由金色「起」寫去「止」～（直筆由上寫落）');
            return false;
          }
          strokeIndex++;
          if (strokeIndex >= raw.medians.length) {
            UI.feedback(p, true, '筆順啱！「' + lesson.char + '」寫得好好 💚');
            meta.textContent = '完成「' + lesson.char + '」全部 ' + raw.medians.length + ' 筆';
            drawFrame([]);
            doneRound(true);
            return true;
          }
          meta.textContent = '而家寫第 ' + (strokeIndex + 1) + '／' + raw.medians.length + ' 筆（上→下／左→右）';
          resetStrokeProgress();
          drawFrame([]);
          UI.feedback(p, true, '第 ' + strokeIndex + ' 筆 OK，繼續下一筆');
          return true;
        }

        resetStrokeProgress();
        drawFrame([]);

        function pos(e) {
          const r = canvas.getBoundingClientRect();
          const src = (e.touches && e.touches[0]) ? e.touches[0] : e;
          return {
            x: ((src.clientX - r.left) / r.width) * canvas.width,
            y: ((src.clientY - r.top) / r.height) * canvas.height
          };
        }

        function startDraw(e) {
          if (strokeIndex >= raw.medians.length) return;
          e.preventDefault();
          if (canvas.setPointerCapture && e.pointerId != null) {
            try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
          }
          drawing = true;
          inkStroke = [pos(e)];
          markHits(inkStroke[0]);
          drawFrame(inkStroke);
        }
        function moveDraw(e) {
          if (!drawing) return;
          e.preventDefault();
          const pt = pos(e);
          inkStroke.push(pt);
          markHits(pt);
          drawFrame(inkStroke);
        }
        function endDraw() {
          if (!drawing) return;
          drawing = false;
          if (coveredRatio() >= 0.35 && directionOk() && inkStroke.length > 3) {
            finishStrokeOrChar();
          } else {
            UI.feedback(p, false, '再由「起」寫到「止」清楚啲');
            inkStroke = [];
            hitMask = hitMask.map(() => false);
            drawFrame([]);
          }
        }

        canvas.addEventListener('pointerdown', startDraw);
        canvas.addEventListener('pointermove', moveDraw);
        canvas.addEventListener('pointerup', endDraw);
        canvas.addEventListener('pointercancel', endDraw);

        clearBtn.onclick = () => {
          inkStroke = [];
          resetStrokeProgress();
          drawFrame([]);
          UI.feedback(p, false, '');
        };
        okBtn.onclick = () => {
          if (strokeIndex >= raw.medians.length) return;
          finishStrokeOrChar();
        };
      }, onComplete);
    }
  };
})();
