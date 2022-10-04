import jwt from 'jsonwebtoken';
import 'dotenv/config';

class Ensure {
  static authentication(request, response, next) {
    let token = request.headers.authorization;

    if (!token) {
      return response
        .status(401)
        .send({ message: 'Missing authorization headers' });
    }

    token = token.split(' ')[1];
    const options = (error, decoded) => {
      if (error) {
        return response.status(401).send({ message: 'Invalid token' });
      }

      request.user = { is_adm: decoded.is_adm, id: decoded.id };
      next();
    };

    jwt.verify(token, process.env.SECRET_KEY, options);
  }

  static adminOnly(request, response, next) {
    const { is_adm } = request.user;
    if (!is_adm) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    next();
  }

  static adminPermissions(request, response, next) {
    const { is_adm, id: uuid } = request.user;
    const { id } = request.params;

    const equalIds = uuid === id;
    if (!is_adm && !equalIds) {
      return response
        .status(401)
        .send({ message: 'Missing admin permissions' });
    }

    next();
  }
}

export default Ensure;
