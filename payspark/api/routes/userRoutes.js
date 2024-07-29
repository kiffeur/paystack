const express = require('express');
const {registerUser, loginUser, getUserById, getUserByPhone, withdraw} = require('../controllers/userController');
const Plan = require('../models/Plan');
const User = require('../models/User'); // Ajoutez cette ligne pour importer le modèle User si nécessaire
const Transaction = require('../models/transaction'); // Ajoutez cette ligne si vous avez un modèle Transaction

const router = express.Router();

router.use((req, res, next) => {
    console.log('CORS middleware executed');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

//router.get('/id', getUserById);

router.get('/:id', getUserById);

// route récupérer utilisateur par le numéro

router.get('/:phone', getUserByPhone);

// route pour effectuer un retrait



// Route pour récupérer le solde du compte
router.get('/balance', async (req, res) => {
    try {
        const user = await User.findOne({ /* condition pour trouver l'utilisateur */});

        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }

        res.json({balance: user.balance});
    } catch (error) {
        console.error('Erreur lors de la récupération du solde:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Récupérer les souscriptions de l'utilisateur
router.get('/subscription-plans', async (req, res) => {
    try {
        const subscriptionPlans = await Plan.find();
        res.json(subscriptionPlans);
    } catch (error) {
        console.error('Erreur lors de la récupération des forfaits de souscription:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Transactions journalières
router.get('/daily-transactions', async (req, res) => {
    try {
        const dailyTransactions = await Transaction.find({ /* condition pour filtrer les transactions de l'utilisateur */});
        res.json(dailyTransactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions quotidiennes:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Détails de la transaction
router.get('/transaction-details/:transactionId', async (req, res) => {
    const {transactionId} = req.params;

    try {
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({message: 'Transaction non trouvée'});
        }

        res.json(transaction);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la transaction:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Effectuer un retrait
router.post('/withdraw', async (req, res) => {
    const {amount} = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { /* condition pour trouver l'utilisateur */},
            {$inc: {balance: -amount}},
            {new: true}
        );

        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }

        res.json({message: `Retrait de ${amount} FCFA réussi`, newBalance: user.balance});
    } catch (error) {
        console.error('Erreur lors du retrait', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Effectuer un dépôt
router.post('/deposit', async (req, res) => {
    const {transactionId} = req.body;

    try {
        const transaction = await Transaction.findOne({transactionId});

        if (!transaction) {
            return res.status(404).json({message: 'Transaction non trouvée'});
        }

        const user = await User.findOneAndUpdate(
            { /* condition pour trouver l'utilisateur */},
            {$inc: {balance: transaction.amount}},
            {new: true}
        );

        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }

        res.json({message: 'Chargement du compte réussi', newBalance: user.balance});
    } catch (error) {
        console.error('Erreur lors du chargement du compte:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});

// Plans utilisateur
router.get('/plans', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        console.error('Erreur lors de la récupération des forfaits:', error);
        res.status(500).json({message: 'Erreur de serveur'});
    }
});



module.exports = router;
