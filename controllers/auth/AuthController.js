const { UserDto } = require("../../dtos")
const { OtpService, HashService, UserService, TokenService } = require("../../services")
// const otpService = require("../../services/otp-service")
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

        const isValid = OtpService.verifyOtp(hashedOtp, data)
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
        // #region Store tokens in Database and Cookie
        await TokenService.stroreRefreshToken(refreshToken, user._id)
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        // #endregion
        const userDto = new UserDto(user)
        res.json({ user: userDto, auth: true })
        //#endregion
    }


    async refresh(req, res) {
        //Refresh Token from cookies
        const { refreshToken: refreshTokenFromCookie } = req.cookies

        //Check If token is valid
        let userData
        try {
            userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie)
        } catch (error) {
            return res.status(401).json({ message: 'Invalid Token' })
        }

        //Check If token is in DB
        try {
            const token = await TokenService.findRefreshToken(userData._id, refreshTokenFromCookie)
            if(!token){
                return res.status(401).json({ message: "Invalid token" })
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal error" })
        }

        //Check if valid user
        const user = UserService.findUser({_id:userData._id})
        if(!user){
            return res.status(404).json({ message: "No User found" })
        }

        //Generate new token
        const {refreshToken,accessToken} = TokenService.generateAccessToken({_id:userData._id,})

        //Update Refresh Token
        try {
            await TokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: "Internal error" })
        }

        //Put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        
        //Response
        const userDto = new UserDto(user)
        res.json({ user: userDto, auth: true })
    }

    async logout(req,res){
        const {refreshToken} = req.cookies

        //delete refresh token from DB
        await TokenService.removeToken(refreshToken)

        //delete cookies
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        res.json({user:null,auth:false})
    }
}

module.exports = new AuthController()