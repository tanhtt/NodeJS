const express = require("express"),
  http = require("http");
const morgan = require('morgan');
const bodyParser = require('body-parser');


const genreRouter = express.Router();
genreRouter.use(bodyParser.json());
genreRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the books to you!');
})
.post((req, res, next) => {
    res.end('Will add the book: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

genreRouter.route('/:genreId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the book: ' + req.params.genreId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /books/'+ req.params.genreId);
})

.put((req, res, next) => {
  res.write('Updating the book: ' + req.params.genreId + '\n');
  res.end('Will update the book: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting book: ' + req.params.dishId);
})

module.exports = genreRouter;
