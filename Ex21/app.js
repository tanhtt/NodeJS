const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const config = require("./config");
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const commentRouter = require("./routes/commentRoutes");

const app = express();
const url = config.mongoUrl;
const connect = mongoose.connect(url);
console.log(url);
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

// Secure traffic only
app.all('*', (req, res, next) => {
if (req.secure) {
return next();
}
else {
res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
}
});


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session.
app.use(
  session({
    name: "session-id",
    secret: config.secretKey,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/users", userRouter);

// Authentication middleware
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    const err = new Error("You are not authenticated!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, "public")));
app.use("/books", bookRouter);
app.use("/comments", commentRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
