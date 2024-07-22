var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TASKSCHEMA = {
    title: String,
    description: String,
    taskstatus: String,
    order: Number,
    status: Boolean,
    isdeleted: Boolean,
    userid: { type: Schema.Types.ObjectId, ref: 'users' },
};

module.exports = TASKSCHEMA;