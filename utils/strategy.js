import passport from "passport";
import User from "../models/user.js";
import { Strategy as localStrategy } from "passport-local";

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const newUser = new User(req.body)

                const user = await newUser.save()

                return done(null, user);

            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({
                    $or: [
                        { email },
                        { username: email}
                    ]
                })

                if (!user) {
                        return done(null, false, {message: 'User not found', code: 'USER_NOT_FOUND'});
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {message: 'Wrong Password', code: 'INVALID_PASSWORD'});
                }

                if (req.path === '/admin/login') {
                    console.log(user.role)
                    if(user.role === 'user') {
                        console.log('first')
                        return done(null, false, {message: 'You are not an Admin', code: 'NOT_AN_ADMIN'});
                    }
                }

                return done(null, user, {message: 'Logged in Successfully'});
            } catch (error) {
                return done(error);
            }
        }
    )
);
