const Expense = require('../models/Expense');

const priorityRank = { high: 3, medium: 2, low: 1 };

const formatPercent = (value) => `${Math.round(value)}%`;

// Adds one Smart Advice item to the response list.
const addAdvice = (recommendations, title, message, action, priority, category) => {
  recommendations.push({ title, message, action, priority, category });
};

// Suggests a small realistic cutback amount based on spending size.
const getReductionAmount = (amount, ratio = 0.18) => {
  if (amount <= 0) return 0;

  const step = amount >= 1000 ? 100 : 50;
  const target = Math.min(amount, Math.max(step, amount * ratio));
  return Math.min(amount, Math.ceil(target / step) * step);
};

// Gives helpful starter advice when the user has no expense history yet.
const buildBeginnerAdvice = (income, savingsGoal, formatCurrency) => {
  const recommendations = [];

  addAdvice(
    recommendations,
    'Start with your first expense',
    'You have not added any expenses yet, so CASHLY needs a few transactions to learn your spending pattern.',
    'Add today\'s expenses like Food, Transport, or Bills to unlock useful advice.',
    'low',
    'Getting started'
  );

  addAdvice(
    recommendations,
    income > 0 ? 'Your income is ready for insights' : 'Set your monthly income',
    income > 0
      ? `Your monthly income is set to ${formatCurrency(income)}. Once you add expenses, CASHLY can compare spending against it.`
      : 'Monthly income is not set yet, so budget advice will be less precise.',
    income > 0
      ? 'Add at least 5 expenses this week for better recommendations.'
      : 'Add your monthly income in Profile for more accurate budget advice.',
    'low',
    'Budget'
  );

  addAdvice(
    recommendations,
    savingsGoal > 0 ? 'Keep your savings goal visible' : 'Create a simple savings goal',
    savingsGoal > 0
      ? `Your savings goal is ${formatCurrency(savingsGoal)}. Tracking daily expenses will show how much you can safely save.`
      : 'A savings goal helps CASHLY turn spending insights into clear next steps.',
    savingsGoal > 0
      ? 'Record small daily purchases so you can protect your savings goal.'
      : 'Set a realistic savings goal and review it each month.',
    'low',
    'Savings'
  );

  return recommendations;
};

