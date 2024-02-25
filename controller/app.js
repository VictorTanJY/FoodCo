const express = require("express");
const moment = require("moment");
const passport = require("passport");
const router = express.Router();
const model = require("../model/app");

router.get("/", function (req, res) {
  res.send("hello world");
});

const callback = (err, res, statusCode, data) => {
  if (err) {
    return res.status(500).send({ err });
  } else {
    return res.status(statusCode).send(data);
  }
};

// POST /signup
router.post("/signup", (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    mobile_number,
    gender,
    address,
  } = req.body;
  if (
    !email ||
    !password ||
    !username ||
    !first_name ||
    !last_name ||
    !mobile_number ||
    !gender ||
    !address
  ) {
    return res.status(400).send({ error: "Please enter all fields." });
  }

  model.getUserByEmail(email, (err, rows) => {
    if (rows.length !== 0) {
      return res
        .status(400)
        .send({ error: "An account already exists with that email." });
    } else {
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      model.insertIntoUser(
        username,
        first_name,
        last_name,
        password,
        email,
        mobile_number,
        gender,
        address,
        date,
        (err, rows) => {
          callback(err, res, 201, { userid: rows.insertId });
        }
      );
    }
  });
});

// GET /logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// POST /login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })(req, res, next);
});

// GET /users/
router.get("/users", (req, res) => {
  try {
    model.getAllUsers((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /users/:userid/
router.get("/users/:userid", (req, res) => {
  try {
    const { userid } = req.params;
    model.getUser(userid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /users/
router.post("/users", (req, res) => {
  try {
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
    model.getUserByEmail(email, (err, rows) => {
      if (rows.length > 0) {
        return res
          .status(400)
          .send({ error: "An account with that email already exists." });
      }
      const acc_created_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      model.insertIntoUser(
        username,
        first_name,
        last_name,
        gender,
        mobile_number,
        address,
        password,
        email,
        acc_created_date,
        (err, rows) => {
          callback(err, res, 201, { userid: rows.insertId });
        }
      );
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /users/:userid
router.put("/users/:userid", (req, res) => {
  try {
    const { userid } = req.params;
    const {
      username,
      first_name,
      last_name,
      gender,
      mobile_number,
      address,
      password,
      email,
      acc_created_date,
    } = req.body;
    model.getUserByEmail(email, (err, rows) => {
      if (rows.length > 0) {
        return res
          .status(400)
          .send({ error: "An account with that email already exists." });
      }
      model.updateUser(
        username,
        first_name,
        last_name,
        gender,
        mobile_number,
        address,
        password,
        email,
        acc_created_date,
        userid,
        (err, rows) => {
          callback(err, res, 200, null);
        }
      );
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /users/:userid
router.delete("/users/:userid", (req, res) => {
  try {
    const { userid } = req.params;
    model.deleteUser(userid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /cuisines/
router.get("/cuisines", (req, res) => {
  try {
    model.getAllCuisines((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /cuisines/:cuisineid/
router.get("/cuisines/:cuisineid", (req, res) => {
  try {
    const { cuisineid } = req.params;
    model.getCuisine(cuisineid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /cuisines/
router.post("/cuisines", (req, res) => {
  try {
    const { cuisine_name } = req.body;
    model.insertIntoCuisine(cuisine_name, (err, rows) => {
      callback(err, res, 201, { cuisineid: rows.insertId });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /cuisines/:cuisineid
router.put("/cuisines/:cuisineid", (req, res) => {
  try {
    const { cuisineid } = req.params;
    const { cuisine_name } = req.body;
    model.updateCuisine(cuisine_name, cuisineid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /cuisines/:cuisineid
router.delete("/cuisines/:cuisineid", (req, res) => {
  try {
    const { cuisineid } = req.params;
    model.deleteCuisine(cuisineid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /addresses/
router.get("/addresses", (req, res) => {
  try {
    model.getAllAddresses((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /addresses/:addressid/
router.get("/addresses/:addressid", (req, res) => {
  try {
    const { addressid } = req.params;
    model.getAddress(addressid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /addresses/
router.post("/addresses", (req, res) => {
  try {
    const { address, postal_code } = req.body;
    model.insertIntoAddress(address, postal_code, (err, rows) => {
      callback(err, res, 201, { addressid: rows.insertId });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /addresses/:addressid
router.put("/addresses/:addressid", (req, res) => {
  try {
    const { addressid } = req.params;
    const { address, postal_code } = req.body;
    model.updateAddress(address, postal_code, addressid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /addresses/
router.delete("/addresses/:addressid", (req, res) => {
  try {
    const { addressid } = req.params;
    model.deleteAddress(addressid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /restaurants/
router.get("/restaurants", (req, res) => {
  try {
    model.getAllRestaurants((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /restaurants/:restaurantid/
router.get("/restaurants/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    model.getRestaurant(restaurantid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /restaurants/
router.post("/restaurants", (req, res) => {
  try {
    const {
      restaurant_name,
      restaurant_synopsis,
      price,
      food_type,
      meal_time_type,
      opening_hours,
      contact,
    } = req.body;
    model.insertIntoRestaurant(
      restaurant_name,
      restaurant_synopsis,
      price,
      food_type,
      meal_time_type,
      opening_hours,
      contact,
      (err, rows) => {
        callback(err, res, 201, { restaurantid: rows.insertId });
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /restaurants/:restaurantid
router.put("/restaurants/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    const {
      restaurant_name,
      restaurant_synopsis,
      price,
      food_type,
      meal_time_type,
      opening_hours,
      contact,
    } = req.body;
    model.updateRestaurant(
      restaurant_name,
      restaurant_synopsis,
      price,
      food_type,
      meal_time_type,
      opening_hours,
      contact,
      restaurantid,
      (err, rows) => {
        callback(err, res, 200, null);
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /restaurants/:restaurantid
router.delete("/restaurants/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    model.deleteRestaurant(restaurantid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /reviews/
router.get("/reviews", (req, res) => {
  try {
    model.getAllReviews((err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /reviews/:restaurantid
router.get("/reviews/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    model.getReviewsForRestaurant(restaurantid, (err, rows) => {
      callback(err, res, 200, rows);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
});

// GET /reviews/:restaurantid/:userid
router.get("/reviews/:restaurantid/:userid", (req, res) => {
  try {
    const { restaurantid, userid } = req.params;
    model.getReview(restaurantid, userid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /reviews/
router.post("/reviews", (req, res) => {
  try {
    const {
      last_updated,
      review_rating,
      review,
      user_id,
      restaurant_id,
    } = req.body;
    model.insertIntoReview(
      last_updated,
      review_rating,
      review,
      user_id,
      restaurant_id,
      (err, rows) => {
        callback(err, res, 201, {
          restaurant_id: restaurant_id,
          user_id: user_id,
        });
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// PUT /reviews/:restaurantid/:userid
router.put("/reviews/:restaurantid/:userid", (req, res) => {
  try {
    const { restaurantid, userid } = req.params;
    const { last_updated, review_rating, review } = req.body;
    model.updateReview(
      last_updated,
      review_rating,
      review,
      user_id,
      restaurant_id,
      (err, rows) => {
        callback(err, res, 200, null);
      }
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /reviews/:restaurantid/:userid
router.delete("/reviews/:restaurantid/:userid", (req, res) => {
  try {
    const { restaurantid, userid } = req.params;
    model.deleteReview(restaurantid, userid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /locatedin/:restaurantid/
router.get("/locatedin/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    model.getLocatedInForRestaurant(restaurantid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /locatedin/
router.post("/locatedin", (req, res) => {
  try {
    const { address_id, restaurant_id } = req.body;
    model.insertIntoLocatedIn(address_id, restaurant_id, (err, rows) => {
      callback(err, res, 201, {
        restaurantid: restaurant_id,
        address_id: address_id,
      });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /locatedin/:restaurantid/:addressid
router.delete("/locatedin/:restaurantid/:addressid", (req, res) => {
  try {
    const { restaurantid, addressid } = req.params;
    model.deleteLocatedIn(addressid, restaurantid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// GET /serves/:restaurantid/
router.get("/serves/:restaurantid", (req, res) => {
  try {
    const { restaurantid } = req.params;
    model.getServeForRestaurant(restaurantid, (err, rows) => {
      callback(err, res, 200, rows[0]);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// POST /serves/
router.post("/serves", (req, res) => {
  try {
    const { cuision_id, restaurant_id } = req.body;
    model.insertIntoServe(cuision_id, restaurant_id, (err, rows) => {
      callback(err, res, 201, {
        restaurantid: restaurant_id,
        cuisine_id: cuisine_id,
      });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// DELETE /serves/:restaurantid/:addressid
router.delete("/serves/:restaurantid/:cuisionid", (req, res) => {
  try {
    const { restaurantid, cuisionid } = req.params;
    model.deleteServe(cuisionid, restaurantid, (err, rows) => {
      callback(err, res, 200, null);
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;
