const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
const { facebook } = require('../config');
	
const userSchema = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: {
      type: String
    }
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);