// db.ts
import mysql from 'mysql2/promise'
// import config from '../config/config'

const connectionConfig = {
    // host: '173.231.207.59',
    // user: 'superdolphins_costing',
    // password: '+lJL10Q.oDK,',
    // database: 'superdolphins_costing',
    host: '173.231.200.72',
    user: 'anshin_costing',
    password: 'zEF5$,f(lQbm',
    database: 'anshin_costing',
}




async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(connectionConfig)
        // console.log('Connected to the database!');
        return connection
    } catch (error) {
        // console.error('Error connecting to the database:', error);
        throw error
    }
}

export { connectToDatabase }
