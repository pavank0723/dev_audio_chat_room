const { RoomController } = require('../controllers')
const { Auth } = require('../middlewares')

const route = require('express').Router()

route.post('/createRoom', Auth,RoomController.createRoom)
route.get('/getRooms', Auth,RoomController.index)

module.exports = route