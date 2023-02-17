const dotenv = require('dotenv')

dotenv.config()
export const{
    APP_NAME,
    APP_PORT,
    BASE_URL,
    DB_URL,
    DEBUG_MODE,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    HASH_SECRET,
    SECRET,
    TWILIO_SMS_SID,
    TWILIO_SMS_AUTH_TOKEN,
    TWILIO_SMS_FROM_NUMBER
} = process.env