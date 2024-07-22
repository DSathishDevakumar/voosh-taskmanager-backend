const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
let db = require('../../models/schemaconnection');

const project = {
    updatedAt: 0,
}

Router.get('/getTask', verifyToken, function (req, res) {
    const { search, date } = req.query;
    const { ID } = req;
    let query = {
        status: true,
        isdeleted: false,
        userid: ID
    };
    if (search) {
        query.title = { $regex: search, $options: 'i' }; // Case-insensitive search on the title field
    }
    DB.GetDocument('tasks', query, project, { sort: { createdAt: date, order: 1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(200).json(result);
        }
    });
});

Router.post('/addTask', verifyToken, async function (req, res) {
    const { ID } = req
    const taskExist = await db.tasks.findOne({ title: req.body.title, userid: ID })
    if (taskExist) {
        res.statusMessage = "Task already exist";
        return res.status(409).end();
    }
    const formData = {
        userid: ID,
        title: helperFunction.Capitalize(req.body.title),
        description: helperFunction.Capitalize(req.body.description),
        status: req.body.status ? req.body.status : 1,
        taskstatus: 'TODO',
        isdeleted: req.body.isdeleted ? req.body.isdeleted : 0,
    }
    DB.InsertDocument('tasks', formData, function (err, result) {

        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Created successfully";
            return res.status(201).json(result);
        }
    });
});

Router.get('/viewTask/:id', verifyToken, function (req, res) {
    DB.GetOneDocument('tasks', { _id: req.params.id }, project, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(200).json(result);
        }
    });
});


Router.post('/editTask/:id', verifyToken, async function (req, res) {
    const { ID } = req
    const formData = {
        title: helperFunction.Capitalize(req.body.title),
        description: helperFunction.Capitalize(req.body.description),
    }
    const resultsAlready = await db.tasks.findOne({ title: formData.title, userid: ID  }).select('_id');
    if (resultsAlready != null) {
        if (resultsAlready._id != req.params.id) {
            res.statusMessage = "Already exist";
            return res.status(409).end();
        }
    }
    DB.FindUpdateDocument('tasks', { _id: req.params.id }, formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Updated successfully";
            return res.status(200).json(result);
        }
    });
});


Router.get('/softDeleteTask/:id', async function (req, res) {
    DB.GetOneDocument('tasks', { _id: req.params.id }, {}, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            DB.FindUpdateDocument('tasks', { _id: req.params.id }, { isdeleted: result.isdeleted ? !result.isdeleted : 1 }, function (err, result1) {
                if (err) {
                    res.status(400).end();
                } else {
                    res.statusMessage = "Deleted successfully";
                    res.status(200).end();
                }
            })
        }
    })
})

Router.post('/updateTasksOrder', async (req, res) => {
    try {
        const { tasks } = req.body; // tasks is an array of updated tasks
        const updatePromises = tasks.map(task =>
            DB.FindUpdateDocument('tasks', { _id: task._id }, { $set: { taskstatus: task.taskstatus, order: task.order } }, function (err, result) { })
        );
        await Promise.all(updatePromises);
        res.statusMessage = 'Task updated successfully'
        res.status(200).end();
    } catch (error) {
        res.statusMessage = error.message
        res.status(400).end();
    }
});

module.exports = Router;