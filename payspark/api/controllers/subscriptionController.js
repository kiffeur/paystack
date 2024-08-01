
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
      price : plan.price,
      description : plan.description,
      statuts : true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });

    await newSubscription.save();


    const transaction = new Transaction({

      type: 'Souscription',
      userId: new mongoose.Types.ObjectId(userId),
      amount: plan.price,
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

    
    
const rule = new schedule.RecurrenceRule();
const now = new Date();
rule.hour = now.getHours();
rule.minute = now.getMinutes();
rule.second = 0; // Run at 0 seconds (start of the minute)

// Set the job to run daily, at the same hour and minute
rule.day = new schedule.Range(1, 31); // Run every day of the month

const job = schedule.scheduleJob(rule, async () => {
  try {
    console.log('Jobs is running');
    const currentDate = new Date();
    if (currentDate < newSubscription.endDate) {
      const user = await User.findById(userId);
      const benefice = plan.price * (plan.benefice / 100);
      user.revenusProjet += benefice;
      await user.save();
    } else {
      newSubscription.statuts = false;
      job.cancel();
    }
  } catch (error) {
    console.error('Error updating user revenusProjet:', error);
  }
});

// To delay the first payment by 1 day, we can use setTimeout
setTimeout(() => {
  job.invoke(); // Manually invoke the job for the first time
}, 24 * 60 * 60 * 1000); // 1 day in milliseconds







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


