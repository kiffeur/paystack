/*const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateInviteCode = () => {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.registerUser = async (req, res) => {
  const { name, phone, password, inviteCode } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Le numéro de téléphone est déjà utilisé' });
    }

    const inviter = await User.findOne({ inviteCode });
    if (!inviter) {
      return res.status(400).json({ message: 'Invalid invite code' });
    }

    let newInviteCode = generateInviteCode();
    while (await User.findOne({ inviteCode: newInviteCode })) {
      newInviteCode = generateInviteCode();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      salt,
      inviteCode: newInviteCode,
      invitedBy: inviteCode,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};

exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    console.log('Input phone:', phone);
    console.log('Input password:', password);

    const query = { phone: phone.trim().toLowerCase() };
    console.log('Database query:', query);

    const user = await User.findOne(query);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Utilisateur ou mot de passe non trouvé' });
    }

    console.log('Hashed password:', user.password);
    console.log('Salt:', user.salt);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValid);

    if (!isValid) {
      console.log('Invalid password');
      return res.status(404).json({ message: 'Utilisateur ou mot de passe non trouvé' });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};

*/
const Transaction = require('../models/transaction');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateInviteCode = () => {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.registerUser = async (req, res) => {
  const { name, phone, password, inviteCode } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Le numéro de téléphone est déjà utilisé' });
    }

    const inviter = await User.findOne({ inviteCode });
    if (!inviter) {
      return res.status(400).json({ message: 'Invalid invite code' });
    }

    let newInviteCode = generateInviteCode();
    while (await User.findOne({ inviteCode: newInviteCode })) {
      newInviteCode = generateInviteCode();
    }

    const newUser = new User({
      name,
      phone,
      password,
      inviteCode: newInviteCode,
      invitedBy: inviteCode,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};

exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    console.log('Input phone:', phone);
    console.log('Input password:', password);

    const query = { phone: phone.trim().toLowerCase() };
    console.log('Database query:', query);

    const user = await User.findOne(query);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Utilisateur ou mot de passe non trouvé' });
    }

    if (user.password!== password) {
      console.log('Invalid password');
      return res.status(404).json({ message: 'Utilisateur ou mot de passe non trouvé' });
    }

    const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        'mireilebeatrice',
        { expiresIn: '1h' }
      );

    res.status(200).json({ 
      token,
      user:{
        id : user._id,
        phone : user.phone,
        name : user.name,
        password : user.password

      },
  
      token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};



//--------------------------------------------------------------------------------
// Fonction pour obtenir un utilisateur par ID
/*exports.getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Erreur du serveur' });
  }
};
*/

/*exports.getUserById = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store the decoded user in the request object

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
*/


//-------------------------------------------------------------------------------------
//RECENT CODE QUE J'UTILISAIS 
/*exports.getUserById = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]; // Extract token without Bearer prefix
  console.log('Received token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; // store the decoded user in the request object

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
*/

//--------------------------------------------------------------------------------------

exports.getUserById = async (req, res) => {

  const token = req.headers['authorization'].split(' ')[1]; // Extract token without Bearer prefix
  console.log('Received token:', token);


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: no token provided' });
  }
  const secretKey = process.env.SECRET_KEY || 'mireilebeatrice'; // Replace with your secret key
  try {
    const decoded = jwt.verify(token, secretKey); // Provide the secret key to jwt.verify()
    console.log('Decoded token:', decoded);
    req.user = decoded; // store the decoded user in the request object
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });

  }

};



// exports.getUserByPhone = async (req, res) => {
  exports.getUserByPhone = async (req, res) => {
    try {
      // Récupération du numéro de téléphone depuis les paramètres de la requête
      const phone = req.params.phone;
      console.log(`Requête reçue pour le numéro de téléphone: ${phone}`);
  
      // Vérification si le numéro de téléphone est fourni
      if (!phone) {
        return res.status(400).json({ message: 'Numéro de téléphone manquant' });
      }
  
      // Vérification si le numéro de téléphone est correctement formaté
      // Ici, vous pouvez ajouter une regex pour valider le format du numéro de téléphone
      // const phoneRegex = /^(\+33|0)[1-9]([-. ]?[0-9]{2}){4}$/; // Exemple de regex pour les numéros français
      // if (!phoneRegex.test(phone)) {
      //   return res.status(400).json({ message: 'Numéro de téléphone mal formaté' });
      // }
  
      console.log(`Recherche de l'utilisateur avec le numéro de téléphone: ${phone}`);
  
      // Recherche de l'utilisateur dans la base de données
      const user = await User.findOne({ phone: phone });
      console.log('Utilisateur trouvé:', user);
  
      // Gestion du cas où l'utilisateur n'est pas trouvé
      if (!user) {
        console.log('Utilisateur non trouvé');
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Retour des informations de l'utilisateur
      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  };


  exports.createTransaction = async (req, res) => {

    try {
      const userId = req.params.userId;
      const { type, amount, description, date } = req.body;
  
      // Create a new transaction
      const transaction = new Transaction({
          userId,
          type,
          amount,
          description,
          date,
      });
    
      // Save the transaction to the database
      await transaction.save();
      // Send the transaction as a response
      res.status(201).json(transaction);
    } catch (error) {  
      console.error('Error creating transaction:', error);
      res.status(500).json({ message: 'Internal server error' });
  
    }
  
  };