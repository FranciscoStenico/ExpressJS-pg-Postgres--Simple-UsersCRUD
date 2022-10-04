import services from '../services/Sessions.service';

class SessionControllers {
  static async login(request, response) {
    try {
      const newLogin = await services.login(request.body);
      return response.status(200).json(newLogin);
    } catch ({ message }) {
      return response.status(401).json({ message });
    }
  }
}

export default SessionControllers;
