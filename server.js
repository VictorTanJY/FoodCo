const express = require("express");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

// Initialise app
const app = express();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);

// Set up passport
require("./passport/passport")(passport);
app.use(
  session({
    secret: "helloworld",
    cookie: { maxAge: 3600000 }, // 1h
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Set up flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Set up EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Set up routes
const routes = require("./controller/app.js");
const views = require("./controller/views.js");
app.use("/api", routes);
app.use("/", views);

// Set up port
const port = 8080;

const server = app.listen(port, function () {
  console.log("App hosted at localhost:" + port);
});
