const commonErrors = require('common-errors');
const HttpStatusCode = require('http-status-codes');

const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const cache = require('../cache');

async function getUser(id) {
    try {
        const value = await cache.getValue(`USER_${id}`);
        if (value) {
            return JSON.parse(value);
        }
        const user = await User.findById(id);
        if (user) {
            await cache.setValue(`USER_${id}`, JSON.stringify(user.toJSON()))
            return user.toJSON();
        }
        return null;
    }
    catch (error) {
        throw new commonErrors.HttpStatusError(
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
}

const authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new commonErrors.HttpStatusError(
                HttpStatusCode.UNAUTHORIZED,
                'You don\'t have authorization to access this api'
            );
        }
        const payload = await jwt.verify(req.headers.authorization, 'shhhhh');
        const user = await getUser(payload.user_id);
        if (!user) {
            throw new commonErrors.HttpStatusError(
                HttpStatusCode.UNAUTHORIZED,
                'You don\'t have authorization to access this api'
            );
        }
        req.session = { user };
        next();
    }
    catch (error) {
        next({ error });
    }
};

module.exports = authenticate;
