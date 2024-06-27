const pgp = require('pg-promise')();

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

const db = pgp(dbConfig);

db.connect()
    .then(obj => {
        console.log('Connected to the database:', obj.connected);
        obj.done(); // success, release the connection
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });
