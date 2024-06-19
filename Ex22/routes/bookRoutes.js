const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Books = require("../models/bookModel");
const authenticate = require("../authenticate");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

bookRouter.route("/")
  .get((req, res, next) => {
    Books.find({})
      .populate("comments")
      .then(books => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(books);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.create(req.body)
      .then(book => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(book);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /books");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.deleteMany({})
      .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

bookRouter.route("/:bookId")
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .populate("comments")
      .then(book => {
        if (book) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        } else {
          const err = new Error("Books not found");
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findByIdAndUpdate(req.params.bookId, {
      $set: req.body
    }, { new: true })
      .then(book => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(book);
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findByIdAndDelete(req.params.bookId)
      .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

  // New route for populating comments with "excellent" or "good"
bookRouter.route("/:bookId/populate")
.get((req, res, next) => {
  Books.findById(req.params.bookId)
    .populate({
      path: 'comments',
      match: { text: { $regex: 'excellent|good', $options: 'i' } },
      populate: { path: 'user', select: 'username' }
    })
    .then(book => {
      if (book) {
        const filteredComments = book.comments.filter(comment =>
          /excellent/i.test(comment.text) || /good/i.test(comment.text)
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(filteredComments);
      } else {
        const err = new Error("Books " + req.params.bookId + " not found");
        err.status = 404;
        return next(err);
      }
    }, err => next(err))
    .catch(err => next(err));
});

module.exports = bookRouter;
