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
const TransactionRoutes = require('./routes/TransactionRoutes')
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
app.use(express.json());


// Middleware pour vérifier la localisation
/*function restrictAccess(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);

  if (geo && (geo.country === 'CM' || geo.country === 'GA')) {
    next(); // Permettre l'accès si l'utilisateur est au Cameroun ou au Gabon
  } else {
    res.status(403).send('Accès refusé : le site n\'est accessible qu\'au Cameroun et au Gabon.');
  }
}

// Appliquer le middleware à toutes les routes
app.use(restrictAccess);
*/


app.use('/api', subscriptionRoutes);
//Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Authorization,Accept-Encoding');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

// Handle OPTIONS request
app.options('/api/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Accept-Language, Accept-Encoding');
  res.send(200);
});

// Handle POST request
app.post('/api/register', (req, res) => {
  // Your registration logic here
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Accept-Language, Accept-Encoding');
    res.send({
        status: true,
        code: 201,
    });
});



//------------------------------------------------------------------------------------------------



// Withdrawal endpoint
app.post('/api/users/:id/withdraw', async (req, res) => {
  try {
    const userId = req.params.id;
    const amount = req.body.amount;



    if (amount < 1500) {

      return res.status(400).json({ message: 'Minimum withdrawal is 1500' });
    }
    
    const user = await User.findById(userId);
    console.log(user.name + " " + 'possède la somme de :', user.soldeTotal);
    
    // If soldeTotal is not set or is 0, use soldeCompte as the default value
  
    const balance = user.soldeTotal || user.soldeCompte;
    
    if (!user || balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
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

    res.status(200).json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GetAll transaction endpoint



app.get('/api/users/:id/transactions', async (req, res) => {

  const userId = req.params.id;

  try {

    const user = await User.findById(userId);
    console.log(' trouvé utilisateur : ', user.name);
    if (!user) {

      res.status(404).json({ message: 'User not found' });
      return;

    }
    const transactions = await Transaction.find({ userId: user.id });
    res.json(transactions);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }

});




// Routes
app.use('/api/transactions', TransactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/Plans', subscriptionRoutes);
app.use('/api/plan', plansRoutes);



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
