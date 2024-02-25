module.exports = {
  validatePassword: function (password) {
    if (password.length < 6) {
      return "Password should be at least 6 characters";
    }
    return null;
  },

  validateEmail: function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      return null;
    }
    return "Please enter a valid email.";
  },

  validateUsername: function (username) {
    if (username.length < 3) {
      return "Username should be at least 3 characters";
    }
    return null;
  },

  getAverageRating: function (reviews) {
    let avgRating = 0;
    if (reviews.length > 0) {
      for (let i = 0; i < reviews.length; i++) {
        avgRating += reviews[i].review_rating;
      }
      avgRating /= reviews.length;
    }
    return avgRating;
  },
};
