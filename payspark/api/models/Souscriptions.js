const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  planId: {type: mongoose.Schema.Types.ObjectId,ref: 'Plan',required: true},
  plan : { type: String, required: true },
  price : Number,
  description: String,
  statuts : Boolean,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);