const { BASE_URL } = require('../config')
class UserDto {
    id;
    name;
    avatar;
    phone;
    activated;
    createdAt;

    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.avatar = user.avatar ? `${BASE_URL}${user.avatar}`: null;
        this.phone = user.phone;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = UserDto;