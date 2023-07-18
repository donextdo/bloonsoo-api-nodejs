import express from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import logger from './utils/logger.js'
import errorHandlerMiddleware from './middleware/error.middleware.js'
import notFoundMiddleware from './middleware/not-found.middleware.js'
import path from 'path'
import { fileURLToPath } from 'url'

class App {
    constructor(routes, port) {
        this.express = express()
        this.port = port

        this.__filename = fileURLToPath(import.meta.url);

        this.__dirname = path.dirname(this.__filename)

        this.initializeDatabaseConnection()
        this.initializeMiddleware()
        this.initializePublicDir()
        this.initializeControllers(routes)
        this.initializeNotFound()
        this.initializeErrorHandling()
    }

    initializeMiddleware() {
        this.express.use(helmet())
        this.express.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
        this.express.use(cors())
        this.express.options('*', cors())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    initializePublicDir() {
        this.express.use('/public', express.static((path.join(this.__dirname, '/public'))))
    }

    initializeControllers(routes) {
        routes.forEach((router) => {
            this.express.use('/api', router)
        })
    }

    initializeNotFound() {
        this.express.use(notFoundMiddleware)
    }

    initializeErrorHandling() {
        this.express.use(errorHandlerMiddleware)
    }

    initializeDatabaseConnection() {
        const mongoUri = process.env.MONGO_URL

        mongoose.set('strictQuery', false)
        mongoose.connect(mongoUri)
            .then(() => {
                logger.info(`Database connection is ready ${'\u{2699}'}`)
            })
            .catch((error) => {
                logger.error(error.message)
            })
    }

    listen() {
        this.express.listen(this.port, () => {
            const rocketEmoji = '\u{1F680}'
            logger.info(`App running on http://localhost:${this.port} ${rocketEmoji}`)
        })
    }
}

export default App