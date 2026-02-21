// ===== PUZZLE DATA =====
const PUZZLES = [
  {
    id: 1,
    title: "🔐 הקוד הראשון",
    type: "cipher",
    scenario: `לפניך שלט ישן על דלת חדר הבריחה. עליו כתוב:\n"כל אות היא מספר. א=1, ב=2, ג=3... \nהמילה הסודית: ד-ע-ת\nחבר את המספרים וכתוב את הסכום."`,
    question: "מה סכום הספרות של המילה ד-ע-ת?\n(ד=4, ע=16, ת=22)",
    hint: "💡 פשוט חבר: 4 + 16 + 22 = ?",
    type: "text",
    answer: "42",
    placeholder: "הכנס את הסכום..."
  },
  {
    id: 2,
    title: "🚪 הדרך קדימה",
    type: "multiple",
    scenario: `מצאת תא עם שלושה מפתחות. על הקיר כתוב:\n\n"לפניך שלוש החלטות. רק אחת מהן מבוססת על חשיבה רציונלית ולא על רגש בלבד.\nאיזו החלטה הייתה אחראית ביותר?"`,
    question: "חבר שלך מציע לך לצאת עם חברים הלילה, אבל מחר יש לך מבחן חשוב. מה תעשה?",
    hint: "💡 חשוב: איזו בחירה לוקחת בחשבון גם את העכשיו וגם את המחר?",
    choices: [
      { text: "⚡ אצא, המבחן הוא מחר – יש עוד זמן.", correct: false },
      { text: "📚 אלמד קצת ואז אצא לשעה קצרה, כי אני יודע מה המצב.", correct: false },
      { text: "🎯 אסביר לחבר שאני לא יכול הלילה, ואקצה את הערב ללמוד.", correct: true }
    ]
  },
  {
    id: 3,
    title: "⚖️ סדר עדיפויות",
    type: "text",
    scenario: `על הקיר תלויה לוח שעם רשימה מבולגנת.\nנכתב עליה: "ארבע מטרות. רק אחת יכולה לחכות ליום אחר.\nמסמנים את מספרה."`,
    question: `המטרות שלך לשבוע זה:\n1️⃣ הכנת מטלה שצריך להגיש מחר\n2️⃣ אימון ספורט שאפשר לדחות\n3️⃣ שיחת טלפון עם חבר שמחכה לתשובה\n4️⃣ קריאת ספר שהתחלת לפני שבוע\n\nאיזה מהם אפשר לדחות הכי בקלות ליום אחר?\nהכנס את המספר בלבד.`,
    hint: "💡 שאל את עצמך: מה יש לו תאריך יעד קבוע, ומה גמיש?",
    answer: "4",
    placeholder: "מספר המטרה (1-4)..."
  },
  {
    id: 4,
    title: "🧩 החידה הלוגית",
    type: "text",
    scenario: `לפניך דלת ועליה מנעול עם מספר.\nהשלט אומר: "לוקח לי 5 דקות לקבל החלטה פשוטה, ו-20 דקות לקבל החלטה מורכבת.\nאם קיבלתי 3 החלטות פשוטות ו-2 מורכבות – כמה דקות בסך הכול?"`,
    question: "חשב: (3 × 5) + (2 × 20) = ?",
    hint: "💡 חשב כל קבוצה בנפרד ואז חבר: 15 + ?",
    answer: "55",
    placeholder: "הכנס את התוצאה..."
  },
  {
    id: 5,
    title: "🏆 ההחלטה הסופית",
    type: "multiple",
    scenario: `הגעת לדלת האחרונה במבוך! רק הצלחה כאן תפתח לך אותה.\n\nקרא את התרחיש בקפידה:`    ,
    question: `דניאל, בן 17, קיבל הצעת עבודה בשכר גבוה שמחייבת אותו לנשור מהלימודים. \nהמשפחה צריכה כסף, אבל ההורים אומרים שהוא חייב להמשיך ללמוד.\nמה עדיף שדניאל יעשה?`,
    hint: "💡 חשוב על טווח ארוך: מה יתן לו יותר אפשרויות בחיים?",
    choices: [
      { text: "💰 לנשור ולעבוד – המשפחה צריכה עכשיו ואין ברירה.", correct: false },
      { text: "🤝 לדבר עם בית הספר על לימודים ערב ולמצוא עבודה חלקית – פתרון ביניים.", correct: true },
      { text: "📖 לסרב לעבודה לגמרי ולהתמקד רק בלימודים.", correct: false }
    ]
  }
];

// ===== STATE =====
let solvedCount = 0;
const solvedPuzzles = new Set();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', startGame);
  renderPuzzles();
});

