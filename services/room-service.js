const { RoomModel } = require("../models")

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId]
        })
        return room
    }

    async getRooms(types) {
        const allRooms = await RoomModel.find({ roomType: { $in: types } }).populate('speakers').populate('ownerId').exec()
        return allRooms

    }
}

module.exports = new RoomService()