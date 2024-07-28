const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true, enum: ['deposit', 'withdrawal'] },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },

});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;