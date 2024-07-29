const express = require('express');
const router = express.Router();
const plansController = require('../controllers/planController');

// GET /api/plans - Récupérer tous les plans de souscription

router.get('/plans', plansController.getAllPlans);



module.exports = router;
