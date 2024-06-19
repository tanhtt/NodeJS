const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Comments = require("../models/commentModel");
const Books = require("../models/bookModel");
const Users = require("../models/userModel")
const authenticate = require("../authenticate");

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Comments.find({})
      .populate('user')
      .populate('book')
      .then(comments => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(comments);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    if (req.body.book && req.body.text) {
      req.body.user = req.user._id;
      Comments.create(req.body)
        .then(comment => {
          Books.findById(req.body.book)
            .then(book => {
              if (book) {
                book.comments.push(comment._id);
                book.save()
                  .then(book => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(comment);
                  }, err => next(err));
              } else {
                const err = new Error("Books not found");
                err.status = 404;
                return next(err);
              }
            }, err => next(err));
        }, err => next(err))
        .catch(err => next(err));
    } else {
      const err = new Error("Books ID and comment text are required");
      err.status = 400;
      return next(err);
    }
  });

commentRouter.route("/:commentId")
  .get(authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .populate('user')
      .populate('book')
      .then(comment => {
        if (comment) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(comment);
        } else {
          const err = new Error("Comments not found");
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(comment => {
        if (comment) {
          if (comment.user.equals(req.user._id)) {
            if (req.body.text) {
              comment.text = req.body.text;
            }
            comment.save()
              .then(comment => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(comment);
              }, err => next(err));
          } else {
            const err = new Error("You are not authorized to update this comment");
            err.status = 403;
            return next(err);
          }
        } else {
          const err = new Error("Comments not found");
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Comments.findByIdAndDelete(req.params.commentId)
      .then(comment => {
        if (comment) {
          Books.findById(comment.book)
            .then(book => {
              if (book) {
                book.comments.pull(comment._id);
                book.save()
                  .then(book => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, status: "Comments deleted" });
                  }, err => next(err));
              } else {
                const err = new Error("Books not found");
                err.status = 404;
                return next(err);
              }
            }, err => next(err));
        } else {
          const err = new Error("Comments not found");
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = commentRouter;
