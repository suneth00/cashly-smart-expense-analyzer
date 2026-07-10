export const parseVoiceInput = (text) => {
  const result = {
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  };

  const lowerText = text.toLowerCase();

  // Define recognized categories
  const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
  
  // Extract category
  for (const cat of categories) {
    if (lowerText.includes(cat.toLowerCase())) {
      result.category = cat;
      break;
    }
  }

  // Extract amount (find the first sequence of numbers/decimals)
  const numberMatches = text.match(/\d+(\.\d{1,2})?/g);
  if (numberMatches && numberMatches.length > 0) {
    result.amount = numberMatches[0];
  }

  // Guess title by stripping out the known words
  let titleStr = text;
  if (result.category) {
    titleStr = titleStr.replace(new RegExp(result.category, 'i'), '');
  }
  if (result.amount) {
    titleStr = titleStr.replace(result.amount, '');
  }
  
  // Clean up filler words often used in speech
  titleStr = titleStr.replace(/(dollars|rupees|bucks|cents|spent|paid|bought|on|today|yesterday|for)/gi, '').trim();
  titleStr = titleStr.replace(/\s{2,}/g, ' '); // remove double spaces
  
  if (titleStr) {
    // Capitalize first letter
    result.title = titleStr.charAt(0).toUpperCase() + titleStr.slice(1);
  } else if (result.category) {
    result.title = `${result.category} Expense`;
  } else {
    result.title = 'Voice Input Expense';
  }

  // Extract relative date
  if (lowerText.includes('yesterday')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    result.date = yesterday.toISOString().split('T')[0];
  }

  return result;
};
