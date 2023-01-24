import Token from '../utils/token.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

export const AuthenticatedMiddleware = async (req, res, next) => {
    const bearer = req.headers.authorization

    if(!bearer || !bearer?.startsWith('Bearer ')) {
        return res.status(401).send('You are not authenticated!')
    }

    const accessToken = bearer?.split('Bearer ')[1].trim();

    try {
        const payload = await Token.verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(403).send('Token is not valid!');
        }

        const user = await User.findById(payload.user.id)

        if (!user) {
            return res.status(404).json({
                message: 'No user found'
            });
        }

        const {password, ...userInfo} = user._doc

        req.user = userInfo;

        return next();
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}


export const AuthenticatedUserMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {
        if(req.user._id === req.params.id || req.user.role === 'admin') {
            next()
        }
        else {
            return res.status(403).send('You are not allowed')
        }
    })
}


export const AuthenticatedHotelAdminMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {
        if(req.user.role === 'hotel-admin' || req.user.role === 'admin') {
            next()
        }
        else {
            return res.status(403).json({
                message: 'You are not allowed'
            })
        }
    })
}


export const AuthenticatedAdminMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {
        if(req.user.role === 'admin') {
            next()
        }
        else {
            return res.status(403).send('You are not allowed')
        }
    })
}

export default {
    AuthenticatedMiddleware,
    AuthenticatedUserMiddleware,
    AuthenticatedAdminMiddleware
}
