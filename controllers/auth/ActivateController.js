const Jimp = require('jimp')
const path = require('path')
const { UserDto } = require('../../dtos')
const { UserService } = require('../../services')

class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body
        if (!name || !avatar) {
            res.status(400).json({ message: "All fields are required" })
        }

        //image base64
        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64')
        const imgPath = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}.png`
        try {
            const jimpResp = await Jimp.read(buffer)
            jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../../storage/${imgPath}`))
        } catch (error) {
            res.status(500).json({ message: "Internal error" })
        }

        const userId = req.user._id
        //Update User
        try {
            const user = await UserService.findUser({ _id: userId })
            if (!user) {
                res.status(404).json({ message: "User not found" })
            }
            user.activated = true
            user.name = name
            user.avatar = `/storage/${imgPath}`
            user.save()
            res.json({ user: new UserDto(user),auth:true })
        } catch (error) {
            res.status(500).json({message:'Somethink went wrong'})
        }
    }
}

module.exports = new ActivateController()