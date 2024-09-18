// // server/passportConfig.js
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "./models/UserModel.js"; // Ensure the path is correct

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5179/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ email: profile.emails[0].value });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = await User.create({
//           email: profile.emails[0].value,
//           password: "", // Or handle as needed for Google accounts
//           profileSetup: false,
//         });

//         done(null, newUser);
//       } catch (err) {
//         done(err, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, false);
//   }
// });

// export default passport;
