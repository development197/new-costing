/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
// import { User } from '../types/types'
import db from '../config/mysqlConnection'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt';
// import bcrypt from 'bcryptjs'

// export default {
//     register: async(req: Request, res: Response, nextFunc: NextFunction) => {

//         // eslint-disable-next-line no-console
//         console.log(req.body);

//         const {name, email, password, role} = req.body;

//         try {

//             // eslint-disable-next-line no-console
//             console.log(name, email);

//             // if (!name || !email || password) {
//             //     return httpResponse(req, res, 400, 'All fields are required.')
//             // }

//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])
//             if (result.length > 0) {
//                 return httpError(nextFunc, new Error('Email already exist'), req, 404)
//             }

//                 // Hash the password
//                 const saltRounds = 10;
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//                 const hashedPassword = await bcrypt.hash(password, saltRounds);

//                 await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',[name, email, hashedPassword, role])

//             httpResponse(req, res, 200, responseMessage.SUCCESS)
//         } catch (err) {
//             httpError(nextFunc, err, req, 500)
//         }
//     },

// }

export default {
    // Create User (Register)
    register: async (req: Request, res: Response, nextFunc: NextFunction) => {
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // const { name, email, password, role } = req.body;

        // try {
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //     if (result.length > 0) {
        //         return httpError(nextFunc, new Error('Email already exists'), req, 404);
        //     }

        //     const saltRounds = 10;
        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        //     const hashedPassword = await bcrypt.hash(password, saltRounds);

        //     await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);

        //     httpResponse(req, res, 200, responseMessage.SUCCESS);
        // } catch (err) {
        //     httpError(nextFunc, err, req, 500);
        // }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name, email, password, role } = req.body

        // Check if any required field is missing
        if (!name || !email || !password) {
            return httpError(nextFunc, new Error('Missing required fields'), req, 400)
        }

        try {
            // Check if the email already exists in the database
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])
            // eslint-disable-next-line no-console
            console.log('Query Result:', result)

            // If email exists, return an error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (result && result.length > 0) {
                return httpError(nextFunc, new Error('Email already exists'), req, 404)
            }

            // Hash the password using bcrypt
            // const saltRounds = 10;
            // const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user into the database
            await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role])

            // Send success response
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            // Log the error for debugging
            // console.error('Error during registration:', err);
            httpError(nextFunc, err, req, 500)
        }
    },

    // Update User
    updateUser: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id } = req.params
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name, email, password, role } = req.body

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [existingUser]: any = await db.query('SELECT * FROM users WHERE id = ?', [id])
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (existingUser.length === 0) {
                return httpError(nextFunc, new Error('User not found'), req, 404)
            }

            // const saltRounds = 10;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            // const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : existingUser[0].password;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await db.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [
                name || existingUser[0].name,
                email || existingUser[0].email,
                password,
                role || existingUser[0].role,
                id
            ])

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    // Delete User
    deleteUser: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id } = req.params

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [existingUser]: any = await db.query('SELECT * FROM users WHERE id = ?', [id])
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (existingUser.length === 0) {
                return httpError(nextFunc, new Error('User not found'), req, 404)
            }

            await db.query('DELETE FROM users WHERE id = ?', [id])

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getUserById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { userId } = req.params

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [results]: any = await db.query('SELECT * FROM users WHERE id = ?', [userId])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (results.length === 0) {
                return httpResponse(req, res, 404, 'User not found.')
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            httpResponse(req, res, 200, 'User found', { company: results[0] })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllUsers: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query('SELECT * FROM users')
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    login: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])

            if (!result.user) {
                return res.status(404).json({ error: 'User not found' })
                // httpError(nextFunc, error, req, 400)
            }

            // Compare password directly (no hashing)
            if (result.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            // Generate JWT token
            const token = jwt.sign({ userId: result.id, role: result.role }, '1234456', { expiresIn: '1h' })

            // Respond with user data and token
            res.json({
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    role: result.role
                },
                token
            })
        } catch (error) {
            // res.status(500).json({ error: error })
            httpError(nextFunc, error, req, 500)
        }
    }
}
