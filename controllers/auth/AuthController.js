class AuthController{
    sendOtp(req,res){
        res.send("Hello from Otp controller route")
    }
}

module.exports = new AuthController