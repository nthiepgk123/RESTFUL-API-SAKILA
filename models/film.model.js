const db = require('../utils/db');

module.exports = {
    all(){
        return db.from('film');
    },
    single(id){
        return db('film').where('film_id',id);
    },
    add(film){
        return db('film').insert(film);
    },
    del(id){
        return db('film')
                .where('film_id',id)
                .del();
    }
}