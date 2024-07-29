// const Subscription = require('../models/Souscriptions');
// const User = require('../models/User');
// const Plan = require('../models/Plan');
// const schedule = require('node-schedule');

// /*exports.subscribeUserToPlan = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const planId = req.body.id;

//     console.log('Received userId:', userId);
//     console.log('Received planId:', planId);

//     // Check if both userId and planId are defined
//     if (!userId ||!planId) {
//       console.log('Missing userId or planId');
//       return res.status(400).json({ message: 'Both userId and planId are required' });
//     }

//     // Find the user and plan documents
//     let user, plan;
//     try {
//       user = await User.findById(userId);
//       plan = await Plan.findById(planId);
//     } catch (error) {
//       console.error(`Error finding user or plan: ${error}`);
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     console.log('Found user:', user);
//     console.log('Found plan:', plan);

//     // Check if both user and plan are found
//     if (!user ||!plan) {
//       console.log('User or plan not found');
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     // Check if user's balance is sufficient to subscribe to the plan
//     if (user.soldeTotal < plan.price) {
//       console.log('Insufficient balance');
//       return res.status(402).json({ message: 'Solde insuffisant pour souscrire à l\'abonnement' });
//     }

//     // Créer une nouvelle souscription
//     const newSubscription = new Subscription({
//       userId,
//       planId,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Durée du plan en millisecondes
//     });

//     // Enregistrer la nouvelle souscription
//     await newSubscription.save();

//     // Ajouter la nouvelle souscription à la liste des abonnements de l'utilisateur
//     user.subscribedPlans.push({
//       planId,
//       startDate: newSubscription.startDate,
//       endDate: newSubscription.endDate
//     });

//     // Débiter le solde total de l'utilisateur et créditer le revenu du projet
//     user.soldeTotal -= plan.price;
//     user.revenusProjet += plan.price;
//     await user.save();

//     res.status(201).json({ message: 'Abonnement réussi', subscription: newSubscription });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur du serveur' });
//   }
// };
// */

// /*exports.subscribeUserToPlan = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const planId = req.body.id;

//     console.log('Received userId:', userId);
//     console.log('Received planId:', planId);

//     // Check if both userId and planId are defined
//     if (!userId ||!planId) {
//       console.log('Missing userId or planId');
//       return res.status(400).json({ message: 'Both userId and planId are required' });
//     }

//     // Find the user and plan documents
//     let user, plan;
//     try {
//       user = await User.findById(userId);
//       plan = await Plan.findById(planId);
//     } catch (error) {
//       console.error(`Error finding user or plan: ${error}`);
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     console.log('Found user:', user);
//     console.log('Found plan:', plan);

//     // Check if both user and plan are found
//     if (!user ||!plan) {
//       console.log('User or plan not found');
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     // Check if user's balance is sufficient to subscribe to the plan
//     if (user.soldeTotal < plan.price) {
//       console.log('Insufficient balance');
//       return res.status(402).json({ message: 'Solde insuffisant pour souscrire à l\'abonnement' });
//     }

//     // Créer une nouvelle souscription
//     const newSubscription = new Subscription({
//       userId,
//       planId,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Durée du plan en millisecondes
//     });

//     // Enregistrer la nouvelle souscription
//     await newSubscription.save();

//     // Débiter le solde total de l'utilisateur et créditer le revenu du projet
//     user.soldeTotal -= plan.price;
//     user.revenusProjet += plan.price * (plan.benefice / 100);



//     // Incrementer le revenu du projet chaque jour jusqu'à la date de fin de l'abonnement
//     const dailyIncrement = plan.price * (plan.benefice / 100);
//     const endDate = newSubscription.endDate;
//     const now = new Date();
//     while (now < endDate) {
//       user.revenusProjet += dailyIncrement;
//       now.setDate(now.getDate() + 1);
//     }

//     // Créditer le parrain de la moitié du bénéfice de l'utilisateur

//     if (user.invitedBy) {
//       const parrain = await User.findOne({ inviteCode: user.invitedBy });
//       if (parrain) {
//         parrain.invitations += plan.price * (plan.benefice / 200);
//         console.log('nous avons crédité avec succès : ' , parrain.name);

//         await parrain.save();

//       }

//     }

//     await user.save();

