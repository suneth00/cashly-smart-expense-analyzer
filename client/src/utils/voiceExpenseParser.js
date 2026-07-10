const CATEGORY_KEYWORDS = {
  Food: ['food', 'lunch', 'dinner', 'breakfast', 'coffee', 'tea', 'meal', 'restaurant', 'kfc', 'pizza', 'burger', 'snacks'],
  Transport: ['bus', 'train', 'taxi', 'uber', 'pickme', 'fuel', 'petrol', 'transport', 'fare'],
  Education: ['book', 'course', 'class', 'tuition', 'exam', 'education', 'study'],
  Shopping: ['shopping', 'clothes', 'shoes', 'shirt', 'dress', 'mall'],
  Bills: ['bill', 'electricity', 'water', 'internet', 'phone', 'rent'],
  Entertainment: ['movie', 'game', 'netflix', 'music', 'party', 'entertainment'],
  Health: ['doctor', 'medicine', 'pharmacy', 'hospital', 'health'],
};

// Converts spoken number words like "five hundred" into numeric values.
const NUMBER_WORDS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const SCALE_WORDS = {
  hundred: 100,
  thousand: 1000,
};

const AMOUNT_TRIGGERS = ['spent', 'paid', 'pay', 'cost', 'costs', 'costed', 'add', 'expense', 'for'];

// Words removed when generating a clean expense title from the transcript.
const FILLER_WORDS = new Set([
  'i',
  'me',
  'my',
  'please',
  'can',
  'you',
  'spent',
  'spend',
  'paid',
  'pay',
  'add',
  'expense',
  'expenses',
  'rupee',
  'rupees',
  'rs',
  'lkr',
  'for',
  'on',
  'today',
  'yesterday',
  'tomorrow',
  'this',
  'week',
  'cost',
  'costs',
  'costed',
  'bought',
  'buy',
  'a',
  'an',
  'the',
  'to',
  'of',
  'at',
  'in',
  'from',
  'with',
  'and',
]);

