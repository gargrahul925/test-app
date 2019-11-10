const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { User } = require('../../models');


/**
* Class UserAPI
*/
class UserAPI {
    /**
     * Function to map internal errors to http errors
     * @param {Object} error Internal Error object
     * 
     * @returns {Object} Returns object having http error and internal error
     */
    static mapErrors(error) {
        const errorMap = {
            [errors.ERR_INVALID_ARGS]: () => (
                new commonErrors.HttpStatusError(
                    HttpStatusCode.BAD_REQUEST,
                    'User Input is not valid.'
                )
            ),
            [errors.ERR_DOWNLOAD_FONT]: () => (
                new commonErrors.HttpStatusError(
                    HttpStatusCode.UNPROCESSABLE_ENTITY,
                    'Unable to download source font'
                )
            ),
            [errors.CREDENTIALS_NOT_VALID]: () => (
                new commonErrors.HttpStatusError(
                    HttpStatusCode.UNAUTHORIZED,
                    'Email or password is wrong'
                )
            ),
            [errors.DUPLICATE_DATA]: () => (
                new commonErrors.HttpStatusError(
                    HttpStatusCode.CONFLICT,
                    'User with given email already registered'
                )
            ),
            default: () => (new commonErrors.HttpStatusError(
                HttpStatusCode.INTERNAL_SERVER_ERROR
            )),
        };
        if (errorMap[error.message]) {
            return errors.addInnerError(errorMap[error.message](), error);
        }
        return errors.addInnerError(errorMap.default(), error);
    }


    /**
     * Function to validate the input request of login API
     * @param {Object} params Parameters passed to reequest query
     *
     * @returns {Error} Returns null if the parameters are valid
     *                    else returns an error object (ValidationError)
     */
    static validateLogin(params) {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
        });
        const {
            error,
        } = schema.validate(params);
        if (error != null) {
            throw new commonErrors.Error(errors.ERR_INVALID_ARGS, error);
        }
    }


    /**
     * Login API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async login(req, res, next) {
        try {
            UserAPI.validateLogin(req.body);
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new commonErrors.Error(errors.CREDENTIALS_NOT_VALID);
            }
            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid) {
                throw new commonErrors.Error(errors.CREDENTIALS_NOT_VALID);
            }
            const token = jwt.sign({ user_id: user._id, type: 'auth', }, 'shhhhh');
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                token
            });
            next();
        } catch (error) {
            next(UserAPI.mapErrors(error));
        }
    }


    /**
     * Function to validate the input request of register API
     * @param {Object} params Parameters passed to reequest body
     *
     * @returns {Error} Returns null if the parameters are valid
     *                    else returns an error object (ValidationError)
     */

    static validateRegister(params) {
        const queryValidator = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
        });

        const { error } = queryValidator.validate(params);
        if (error != null) {
            throw new commonErrors.Error(errors.ERR_INVALID_ARGS, error);
        }
    }

    /**
     * Sample Register API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async register(req, res, next) {
        try {
            UserAPI.validateRegister(req.body);
            const payload = Object.assign({}, req.body);
            payload.password = bcrypt.hashSync(req.body.password, 10);
            const user = await User.register(payload);
            const token = jwt.sign({ user_id: user._id, type: 'auth', }, 'shhhhh');
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                token
            });
            next();
        } catch (error) {
            next(UserAPI.mapErrors(error));
        }
    }
}

module.exports = {
    login: UserAPI.login,
    register: UserAPI.register,
};