//     // Ajouter la nouvelle souscription à la liste des abonnements de l'utilisateur
//     user.subscribedPlans.push({
//       planId,
//       startDate: newSubscription.startDate,
//       endDate: newSubscription.endDate
//     });

//     await user.save();

//     res.status(201).json({ message: 'Abonnement réussi', subscription: newSubscription });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur du serveur' });
//   }
// };
// */

// exports.subscribeUserToPlan = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const planId = req.body.id;

//     console.log('Received userId:', userId);
//     console.log('Received planId:', planId);

//     // Check if both userId and planId are defined
//     if (!userId ||!planId) {
//       console.log('Missing userId or planId');
//       return res.status(400).json({ message: 'Both userId and planId are required' });
//     }

//     // Find the user and plan documents
//     let user, plan;
//     try {
//       user = await User.findById(userId);
//       plan = await Plan.findById(planId);
//     } catch (error) {
//       console.error(`Error finding user or plan: ${error}`);
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     console.log('Found user:', user);
//     console.log('Found plan:', plan);

//     // Check if both user and plan are found
//     if (!user ||!plan) {
//       console.log('User or plan not found');
//       return res.status(404).json({ message: 'User or plan not found' });
//     }

//     // Check if user has enough balance
//     if (user.soldeTotal < plan.price) {
//       return res.status(402).json({ message: 'Solde insuffisant' });
//     }

//     // Créer une nouvelle souscription
//     const newSubscription = new Subscription({
//       userId,
//       planId,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Durée du plan en millisecondes
//     });

//     // Enregistrer la nouvelle souscription
//     await newSubscription.save();

//     // Débiter le solde total de l'utilisateur et créditer le revenu du projet
//     user.soldeTotal -= plan.price;
//     //user.revenusProjet += plan.price * (plan.benefice / 100);
//     await user.save();

//     // Incrémenter le revenu du projet chaque jour pendant 60 jours
//     const now = new Date();
//     const rule = new schedule.RecurrenceRule();
//     rule.hour = now.getHours();
//     console.log(rule.hour);
//     rule.minute = now.getMinutes();
//     console.log(rule.minute);
    
//     const job = schedule.scheduleJob(rule, async () => {
//       const currentDate = new Date();
//       if (currentDate < newSubscription.endDate) {
//         const benefice = plan.price * (plan.benefice / 100);
//         user.revenusProjet += benefice;
//         console.log('Le bénéfice est donc de ', benefice);
//         await user.save();
//       } else {
//         job.cancel();
//       }
//     });
    


//     /*const now = new Date();
//     const rule = new schedule.RecurrenceRule();
//     rule.hour = now.getHours();
//     console.log(rule.hour);
//     rule.minute = now.getMinutes();
//     console.log(rule.minute);
    
//     const job = schedule.scheduleJob(rule, async () => {
//       const currentDate = new Date();
//       if (currentDate < newSubscription.endDate) {
//         const benefice = plan.price * (plan.benefice / 100);
//         user.revenusProjet += benefice;
//         console.log('Le bénéfice est donc de ', benefice);
//         await user.save();
//       } else {
//         job.cancel();
//       }
//     });
//     */
    
//     // Incrémenter le solde invitations du parrain si l'utilisateur a été invité
//     if (user.invitedBy) {
//       const parain = await User.findOne({ inviteCode: user.invitedBy });
//       if (parain) {
//         await incrementParainSoldeInvitations(parain.id, plan.price * (plan.benefice / 200));
//       }
//     }

//     res.status(201).json({ message: 'Abonnement réussi', subscription: newSubscription });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur du serveur' });
//   }
// };

// async function incrementParainSoldeInvitations(parainId, benefice) {
//   try {
//     const parain = await User.findById(parainId);
//     if (parain) {
//       parain.invitations += benefice ;
//       console.log('le solde invitations de ',parain.name + "" + 'a bien été augmenté' + "" + 'de la somme de ',benefice);
//       await parain.save();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// // exports.userSubscriptions.js
//  /*exports.userSubscriptions = async (req, res) => {
  /*try {
    const userId = req.params.id;
    const subscriptions = await Subscription.find({ userId });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//module.exports = { userSubscriptions };
*/

//------------------------------------------------------------------------//

const Subscription = require('../models/Souscriptions');
const User = require('../models/User');
const Plan = require('../models/Plan');
const schedule = require('node-schedule');

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
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });

    await newSubscription.save();

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


