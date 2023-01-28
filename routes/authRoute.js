const {AuthController} = require('../controllers')

const route = require('express').Router()

route.post('/send-otp',AuthController.sendOtp)
route.post('/verify-otp',AuthController.verifyOtp)

module.exports = route