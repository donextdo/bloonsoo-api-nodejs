import jwt from 'jsonwebtoken'

export const createToken = (payload) => {
    return jwt.sign(
        {user: payload},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )
}

export const verifyToken = async (
    token
) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, payload) => {
                if(err) return reject(err)

                resolve(payload)
            }
        )
    })
}

export default { createToken, verifyToken }