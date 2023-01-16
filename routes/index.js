const router = require('express').Router()

const authRouter = require('../routes/authRoute')

router.use('/auth/',authRouter)


module.exports = router