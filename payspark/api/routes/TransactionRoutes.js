const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction'); // Assurez-vous d'importer votre modèle Transaction

// GET /api/transactions - Récupérer toutes les transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
});

module.exports = router;
