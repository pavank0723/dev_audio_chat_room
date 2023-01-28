const crypto = require('crypto')
const { TWILIO_SMS_SID, TWILIO_SMS_AUTH_TOKEN, TWILIO_SMS_FROM_NUMBER, APP_NAME } = require('../config')
const hashService = require('./hash-service')

const twilio = require('twilio')(TWILIO_SMS_SID,TWILIO_SMS_AUTH_TOKEN,{
    lazyLoading:true
})
class OtpService{
    //OTP Generate
    async generateOtp(){
        const otp = crypto.randomInt(1000,9999)
        return otp
    }

    async sendBySms(phone,otp){
        return await twilio.messages.create({
            to:phone,
            from:TWILIO_SMS_FROM_NUMBER,
            body:`Your ${APP_NAME} OTP is ${otp}`
        })
    }

    verifyOtp(hashedOtp,data){
        let computedHash = hashService.hashOtp(data)
        return computedHash === hashedOtp

    }
}

module.exports = new OtpService()