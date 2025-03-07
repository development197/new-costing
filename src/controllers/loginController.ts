/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/mysqlConnection';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Execute the query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: [any[], any] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // Check if a user with the given email exists
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = rows[0];

    // Compare the passwords (no hashing for this example)
    if (user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, '1234456', { expiresIn: '3h' });

    // Send the response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // console.error('Database query error:', error);
    res.status(500).json({ error: error });
  }
};
