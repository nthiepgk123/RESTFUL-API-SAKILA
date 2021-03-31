const db = require('../utils/db');

module.exports = {
    async findOne(user) {
        const data = await db('User').where('UserName', user);
        return data[0];
    },
    addUser(User) {
        return db('User').insert(User);
    },
    showListUser() {
        return db.from('User');
    }
}