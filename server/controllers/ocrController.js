const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// @desc    Extract text from receipt image
// @route   POST /api/ocr/receipt
// @access  Private
const processReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const imagePath = req.file.path;

    // Perform OCR
    const result = await Tesseract.recognize(imagePath, 'eng');
    
    const text = result.data.text;

    // Try to parse basic data from text
    let suggestedExpense = {
      title: 'Unknown Merchant',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'Other'
    };

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length > 0) {
      // Guess merchant name from first line
      // Ignore lines that are just numbers or weird chars
      const possibleMerchant = lines.find(l => /[a-zA-Z]{3,}/.test(l));
      if (possibleMerchant) {
        // limit length
        suggestedExpense.title = possibleMerchant.substring(0, 50).replace(/[^a-zA-Z0-9\s]/g, '').trim();
      }
    }

    // Guess amount
    // Match lines containing total, total due, amount due etc.
    const totalMatch = text.match(/(?:total|amount due|sum|balance)[\s:]*[$€£]?\s*(\d+[\.,]\d{2})/i);
    if (totalMatch && totalMatch[1]) {
      suggestedExpense.amount = parseFloat(totalMatch[1].replace(',', '.'));
    } else {
      // Fallback: find the largest currency-looking number
      const moneyMatches = text.match(/[$€£]?\s*(\d+[\.,]\d{2})/g);
      if (moneyMatches) {
        const amounts = moneyMatches.map(m => parseFloat(m.replace(/[^0-9\.,]/g, '').replace(',', '.')));
        const validAmounts = amounts.filter(n => !isNaN(n));
        if (validAmounts.length > 0) {
          suggestedExpense.amount = Math.max(...validAmounts);
        }
      }
    }

    // Guess Date
    // Match common date formats: MM/DD/YYYY, YYYY-MM-DD
    const dateMatch = text.match(/(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
    if (dateMatch && dateMatch[1]) {
      const parsedDate = new Date(dateMatch[1]);
      if (!isNaN(parsedDate)) {
        suggestedExpense.date = parsedDate.toISOString().split('T')[0];
      }
    }

    // Clean up uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete temp file', err);
    });

    res.status(200).json({
      extractedText: text,
      suggestedExpense
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ message: 'Failed to process receipt', error: error.message });
  }
};

module.exports = {
  processReceipt
};
