const { OtpService } = require("../../services")

class AuthController{

    //#region SEND OTP
    async sendOtp(req,res){
        const{phone} = req.body

        if(!phone){
            res.status(400).json({message:"Phone field is required! "})
        }
        const otp = await OtpService.generateOtp()
        res.json({otp:otp})
    }
    //#endregion
}

module.exports = new AuthController()