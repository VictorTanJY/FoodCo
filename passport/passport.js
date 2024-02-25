const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const model = require("../model/app");

module.exports = function (passport) {
  // Try to authenticate user
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      model.getUserByEmailAndPassword(email, password, (err, rows) => {
        // No user found.
        if (rows.length !== 1) {
          return done(null, false, { message: "Wrong email or password." });
        }
        if (err) {
          return done(null, false, err);
        }

        // Return user found
        return done(null, rows[0]);
      });
    })
  );

  passport.serializeUser(function (user, done) {
    delete user["password"];
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    const id = user.user_id;
    model.getUser(id, (err, rows) => {
      // No user found.
      if (rows.length !== 1) {
        return done(null, false, { message: "No such user." });
      }
      if (err) {
        return done(null, false, err);
      }
      // User found
      done(null, { ...rows[0] });
    });
  });
};
