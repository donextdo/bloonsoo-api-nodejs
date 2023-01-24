import User from "../models/user.js";
import passport from "passport";
import Token from "../utils/token.js";

const signup = async (req, res, next) => {
    try {
        passport.authenticate('signup', {session: false}, function (err, user, info) {

            if (err || !user) {

                if (err.code && err.code === 11000) {
                    return res.status(400).json({
                        isRegistered: false,
                        duplicate: Object.keys(err.keyValue),
                        message: `Duplicate value entered for ${Object.keys(
                            err.keyValue
                          )} field, please choose another value`
                    })
                }

                return res.status(500).json({
                    isRegistered: false,
                    message: 'Unable to register your account, Already have a account? try login',
                    info
                });
            }
            const {password, ...userInfo} = user.toObject()

            const payload = {id: user._id, email: user.email, role: user.role}

            const token = Token.createToken(payload)

            return res.json({
                isRegistered: false,
                userInfo,
                token
            })
    
    
        })(req, res, next);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const signin = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                   return res.status(401).json({ message: info?.message, code: info?.code})
                }
                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) {
                            return res.status(500).json({message: 'error login user'})
                        }

                        const {password, ...userInfo} = user._doc

                        const payload = {id: user._id, email: user.email, role: user.role}

                        const token = Token.createToken(payload)

                        return res.json({
                            userInfo,
                            token
                        })

                    }
                );
            } catch (error) {
                return res.status(401).json({message: 'error login user'})
            }
        }
    )(req, res, next);
}

const adminLogin = async (req, res, next) => {

    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                   return res.status(401).json({ message: info?.message, code: info?.code})
                }
                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) {
                            return res.status(500).json({message: 'error login user'})
                        }

                        const {password, ...userInfo} = user._doc

                        const payload = {id: user._id, email: user.email, role: user.role}

                        const token = Token.createToken(payload)

                        return res.json({
                            userInfo,
                            token
                        })

                    }
                );
            } catch (error) {
                return res.status(401).json({message: 'error login user'})
            }
        }
    )(req, res, next);
}

const getAuthUser = (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(404).json({
                success: false,
                message: "Please login"
            })
        }

        res.status(200).json(req.user)

    } catch (error) {
        res.status(500).json(error.message)
    }
}

export default {
    signup,
    signin,
    adminLogin,
    getAuthUser
}