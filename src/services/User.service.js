import { hash } from 'bcryptjs';
import database from '../database';

class UserServices {
  static async register(name, email, password, is_adm) {
    const hashedKey = await hash(password, 10);
    try {
      const res = await database.query(
        `
        INSERT INTO 
          users(email, name, password, is_adm) 
        VALUES 
          ($1, $2, $3, $4) 
        RETURNING *`,
        [email, name, hashedKey, is_adm]
      );

      const { id, created_on, updated_on } = res.rows[0];
      return { id, email, name, is_adm, created_on, updated_on };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async list() {
    try {
      const res = await database.query('SELECT * FROM users');

      return res.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async profile(id) {
    try {
      const res = await database.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);

      const { name, email, is_adm, created_on, updated_on } = res.rows[0];
      return { id, name, email, is_adm, created_on, updated_on };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(id, updates) {
    try {
      let query = 'UPDATE users SET ';
      const keys = Object.keys(updates);
      const values = Object.values(updates);

      keys.forEach((key, index, arr) => {
        query += `${key} = \$${index + 1}, `;
        query =
          index === arr.length - 1
            ? query.slice(0, -2) +
              `,
              updated_on = now() - INTERVAL '3 hours'
              WHERE 
                id = \$${arr.length + 1} 
              RETURNING *
            `
            : query;
      });

      const res = await database.query(query, [...values, id]);
      const { email, name, is_adm, created_on, updated_on } = res.rows[0];

      return { id, email, name, is_adm, created_on, updated_on };
    } catch (error) {
      throw new Error(error);
    }

    /* return res.rows[0]; */
  }

  static async delete(id) {
    try {
      const res = await database.query('DELETE FROM users WHERE id = $1', [id]);
      if (!res.rowCount) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default UserServices;
