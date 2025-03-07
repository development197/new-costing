/* eslint-disable no-console */
// // import app from './app'
// // import config from './config/config'
// // import { connectToDatabase } from './services/databaseService';
// // import logger from './util/logger';

// // const server = app.listen(config.PORT)

// // // eslint-disable-next-line @typescript-eslint/no-floating-promises
// // ;(async()=>{
// //     try {
// //         const connection = await connectToDatabase();
// //         logger.info('DATABASE_CONNECTION', {
// //             meta: {
// //                 CONNECTION_NAME: connection.config.database
// //             }
// //         })
// //         logger.info('APPLICATION_STARTED', {
// //             meta: {
// //                 PORT: config.PORT,
// //                 SERVER_URL: config.SERVER_URL
// //             }
// //         })
// //     } catch (err) {
// //         logger.error('APPLICATION_ERROR', {meta: err})
// //         server.close((error)=>{
// //             if(error){
// //                 logger.error('APPLICATION_ERROR', {meta: error})
// //             }
// //             process.exit(1)
// //         })
// //     }
// // })()

// import app from './app'
// import { connectToDatabase } from './services/databaseService'
// import logger from './util/logger'

// const PORT = 3300
// const SERVER_URL = 'https://ded6827.inmotionhosting.com'

// const server = app.listen(PORT)

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// ;(async () => {
//     try {
//         const connection = await connectToDatabase()
//         logger.info('DATABASE_CONNECTION', {
//             meta: {
//                 CONNECTION_NAME: connection.config.database
//             }
//         })
//         logger.info('APPLICATION_STARTED', {
//             meta: {
//                 PORT,
//                 SERVER_URL
//             }
//         })
//     } catch (err) {
//         logger.error('APPLICATION_ERROR', { meta: err })
//         server.close((error) => {
//             if (error) {
//                 logger.error('APPLICATION_ERROR', { meta: error })
//             }
//             process.exit(1)
//         })
//     }
// })()

import app from './app'
import { connectToDatabase } from './services/databaseService'

const PORT = 3300
const SERVER_URL = 'https://ded6827.inmotionhosting.com'

const server = app.listen(PORT)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
    try {
        await connectToDatabase()
        console.log(`Server is running at ${SERVER_URL} on port ${PORT}`)
    } catch (err) {
        console.error('Error starting application:', err)
        server.close(() => process.exit(1))
    }
})()
