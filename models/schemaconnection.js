const mongoose = require('mongoose');

// importing schemas to create model
const importedUserSchema = require('../schemas/user');
const importedTaskSchema = require('../schemas/task');

// Creating schema
const UserSchema = mongoose.Schema(importedUserSchema, { timestamps: true, versionKey: false });
const TaskSchema = mongoose.Schema(importedTaskSchema, { timestamps: true, versionKey: false });

// Creating models
const UserModel = mongoose.model('users', UserSchema);
const TaskModel = mongoose.model('tasks', TaskSchema);

module.exports = {
    users: UserModel,
    tasks: TaskModel,
}
