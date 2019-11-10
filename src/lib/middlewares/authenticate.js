const commonErrors = require('common-errors');
const HttpStatusCode = require('http-status-codes');

const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const cache = require('../cache');

class Authenticate {
  static async getUser(id) {
    try {
      const value = await cache.getValue(`USER_${id}`);
      if (value) {
        return JSON.parse(value);
      }
      const user = await User.findById(id);
      if (user) {
        await cache.setValue(`USER_${id}`, JSON.stringify(user.toJSON()));
        return user.toJSON();
      }
      return null;
    } catch (error) {
      throw new commonErrors.HttpStatusError(
        HttpStatusCode.INTERNAL_SERVER_ERROR, {
          message: error.message,
        },
      );
    }
  }

  static async authenticate(req, res, next) {
    try {
      if (!req.headers.authorization) {
        throw new commonErrors.HttpStatusError(
          HttpStatusCode.UNAUTHORIZED, {
            message: 'You don\'t have authorization to access this api',
          },
        );
      }
      const payload = await jwt.verify(req.headers.authorization, 'shhhhh');
      const user = await Authenticate.getUser(payload.user_id);
      if (!user) {
        throw new commonErrors.HttpStatusError(
          HttpStatusCode.UNAUTHORIZED, {
            message: 'You don\'t have authorization to access this api',
          },
        );
      }
      req.session = { user };
      next();
    } catch (error) {
      next({ error });
    }
  }
}

module.exports = Authenticate;
