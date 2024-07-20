const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateInviteCode = () => {
    return Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.registerUser = async (req, res) => {

    const { name, phone, password, inviteCode } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        phone,
        password: hashedPassword,
        inviteCode: newInviteCode,
        invitedBy: inviteCode,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
};

exports.loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        //Générer le token JWT
        const token = jwt.sign(
            { userId: user._id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(process.env.JWT_SECRET);
        //AUTHENTIFICATION REUSSIE

        res.status(200).json({ message: 'Authentification réussie', token });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};
