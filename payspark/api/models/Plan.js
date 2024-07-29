const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({

    name: {type: String,required: true,unique: true},
    description: {type: String,required: true},
    price: {type: Number,required: true},
    benefice : {type : Number , required : true}
   });
  

  const Plans =  mongoose.model('Plan', PlanSchema);

  module.exports = Plans;