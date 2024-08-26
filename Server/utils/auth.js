const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect("/signup");
  } else {
    next();
  }
};

module.exports = withAuth;
