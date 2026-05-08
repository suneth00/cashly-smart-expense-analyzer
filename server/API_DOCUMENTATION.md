# CASHLY API Documentation

This document outlines all backend REST API endpoints available in the CASHLY application.

## Base URL
Local Development: `http://localhost:5000/api`

---

## 1. Authentication Routes

### Register User
- **Method:** `POST`
- **Route:** `/auth/register`
- **Auth Required:** No
- **Description:** Creates a new user account and returns a JWT.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "monthlyIncome": 5000,
    "savingsGoal": 1000
  }
  ```
- **Response:**
  ```json
  {
    "_id": "64f1a...",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyIncome": 5000,
    "savingsGoal": 1000,
    "token": "eyJhbGci..."
  }
  ```

### Login User
- **Method:** `POST`
- **Route:** `/auth/login`
- **Auth Required:** No
- **Description:** Authenticates a user and returns a JWT.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** *(Same as Register)*

### Get Profile
- **Method:** `GET`
- **Route:** `/auth/profile`
- **Auth Required:** Yes (Bearer Token)
- **Description:** Returns the logged-in user's profile details.
- **Response:**
  ```json
  {
    "_id": "64f1a...",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyIncome": 5000,
    "savingsGoal": 1000,
    "createdAt": "2023-10-25T14:30:00.000Z"
  }
  ```

### Update Profile
- **Method:** `PUT`
- **Route:** `/auth/profile`
- **Auth Required:** Yes (Bearer Token)
- **Description:** Updates the user's name, income, or savings goal.
- **Request Body:**
  ```json
  {
    "name": "Johnathan Doe",
    "monthlyIncome": 6000
  }
  ```
- **Response:** *(Returns updated profile)*

---

## 2. Expense Routes

### Get All Expenses
- **Method:** `GET`
- **Route:** `/expenses`
- **Auth Required:** Yes
- **Description:** Retrieves all expenses for the authenticated user, sorted by date (newest first).
- **Response:**
  ```json
  [
    {
      "_id": "64f1b...",
      "user": "64f1a...",
      "title": "Groceries",
      "amount": 45.50,
      "category": "Food",
      "paymentMethod": "Credit Card",
      "date": "2023-10-25T00:00:00.000Z",
      "notes": "Whole Foods"
    }
  ]
  ```

### Add Expense
- **Method:** `POST`
- **Route:** `/expenses`
- **Auth Required:** Yes
- **Description:** Creates a new expense entry.
- **Request Body:**
  ```json
  {
    "title": "Groceries",
    "amount": 45.50,
    "category": "Food",
    "paymentMethod": "Credit Card",
    "date": "2023-10-25"
  }
  ```
- **Response:** *(Returns created expense object)*

### Update Expense
- **Method:** `PUT`
- **Route:** `/expenses/:id`
- **Auth Required:** Yes
- **Description:** Updates an existing expense by ID.
- **Request Body:**
  ```json
  {
    "amount": 50.00
  }
  ```
- **Response:** *(Returns updated expense object)*

### Delete Expense
- **Method:** `DELETE`
- **Route:** `/expenses/:id`
- **Auth Required:** Yes
- **Description:** Deletes an expense by ID.
- **Response:**
  ```json
  {
    "id": "64f1b..."
  }
  ```

---

## 3. Analytics Routes

### Get Analytics Summary
- **Method:** `GET`
- **Route:** `/analytics/summary`
- **Auth Required:** Yes
- **Description:** Returns aggregated data for dashboard charts.
- **Response:**
  ```json
  {
    "totalExpenses": 1450.75,
    "monthlySpending": 850.50,
    "categorySummary": [ { "category": "Food", "total": 450.25 } ],
    "highestSpendingCategory": "Food",
    "recentTransactions": [ ... ],
    "dailySpendingTrend": [ { "date": "2023-10-24", "total": 120.00 } ]
  }
  ```

### Get Money Health Score
- **Method:** `GET`
- **Route:** `/analytics/money-health-score`
- **Auth Required:** Yes
- **Description:** Evaluates financial health based on income and spending rules.
- **Response:**
  ```json
  {
    "score": 85,
    "status": "Excellent",
    "explanation": "Your Money Health Score is calculated based on...",
    "suggestions": [
      "Great job! You are managing your finances perfectly."
    ]
  }
  ```

---

## 4. Recommendation Routes

### Get Smart Recommendations
- **Method:** `GET`
- **Route:** `/recommendations`
- **Auth Required:** Yes
- **Description:** Returns rule-based financial advice.
- **Response:**
  ```json
  [
    {
      "title": "High Food Expenses",
      "message": "You're spending a significant amount on food...",
      "priority": "medium"
    }
  ]
  ```

---

## 5. OCR Scanner Routes

### Extract Receipt Text
- **Method:** `POST`
- **Route:** `/ocr/receipt`
- **Auth Required:** Yes
- **Description:** Upload an image (`multipart/form-data`) to extract text and generate a suggested expense using AI.
- **Request:**
  - Content-Type: `multipart/form-data`
  - Body: `receiptImage` (File)
- **Response:**
  ```json
  {
    "extractedText": "WHOLE FOODS MARKET\nTOTAL 45.50",
    "suggestedExpense": {
      "title": "WHOLE FOODS MARKET",
      "amount": 45.50,
      "date": "2023-10-25",
      "category": "Other"
    }
  }
  ```
