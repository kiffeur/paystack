

/*------------------------------ Hebergement en ligne--------------------------------------*/
//const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
//import 'dotenv/config';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const plansRoutes = require('./routes/plan');
const User = require('./models/User');
const Transaction = require('../api/models/transaction');
const Subscription = require('./models/Souscriptions');
const VerificationChain = require('./models/VerificationChain');
// bloquer les IP : adresse et ne permettre l'accès qu'au cameroun et au gabon
const geoip = require('geoip-lite');
//const TransactionsRoutes = require('./routes/TransactionRoutes');
const cors = require('cors');
//const dailyReturns = require('./cronJobs/dailyReturns');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Middleware
app.use(bodyParser.json());


app.use('/api', subscriptionRoutes);
//Add CORS middleware



//------------------------------------------------------------------------------------------------



// Withdrawal endpoint
// Withdrawal endpoint
app.post('/api/users/:id/withdraw', async (req, res) => {
  try {
    const userId = req.params.id;
    const amount = req.body.amount;



    if (amount < 1500) {

      return res.status(400).json({ message: 'Montant minimum de retrait est 2000' });
    }
    
    const user = await User.findById(userId);
    console.log(user.name + " " + 'possède la somme de :', user.soldeTotal);
    
    // If soldeTotal is not set or is 0, use soldeCompte as the default value
  
    const balance = user.soldeTotal || user.soldeCompte;
    
    if (!user || balance < amount) {
      return res.status(400).json({ message: 'Votre solde est insuffisant' });
    }

    // Ajouter une transaction 

    const transaction = new Transaction({

  type: 'Retrait',
  userId: new mongoose.Types.ObjectId(userId),
  amount: req.body.amount,
  date: new Date(),
  description: `Retrait de ${req.body.amount}`
    
    });
     
    transaction.save().then(() => {
      console.log(`Transaction enregistrée : ${transaction.description}` + 'pour le gars dont le Id est :', userId);
    }).catch((err) => {
    
      console.error(err);
    });

    user.soldeTotal -= amount;
    user.totalRetrait += amount;
    await user.save();

    res.status(200).json({ message: 'Votre demande de retrait a été validée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recharger le compte 
app.post('/api/users/:id/recharge', async (req, res) => {
  const userId = req.params.id;
  const amount = req.body.amount;
  const verificationChain = req.body.verificationChain;

  console.log('identifiant reçu est :', userId);
  console.log('montant reçu est :', amount);
  console.log('ID transaction reçu est :', verificationChain);
  

  // Add a regex pattern to validate the verificationChain
  const verificationChainPattern = /^(?:[A-Z0-9]{8}\.[A-Z0-9]{4}\.[A-Z0-9]{6}|9\d{9})$/;

if (!verificationChainPattern.test(verificationChain)) {
  return res.status(400).json({ message: 'Format invalide' });
}
  

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the verification chain exists and has not been used before
    const existingChain = await VerificationChain.findOne({ chain: verificationChain, used: false });
    if (!existingChain) {
      return res.status(400).json({ message: 'Id Transaction invalide' });
    }

    // Update user's balance
    user.soldeCompte += amount;
    await user.save();

    // Mark the verification chain as used
    existingChain.used = true;
    await existingChain.save();

    // Create a new transaction
    const transaction = new Transaction({
      type: 'Recharge',
      userId: user.id,
      amount: amount,
      verificationChain: verificationChain,
      description : 'recharge de la somme de ' + amount ,
      date: new Date()
    });
    await transaction.save();

    res.json({ message: 'Recharge successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




// GetAll transaction endpoint


//Récupérer les transaction d'un utilisateurs
app.get('/api/users/:id/transactions', async (req, res) => {

  const userId = req.params.id;

  try {

    const user = await User.findById(userId);
    console.log(' trouvé utilisateur : ', user.name);
    if (!user) {

      res.status(404).json({ message: 'User not found' });
      return;
n
    }
    const transactions = await Transaction.find({ userId: user.id });
    res.json(transactions);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }

});


// Récupérer les souscriptions d'un utilisateur
app.get('/api/subscriptions/:id', async (req, res) => {

  const userId = req.params.id;

  try {

    const subscriptions = await Subscription.find({ userId: userId });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving subscriptions' });
  }

});





// Routes
app.use('/api/users', userRoutes);
app.use('/api/Plans', subscriptionRoutes);
app.use('/api/plan', plansRoutes);



// MongoDB connection
//mongodb+srv://emmanuel:Babibou237@payspark.fsc0ilg.mongodb.net/
 
/*
 mongoose.connect('mongodb+srv://emmanuel:Babibou237@payspark.fsc0ilg.mongodb.net/')
   .then(() => {
     console.log('Connected to MongoDB');
   })
   .catch(err => {
     console.error('Error connecting to MongoDB', err);
   });
app.listen(PORT, () => {
   console.log('Server running on port http://localhost:',PORT);
 });
*/


// MongoDB connection


mongoose.connect('mongodb://localhost:27017/payspark')
   .then(() => {
     console.log('Connected to MongoDB');
   })
   .catch(err => {
     console.error('Error connecting to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
