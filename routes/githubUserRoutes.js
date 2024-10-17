const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

router.get('/', (req, res) => {
  res.send(req.user ? `Logged in as ${req.user.username}` : 'Logged Out');
});

module.exports = router;
