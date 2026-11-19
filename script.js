const questions = {
  emoji: [
    { clue: '🌙 🐱 💜', hint: '女團・四人・紫色的夜晚', answers: ['how you like that', 'blackpink'], display: 'BLACKPINK — How You Like That' },
    { clue: '🧊 👑 🪞', hint: '女團・「I'm on the next level」', answers: ['next level', 'aespa'], display: 'aespa — Next Level' },
    { clue: '🧛‍♂️ 🌙 🩸', hint: '男團・命運與月亮的故事', answers: ['bite me', 'enhypen'], display: 'ENHYPEN — Bite Me' },
    { clue: '🍭 🫧 💗', hint: '女團・甜甜的氣泡糖概念', answers: ['bubble gum', 'newjeans'], display: 'NewJeans — Bubble Gum' }
  ],
  dance: [
    { clue: '招牌動作：雙手比出望遠鏡，在眼睛前轉一圈。', hint: '女團・2020 年的超級熱門歌', answers: ['ddu-du ddu-du', 'ddu du ddu du', 'blackpink'], display: 'BLACKPINK — 뚜두뚜두 (DDU-DU DDU-DU)' },
    { clue: '招牌動作：雙手交叉後向外打開，像在打開一朵花。', hint: '男團・歌曲名字是一種「戰鬥」', answers: ['warrior', 'bts', 'fire'], display: 'BTS — FIRE' },
    { clue: '招牌動作：手指做出小愛心，再跟著節拍向前推。', hint: '男團・歌名就像一句深情告白', answers: ['love scenario', 'ikon'], display: 'iKON — LOVE SCENARIO' }
  ],
  mv: [
    { clue: 'MV 場景：一座被糖果色裝飾的巨大房子，五位女孩在房間裡開派對。', hint: '女團・歌名像邀請大家加入一個俱樂部', answers: ['feel special', 'twice'], display: 'TWICE — Feel Special' },
    { clue: 'MV 場景：在紅色沙漠與神祕儀式之間穿梭，畫面有強烈的紅黑色調。', hint: '男團・歌名是一種「奇蹟」', answers: ['wonderland', 'ateez'], display: 'ATEEZ — WONDERLAND' },
    { clue: 'MV 場景：復古校園、Y2K 穿搭，女孩們在走廊和操場自在玩耍。', hint: '女團・歌名是簡單的問候', answers: ['attention', 'newjeans'], display: 'NewJeans — Attention' }
  ]
};
let currentMode, currentQuestion, questionIndex = 0, hintLevel = 0, solved = false;
const modal = document.querySelector('#game-modal'), clue = document.querySelector('#question-clue'), feedback = document.querySelector('#feedback');
const normalize = value => value.trim().toLocaleLowerCase().replace(/[\s\-_.!?'’]/g, '');
function start(mode) { currentMode = mode; questionIndex = Math.floor(Math.random() * questions[mode].length); showQuestion(); modal.hidden = false; document.body.style.overflow = 'hidden'; document.querySelector('#answer-input').focus(); }
function showQuestion() {
  currentQuestion = questions[currentMode][questionIndex % questions[currentMode].length]; hintLevel = 0; solved = false;
  const names = { emoji: 'EMOJI', dance: 'DANCE MOVE', mv: 'MUSIC VIDEO' };
  document.querySelector('#modal-kicker').textContent = `ROUND 01 · ${names[currentMode]}`;
  clue.textContent = currentQuestion.clue; clue.classList.toggle('text-clue', currentMode !== 'emoji');
  document.querySelector('#artist-hint').textContent = '';
  document.querySelector('#answer-input').value = '';
  document.querySelector('#answer-input').disabled = false;
  feedback.textContent = ''; feedback.className = 'feedback';
  document.querySelector('#next-btn').hidden = true;
}
document.querySelectorAll('.mode-card').forEach(card => card.addEventListener('click', () => start(card.dataset.mode)));
document.querySelector('#answer-form').addEventListener('submit', event => {
  event.preventDefault(); if (solved) return;
  const guess = normalize(document.querySelector('#answer-input').value);
  if (!guess) return;
  const accepted = currentQuestion.answers.some(answer => normalize(answer) === guess || (guess.length > 4 && normalize(answer).includes(guess)));
  if (accepted) { solved = true; feedback.textContent = `猜對了！答案是 ${currentQuestion.display} 🎉`; feedback.className = 'feedback'; document.querySelector('#answer-input').disabled = true; document.querySelector('#next-btn').hidden = false; }
  else { feedback.textContent = '再想一下，或試試提示吧！'; feedback.className = 'feedback wrong'; }
});
document.querySelector('#hint-btn').addEventListener('click', () => { hintLevel++; document.querySelector('#artist-hint').textContent = hintLevel === 1 ? `提示：${currentQuestion.hint}` : `答案第一個字母：${currentQuestion.display[0]}`; });
document.querySelector('#answer-btn').addEventListener('click', () => { feedback.textContent = `答案是 ${currentQuestion.display}`; feedback.className = 'feedback'; solved = true; document.querySelector('#answer-input').disabled = true; document.querySelector('#next-btn').hidden = false; });
document.querySelector('#next-btn').addEventListener('click', () => { questionIndex++; showQuestion(); });
function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
document.querySelector('#close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
