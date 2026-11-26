const questions = {
  emoji: [
    { clue: '👀 🫵 ↔️ 👀 🙋‍♀️', hint: '女團・歌詞反覆唱「look at you, now look at me」', answers: ['how you like that', 'blackpink'], display: 'BLACKPINK — How You Like That', difficulty: 'medium' },
    { clue: '🪜 🚪 🔝', hint: "女團・副歌唱著「I'm on the next level」", answers: ['next level', 'aespa'], display: 'aespa — Next Level', difficulty: 'easy' },
    { clue: '🧛‍♂️ 🌙 🩸', hint: '男團・命運與月亮的故事', answers: ['bite me', 'enhypen'], display: 'ENHYPEN — Bite Me', difficulty: 'medium' },
    { clue: '🍭 🫧 💗', hint: '女團・甜甜的氣泡糖概念', answers: ['bubble gum', 'newjeans'], display: 'NewJeans — Bubble Gum', difficulty: 'easy' },
    { clue: '🪩 🕺 🎷 ✨', hint: '男團・副歌唱著「light it up like dynamite」', answers: ['dynamite', 'bts'], display: 'BTS — Dynamite', difficulty: 'easy' },
    { clue: '🩷 🌹 ☠️', hint: '女團・副歌反覆唱著「pink venom」', answers: ['pink venom'], display: 'BLACKPINK — Pink Venom', difficulty: 'medium' }
  ],
  dance: [
    { clue: '招牌動作：食指與拇指比出手槍手勢，隨著副歌節奏指向鏡頭。', hint: '女團・2018 年推出的代表熱門曲', answers: ['ddu-du ddu-du', 'ddu du ddu du', 'blackpink'], display: 'BLACKPINK — 뚜두뚜두 (DDU-DU DDU-DU)', difficulty: 'medium' },
    { clue: '招牌動作：副歌群舞配合「불타오르네」的吶喊，動作俐落有力。', hint: '男團・英文歌名是「火」', answers: ['fire', 'bts'], display: 'BTS — FIRE', difficulty: 'easy' },
    { clue: '招牌動作：隊形隨著旋律流動變換，像一段愛情故事的起承轉合。', hint: '男團・歌名可以形容一段愛情故事', answers: ['love scenario', 'ikon'], display: 'iKON — LOVE SCENARIO', difficulty: 'medium' },
    { clue: '招牌動作：雙手在臉頰旁比出哭泣符號「TT」，做出委屈表情。', hint: '女團・歌名只有兩個英文字母', answers: ['tt', 'twice'], display: 'TWICE — TT', difficulty: 'easy' },
    { clue: '招牌動作：副歌先屈臂展現力量，再把手勢變成貓爪，配合「Anti-ti-ti fragile」的節奏。', hint: '女團・歌名形容不容易被擊垮', answers: ['antifragile'], display: 'LE SSERAFIM — ANTIFRAGILE', difficulty: 'hard' }
  ],
  mv: [
    { clue: 'MV 場景：成員穿梭在各自風格的華麗場景，最後在金色舞台齊舞。', hint: '女團・歌名是在說「感到特別」', answers: ['feel special', 'twice'], display: 'TWICE — Feel Special', difficulty: 'medium' },
    { clue: 'MV 場景：成員穿著紅黑制服，在行進樂隊與烈焰場景前列隊前進。', hint: '男團・歌名是一種「奇蹟」', answers: ['wonderland', 'ateez'], display: 'ATEEZ — WONDERLAND', difficulty: 'hard' },
    { clue: 'MV 場景：五位女孩在大片綠草與藍天前自在起舞，畫面明亮清爽。', hint: '女團・歌名是簡單的問候', answers: ['attention'], display: 'NewJeans — Attention', difficulty: 'easy' },
    { clue: 'MV 場景：手持攝影機記錄五位女孩的校園日常，MV 分成 Side A 與 Side B。', hint: '女團・歌名描述「我也一樣」', answers: ['ditto'], display: 'NewJeans — Ditto', difficulty: 'medium' },
    { clue: 'MV 場景：收到舞會邀請後準備赴約，接著在舞會場景唱歌跳舞。', hint: '女團・英文歌名是「那種心動的感覺」', answers: ['the feels'], display: 'TWICE — The Feels', difficulty: 'medium' }
  ]
};
document.querySelector('.emoji-preview').textContent = questions.emoji[0].clue;
let currentMode, currentQuestion, questionIndex = 0, hintLevel = 0, solved = false, score = 0, roundQuestions = [], roundComplete = false;
let returnFocus = null;
const modal = document.querySelector('#game-modal'), clue = document.querySelector('#question-clue'), feedback = document.querySelector('#feedback');
const normalize = value => value.trim().toLocaleLowerCase().replace(/[\s\-_.!?'’]/g, '');
function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
function start(mode) {
  if (modal.hidden) returnFocus = document.activeElement;
  resetRoundControls();
  currentMode = mode; score = 0; questionIndex = 0; roundComplete = false;
  roundQuestions = shuffle(questions[mode]);
  showQuestion(); modal.hidden = false; document.body.style.overflow = 'hidden'; document.querySelector('#answer-input').focus();
}
function showQuestion() {
  currentQuestion = roundQuestions[questionIndex]; hintLevel = 0; solved = false;
  document.querySelector('#round-status').textContent = `第 ${questionIndex + 1} / ${roundQuestions.length} 題 · 得分 ${score}`;
  const difficultyNames = { easy: '入門', medium: '進階', hard: '挑戰' };
  document.querySelector('#question-difficulty').textContent = `難度・${difficultyNames[currentQuestion.difficulty]}`;
  document.querySelector('#game-title').textContent = '猜猜這是哪首歌？';
  const names = { emoji: 'EMOJI', dance: 'DANCE MOVE', mv: 'MUSIC VIDEO' };
  document.querySelector('#modal-kicker').textContent = `ROUND ${String(questionIndex + 1).padStart(2, '0')} · ${names[currentMode]}`;
  clue.textContent = currentQuestion.clue; clue.classList.toggle('text-clue', currentMode !== 'emoji');
  document.querySelector('#artist-hint').textContent = '';
  document.querySelector('#answer-input').value = '';
  document.querySelector('#answer-input').disabled = false;
  feedback.textContent = ''; feedback.className = 'feedback';
  document.querySelector('#next-btn').hidden = true;
  document.querySelector('#next-btn').textContent = questionIndex === roundQuestions.length - 1 ? '查看結果 →' : '下一題 →';
}
document.querySelectorAll('.mode-card').forEach(card => card.addEventListener('click', () => start(card.dataset.mode)));
document.querySelector('#answer-form').addEventListener('submit', event => {
  event.preventDefault(); if (solved) return;
  const guess = normalize(document.querySelector('#answer-input').value);
  if (!guess) return;
  const accepted = currentQuestion.answers.some(answer => normalize(answer) === guess);
  if (accepted) { solved = true; score++; feedback.textContent = `猜對了！答案是 ${currentQuestion.display} 🎉`; feedback.className = 'feedback'; document.querySelector('#answer-input').disabled = true; document.querySelector('#next-btn').hidden = false; document.querySelector('#next-btn').focus(); document.querySelector('#round-status').textContent = `第 ${questionIndex + 1} / ${roundQuestions.length} 題 · 得分 ${score}`; }
  else { feedback.textContent = '再想一下，或試試提示吧！'; feedback.className = 'feedback wrong'; }
});
document.querySelector('#hint-btn').addEventListener('click', () => { hintLevel++; document.querySelector('#artist-hint').textContent = hintLevel === 1 ? `提示：${currentQuestion.hint}` : `歌名第一個字母：${currentQuestion.answers[0][0].toLocaleUpperCase()}`; });
document.querySelector('#answer-btn').addEventListener('click', () => { feedback.textContent = `答案是 ${currentQuestion.display}`; feedback.className = 'feedback'; solved = true; document.querySelector('#answer-input').disabled = true; document.querySelector('#next-btn').hidden = false; document.querySelector('#next-btn').focus(); });
document.querySelector('#next-btn').addEventListener('click', () => {
  if (roundComplete) { start(currentMode); return; }
  if (questionIndex === roundQuestions.length - 1) {
    roundComplete = true;
    document.querySelector('#modal-kicker').textContent = 'ROUND COMPLETE';
    document.querySelector('#game-title').textContent = '挑戰完成！';
    clue.textContent = `你答對 ${score} / ${roundQuestions.length} 題`;
    clue.classList.remove('text-clue');
    document.querySelector('#artist-hint').textContent = score === roundQuestions.length ? '太厲害了，全部答對！' : '再玩一輪，看看能不能刷新成績。';
    document.querySelector('#answer-form').hidden = true;
    feedback.textContent = '想再挑戰一次嗎？'; feedback.className = 'feedback';
    document.querySelector('#hint-btn').hidden = true; document.querySelector('#answer-btn').hidden = true;
    const next = document.querySelector('#next-btn'); next.textContent = '重新挑戰 ↻'; next.hidden = false;
    return;
  }
  questionIndex++; showQuestion();
});
function resetRoundControls() {
  document.querySelector('#answer-form').hidden = false;
  document.querySelector('#hint-btn').hidden = false; document.querySelector('#answer-btn').hidden = false;
}
function closeModal() {
  modal.hidden = true; document.body.style.overflow = '';
  if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
}
modal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...modal.querySelectorAll('button:not([hidden]), input:not([disabled])')]
    .filter(element => !element.closest('[hidden]'));
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
document.querySelector('#close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
