module.exports = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'BudgetBuddy API is running!'
    });
};
