const express = require("express");
const passport = require("passport");
const moment = require("moment");
const {
  ensureAuthenticated,
  ensureNotAuthenticated,
} = require("../middleware/auth");
const model = require("../model/app");
const router = express.Router();
const {
  validateEmail,
  validatePassword,
  validateUsername,
  getAverageRating,
} = require("../utils/utils");
const { render } = require("ejs");
const { updateUser } = require("../model/app");

const renderError = (req, res, error) => {
  res.render("error", {
    isAuthenticated: req.isAuthenticated(),
    error,
  });
};

const handleEmailCheck = (email, handleInUse, handleNotInUse) => {
  model.getUserByEmail(email, (err, rows) => {
    if (rows.length !== 0) {
      handleInUse();
    } else {
      handleNotInUse();
    }
  });
};

const handleNameSearch = (req, res, name, cuisines) => {
  model.getRestaurantsByName(name, (err, rows) => {
    if (err) {
      return renderError(req, res, err);
    }
    restaurants = rows;
    res.render("index", {
      isAuthenticated: req.isAuthenticated(),
      restaurants,
      cuisines,
    });
  });
};

const handleCuisineSearch = (req, res, cuisine_id, cuisines) => {
  model.getRestaurantsByCuisine(cuisine_id, (err, rows) => {
    if (err) {
      return renderError(req, res, err);
    }
    restaurants = rows;
    res.render("index", {
      isAuthenticated: req.isAuthenticated(),
      restaurants,
      cuisines,
    });
  });
};

const getUserReview = (reviews, user) => {
  if (!reviews || !user) {
    return false;
  }
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].user_id == user.user_id) {
      return reviews[i];
    }
  }
  return false;
};

const handleUserUpdate = (req, res, newUser) => {
  model.updateUser(
    newUser.username,
    newUser.first_name,
    newUser.last_name,
    newUser.gender,
    newUser.mobile_number,
    newUser.address,
    newUser.password,
    newUser.email,
    newUser.date,
    req.user.user_id,
    (err, rows) => {
      res.render("profile", {
        success: "Your profile was updated successfully.",
        user: newUser,
        isAuthenticated: req.isAuthenticated(),
      });
    }
  );
};

router.get("/", (req, res) => {
  const name = req.query["name"];
  const cuisine_id = req.query["cuisine"];
  let restaurants = [];
  model.getAllCuisines((err, rows) => {
    if (err) {
      return renderError(req, res, err);
    }
    let cuisines = rows;

    if (name) {
      handleNameSearch(req, res, name, cuisines);
    } else if (cuisine_id) {
      handleCuisineSearch(req, res, cuisine_id, cuisines);
    } else {
      model.getAllRestaurants((err, rows) => {
        if (err) {
          return renderError(req, res, err);
        }
        restaurants = rows;
        res.render("index", {
          isAuthenticated: req.isAuthenticated(),
          restaurants,
          cuisines,
        });
      });
    }
  });
});

router.get("/restaurant/:id", (req, res) => {
  const { id } = req.params;
  let restaurant;
  let reviews;
  model.getRestaurant(id, (err, rows) => {
    if (err) {
      return renderError(req, res, err);
    }

    restaurant = rows[0];

    model.getCuisinesByRestaurant(id, (err, rows) => {
      if (err) {
        return renderError(req, res, err);
      }

      cuisines = rows;

      model.getReviewsForRestaurant(id, (err, rows) => {
        if (err) {
          return renderError(req, res, err);
        }

        reviews = rows;

        // Calculate average rating
        const avgRating = getAverageRating(reviews);
        res.render("restaurant", {
          restaurant,
          cuisines,
          reviews,
          isAuthenticated: req.isAuthenticated(),
          avgRating,
          review: getUserReview(reviews, req.user),
        });
      });
    });
  });
});

router.post("/restaurant", ensureAuthenticated, (req, res) => {
  const { review_rating, review, restaurant_id } = req.body;
  model.getReview(restaurant_id, req.user.user_id, (err, rows) => {
    if (rows.length > 0) {
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      model.updateReview(
        date,
        review_rating,
        review,
        req.user.user_id,
        restaurant_id,
        (err, rows) => {
          if (err) {
            return renderError(req, res, err);
          }
          res.redirect("/restaurant/" + restaurant_id);
        }
      );
    } else if (rows.length === 0) {
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      model.insertIntoReview(
        date,
        review_rating,
        review,
        req.user.user_id,
        restaurant_id,
        (err, rows) => {
          if (err) {
            return renderError(req, res, err);
          }
          res.redirect("/restaurant/" + restaurant_id);
        }
      );
    } else {
      return renderError(req, res, err);
    }
  });
});