function startGame() {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== RENDER =====
function renderPuzzles() {
  const container = document.getElementById('puzzles-container');
  container.innerHTML = '';

  PUZZLES.forEach((puzzle, idx) => {
    const card = buildCard(puzzle, idx);
    container.appendChild(card);
  });

  updateProgress();
}

function buildCard(puzzle, idx) {
  const isFirst = idx === 0;
  const card = document.createElement('div');
  card.className = 'puzzle-card ' + (isFirst ? 'active' : 'locked');
  card.id = `puzzle-card-${idx}`;

  // Header
  const header = document.createElement('div');
  header.className = 'puzzle-header';

  const numRow = document.createElement('div');
  numRow.className = 'puzzle-number';

  const badge = document.createElement('div');
  badge.className = 'puzzle-num-badge';
  badge.textContent = puzzle.id;

  const title = document.createElement('div');
  title.className = 'puzzle-title';
  title.textContent = puzzle.title;

  numRow.appendChild(badge);
  numRow.appendChild(title);

  const lockIcon = document.createElement('span');
  lockIcon.className = 'puzzle-lock-icon';
  lockIcon.textContent = isFirst ? '' : '🔒';
  lockIcon.id = `lock-icon-${idx}`;

  header.appendChild(numRow);
  header.appendChild(lockIcon);
  card.appendChild(header);

  // Scenario box
  if (puzzle.scenario) {
    const scenario = document.createElement('div');
    scenario.className = 'puzzle-scenario';
    scenario.style.whiteSpace = 'pre-line';
    scenario.textContent = puzzle.scenario;
    card.appendChild(scenario);
  }

  // Question
  const q = document.createElement('div');
  q.className = 'puzzle-question';
  q.textContent = puzzle.question;
  card.appendChild(q);

  // Input / choices
  if (puzzle.choices) {
    const choiceDiv = buildChoices(puzzle, idx);
    card.appendChild(choiceDiv);
  } else {
    const inputRow = buildTextInput(puzzle, idx);
    card.appendChild(inputRow);
  }

  // Feedback
  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.id = `feedback-${idx}`;
  card.appendChild(feedback);

  // Solved banner
  const banner = document.createElement('div');
  banner.className = 'solved-banner';
  banner.id = `solved-banner-${idx}`;
  banner.innerHTML = `<span>✅</span><span>כל הכבוד! עברת את השלב הזה!</span>`;
  card.appendChild(banner);

  // Hint
  const hintRow = document.createElement('div');
  hintRow.className = 'hint-row';

  const hintBtn = document.createElement('button');
  hintBtn.className = 'btn-hint';
  hintBtn.textContent = '💡 קבל רמז';
  hintBtn.id = `hint-btn-${idx}`;
  hintBtn.addEventListener('click', () => showHint(idx));

  const hintText = document.createElement('div');
  hintText.className = 'hint-text';
  hintText.id = `hint-text-${idx}`;
  hintText.textContent = puzzle.hint;

  hintRow.appendChild(hintBtn);
  hintRow.appendChild(hintText);
  card.appendChild(hintRow);

  return card;
}

function buildChoices(puzzle, idx) {
  const div = document.createElement('div');
  div.className = 'choices';
  div.id = `choices-${idx}`;

  puzzle.choices.forEach((choice, ci) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.id = `choice-${idx}-${ci}`;
    btn.addEventListener('click', () => handleChoice(idx, ci, choice.correct, btn));
    div.appendChild(btn);
  });

  return div;
}

function buildTextInput(puzzle, idx) {
  const row = document.createElement('div');
  row.className = 'puzzle-input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'puzzle-input';
  input.placeholder = puzzle.placeholder || 'הכנס תשובה...';
  input.id = `input-${idx}`;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkTextAnswer(idx, puzzle.answer, input);
  });

  const btn = document.createElement('button');
  btn.className = 'btn-check';
  btn.textContent = 'בדוק ✓';
  btn.id = `check-btn-${idx}`;
  btn.addEventListener('click', () => checkTextAnswer(idx, puzzle.answer, input));

  row.appendChild(input);
  row.appendChild(btn);
  return row;
}

// ===== ANSWER CHECKING =====
function handleChoice(puzzleIdx, choiceIdx, isCorrect, btn) {
  if (solvedPuzzles.has(puzzleIdx)) return;

  const allBtns = document.querySelectorAll(`#choices-${puzzleIdx} .choice-btn`);

  if (isCorrect) {
    btn.classList.add('selected-correct');
    allBtns.forEach(b => b.disabled = true);
    onPuzzleSolved(puzzleIdx);
  } else {
    btn.classList.add('selected-wrong');
    btn.disabled = true;
    showFeedback(puzzleIdx, '❌ לא בדיוק... נסה אפשרות אחרת!', 'error');
    setTimeout(() => btn.classList.remove('selected-wrong'), 1500);
    setTimeout(() => hideFeedback(puzzleIdx), 2000);
  }
}

