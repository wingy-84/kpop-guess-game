const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', '..', 'script.js'), 'utf8');

function createGame({ random = Math.random } = {}) {
  let document;
  const ids = [
    'game-modal', 'question-clue', 'feedback', 'round-status', 'question-difficulty',
    'game-title', 'modal-kicker', 'artist-hint', 'answer-input', 'answer-form',
    'next-btn', 'hint-btn', 'answer-btn', 'close-modal'
  ];
  const elements = Object.fromEntries(ids.map(id => [id, {
    id,
    textContent: '',
    value: '',
    disabled: false,
    hidden: id === 'game-modal' || id === 'next-btn',
    className: '',
    listeners: {},
    addEventListener(type, listener) {
      (this.listeners[type] ||= []).push(listener);
    },
    click() {
      for (const listener of this.listeners.click || []) listener({ target: this, preventDefault() {} });
    },
    focus() {
      document.activeElement = this;
    },
    closest(selector) {
      return selector === '[hidden]' && this.id === 'answer-input' && elements['answer-form'].hidden
        ? elements['answer-form']
        : null;
    },
    classList: { toggle() {}, remove() {} }
  }]));
  elements['game-modal'].querySelectorAll = () =>
    ['close-modal', 'answer-input', 'hint-btn', 'answer-btn', 'next-btn']
      .map(id => elements[id])
      .filter(element => !element.hidden && !element.disabled && !element.closest('[hidden]'));

  const cards = ['emoji', 'dance', 'mv'].map(mode => ({
    dataset: { mode },
    addEventListener(type, listener) {
      if (type === 'click') this.onClick = listener;
    },
    focus() {
      document.activeElement = this;
    }
  }));
  const nativeMath = Object.create(Math);
  nativeMath.random = random;
  document = {
    body: { style: {} },
    activeElement: cards[0],
    listeners: {},
    querySelector(selector) {
      return elements[selector.slice(1)];
    },
    querySelectorAll() {
      return cards;
    },
    addEventListener(type, listener) {
      this.listeners[type] = listener;
    }
  };
  const sandbox = { document, Math: nativeMath, console };
  vm.runInNewContext(`${source}\nglobalThis.inspectGame = () => ({ questions, currentQuestion, score, questionIndex, roundComplete, roundQuestions, currentMode });`, sandbox);
  return { cards, document, elements, inspect: () => sandbox.inspectGame() };
}

function submit(game, answer) {
  game.elements['answer-input'].value = answer;
  game.elements['answer-form'].listeners.submit[0]({ preventDefault() {} });
}

test('all modes score correct answers, keep reveals unscored, complete and replay rounds', () => {
  const game = createGame();
  for (const mode of ['emoji', 'dance', 'mv']) {
    game.cards.find(card => card.dataset.mode === mode).onClick();
    const total = game.inspect().questions[mode].length;
    assert.match(game.elements['round-status'].textContent, new RegExp(`/ ${total} 題`));

    game.elements['answer-btn'].click();
    game.elements['next-btn'].click();
    assert.equal(game.inspect().score, 0);

    while (!game.inspect().roundComplete) {
      const before = game.inspect();
      submit(game, before.currentQuestion.answers[0]);
      assert.equal(game.inspect().score, before.score + 1);
      game.elements['next-btn'].click();
    }
    assert.equal(game.elements['question-clue'].textContent, `你答對 ${total - 1} / ${total} 題`);
    game.elements['next-btn'].click();
    assert.equal(game.inspect().questionIndex, 0);
    assert.equal(game.inspect().roundComplete, false);
  }
});

test('answer matching accepts normalized full aliases and rejects partial matches', () => {
  const game = createGame({ random: () => 0 });
  game.cards.find(card => card.dataset.mode === 'emoji').onClick();
  const alias = game.inspect().currentQuestion.answers[0];
  assert.equal(alias, 'next level');
  submit(game, alias.slice(1));
  assert.equal(game.inspect().score, 0);
  submit(game, alias.toUpperCase().replace(/\\s+/g, '-'));
  assert.equal(game.inspect().score, 1);
});

test('every question has valid difficulty and answer aliases', () => {
  const game = createGame();
  for (const questions of Object.values(game.inspect().questions)) {
    for (const question of questions) {
      assert.ok(['easy', 'medium', 'hard'].includes(question.difficulty));
      assert.ok(question.answers.length > 0);
      assert.ok(question.answers.every(answer => typeof answer === 'string' && answer.trim()));
    }
  }
});

test('dialog traps keyboard focus and returns focus to its opener on Escape', () => {
  const game = createGame();
  const opener = game.cards[0];
  opener.onClick();
  const keydown = game.elements['game-modal'].listeners.keydown[0];

  game.document.activeElement = game.elements['close-modal'];
  let prevented = false;
  keydown({ key: 'Tab', shiftKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(game.document.activeElement, game.elements['answer-btn']);

  prevented = false;
  keydown({ key: 'Tab', shiftKey: false, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(game.document.activeElement, game.elements['close-modal']);

  submit(game, game.inspect().currentQuestion.answers[0]);
  assert.equal(game.document.activeElement, game.elements['next-btn']);
  game.document.listeners.keydown({ key: 'Escape' });
  assert.equal(game.elements['game-modal'].hidden, true);
  assert.equal(game.document.activeElement, opener);
});
