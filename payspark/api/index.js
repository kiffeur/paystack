require('dotenv').config();
//import 'dotenv/config';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const plansRoutes = require('./routes/plan');
//const TransactionsRoutes = require('./routes/TransactionRoutes');
const cors = require('cors');
const dailyReturns = require('./cronJobs/dailyReturns');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Middleware
app.use(bodyParser.json());



//const cron = require('node-cron');
//cron.schedule('0 0 * * *', dailyReturns); // run daily at 00:00

//app.use('/api/transactions', TransactionsRoutes);
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



// Routes
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
