const { Pool } = require('pg');

const isProduction = process.env.ENVIRONMENT === 'prod';


const pool = new Pool({
    user: 'twuuser',
    host: isProduction ? 'database' : 'localhost',
    database: 'twudb',
    password: 'twupw',
    port: isProduction ? 5432 : 5433,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
