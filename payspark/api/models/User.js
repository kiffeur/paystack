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

//-------------Mettre le solde Total à jour---------//

/*userSchema.pre('save', function(next) {
  this.soldeTotal = this.soldeCompte + this.revenusProjet + this.invitations - this.totalRetrait;
  next();
});
*/

//-------------Effectuer un retrait ---------//

/*userSchema.methods.withdraw = function(amount, callback) {

    if (amount < 1500) {
      return callback(new Error("Le montant minimum de retrait est de 1500 FCFA"));

    }
  
  
    if (this.soldeTotal < amount) {
      return callback(new Error("Solde insuffisant"));
    }
  
    this.soldeTotal -= amount;
    this.totalRetrait += amount;
  
    this.save(callback);
  
  };
  */

const User = mongoose.model('User', userSchema);

module.exports = User;
