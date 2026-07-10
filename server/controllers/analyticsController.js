const Expense = require('../models/Expense');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Normalizes dates to UTC midnight so chart dates do not drift by timezone.
const startOfUtcDate = (date) => (
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
);

const toUtcDateKey = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildLastThirtyDayTrend = (dailyTotals, startDate, today) => {
  // Creates 30 chart points and fills missing days with 0.
  const totalsByDate = dailyTotals.reduce((acc, item) => {
    acc[item.date] = item.total;
    return acc;
  }, {});

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(startDate.getTime() + index * MS_PER_DAY);
    const dateKey = toUtcDateKey(date);

    if (date > today) return null;

    return {
      date: dateKey,
      total: totalsByDate[dateKey] || 0,
    };
  }).filter(Boolean);
};

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculates the user's all-time total spending.
    const totalExpensesAggr = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalExpenses = totalExpensesAggr.length > 0 ? totalExpensesAggr[0].totalAmount : 0;

    // Calculates spending from the first day of the current month.
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlySpendingAggr = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const monthlySpending = monthlySpendingAggr.length > 0 ? monthlySpendingAggr[0].totalAmount : 0;

    // Groups expenses by category for breakdown charts.
    const categorySummary = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', total: 1, _id: 0 } },
      { $sort: { total: -1 } }
    ]);

    const highestSpendingCategory = categorySummary.length > 0 ? categorySummary[0].category : 'N/A';

    // Shows the latest transactions on the dashboard.
    const recentTransactions = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    // Builds the Daily Spending chart for today - 29 days through today only.
    const today = startOfUtcDate(new Date());
    const tomorrow = new Date(today.getTime() + MS_PER_DAY);
    const startOfTrend = new Date(today.getTime() - (29 * MS_PER_DAY));
    
    const dailyTotals = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfTrend, $lt: tomorrow } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "UTC" } }, 
          total: { $sum: '$amount' } 
        } 
      },
      { $project: { date: '$_id', total: 1, _id: 0 } },
      { $sort: { date: 1 } }
    ]);
    const dailySpendingTrend = buildLastThirtyDayTrend(dailyTotals, startOfTrend, today);

    // Groups recent spending by month for monthly chart summaries.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySummary = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, 
          total: { $sum: '$amount' } 
        } 
      },
      { $project: { month: '$_id', total: 1, _id: 0 } },
      { $sort: { month: 1 } }
    ]);

    res.status(200).json({
      totalExpenses,
      monthlySpending,
      categorySummary,
      highestSpendingCategory,
      recentTransactions,
      dailySpendingTrend,
      monthlySummary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate Money Health Score
// @route   GET /api/analytics/money-health-score
// @access  Private
const getMoneyHealthScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const { monthlyIncome, savingsGoal } = req.user;

    const income = monthlyIncome || 0;
    const savings = savingsGoal || 0;

    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const currentMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfCurrentMonth }
    });

    const prevMonthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
    });

    const currentTotal = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const prevTotal = prevMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Starts at 100 and subtracts points when spending habits look risky.
    let score = 100;
    const suggestions = [];

    // Rule 1: compares current month spending against monthly income.
    if (income > 0) {
      const spendingRatio = currentTotal / income;
      if (spendingRatio > 0.8) {
        score -= 25;
        suggestions.push("You have spent more than 80% of your income. Try to reduce non-essential expenses.");
      } else if (spendingRatio > 0.6) {
        score -= 15;
        suggestions.push("You have spent more than 60% of your income. Keep an eye on your budget.");
      }
    } else {
      score -= 15;
      suggestions.push("Set your monthly income in your profile for a more accurate health score.");
    }

    // Rule 2: rewards users who set a savings goal.
    if (savings <= 0) {
      score -= 10;
      suggestions.push("Set a savings goal to stay motivated and build financial security.");
    }

    // Rule 3: checks if fun/non-essential categories are too high.
    const funExpenses = currentMonthExpenses.filter(e => e.category === 'Entertainment' || e.category === 'Shopping');
    const funTotal = funExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    if (currentTotal > 0 && (funTotal / currentTotal) > 0.3) {
      score -= 15;
      suggestions.push("Entertainment and Shopping make up over 30% of your spending. Consider cutting back here.");
    }

    // Rule 4: compares this month with last month.
    if (currentTotal > prevTotal && prevTotal > 0) {
      score -= 15;
      suggestions.push(`Your spending this month ($${currentTotal.toFixed(0)}) is higher than last month ($${prevTotal.toFixed(0)}).`);
    }

    // Rule 5: encourages proper categorization for better insights.
    const otherExpenses = currentMonthExpenses.filter(e => e.category === 'Other');
    if (currentMonthExpenses.length > 0 && (otherExpenses.length / currentMonthExpenses.length) > 0.2) {
      score -= 10;
      suggestions.push("Categorizing your 'Other' expenses will help you understand your spending habits better.");
    }

    score = Math.max(0, score);

    let status = 'Risky';
    if (score >= 80) status = 'Excellent';
    else if (score >= 60) status = 'Good';
    else if (score >= 40) status = 'Needs Improvement';

    if (suggestions.length === 0) {
      suggestions.push("Great job! You are managing your finances perfectly.");
    }

    res.status(200).json({
      score,
      status,
      explanation: "Your Money Health Score is calculated based on your income, savings goals, and spending habits compared to previous periods.",
      suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalyticsSummary,
  getMoneyHealthScore
};
