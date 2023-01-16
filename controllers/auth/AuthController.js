class AuthController{
    sendOtp(req,res){
        res.send("Hello from Otp route")
    }
}

module.exports = new AuthController