router.post("/delete-review", (req, res) => {
  const { restaurant_id } = req.body;
  model.deleteReview(restaurant_id, req.user.user_id, (err, rows) => {
    if (err) {
      return renderError(req, res, err);
    }
    res.redirect("/restaurant/" + restaurant_id);
  });
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
  });
});

router.post("/profile-delete", ensureAuthenticated, (req, res) => {
  model.deleteReviewsByUser(req.user.user_id, (err, rows) => {
    if (err) {
      return res.render("profile", {
        errors: ["Failed to deactivate!"],
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
      });
    }
    model.deleteUser(req.user.user_id, (err, rows) => {
      if (rows) {
        res.render("login");
      } else {
        res.render("profile", {
          errors: ["Failed to deactivate!"],
          user: req.user,
          isAuthenticated: req.isAuthenticated(),
        });
      }
    });
  });
});

router.post("/profile", ensureAuthenticated, (req, res) => {
  const {
    username,
    first_name,
    last_name,
    gender,
    mobile_number,
    address,
    password,
    email,
  } = req.body;

  // Validate all fields
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const usernameError = validateUsername(username);
  let errors = [];
  if (emailError) {
    errors.push(emailError);
  }
  if (passwordError) {
    errors.push(passwordError);
  }
  if (usernameError) {
    errors.push(usernameError);
  }
  if (emailError || passwordError || usernameError) {
    return res.render("profile", {
      errors,
      user: req.user,
      isAuthenticated: req.isAuthenticated(),
    });
  }
  // Update user in db
  const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let newUser = {
    username,
    first_name,
    last_name,
    gender,
    mobile_number,
    address,
    password,
    email,
    date,
    id: req.user.user_id,
  };
  if (email !== req.user.email) {
    handleEmailCheck(
      email,
      () => {
        return res.render("profile", {
          errors: ["An account with that email already exists."],
          user: req.user,
          isAuthenticated: req.isAuthenticated(),
        });
      },
      () => {
        handleUserUpdate(req, res, newUser);
      }
    );
  } else {
    handleUserUpdate(req, res, newUser);
  }
});

router.get("/signup", ensureNotAuthenticated, (req, res) =>
  res.render("signup")
);

router.post("/signup", (req, res) => {
  const {
    email,
    password,
    username,
    first_name,
    last_name,
    mobile_number,
    gender,
    address,
  } = req.body;

  // Validate all fields
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const usernameError = validateUsername(username);
  let errors = [];
  if (emailError) {
    errors.push(emailError);
  }
  if (passwordError) {
    errors.push(passwordError);
  }
  if (usernameError) {
    errors.push(usernameError);
  }
  if (emailError || passwordError || usernameError) {
    return res.render("signup", {
      errors,
      username,
      first_name,
      last_name,
      password,
      email,
      mobile_number,
      gender,
      address,
    });
  }

  // Find matching user
  handleEmailCheck(
    email,
    () => {
      return res.render("signup", {
        errors: ["An account with that email already exists."],
        username,
        first_name,
        last_name,
        password,
        email,
        mobile_number,
        gender,
        address,
      });
    },
    () => {
      // Insert new user to db
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      model.insertIntoUser(
        username,
        first_name,
        last_name,
        gender,
        mobile_number,
        address,
        password,
        email,
        date,
        (err, rows) => {
          if (rows) {
            return res.render("signup", {
              errors: [],
              success: "You have successfully registered.",
            });
          } else {
            return res.render("signup", {
              errors: [err],
            });
          }
        }
      );
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/login", ensureNotAuthenticated, (req, res) => res.render("login"));

router.post("/login", (req, res, next) => {
  // Validate email and password
  const { email, password } = req.body;
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  let errors = [];
  if (emailError) {
    errors.push(emailError);
  }
  if (passwordError) {
    errors.push(passwordError);
  }
  if (emailError || passwordError) {
    return res.render("login", {
      errors,
      email,
      password,
    });
  }

  // Try to log in user
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: { type: "error", message: "Wrong email or password." },
  })(req, res, next);
});

module.exports = router;
