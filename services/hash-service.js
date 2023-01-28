const crypto = require('crypto')
const { HASH_SECRET } = require('../config')
class HashService {
    //Genreate Hash of OTP
    hashOtp(data) {
       return crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex')
    }
}

module.exports = new HashService()