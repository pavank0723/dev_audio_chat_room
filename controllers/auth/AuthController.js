const { OtpService, HashService } = require("../../services")

class AuthController{

    //#region SEND OTP
    async sendOtp(req,res){
        const{phone} = req.body

        if(!phone){
            res.status(400).json({message:"Phone field is required! "})
        }
        const otp = await OtpService.generateOtp()

        //#region HASH
        const ttl = 1000 * 60 *2
        const expire = Date.now() * ttl
        const data = `${phone}.${otp}.${expire}`
        const hash = HashService.hashOtp(data)
        //#endregion 

        res.json({hash:hash})
    }
    //#endregion
}

module.exports = new AuthController()