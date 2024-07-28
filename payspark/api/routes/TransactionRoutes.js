const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// Récupérer toutes les transactions pour un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ userId });
    res.json(transactions);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions', error);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// Créer une nouvelle transaction pour un utilisateur
router.post('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { type, amount, description, date } = req.body;
    const transaction = new Transaction({ userId, type, amount, description, date });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erreur lors de la création de la transaction', error);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

module.exports = router;