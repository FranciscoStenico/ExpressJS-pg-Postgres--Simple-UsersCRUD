import services from '../services/User.service';

class UsersControllers {
  static async register(request, response) {
    try {
      const { name, email, password, is_adm } = request.body;
      const newUser = await services.register(name, email, password, is_adm);

      return response.status(201).json(newUser);
    } catch ({ message }) {
      return response.status(400).json({ message });
    }
  }

  static async list(_, response) {
    try {
      const users = await services.list();

      return response.status(200).json(users);
    } catch ({ message }) {
      return response.status(404).json({ message });
    }
  }

  static profile(request, response) {
    try {
      const { uuid } = request.user;
      const userProfile = services.profile(uuid);

      return response.status(200).send(userProfile);
    } catch (error) {
      return response.status(404).send({ message: error.message });
    }
  }

  static update(request, response) {
    try {
      const { id } = request.params;
      const updates = request.body;
      const updatedProfile = services.update(id, updates);

      return response.status(200).send(updatedProfile);
    } catch (error) {
      return response.status(404).send({ message: error.message });
    }
  }

  static delete(request, response) {
    try {
      const { id } = request.params;
      services.delete(id);

      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: error.message });
    }
  }
}

export default UsersControllers;
