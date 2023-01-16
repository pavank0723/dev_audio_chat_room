const express = require('express')
const { APP_PORT } = require('./config')
const app = express()

const router = require('./routes')

app.use('/api',router)

app.get('/',(req,res) =>{
    res.send('Hello from express js')
})

const port  = APP_PORT || 6000
app.listen(port,() => console.log(`Listining on port ${port}`))