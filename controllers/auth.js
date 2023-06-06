import User from "../models/user.js";
import passport from "passport";
import Token from "../utils/token.js";
import VerifyToken from "../models/token.model.js";
import randomstring from "randomstring";
import sendEmail from "../utils/email/sendEmail.js";
import ejs from 'ejs'
import fs from 'fs'
import bcrypt from 'bcrypt'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import {
    NotFoundError,
    BadRequestError,
    UnauthenticatedError,
    ForbiddenError
} from '../errors/errors.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)

const verifyEmailTemplate = fs.readFileSync(path.join(__dirname, '../utils/email/verify-email.ejs'), 'utf-8');
const passwordRestTemplate = fs.readFileSync(path.join(__dirname, '../utils/email/password-reset.ejs'), 'utf-8')

const bloonsoWeb = process.env.BLOONSOO_WEB


const signup = async (req, res, next) => {
    try {
        passport.authenticate('signup', {session: false}, async function (err, user, info) {

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

            // const payload = {id: user._id, email: user.email, role: user.role}

            // const token = Token.createToken(payload)

            const hash = randomstring.generate()

            const verifyTokenDto = new VerifyToken({
                user: user._id,
                token: hash
            })

            await verifyTokenDto.save()

            const verificationLink = `${bloonsoWeb}/email-verification/${hash}`

            const data = { verifyUrl: verificationLink};
            const renderedTemplate = ejs.render(verifyEmailTemplate, data);

            await sendEmail(
                'Verify Your Account with Bloonsoo', 
                user.email,
                renderedTemplate
            )

            return res.status(201).json({
                isRegistered: true,
                userInfo
            })
    
    
        })(req, res, next);
    } catch (error) {
        next(error)
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

const verifyEmail = async (req, res, next) => {
    try {
        
        const token = req.body.token
        const verifyToken = await VerifyToken.findOne({
            token
        })

        if(!verifyToken) {
            throw new NotFoundError(`INVALID_TOKEN`)
        }

        if(verifyToken.isCompleted) {
            throw new ForbiddenError(`TOKEN_ALREADY_COMPLETED`)
        }

        await VerifyToken.findOneAndUpdate(
            { token: token },
            {
                $set: {
                    isCompleted: true
                }
            },
            {
                runValidators: true
            }
        )

        await User.findByIdAndUpdate(
            verifyToken.user.toString(),
            {
                $set: {
                    isEmailVerified: true
                }
            },
            {
                runValidators: true
            }
        )

        res.status(200).json({
            success: true,
            message: 'EMAIL_VERIFIED_SUCCESSFULLY'
        })

    }
    catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const token = req.body.token
        const password = req.body.password

        const verifyToken = await VerifyToken.findOne({
            token
        })

        if(!verifyToken) {
            throw new NotFoundError(`INVALID_TOKEN`)
        }

        if(verifyToken.isCompleted) {
            throw new ForbiddenError(`TOKEN_ALREADY_COMPLETED`)
        }

        await VerifyToken.findOneAndUpdate(
            { token: token },
            {
                $set: {
                    isCompleted: true
                }
            },
            {
                runValidators: true
            }
        )

        const hash = await bcrypt.hash(password, 10)

        await User.findByIdAndUpdate(
            verifyToken.user.toString(),
            {
                $set: {
                    password: hash
                }
            },
            {
                runValidators: true
            }
        )

        res.status(200).json({
            success: true,
            message: 'PASSWORD_RESET_SUCCESSFULLY'
        })
    }
    catch (error) {
        next(error)
    }
}

const sendResetPasswordMail = async (req, res, next) => {
    try {
        const email = req.body.email

        const userExit = await User.findOne({
            email
        })

        if(!userExit) {
            res.status(404).json({
                success: false,
                message: 'USER_NOT_FOUND'
            })
        }

        const hash = randomstring.generate()

        const verifyTokenDto = new VerifyToken({
            user: userExit._id,
            token: hash
        })

        await verifyTokenDto.save()

        const verificationLink = `${bloonsoWeb}/password-reset/${hash}`

        const data = { verifyUrl: verificationLink};
        const renderedTemplate = ejs.render(passwordRestTemplate, data);

        await sendEmail(
            'Reset your bloonsoo account password', 
            userExit.email,
            renderedTemplate
        )

        res.status(200).json({
            success: true,
            message: 'VERIFICATION_LINK_SENT'
        })

    }
    catch (error) {
        next(error)
    }
}


export default {
    signup,
    signin,
    adminLogin,
    getAuthUser,
    verifyEmail,
    resetPassword,
    sendResetPasswordMail
}