import mysql from 'mysql2/promise';
// import config from '../config/config';

const db = mysql.createPool({
    host: '173.231.200.72',
    user: 'anshin_costing',
    password: 'zEF5$,f(lQbm',
    database: 'anshin_costing',
});

export default db;