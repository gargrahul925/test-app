const mongoose = require('mongoose');
const commonErrors = require('common-errors');

const errors = require('../lib/core/errors');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: String,
        default: new Date().toISOString()
    }
});

userSchema.statics.register = async function (data) {
    try {
        const user = new User(data);
        const error = await user.validateSync();
        if (error) {
            throw new commonErrors.ValidationError({
                description: 'Invalid input param(s)',
                details: error,
            });
        }
        const result = await this.findOne({ email: data.email });
        if (result) {
            throw new commonErrors.Error(errors.DUPLICATE_DATA, new Error('User already registered.'));
        }
        return await user.save();
    }
    catch (e) {
        throw e;
    }
}

const User = mongoose.model('User', userSchema, 'users');


module.exports = User;
