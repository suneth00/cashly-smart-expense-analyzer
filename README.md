# CASHLY - Smart Expense Analyzer 💸

## Project Overview
CASHLY is a comprehensive, full-stack web application designed to help users intelligently track, analyze, and manage their personal finances. Built with the MERN stack (MongoDB, Express, React, Node.js), CASHLY goes beyond basic expense tracking by offering an AI-powered receipt scanner, voice-activated expense entry, a dynamic Money Health Score, and personalized financial recommendations. 

This project was developed with a focus on delivering a premium, modern fintech user experience with a highly responsive and interactive UI.

---

## Key Features
- **Secure Authentication:** JWT-based user registration and login.
- **Smart Dashboard:** Real-time visual insights using interactive charts (Recharts) to track daily spending trends and category breakdowns.
- **Advanced Expense Management:** Full CRUD operations with search, category filtering, and sorting capabilities.
- **AI Receipt Scanner:** Upload a receipt and let Optical Character Recognition (Tesseract.js) automatically extract the merchant, date, and total amount.
- **Voice Assistant:** Use your microphone to log expenses naturally (e.g., "I spent $15 on food today") via the Web Speech API.
- **Money Health Score:** A custom algorithm that grades your financial health (0-100) based on your income, spending ratio, and savings goals.
- **Personalized Recommendations:** Actionable, rule-based financial advice dynamically generated from your spending habits.
- **Premium UI/UX:** Responsive glassmorphic design, smooth animations, slide-out mobile navigation, and Tailwind CSS v4 styling.

---

## Tech Stack
### Frontend (Client)
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **OCR Engine:** Tesseract.js & Multer (for file handling)

---

## Folder Structure
```text
cashly-smart-expense-analyzer/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   └── src/
│       ├── api/            # Axios instance and interceptors
│       ├── components/     # Reusable UI components (Navbar, Sidebar, Forms)
│       ├── context/        # AuthContext for global state
│       ├── pages/          # Full page components (Dashboard, Expenses, etc.)
│       └── utils/          # Helper functions (e.g., Voice Parser)
│
├── server/                 # Backend Node.js Application
│   ├── config/             # Database connection setup
│   ├── controllers/        # Route logic and database operations
│   ├── middleware/         # JWT Auth and Error handling
│   ├── models/             # Mongoose schemas (User, Expense)
│   ├── routes/             # API endpoint definitions
│   └── uploads/            # Temporary storage for receipt images
│
└── README.md
```

---

## Environment Variables
To run this project locally, you will need to add the following environment variables to a `.env` file in the **`server`** directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

---

## Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cashly-smart-expense-analyzer
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

---

## How to Run Locally
You will need two terminal windows open to run the client and server concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*The backend will run on `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## How to Test
1. Open `http://localhost:5173` in your browser.
2. **Register** a new account and set a monthly income and savings goal.
3. Navigate to **Add Expense** and create a few manual entries.
4. Try the **Microphone** button to add an expense via voice command (Requires Chrome/Edge).
5. Navigate to the **Receipt Scanner** and upload an image of a receipt.
6. Visit the **Analytics** page to view your customized Money Health Score and AI Recommendations.

---

## Frontend Pages
- `/login` - User login
- `/register` - Account creation
- `/dashboard` - High-level overview, quick stats, and charts
- `/expenses` - Searchable, sortable list of all transactions
- `/add-expense` - Manual and Voice-activated expense entry
- `/analytics` - Deep dive into Health Score and Smart Advice
- `/receipt-scanner` - Tesseract OCR image upload
- `/profile` - Manage name, income, and goals

---

## Backend API Routes
*For detailed request/response examples, please see [`server/API_DOCUMENTATION.md`](./server/API_DOCUMENTATION.md).*

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`
- **Expenses:** `GET /api/expenses`, `POST /api/expenses`, `PUT /api/expenses/:id`, `DELETE /api/expenses/:id`
- **Analytics:** `GET /api/analytics/summary`, `GET /api/analytics/money-health-score`
- **Recommendations:** `GET /api/recommendations`
- **OCR:** `POST /api/ocr/receipt`

---

## Deployment Guide
### Backend on Render
Create a Render Web Service from this repository with these settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Add these environment variables in Render:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Render provides `PORT` automatically. The backend also supports `CLIENT_URL`, `FRONTEND_URL`, or comma-separated `CORS_ORIGIN` values for allowed frontend origins.

### Frontend on Vercel
Create a Vercel project from this repository with these settings:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Add this environment variable in Vercel:

```env
VITE_API_URL=https://cashly-smart-expense-analyzer.onrender.com/api
```

After Vercel gives you the final frontend URL, add it to Render's `CORS_ORIGIN` value and redeploy the backend if needed.

### Deployment Checks
- `https://cashly-smart-expense-analyzer.onrender.com/` should show `CASHLY Backend API is running`.
- `https://cashly-smart-expense-analyzer.onrender.com/api/test` should return `{ "message": "CASHLY API is running" }`.
- The frontend should build successfully with `npm run build` from the `client` directory.

---

## Future Improvements
- Implement Data Pagination for users with thousands of expenses.
- Add multi-currency support and currency conversion.
- Introduce Progressive Web App (PWA) capabilities for offline tracking.
- Expand OCR capabilities to handle multi-language receipts using cloud AI APIs.

---

## Team Members
- **[Student Name]** - Lead Developer
- **[Student Name]** - UI/UX Designer
- **[Student Name]** - Database Architect