// Ensures the user always receives enough advice cards to display.
const fillAdvice = (recommendations, context, formatCurrency) => {
  const {
    income,
    savingsGoal,
    totalSpending,
    incomeUsagePercent,
    topCategory,
    categoryTotals,
  } = context;

  if (recommendations.length < 3 && topCategory) {
    addAdvice(
      recommendations,
      `${topCategory.category} is your biggest category`,
      `You spent ${formatCurrency(topCategory.total)} on ${topCategory.category} this month, which is ${formatPercent(topCategory.percent)} of total spending.`,
      `Set a small weekly limit for ${topCategory.category} and review it before your next purchase.`,
      'low',
      topCategory.category
    );
  }

  if (recommendations.length < 3 && income > 0 && totalSpending > 0) {
    const remainingIncome = Math.max(income - totalSpending, 0);
    addAdvice(
      recommendations,
      'Plan the rest of the month',
      `You have used ${formatPercent(incomeUsagePercent)} of your monthly income, with ${formatCurrency(remainingIncome)} left before income is fully used.`,
      'Pick a simple weekly spending limit for the days left in this month.',
      incomeUsagePercent > 60 ? 'medium' : 'low',
      'Budget'
    );
  }

  if (recommendations.length < 3 && savingsGoal > 0) {
    addAdvice(
      recommendations,
      'Keep your savings goal moving',
      `Your current savings goal is ${formatCurrency(savingsGoal)}.`,
      'Move a small fixed amount toward savings before spending on extras.',
      'low',
      'Savings'
    );
  }

  if (recommendations.length < 3 && categoryTotals.Other) {
    addAdvice(
      recommendations,
      'Your expenses are easier to read when categorized',
      `You have ${formatCurrency(categoryTotals.Other)} marked as Other this month.`,
      'Rename or recategorize unclear expenses so future advice becomes more accurate.',
      'low',
      'Other'
    );
  }

  if (recommendations.length < 3) {
    addAdvice(
      recommendations,
      'Keep checking your spending weekly',
      `You recorded ${formatCurrency(totalSpending)} in expenses this month.`,
      'Review your top categories once a week and adjust before spending grows.',
      'low',
      'Tracking'
    );
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    // Uses profile values and current-month expenses to generate advice.
    const userId = req.user._id;
    const income = Number(req.user.monthlyIncome) || 0;
    const savingsGoal = Number(req.user.savingsGoal) || 0;
    const currency = req.user.currency || '$';

    const formatCurrency = (value) => {
      const amount = Number(value) || 0;
      const hasCents = Math.abs(amount % 1) > 0.005;
      return `${currency}${amount.toLocaleString(undefined, {
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: hasCents ? 2 : 0,
      })}`;
    };

    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Loads total history count and this month's expenses together.
    const [allExpenseCount, expenses] = await Promise.all([
      Expense.countDocuments({ user: userId }),
      Expense.find({
        user: userId,
        date: { $gte: startOfCurrentMonth },
      }),
    ]);

    if (allExpenseCount === 0) {
      return res.status(200).json(buildBeginnerAdvice(income, savingsGoal, formatCurrency));
    }

    const recommendations = [];

    if (expenses.length === 0) {
      addAdvice(
        recommendations,
        'Start tracking this month',
        'You have expenses saved before, but none have been added for this month yet.',
        'Add your latest expenses so this month\'s advice can use fresh spending data.',
        'low',
        'Tracking'
      );

      addAdvice(
        recommendations,
        income > 0 ? 'Your budget is ready to compare' : 'Add income for clearer budget advice',
        income > 0
          ? `Your monthly income is ${formatCurrency(income)}, ready to compare once expenses are added.`
          : 'Monthly income is missing, so CASHLY cannot measure spending against your budget yet.',
        income > 0
          ? 'Add at least 5 expenses this month for stronger insights.'
          : 'Update your Profile with monthly income.',
        'low',
        'Budget'
      );

      addAdvice(
        recommendations,
        'Build a simple weekly habit',
        'A few small entries each week are enough to reveal useful patterns.',
        'Record Food, Transport, and Shopping expenses as soon as they happen.',
        'low',
        'Tracking'
      );

      return res.status(200).json(recommendations);
    }

    // Builds category totals so advice can target the biggest spending areas.
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((totals, exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
      return totals;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        total,
        percent: totalSpending > 0 ? (total / totalSpending) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const topCategory = categoryBreakdown[0];
    const topCategories = categoryBreakdown.slice(0, 3).map((item) => item.category);
    const incomeUsagePercent = income > 0 ? (totalSpending / income) * 100 : 0;

    if (expenses.length < 5) {
      const remaining = 5 - expenses.length;
      addAdvice(
        recommendations,
        'Add a few more expenses',
        `You have added ${expenses.length} expense${expenses.length === 1 ? '' : 's'} this month, so insights may still be early.`,
        `Add ${remaining} more expense${remaining === 1 ? '' : 's'} for a clearer spending picture.`,
        'low',
        'Tracking'
      );
    }

    // Rule-based advice: high income usage becomes high-priority budget advice.
    if (income > 0 && incomeUsagePercent > 80) {
      addAdvice(
        recommendations,
        'You are close to your income limit',
        `You have already used ${formatPercent(incomeUsagePercent)} of your monthly income (${formatCurrency(totalSpending)} of ${formatCurrency(income)}).`,
        'Pause non-essential spending like Shopping and Entertainment for the next few days.',
        'high',
        'Budget'
      );
    } else if (income > 0 && incomeUsagePercent > 60) {
      addAdvice(
        recommendations,
        'Monthly spending is climbing',
        `You have used ${formatPercent(incomeUsagePercent)} of your monthly income (${formatCurrency(totalSpending)} of ${formatCurrency(income)}).`,
        'Set a weekly spending limit for the rest of this month.',
        'medium',
        'Budget'
      );
    }

    const foodTotal = categoryTotals.Food || 0;
    const foodPercent = totalSpending > 0 ? (foodTotal / totalSpending) * 100 : 0;
    if (foodTotal > 0 && foodPercent > 35) {
      const reduction = getReductionAmount(foodTotal);
      addAdvice(
        recommendations,
        'Food spending is getting high',
        `You spent ${formatCurrency(foodTotal)} on Food this month, which is ${formatPercent(foodPercent)} of your total spending.`,
        `Try reducing Food expenses by ${formatCurrency(reduction)} next week.`,
        'medium',
        'Food'
      );
    }

    const shoppingTotal = categoryTotals.Shopping || 0;
    const entertainmentTotal = categoryTotals.Entertainment || 0;
    const nonEssentialTotal = shoppingTotal + entertainmentTotal;
    const nonEssentialPercent = totalSpending > 0 ? (nonEssentialTotal / totalSpending) * 100 : 0;
    if (nonEssentialTotal > 0 && nonEssentialPercent > 30) {
      const reduction = getReductionAmount(nonEssentialTotal, 0.2);
      addAdvice(
        recommendations,
        'Non-essential spending is growing',
        `Shopping and Entertainment add up to ${formatCurrency(nonEssentialTotal)}, which is ${formatPercent(nonEssentialPercent)} of your spending.`,
        `Delay one extra purchase and aim to save about ${formatCurrency(reduction)} this week.`,
        'medium',
        'Shopping & Entertainment'
      );
    }

    const transportTotal = categoryTotals.Transport || 0;
    if (transportTotal > 0 && topCategories.includes('Transport')) {
      const transportPercent = (transportTotal / totalSpending) * 100;
      const transportRank = categoryBreakdown.findIndex((item) => item.category === 'Transport') + 1;
      addAdvice(
        recommendations,
        'Transport is one of your top costs',
        `You spent ${formatCurrency(transportTotal)} on Transport this month, making it your #${transportRank} category at ${formatPercent(transportPercent)} of spending.`,
        'Try one lower-cost trip this week, like sharing a ride or using public transport.',
        transportPercent > 20 ? 'medium' : 'low',
        'Transport'
      );
    }

    const otherTotal = categoryTotals.Other || 0;
    const otherPercent = totalSpending > 0 ? (otherTotal / totalSpending) * 100 : 0;
    if (otherTotal > 0 && otherPercent > 20) {
      addAdvice(
        recommendations,
        'Too much spending is marked as Other',
        `You have ${formatCurrency(otherTotal)} in Other this month, which is ${formatPercent(otherPercent)} of total spending.`,
        'Recategorize unclear expenses so CASHLY can give more accurate advice.',
        otherPercent > 30 ? 'medium' : 'low',
        'Other'
      );
    }

    const hasHealthyIncome = income > 0 && incomeUsagePercent < 60;
    if (hasHealthyIncome) {
      const remainingIncome = income - totalSpending;
      addAdvice(
        recommendations,
        'Great job staying under budget',
        `You are using ${formatPercent(incomeUsagePercent)} of your monthly income, leaving about ${formatCurrency(remainingIncome)} unspent.`,
        savingsGoal > 0
          ? 'Move extra money toward your savings goal while spending is still healthy.'
          : 'Move a small amount into savings before spending on extras.',
        'low',
        'Savings'
      );
    }

    if (income <= 0) {
      addAdvice(
        recommendations,
        'Add income for sharper advice',
        `You recorded ${formatCurrency(totalSpending)} in spending this month, but monthly income is not set.`,
        'Add your monthly income in Profile so CASHLY can compare spending against your budget.',
        'low',
        'Budget'
      );
    }

    fillAdvice(recommendations, {
      income,
      savingsGoal,
      totalSpending,
      incomeUsagePercent,
      topCategory,
      categoryTotals,
    }, formatCurrency);

    // Sends the most important advice first and limits the list for the UI.
    const sortedRecommendations = recommendations
      .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority])
      .slice(0, 5);

    res.status(200).json(sortedRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendations,
};
