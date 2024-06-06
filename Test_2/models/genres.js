const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Genre schema
const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Genres = mongoose.model('Genre', genreSchema);

module.exports = Genres;