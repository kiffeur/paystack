const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({

  type: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  plan: String,
  date: Date,
  description: String,
  verificationChain : String


});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;