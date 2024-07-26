const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    invitedBy: { type: String, default: null },
    revenusProjet: { type: Number, default: 0 },
    totalRetrait: { type: Number, default: 0 },
    invitations: { type: Number, default: 0 },
    soldeTotal: { type: Number, default: 0 },
});

userSchema.methods.updateSoldeTotal = function() {
    this.soldeTotal = this.revenusProjet + this.invitations;
    return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
