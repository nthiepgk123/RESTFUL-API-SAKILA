const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'hoan779850',
      database : 'sakila',
      port : 3306
    },
    loop : {
        min : 0,
        max : 50
    }
});
module.exports = knex;