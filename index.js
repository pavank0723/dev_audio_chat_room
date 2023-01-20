const express = require('express')
const router = require('./routes')
const { APP_PORT } = require('./config')

const app = express()

//📌Note: By default JSON in Express JS --==> ❎disable 
app.use(express.json()) //✅ Enable

//Router setup
app.use('/api',router)

const port  = APP_PORT || 6000
app.listen(port,() => console.log(`Listining on port ${port}`))