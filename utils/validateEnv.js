import { cleanEnv, str, port } from "envalid";

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        MONGO_URL: str(),
        PORT: port({ default: 9000 })
    })
}

export default validateEnv