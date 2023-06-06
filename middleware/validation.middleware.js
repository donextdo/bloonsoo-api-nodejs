import { StatusCodes } from 'http-status-codes'

function validationMiddleware(schema) {
    return async (
        req,
        res,
        next
    ) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            )
            req.body = value
            next()
        } catch (e) {
            const errors = []
            e.details.forEach((error) => {
                errors.push(error.message)
            })
            res.status(StatusCodes.BAD_REQUEST).json(errors)
        }
    }
}   

export default validationMiddleware