const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("comment", commentSchema);
