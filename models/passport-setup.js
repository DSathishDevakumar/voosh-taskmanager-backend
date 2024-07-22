// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// let db = require('../../models/schemaconnection');

// passport.use(
//   new GoogleStrategy({
//     clientID: '415459946998-odt9c679e6b2obf78gqalvaahuclp7vn.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: '/auth/google/callback',
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     // Check if user already exists in our db
//     const existingUser = await db.users.findOne({ googleid: profile.id });
//     if (existingUser) {
//       // Already have user
//       return done(null, existingUser);
//     }

//     // If not, create a new user in our db
//     const newUser = await new User({ googleId: profile.id }).save();
//     done(null, newUser);
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     db.users.findById(id).then(user => {
//       done(null, user);
//     });
//   });
