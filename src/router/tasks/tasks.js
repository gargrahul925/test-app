const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Joi = require('@hapi/joi');

const ApiResponse = require('../../lib/core/APIResponse');
const errors = require('../../lib/core/errors');

const { Task } = require('../../models');


/**
* Class TaskAPI
*/
class TaskAPI {

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
            [errors.NOT_FOUND]: () => (
                new commonErrors.HttpStatusError(
                    HttpStatusCode.NOT_FOUND,
                    'Task not found'
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
     * Function to validate the input request
     * @param {Object} params Parameters passed to reequest query
     *
     * @returns {Error} Returns null if the parameters are valid
     *                    else returns an error object (ValidationError)
     */
    static validate(params) {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string(),
            completionTime: Joi.date(),
            reminderTime: Joi.date(),
            isCompleted: Joi.boolean().default(false),
        });

        const {
            error,
        } = schema.validate(params);
        if (error != null) {
            throw new commonErrors.Error(errors.ERR_INVALID_ARGS, error);
        }
    }

    /**
     * Get API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async get(req, res, next) {
        try {
            const task = await Task.findById(req.params.id);
            if (!task || task.user.toString() !== req.session.user._id) {
                throw new commonErrors.Error(errors.NOT_FOUND, new Error('record not found.'));
            }
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                data: task,
            });
            next();
        } catch (error) {
            next(TaskAPI.mapErrors(error));
        }
    }

    /**
     * List API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async list(req, res, next) {
        try {
            //Filters can be added Ex: to list only complete tasks so on. 
            const tasks = await Task.find({ user: req.session.user._id });
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                data: {
                    records: tasks,
                    count: tasks.length
                },
            });
            next();
        }
        catch (error) {
            next(TaskAPI.mapErrors(error));
        }
    }

    /**
     * Post API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async post(req, res, next) {
        try {
            TaskAPI.validate(req.body);
            const task = new Task(Object.assign({}, req.body, { user: req.session.user._id }));
            const result = await task.save();
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                data: result.toJSON(),
            });
            next();
        }
        catch (error) {
            next(TaskAPI.mapErrors(error));
        }
    }

    /**
     * PUT API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async put(req, res, next) {
        try {
            const task = await Task.findById(req.params.id);
            if (!task || task.user.toString() !== req.session.user._id) {
                throw new commonErrors.Error(errors.NOT_FOUND, new Error('record not found.'));
            }
            TaskAPI.validate(req.body);
            task.set(req.body);
            await task.save();
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                message: 'Record Updated',
                data: {},
            });
            next();
        }
        catch (error) {
            next(TaskAPI.mapErrors(error));
        }
    }

    /**
     * Delete API
     * @param {*} req Request Object
     * @param {*} res Response Object
     * @param {*} next Next pointer
     *
     * @returns {unidentified} Unindentified
     */
    static async delete(req, res, next) {
        try {
            const task = await Task.findById(req.params.id);
            if (!task || task.user.toString() !== req.session.user._id) {
                throw new commonErrors.Error(errors.NOT_FOUND, error);
            }
            await task.save();
            res.locals.apiResponse = new ApiResponse(HttpStatusCode.OK, {
                message: 'Record Deleted',
                data: {},
            });
            next();
        }
        catch (error) {
            next(TaskAPI.mapErrors(error));
        }
    }
}

module.exports = {
    get: TaskAPI.get,
    list: TaskAPI.list,
    post: TaskAPI.post,
    put: TaskAPI.put,
    delete: TaskAPI.delete,
};
