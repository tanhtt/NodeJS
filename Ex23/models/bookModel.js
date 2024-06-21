const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  publication_year: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  contents: {
    type: String,
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("book", bookSchema);
