// Test Controller
const getTestMessage = (req, res) => {
  res.status(200).json({ message: "CASHLY API is running" });
};

module.exports = {
  getTestMessage,
};
