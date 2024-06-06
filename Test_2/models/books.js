const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);	
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
	    rating:  {
	        type: Number,
	        min: 1,
	        max: 5,
	        required: true
	    },
	    comment:  {
	        type: String,
	        required: true
	    },
	    author:  {
	        type: String,
	        required: true
	    }
	}, {
	    timestamps: true
	});
    
  const bookSchema = new Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    publish_date: {
        type: Date,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    comments: [commentSchema],
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre', // Assuming you have a Genre model
        required: true
    }
}, {
    timestamps: true
});
		
    
	
	var Books = mongoose.model('Book', bookSchema);
	
	module.exports = Books;
