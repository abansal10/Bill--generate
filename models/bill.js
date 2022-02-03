const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;
const billSchema = new Schema({
  invoice: {
    type: Number,
    default:1000
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    require: true
  }

});
billSchema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'invoice'});
module.exports = mongoose.model('Bill', billSchema);