function checkTextAnswer(puzzleIdx, correctAnswer, input) {
  if (solvedPuzzles.has(puzzleIdx)) return;

  const userAnswer = input.value.trim().replace(/\s+/g, '');
  const correct = correctAnswer.trim().replace(/\s+/g, '');

  if (userAnswer === correct) {
    input.disabled = true;
    document.getElementById(`check-btn-${puzzleIdx}`).disabled = true;
    onPuzzleSolved(puzzleIdx);
  } else if (userAnswer === '') {
    showFeedback(puzzleIdx, '✏️ אנא הכנס תשובה.', 'error');
    setTimeout(() => hideFeedback(puzzleIdx), 2000);
  } else {
    showFeedback(puzzleIdx, '❌ תשובה שגויה. נסה שוב!', 'error');
    input.style.borderColor = 'var(--wrong)';
    setTimeout(() => { input.style.borderColor = ''; hideFeedback(puzzleIdx); }, 2000);
  }
}

// ===== PUZZLE SOLVED =====
function onPuzzleSolved(idx) {
  solvedPuzzles.add(idx);
  solvedCount++;

  const card = document.getElementById(`puzzle-card-${idx}`);
  card.classList.remove('active');
  card.classList.add('solved');

  const lockIcon = document.getElementById(`lock-icon-${idx}`);
  if (lockIcon) lockIcon.textContent = '✅';

  // Hide hint button
  const hintBtn = document.getElementById(`hint-btn-${idx}`);
  if (hintBtn) hintBtn.style.display = 'none';

  // Show solved banner
  const banner = document.getElementById(`solved-banner-${idx}`);
  if (banner) banner.classList.add('show');

  showFeedback(idx, '🎉 מעולה! פתרת את החידה!', 'success');

  updateProgress();

  // Check if all done
  if (solvedCount === PUZZLES.length) {
    setTimeout(showFinalScreen, 800);
    return;
  }

  // Unlock next puzzle
  const nextIdx = idx + 1;
  if (nextIdx < PUZZLES.length) {
    setTimeout(() => unlockPuzzle(nextIdx), 600);
  }
}

function unlockPuzzle(idx) {
  const card = document.getElementById(`puzzle-card-${idx}`);
  if (!card) return;

  card.classList.remove('locked');
  card.classList.add('active');

  const lockIcon = document.getElementById(`lock-icon-${idx}`);
  if (lockIcon) lockIcon.textContent = '';

  // Scroll into view smoothly
  setTimeout(() => {
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

// ===== FEEDBACK =====
function showFeedback(idx, msg, type) {
  const el = document.getElementById(`feedback-${idx}`);
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback ${type} show`;
}

function hideFeedback(idx) {
  const el = document.getElementById(`feedback-${idx}`);
  if (el) el.className = 'feedback';
}

// ===== HINT =====
function showHint(idx) {
  const btn = document.getElementById(`hint-btn-${idx}`);
  const text = document.getElementById(`hint-text-${idx}`);
  if (!text) return;
  text.classList.add('show');
  if (btn) btn.style.display = 'none';
}

// ===== PROGRESS =====
function updateProgress() {
  const pct = (solvedCount / PUZZLES.length) * 100;
  const bar = document.getElementById('progress-fill');
  if (bar) bar.style.width = pct + '%';

  const label = document.getElementById('progress-label');
  if (label) label.textContent = `${solvedCount} / ${PUZZLES.length} חידות`;
}

// ===== FINAL SCREEN =====
function showFinalScreen() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('final-screen').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById('btn-generate').addEventListener('click', generateCode);
}

// ===== HASH + CODE GENERATION =====
async function generateCode() {
  const idInput = document.getElementById('id-input');
  const idError = document.getElementById('id-error');
  const codeResult = document.getElementById('code-result');
  const codeValue = document.getElementById('code-value');
  const encouragement = document.getElementById('encouragement-text');

  idError.classList.remove('show');
  const idNum = idInput.value.trim().replace(/\D/g, '');

  if (idNum.length < 5 || idNum.length > 9) {
    idError.textContent = '⚠️ אנא הכנס מספר ת.ז. תקין (5–9 ספרות).';
    idError.classList.add('show');
    return;
  }

  try {
    // SHA-256 via Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode('mazeBracha_' + idNum + '_decision2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Take first 8 chars, uppercase
    const code = hashHex.substring(0, 8).toUpperCase();

    codeValue.textContent = code;
    encouragement.innerHTML = `
      <div class="star-row">⭐ ⭐ ⭐ ⭐ ⭐</div>
      <p>
        הצלחת לעבור את כל חמשת שלבי מבוך ההחלטות!<br>
        הראית חשיבה ביקורתית, שיפוט נכון ויכולת להבחין בין בחירות טובות לפחות טובות.<br><br>
        <strong>הקוד האישי שלך הוא הוכחה לכך שהשלמת את המשימה.</strong><br>
        שמור אותו – תצטרך למסור אותו למורה! 🏆
      </p>
    `;
    codeResult.classList.add('show');
    codeResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Lock button
    document.getElementById('btn-generate').disabled = true;
    idInput.disabled = true;

  } catch (err) {
    idError.textContent = '⚠️ שגיאה בחישוב – אנא נסה שוב.';
    idError.classList.add('show');
  }
}
