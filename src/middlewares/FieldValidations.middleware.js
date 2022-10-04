class FieldValidations {
  static register = ['name', 'email', 'password', 'is_adm'];
  static login = ['email', 'password'];
  static updateUser = ['name', 'email'];

  static check =
    (type, ...fields) =>
    (request, response, next) => {
      if (!this.compare(fields, request, type)) {
        return response
          .status(400)
          .send({ message: `Required fields: ${fields.join(', ')}` });
      }

      next();
    };

  static compare(fields, { body }, type) {
    const requestKeys = Object.keys(body);

    const fieldName = requestKeys.every((key) =>
      fields.some((modelKey) => modelKey == key)
    );
    const simmetry = fields.length === requestKeys.length;

    switch (type) {
      case 'all':
        return fieldName && simmetry;
      case 'parse':
        return fieldName;
    }
  }
}

export default FieldValidations;
