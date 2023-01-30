const { OtpService, HashService, UserService, TokenService } = require("../../services")
const otpService = require("../../services/otp-service")
class AuthController {

    //#region SEND OTP
    async sendOtp(req, res) {
        const { phone } = req.body

        if (!phone) {
            res.status(400).json({ message: "Phone field is required! " })
        }
        const otp = await OtpService.generateOtp()

        //#region HASH
        const ttl = 1000 * 60 * 2 //ttl -> time to leave =>> 2 mins
        const expires = Date.now() + ttl
        const data = `${phone}.${otp}.${expires}`
        const hash = HashService.hashOtp(data)
        //#endregion 

        //#region send OTP
        try {
            // await otpService.sendBySms(phone, otp) //Original Mobile Number
            res.json(
                {
                    hash: `${hash}.${expires}`,
                    phone,
                    otp //dummy
                }
            )
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'message sending failed' })
        }
        //#endregion
        // res.json({ hash: hash })
    }
    //#endregion

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: 'All fields are required!' })
        }

        const [hashedOtp, expires] = hash.split('.')
        if (Date.now() > +expires) {
            res.status(400).json({ message: 'Otp expired' })
        }

        const data = `${phone}.${otp}.${expires}`

        const isValid = otpService.verifyOtp(hashedOtp, data)
        if (!isValid) {
            res.status(400).json({ message: 'Invalid OTP' })
        }

        let user

        try {
            user = await UserService.findUser({ phone })
            if (!user) {
                user = await UserService.createUser({ phone })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'DB Server error' })
        }

        //#region Token
        const { accessToken, refreshToken } = TokenService.generateAccessToken(
            { 
                _id: user._id, 
                activated: false 
            }
        )
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        
        res.json({ accessToken })
        //#endregion
    }
}

module.exports = new AuthController()