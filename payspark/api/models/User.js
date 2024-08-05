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
    soldeCompte:{type : Number, default : 0},
    soldeTotal: { 
        type: Number,
         default: 0,
         get: function() {
          return (this.invitations + this.revenusProjet + this.soldeCompte) - this.totalRetrait;}},
    subscribedPlans: [{planId: {type: mongoose.Schema.Types.ObjectId, ref: 'Plan'},startDate: Date,
    endDate: Date}]
});



const User = mongoose.model('User', userSchema);

module.exports = User;

