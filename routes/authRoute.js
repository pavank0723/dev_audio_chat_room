const AuthController = require('../controllers')

const route = require('express').Router()

route.post('/send-otp',AuthController.sendOtp)

module.exports = route