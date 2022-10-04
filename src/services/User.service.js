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

      return res.rows[0];
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

  static profile(id) {
    const userProfile = users.find(({ uuid }) => uuid == id);
    if (!userProfile) {
      throw new Error('User not found');
    }

    const { name, email, isAdm, createdOn, updatedOn, uuid } = userProfile;
    return { name, email, isAdm, createdOn, updatedOn, uuid };
  }

  static update(id, updates) {
    const userIndex = users.findIndex(({ uuid }) => uuid == id);
    const user = users.find(({ uuid }) => uuid == id);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date().toJSON();
    const updatedUser = { ...user, ...updates, updatedOn: now };
    const { name, email, isAdm, createdOn, updatedOn, uuid } = updatedUser;

    users.splice(userIndex, 1, updatedUser);
    return { name, email, isAdm, createdOn, updatedOn, uuid };
  }

  static delete(id) {
    const userIndex = users.findIndex((user) => user.uuid === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(this.userIndex(id), 1);
  }
}

export default UserServices;
