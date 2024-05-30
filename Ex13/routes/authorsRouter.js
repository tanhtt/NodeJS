const express = require("express"),
  http = require("http");
const morgan = require('morgan');
const bodyParser = require('body-parser');


const authorRouter = express.Router();
authorRouter.use(bodyParser.json());
authorRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the authors to you!');
})
.post((req, res, next) => {
    res.end('Will add the author: ' +req.body.name+ ' with countrys: ' +req.body.birthYear);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /author');
})
.delete((req, res, next) => {
    res.end('Deleting all authors');
});

authorRouter.route('/:authorId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the author: ' + req.params.authorId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation on /authors/'+ req.body.name);
})

.put((req, res, next) => {
  res.write('Updating the author: ' + req.params.authorId + '\n');
  res.end('Will update the author: ' + req.body.name + 
        ' with details: ' + req.body.country);
})

.delete((req, res, next) => {
    res.end('Deleting book: ' + req.params.authorId);
})

module.exports = authorRouter;
