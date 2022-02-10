const mongoose = require('./');

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  data: { type: String, required: true },
  fulltime: { type: Boolean, default: false }
});

module.exports  = mongoose.model('wa5', dataSchema);
