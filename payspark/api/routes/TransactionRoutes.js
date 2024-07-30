const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const transactionController = require('../controllers/transactionController');





// Récupérer toutes les transactions pour un utilisateur
//router.get('/:id', transactionController.getTransactionByUserId);


// Créer une nouvelle transaction pour un utilisateur


module.exports = router;