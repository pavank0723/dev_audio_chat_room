const mongoose = require('mongoose')
const { BASE_URL } = require('../config')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false,
        get: (avatar) => {
            if (avatar) {
                return `${BASE_URL}${avatar}`
            } else {
                return avatar
            }

        }
    },
    phone: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
})

module.exports = mongoose.model('User', userSchema, 'users')