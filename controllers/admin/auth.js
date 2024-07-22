const express = require('express');
const passport = require('passport');
const Router = express.Router();

// Auth Routes
Router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

Router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/profile');
});

Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = Router;
