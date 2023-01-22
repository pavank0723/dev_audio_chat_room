const crypto = require('crypto')
const { HASH_SECRET } = require('../config')
class HashService {
    hashOtp(data) {
       return crypto.createHash('sh256', HASH_SECRET).update(data).digest('hex')
    }
}

module.exports = new HashService()