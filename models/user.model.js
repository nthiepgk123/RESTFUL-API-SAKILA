const db = require('../utils/db');

module.exports = {
    findOne(user, pass) {
        return db('User').where('UserName', user);
    },
    addUser(User) {
        return db('User').insert(User);
    }
}