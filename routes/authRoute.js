const { AuthController, ActivateController } = require('../controllers')
const { Auth } = require('../middlewares')

const route = require('express').Router()

route.post('/send-otp', AuthController.sendOtp)
route.post('/verify-otp', AuthController.verifyOtp)
route.post('/activate', Auth, ActivateController.activate)
route.get('/refresh', AuthController.refresh)
route.post('/logout', Auth,AuthController.logout)

module.exports = route