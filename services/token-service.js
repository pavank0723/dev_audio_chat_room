const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config')

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
    
}

module.exports = new TokenService()