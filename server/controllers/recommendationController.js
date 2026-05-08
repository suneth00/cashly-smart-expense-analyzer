const Expense = require('../models/Expense');

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { monthlyIncome, savingsGoal } = req.user;

    const income = monthlyIncome || 0;
    const savings = savingsGoal || 0;

    // Get current month expenses
    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startOfCurrentMonth }
    });

    const recommendations = [];

    // Rule: No expenses exist
    if (expenses.length === 0) {
      recommendations.push({
        title: "Welcome to CASHLY",
        message: "Start adding your daily expenses to unlock personalized financial recommendations and insights.",
        priority: "high"
      });
      return res.status(200).json(recommendations);
    }

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Group by category
    const categories = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    // Rule: Total spending close to income (> 85%)
    if (income > 0 && (totalSpending / income) > 0.85) {
      recommendations.push({
        title: "Budget Warning",
        message: "Your total spending is very close to your monthly income. Focus on reducing flexible categories like Shopping and Entertainment immediately.",
        priority: "high"
      });
    }

    // Rule: Savings goal check
    if (savings > 0) {
      if (income > 0 && (totalSpending + savings > income)) {
        recommendations.push({
          title: "Savings Goal at Risk",
          message: `At your current spending rate, you may not reach your $${savings} savings goal. Review your recent transactions for cutbacks.`,
          priority: "high"
        });
      } else {
        recommendations.push({
          title: "Savings on Track",
          message: `Great job! If you maintain this spending rate, you are well on your way to hitting your $${savings} savings goal. Make sure to transfer it to your savings account.`,
          priority: "low"
        });
      }
    }

    // Rule: Food spending high (> 25% of total)
    if (categories['Food'] && (categories['Food'] / totalSpending) > 0.25) {
      recommendations.push({
        title: "High Food Expenses",
        message: "You're spending a significant amount on food. Consider meal prepping or reducing dining out to save money.",
        priority: "medium"
      });
    }

    // Rule: Transport high (> 20% of total)
    if (categories['Transport'] && (categories['Transport'] / totalSpending) > 0.20) {
      recommendations.push({
        title: "Transport Costs",
        message: "Your transportation costs are quite high. Look into public transit, carpooling, or biking for cheaper travel options.",
        priority: "medium"
      });
    }

    // Rule: Entertainment high (> 15% of total)
    if (categories['Entertainment'] && (categories['Entertainment'] / totalSpending) > 0.15) {
      recommendations.push({
        title: "Entertainment Budget",
        message: "Entertainment is taking up a large portion of your spending. Setting a strict weekly entertainment budget could help.",
        priority: "low"
      });
    }

    // Rule: Shopping high (> 15% of total)
    if (categories['Shopping'] && (categories['Shopping'] / totalSpending) > 0.15) {
      recommendations.push({
        title: "Shopping Habits",
        message: "Your shopping expenses are elevated. Try to distinguish between 'wants' and 'needs' to reduce non-essential purchases.",
        priority: "medium"
      });
    }

    // Fallback recommendations if we don't hit enough rules to make 3
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Review Subscriptions",
        message: "Regularly check your monthly subscriptions and cancel any services you no longer actively use.",
        priority: "low"
      });
    }
    
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Emergency Fund",
        message: "Always aim to keep at least 3-6 months of essential living expenses saved in an easily accessible emergency fund.",
        priority: "medium"
      });
    }

    // Sort by priority (high -> medium -> low)
    const priorityValues = { high: 3, medium: 2, low: 1 };
    recommendations.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);

    // Return exactly 3 to 5
    res.status(200).json(recommendations.slice(0, 5));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendations
};