const WEEKDAYS = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const toLocalDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeTranscript = (transcript) =>
  // Cleans speech text so matching amounts, categories, and dates is easier.
  transcript
    .toLowerCase()
    .replace(/rs\./g, 'rs')
    .replace(/l\.k\.r\./g, 'lkr')
    .replace(/,/g, '')
    .replace(/[^\w\s.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const titleCase = (text) =>
  text
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getTokenInfo = (text) => {
  const matches = [...text.matchAll(/[a-z]+|\d+(?:\.\d+)?/g)];
  return matches.map((match) => ({
    value: match[0],
    index: match.index,
    end: match.index + match[0].length,
  }));
};

const parseNumberWordsAt = (tokens, start) => {
  let total = 0;
  let current = 0;
  let consumed = 0;
  let hasNumber = false;

  for (let i = start; i < tokens.length; i += 1) {
    const word = tokens[i].value;

    if (word === 'and' && hasNumber) {
      consumed += 1;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(NUMBER_WORDS, word)) {
      current += NUMBER_WORDS[word];
      consumed += 1;
      hasNumber = true;
      continue;
    }

    if (word === 'hundred' && hasNumber) {
      current = (current || 1) * SCALE_WORDS.hundred;
      consumed += 1;
      continue;
    }

    if (word === 'thousand' && hasNumber) {
      total += (current || 1) * SCALE_WORDS.thousand;
      current = 0;
      consumed += 1;
      continue;
    }

    break;
  }

  if (!hasNumber) return null;

  return {
    value: total + current,
    start: tokens[start].index,
    end: tokens[start + consumed - 1].end,
    raw: tokens.slice(start, start + consumed).map((token) => token.value).join(' '),
  };
};

const findAmountCandidates = (text, tokens) => {
  // Finds both digit amounts and spoken amounts from the transcript.
  const candidates = [];

  for (const match of text.matchAll(/\b\d+(?:\.\d{1,2})?\b/g)) {
    candidates.push({
      value: Number(match[0]),
      raw: match[0],
      start: match.index,
      end: match.index + match[0].length,
      source: 'digits',
    });
  }

  for (let i = 0; i < tokens.length; i += 1) {
    const parsed = parseNumberWordsAt(tokens, i);
    if (parsed && parsed.value > 0) {
      candidates.push({ ...parsed, source: 'words' });
      const consumedWords = parsed.raw.split(' ').length;
      i += consumedWords - 1;
    }
  }

  return candidates.filter((candidate) => Number.isFinite(candidate.value) && candidate.value > 0);
};

const chooseAmount = (candidates, tokens) => {
  if (candidates.length === 0) return null;

  // Prefers amounts near words like "spent" or "paid".
  const tokenBeforeCandidate = (candidate, limit = 4) =>
    tokens
      .filter((token) => token.end <= candidate.start)
      .slice(-limit)
      .map((token) => token.value);

  const triggered = candidates
    .map((candidate) => {
      const previousWords = tokenBeforeCandidate(candidate);
      const nearestTriggerIndex = previousWords
        .map((word, index) => (AMOUNT_TRIGGERS.includes(word) ? index : -1))
        .filter((index) => index >= 0)
        .pop();

      return {
        ...candidate,
        triggerDistance: nearestTriggerIndex === undefined ? Infinity : previousWords.length - nearestTriggerIndex,
      };
    })
    .filter((candidate) => candidate.triggerDistance !== Infinity)
    .sort((a, b) => a.triggerDistance - b.triggerDistance || b.value - a.value);

  if (triggered.length > 0) return triggered[0];

  return [...candidates].sort((a, b) => b.value - a.value)[0];
};

const detectCategory = (text) => {
  // Matches keywords like "food" or "bus" to a CASHLY category.
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`, 'i').test(text))) {
      return { category, detected: true };
    }
  }

  return { category: 'Other', detected: false };
};

const closestWeekdayDate = (targetDay, today) => {
  const currentDay = today.getDay();
  const forward = (targetDay - currentDay + 7) % 7;
  const backward = forward - 7;
  const offset = forward === 0 ? 0 : forward <= Math.abs(backward) ? forward : backward;
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date;
};

const detectDate = (text, today = new Date()) => {
  // Detects simple date words such as today, yesterday, tomorrow, or weekdays.
  const date = new Date(today);

  if (/\byesterday\b/.test(text)) {
    date.setDate(today.getDate() - 1);
    return { date: toLocalDateInput(date), label: 'yesterday' };
  }

  if (/\btomorrow\b/.test(text)) {
    date.setDate(today.getDate() + 1);
    return { date: toLocalDateInput(date), label: 'tomorrow' };
  }

  for (const [weekday, dayIndex] of Object.entries(WEEKDAYS)) {
    if (new RegExp(`\\bnext\\s+${weekday}\\b`).test(text)) {
      const next = new Date(today);
      const offset = (dayIndex - today.getDay() + 7) % 7 || 7;
      next.setDate(today.getDate() + offset);
      return { date: toLocalDateInput(next), label: `next ${weekday}` };
    }

    if (new RegExp(`\\b(last|previous)\\s+${weekday}\\b`).test(text)) {
      const previous = new Date(today);
      const offset = (today.getDay() - dayIndex + 7) % 7 || 7;
      previous.setDate(today.getDate() - offset);
      return { date: toLocalDateInput(previous), label: `previous ${weekday}` };
    }

    if (new RegExp(`\\b${weekday}\\b`).test(text)) {
      return { date: toLocalDateInput(closestWeekdayDate(dayIndex, today)), label: weekday };
    }
  }

  if (/\bthis\s+week\b/.test(text)) {
    return { date: toLocalDateInput(date), label: 'this week' };
  }

  return { date: toLocalDateInput(date), label: 'today' };
};

const removeAmountPhrases = (text, amounts) => {
  if (!amounts.length) return text;

  return [...amounts]
    .sort((a, b) => b.start - a.start)
    .reduce((cleanedText, amount) => `${cleanedText.slice(0, amount.start)} ${cleanedText.slice(amount.end)}`, text);
};

const generateTitle = (text, amounts, category) => {
  // Builds a readable title from the remaining useful words.
  const withoutAmount = removeAmountPhrases(text, amounts);
  const categoryName = category.toLowerCase();
  const titleWords = withoutAmount
    .split(' ')
    .filter((word) => word && !FILLER_WORDS.has(word))
    .filter((word) => !Object.prototype.hasOwnProperty.call(WEEKDAYS, word))
    .filter((word) => word !== 'last' && word !== 'next' && word !== 'previous')
    .filter((word) => word !== categoryName && word !== 'other');

  if (titleWords.length > 0) {
    return titleCase(titleWords.join(' '));
  }

  return category !== 'Other' ? category : 'Voice Input Expense';
};

export const parseVoiceExpense = (transcript, options = {}) => {
  // Main parser used by the Voice Assistant on the Add Expense page.
  const cleaned = normalizeTranscript(transcript || '');
  const today = options.today ? new Date(options.today) : new Date();
  const tokens = getTokenInfo(cleaned);
  const amountCandidates = findAmountCandidates(cleaned, tokens);
  const amount = chooseAmount(amountCandidates, tokens);
  const { category, detected: categoryDetected } = detectCategory(cleaned);
  const dateInfo = detectDate(cleaned, today);
  const warnings = [];

  if (!amount) {
    warnings.push('I could not detect the amount. Please enter it manually.');
  }

  if (!categoryDetected) {
    warnings.push('Category was not clear. Please choose the correct one.');
  }

  if (amountCandidates.length > 1) {
    warnings.push('Please check the detected amount.');
  }

  const confidence = !amount
    ? 'low'
    : categoryDetected
      ? 'high'
      : 'medium';

  const confidenceMessage = confidence === 'high'
    ? 'Looks good. Please confirm before saving.'
    : confidence === 'medium'
      ? 'I found the amount, but please check the category.'
      : 'I could not clearly understand the amount. Please edit it manually.';

  const fields = {
    title: generateTitle(cleaned, amountCandidates, category),
    amount: amount ? String(amount.value) : '',
    category,
    date: dateInfo.date,
  };

  return {
    transcript,
    normalizedTranscript: cleaned,
    fields,
    confidence,
    confidenceMessage,
    warnings,
    dateLabel: dateInfo.label,
    amountCandidates: amountCandidates.map((candidate) => ({
      value: candidate.value,
      raw: candidate.raw,
      source: candidate.source,
    })),
    detected: {
      amount: Boolean(amount),
      category: categoryDetected,
      multipleAmounts: amountCandidates.length > 1,
    },
  };
};

export default parseVoiceExpense;
