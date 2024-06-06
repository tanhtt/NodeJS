const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Books = require('../models/books');
const Genres = require('../models/genres');

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());

bookRouter.route('/')
.get((req,res,next) => {
    let filter = {};
    if (req.query.price) {
        filter.price = { $lt: Number(req.query.price) }; // Convert price to number
    }
    Books.find(filter)
//   Books.find({})
//   .populate('genre') // Populate genre details
    .then((books) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  Books.create(req.body)
    .then((book) => {
        console.log('Book Created ', book);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
})
.delete((req, res, next) => {
  Books.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

bookRouter.route('/:bookId')
.get((req,res,next) => {
    Books.findById(req.params.bookId)
    // .populate('genre') // Populate genre details
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Books/'+ req.params.bookId);
})
.put((req, res, next) => {
    Books.findByIdAndUpdate(req.params.bookId, {
        $set: req.body
    }, { new: true })
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Books.findByIdAndDelete(req.params.bookId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

bookRouter.route('/:bookId/comments')
.get((req,res,next) => {
    Books.findById(req.params.bookId)
    .then((book) => {
        if (book != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(book.comments);
        }
        else {
            err = new Error('Book ' + req.params.bookId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Books.findById(req.params.bookId)
    .then((book) => {
        if (book != null) {
            book.comments.push(req.body);
            book.save()
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);                
            }, (err) => next(err));
        }
        else {
            err = new Error('book ' + req.params.bookId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Books/'
        + req.params.bookId + '/comments');
})
.delete((req, res, next) => {
    // Books.findById(req.params.bookId)
    // .then((book) => {
    //     if (book != null) {
    //         for (var i = (book.comments.length -1); i >= 0; i--) {
    //             book.comments.id(book.comments[i]._id).remove();
    //         }
    //         book.save()
    //         .then((book) => {
    //             res.statusCode = 200;
    //             res.setHeader('Content-Type', 'application/json');
    //             res.json(book);                
    //         }, (err) => next(err));
    //     }
    //     else {
    //         err = new Error('book ' + req.params.bookId + ' not found');
    //         err.status = 404;
    //         return next(err);
    //     }
    // }, (err) => next(err))
    // .catch((err) => next(err));    
    Books.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

bookRouter.route('/:bookId/comments/:commentId')
.get((req,res,next) => {
    Books.findById(req.params.bookId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.bookId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Books/'+ req.params.bookId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Books.findById(req.params.bookId)
    .then((book) => {
        if (book != null && book.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                book.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                book.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            book.save()
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);                
            }, (err) => next(err));
        }
        else if (book == null) {
            err = new Error('book ' + req.params.bookId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Books.findById(req.params.bookId)
    .then((book) => {
        if (book != null && book.comments.id(req.params.commentId) != null) {
            book.comments.pull(req.params.commentId);
            book.save()
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);                
            }, (err) => next(err));
        }
        else if (book == null) {
            err = new Error('book ' + req.params.bookId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = bookRouter;
