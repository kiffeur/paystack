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

    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
};

//récupérer utilisateur par le ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
};


 
