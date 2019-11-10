const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    completionTime: {
        type: Date,
    },
    reminderTime: {
        type: Date,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date().toISOString()
    }
});


const Task = mongoose.model('Task', taskSchema, 'tasks');

module.exports = Task;
