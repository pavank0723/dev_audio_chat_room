const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config')
const { RefreshModel } = require('../models')

class TokenService {
    generateAccessToken(payload) {
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        })

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: '1y'
        })

        return {
            accessToken, refreshToken
        }
    }

    async stroreRefreshToken(token, userId) {
        try {
            await RefreshModel.create({
                token,
                userId
            })
        } catch (error) {
            console.log(error)
        }
    }

    async verifyAccessToken(token){
        return jwt.verify(token,JWT_SECRET)
    }
}

module.exports = new TokenService()