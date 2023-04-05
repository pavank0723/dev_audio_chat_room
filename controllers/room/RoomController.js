const { RoomDto } = require('../../dtos')
const { UserService, RoomService } = require('../../services')

class RoomController {
    async index(req, res) {

        const rooms = await RoomService.getRooms(['open'])
        const allRooms =rooms.map(room => new RoomDto(room))
        return res.json(allRooms)

    }

    async createRoom(req, res) {

        const { topic, roomType } = req.body
        if (!topic || !roomType) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        const room = await RoomService.create({
            topic,
            roomType,
            ownerId: req.user._id
        })

        return res.json(new RoomDto(room))

    }
}

module.exports = new RoomController()