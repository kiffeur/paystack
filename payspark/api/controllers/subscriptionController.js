
//------------------------------------------------------------------------//
const Transaction = require('../models/transaction');
const Subscription = require('../models/Souscriptions');
const User = require('../models/User');
const Plan = require('../models/Plan');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

exports.subscribeUserToPlan = async (req, res) => {
  try {
    const userId = req.params.id;
    const planId = req.body.id;

    console.log('Received userId:', userId);
    console.log('Received planId:', planId);

    if (!userId || !planId) {
      return res.status(400).json({ message: 'Both userId and planId are required' });
    }

    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'User or plan not found' });
    }

    if (user.soldeTotal < plan.price) {
      return res.status(402).json({ message: 'Solde insuffisant' });
    }

    const newSubscription = new Subscription({
      userId,
      planId,
      plan : plan.name,
      statuts : true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });

    await newSubscription.save();


    const transaction = new Transaction({

      type: 'Souscription',
      userId: new mongoose.Types.ObjectId(userId),
      amount: req.body.amount,
      plan: plan.name,
      date: new Date(),
      description: `Souscription au forfait ${plan.name}`
    
    });
    

    transaction.save().then(() => {
      console.log(`Transaction enregistrée : ${transaction.description}` + 'pour le gars dont le Id est :', userId);
    }).catch((err) => {
    
      console.error(err);
    });

    user.soldeTotal -= plan.price;
    await user.save();

    const now = new Date();
    const rule = new schedule.RecurrenceRule();
    rule.hour = now.getHours();
    rule.minute = now.getMinutes();
    rule.second = now.getSeconds() + 5; // Add a delay to ensure the first run is in the future

    const job = schedule.scheduleJob(rule, async () => {
      const currentDate = new Date();
      if (currentDate < newSubscription.endDate) {
        const benefice = plan.price * (plan.benefice / 100);
        user.revenusProjet += benefice;
        await user.save();
      } else {
        newSubscription.statuts = false;
        job.cancel();
      }
    });

    if (user.invitedBy) {
      const parain = await User.findOne({ inviteCode: user.invitedBy });
      if (parain) {
        await incrementParainSoldeInvitations(parain.id, plan.price * (plan.benefice / 200));
      }
    }

    res.status(201).json({ message: 'Abonnement réussi', subscription: newSubscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

async function incrementParainSoldeInvitations(parainId, benefice) {
  try {
    const parain = await User.findById(parainId);
    if (parain) {
      parain.invitations += benefice;
      await parain.save();
    }
  } catch (error) {
    console.error(error);
  }
}


