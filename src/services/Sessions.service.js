import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import database from '../database';

class SessionServices {
  static async login({ email, password }) {
    try {
      const res = await database.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = res.rows[0];

      if (!res.rowCount) {
        throw new Error('Email or password invalid');
      }

      const passwordCheck = await compare(password, res.rows[0].password);
      if (!passwordCheck) {
        throw new Error('Email or password invalid');
      }

      const token = jwt.sign(
        {
          is_adm: user.is_adm,
          id: user.id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '24h',
        }
      );

      const { id, email: resEmail, name, is_adm, created_on, updated_on } = res.rows[0];
      return { user: { id, email: resEmail, name, is_adm, created_on, updated_on }, token };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default SessionServices;
