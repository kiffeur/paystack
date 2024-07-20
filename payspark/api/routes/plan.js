const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// GET /api/plans - Récupérer tous les plans de souscription
router.get('/', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        console.error('Erreur lors de la récupération des plans de souscription:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
});

// POST /api/plans - Créer un nouveau plan de souscription
router.post('/', async (req, res) => {
    const { name, description, price, duration } = req.body;

    try {
        const newPlan = new Plan({ name, description, price, duration });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        console.error('Erreur lors de la création d\'un plan de souscription:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
});

module.exports = router;
