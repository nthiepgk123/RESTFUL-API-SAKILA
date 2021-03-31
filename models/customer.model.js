const db = require('../utils/db');

module.exports = {
    all() {
        return db.from('customer');
    },
    single(id) {
        return db('customer').where('customer_id', id);
    },
    add(customer) {
        return db('customer').insert(customer);
    },
    del(id) {
        return db('customer')
            .where('customer_id', id)
            .del();
    }
}