/**
 * =============================================================================
 * FILE: ocrController.js
 * PURPOSE: Handles the AI-powered Receipt Scanning feature of CASHLY.
 *
 * HOW IT WORKS (for VIVA explanation):
 * 1. The React frontend sends a receipt photo to POST /api/ocr/receipt.
 * 2. Multer middleware (in ocrRoutes.js) saves the photo to the /uploads folder
 *    and attaches its path to req.file.
 * 3. This controller picks up that file, runs it through the Tesseract OCR
 *    engine, and receives the raw text printed on the receipt.
 * 4. We then use Regular Expressions (regex) to intelligently extract three
 *    key fields: the merchant name (title), the total amount, and the date.
 * 5. The extracted data is sent back to the frontend as JSON, which
 *    pre-fills the expense form so the user can review and save it.
 *
 * LIBRARY: tesseract.js (v7) — an open-source OCR engine ported to JavaScript.
 *          "OCR" stands for Optical Character Recognition.
 * =============================================================================
 */

// --- External Library Imports ---
const Tesseract = require('tesseract.js'); // The OCR (text-from-image) engine
const fs        = require('fs');           // Node.js built-in: File System operations
const path      = require('path');         // Node.js built-in: handles file/folder paths


// =============================================================================
// CONTROLLER: processReceipt
// ROUTE:      POST /api/ocr/receipt
// ACCESS:     Private (requires a valid JWT — user must be logged in)
//
// This is an async function because OCR (reading text from an image) takes
// time. Using async/await makes the code read like a simple, top-to-bottom
// sequence of steps, even though each step involves waiting for I/O.
// =============================================================================
const processReceipt = async (req, res) => {
  // OCR suggests expense values; it does not save the expense automatically.

  // We declare 'worker' outside the try block so we can still access
  // it in the 'finally' block to shut it down and free memory —
  // even if an error occurs partway through.
  let worker = null;

  try {

    // -------------------------------------------------------------------------
    // STEP 1: Validate that a file was actually uploaded
    // -------------------------------------------------------------------------
    // 'req.file' is populated by the Multer middleware defined in ocrRoutes.js.
    // If the user didn't attach a file to their request, we reject it early
    // with HTTP 400 (Bad Request) and a clear error message.
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    // Get the full path to the uploaded file on our server's disk.
    // Example: 'uploads/receiptImage-1720444800000.jpg'
    const imagePath = req.file.path;


    // -------------------------------------------------------------------------
    // STEP 2: Set up the Tesseract OCR Worker
    // -------------------------------------------------------------------------
    // Tesseract.js v7 requires us to create a "worker" — a background process
    // that runs the OCR engine. We must do this before recognising any image.
    //
    // Arguments explained:
    //   'eng'    → The language to use (English). Reads from 'eng.traineddata'.
    //   1        → The OCR Engine Mode (OEM). Mode 1 uses the LSTM neural
    //              network, which is the most accurate modern mode.
    //   { langPath } → Tells Tesseract WHERE to find the eng.traineddata file.
    //              We point it to the server root folder (one level above
    //              this 'controllers' folder) so it uses our LOCAL copy
    //              and doesn't need to download it from the internet.
    const langPath = path.join(__dirname, '..'); // '..' goes up from /controllers to /server
    worker = await Tesseract.createWorker('eng', 1, { langPath });


    // -------------------------------------------------------------------------
    // STEP 3: Run OCR — Extract all text from the receipt image
    // -------------------------------------------------------------------------
    // worker.recognize() scans the image and returns a 'data' object.
    // data.text contains all the text it found, as a single long string.
    // We use a fallback of '' (empty string) in case data.text is undefined.
    const { data } = await worker.recognize(imagePath);
    const rawText  = data.text || '';


    // -------------------------------------------------------------------------
    // STEP 4: Set up default values for the suggested expense
    // -------------------------------------------------------------------------
    // We start with safe defaults. The parsing steps below will try to
    // overwrite these with real values extracted from the receipt text.
    // If parsing fails, the user still gets a form they can fill in manually.
    let suggestedExpense = {
      title:    'Unknown Merchant',               // Will be replaced by the shop name
      amount:   0,                                // Will be replaced by the total cost
      date:     new Date().toISOString().split('T')[0], // Defaults to today (YYYY-MM-DD)
      category: 'Other',                          // User can change this in the form
    };


    // -------------------------------------------------------------------------
    // STEP 5: Parse the Merchant Name (Title)
    // -------------------------------------------------------------------------
    // Split the raw OCR text into individual lines, trim whitespace,
    // and remove any empty lines to get a clean array of text lines.
    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // The merchant name is usually at the TOP of a receipt.
    // We search for the first line that contains at least 3 consecutive
    // letters — this filters out lines that are pure numbers or symbols.
    const merchantLine = lines.find(line => /[a-zA-Z]{3,}/.test(line));

    if (merchantLine) {
      // Clean up the merchant name:
      //  - Limit to 50 characters so it fits neatly in our database
      //  - Remove special characters (keeps only letters, numbers, spaces)
      //  - Trim any leading/trailing whitespace
      suggestedExpense.title = merchantLine
        .substring(0, 50)
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim();
    }


    // -------------------------------------------------------------------------
    // STEP 6: Parse the Total Amount
    // -------------------------------------------------------------------------
    // STRATEGY A (preferred): Look for a line that contains a keyword like
    // "total", "amount due", or "balance" followed by a number.
    // This regex uses a "non-capturing group" (?:...) to match any of the
    // keywords, then captures the decimal number that follows.
    const labelledTotalMatch = rawText.match(
      /(?:total|amount due|sum|balance)[\s:]*[$€£]?\s*(\d+[.,]\d{2})/i
    );

    if (labelledTotalMatch && labelledTotalMatch[1]) {
      // labelledTotalMatch[1] is the first capture group — the number itself.
      // We replace commas with dots to handle European number formats (e.g., "12,50" → "12.50")
      suggestedExpense.amount = parseFloat(labelledTotalMatch[1].replace(',', '.'));

    } else {
      // STRATEGY B (fallback): If no labelled total was found, find ALL
      // currency-looking numbers on the receipt (e.g., "4.50", "$12.99")
      // and assume the LARGEST one is the total bill.
      const allCurrencyMatches = rawText.match(/[$€£]?\s*(\d+[.,]\d{2})/g);

      if (allCurrencyMatches) {
        // Convert each matched string to a JavaScript number (float)
        const validAmounts = allCurrencyMatches
          .map(match => parseFloat(match.replace(/[^0-9.,]/g, '').replace(',', '.')))
          .filter(num => !isNaN(num)); // Discard any that couldn't be parsed

        if (validAmounts.length > 0) {
          // Math.max(...array) spreads the array as individual arguments
          // to find the highest value — that's our best guess at the total.
          suggestedExpense.amount = Math.max(...validAmounts);
        }
      }
    }


    // -------------------------------------------------------------------------
    // STEP 7: Parse the Date
    // -------------------------------------------------------------------------
    // This regex matches common date formats found on receipts:
    //   - MM/DD/YYYY  (e.g., 07/08/2024)
    //   - YYYY-MM-DD  (e.g., 2024-07-08) — ISO format
    //   - DD.MM.YYYY  (e.g., 08.07.2024) — European format
    // The separator can be '/', '-', or '.'
    const dateMatch = rawText.match(/(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);

    if (dateMatch && dateMatch[1]) {
      // JavaScript's Date constructor can parse most standard date strings.
      const parsedDate = new Date(dateMatch[1]);

      // isNaN(date) returns true if the date is invalid (e.g., "99/99/9999").
      // We only use the parsed date if it's a real, valid date.
      if (!isNaN(parsedDate)) {
        suggestedExpense.date = parsedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
    }


    // -------------------------------------------------------------------------
    // STEP 8: Delete the temporary uploaded file from the server's disk
    // -------------------------------------------------------------------------
    // We no longer need the uploaded image — the OCR is already done.
    // Deleting it keeps the /uploads folder clean and saves disk space.
    // We use the callback form of fs.unlink() so the deletion happens in
    // the background without blocking our response to the user.
    fs.unlink(imagePath, (deleteError) => {
      if (deleteError) {
        // This is non-fatal — log it but don't crash the request.
        console.error('Warning: Could not delete temp upload file:', deleteError);
      }
    });


    // -------------------------------------------------------------------------
    // STEP 9: Send the results back to the React frontend
    // -------------------------------------------------------------------------
    // We return TWO things:
    //   1. 'extractedText' — the raw OCR output, displayed to the user so they
    //       can verify what the AI actually read from their receipt.
    //   2. 'suggestedExpense' — our best-guess expense object, which the frontend
    //       uses to pre-fill the "Add Expense" form fields.
    res.status(200).json({
      extractedText:   rawText,
      suggestedExpense,
    });


  } catch (error) {
    // -------------------------------------------------------------------------
    // ERROR HANDLING: Something went wrong during OCR processing
    // -------------------------------------------------------------------------
    // We log the full error on the server for debugging purposes.
    // To the client, we send a clear HTTP 500 (Internal Server Error) response.
    console.error('OCR Processing Error:', error);

    // Clean up the uploaded file if it still exists, to avoid disk clutter.
    if (req.file) {
      fs.unlink(req.file.path, () => {}); // Silent cleanup — no callback needed
    }

    res.status(500).json({
      message: 'Failed to process receipt. Please try again.',
      error:   error.message,
    });

  } finally {
    // -------------------------------------------------------------------------
    // CLEANUP: Always shut down the Tesseract worker
    // -------------------------------------------------------------------------
    // The 'finally' block runs whether the try block succeeded OR failed.
    // This guarantees we always call worker.terminate(), which stops the
    // background Tesseract process and frees up memory on the server.
    // Without this, abandoned workers would accumulate and slow down the server.
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateError) {
        // If termination itself fails, just log it — don't crash.
        console.error('Warning: Tesseract worker did not terminate cleanly:', terminateError);
      }
    }
  }
};


// =============================================================================
// EXPORT
// =============================================================================
// We export processReceipt so it can be imported and used in ocrRoutes.js.
// Using destructured object export { processReceipt } is a Node.js best
// practice — it makes it easy to add more controller functions later.
module.exports = { processReceipt };
