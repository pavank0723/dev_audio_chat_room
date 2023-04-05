const router = require('express').Router()

const authRouter = require('../routes/authRoute')
const roomRouter = require('../routes/roomRoute')

router.use('/auth/',authRouter)
router.use('/room/',roomRouter)


module.exports = router