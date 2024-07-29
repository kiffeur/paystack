// api/cronJobs/dailyReturns.js
const User = require('../models/User');
const Subscription = require('../models/Souscriptions');

const dailyReturns = async () => {
  const subscriptions = await Subscription.find({ endDate: { $gt: new Date() } }); // find active subscriptions

  for (const subscription of subscriptions) {
    const user = await User.findById(subscription.userId);
    const plan = await Plan.findById(subscription.planId);

    // Calculate daily return
    const dailyReturn = plan.price * (plan.returnPercentage / 100);

    // Update user's revenusProjet and soldeTotal
    user.revenusProjet += dailyReturn;
    user.soldeTotal += dailyReturn;
    await user.save();
  }
};

module.exports = dailyReturns;