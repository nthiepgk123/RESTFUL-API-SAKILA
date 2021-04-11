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
    },
    updateRefreshToken(idUser, refreshtoken) {
        return db('User').where('User_Id', idUser).update('rfToken', refreshtoken);
    },
    async newRefreshToken(id, refreshtoken) {
        const CheckUser = await db('User').where('User_Id', id).andWhere('rfToken', refreshtoken);
        if (CheckUser.length > 0) {
            return true;
        }
        return false;
    }
}