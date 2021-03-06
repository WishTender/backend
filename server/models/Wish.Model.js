const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Constructor
 * @param {*} Object object with wish_name
 */
const Wish = new Schema({
  wish_name: { type: 'string', trim: true },
});

module.exports = mongoose.model('Wish', Wish);
