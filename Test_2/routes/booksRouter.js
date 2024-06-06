const express = require("express"),
  http = require("http");
const morgan = require('morgan');
const bodyParser = require('body-parser');


const booksRouter = express.Router();
booksRouter.use(bodyParser.json());
booksRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the books to you! id: '+ req.body.isbn);
})
.post((req, res, next) => {
    res.end('Will add the book: ' + req.body.title + ' with details: ' + req.body.publisher);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation put title'+ req.body.title );
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

booksRouter.route('/:bookId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the book: ' + req.params.bookId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /books/'+ req.params.bookId);
})

.put((req, res, next) => {
  res.write('Updating the book: ' + req.params.bookId + '\n');
  res.end('Will update the book: ' + req.body.title + 
        ' with details: ' + req.body.pages);
})

.delete((req, res, next) => {
    res.end('Deleting book: ' + req.params.dishId);
})

module.exports = booksRouter;
