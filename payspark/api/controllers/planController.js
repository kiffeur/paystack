const Plans = require('../models/Plan');

async function getAllPlans(req, res) {
  try {
    const plans = await Plans.find().exec();
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des plans' });
  }
}

module.exports = { getAllPlans };