const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const bcrypt = require('bcryptjs');
let db = require('../../models/schemaconnection');
const upload = require('../../models/fileupload');

const project = {
    createdAt: 0,
    updatedAt: 0,
}

Router.post('/addUser', async function (req, res) {
    const userExist = await db.users.findOne({ email: req.body.email.toLowerCase() })
    console.log('userExist',userExist);
    if (userExist) {
        res.statusMessage = "Email already exist";
        return res.status(409).end();
    }
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    const formData = {
        email: req.body.email.toLowerCase(),
        password: password,
        firstname: helperFunction.Capitalize(req.body.firstname),
        lastname: helperFunction.Capitalize(req.body.lastname),
        status: req.body.status ? req.body.status : 1,
        isdeleted: req.body.isdeleted ? req.body.isdeleted : 0,
    }
    DB.InsertDocument('users', formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Created successfully";
            return res.status(201).json(result);
        }
    });
});

Router.get('/getUser', verifyToken, function (req, res) {
    const { ID } = req
    DB.GetOneDocument('users', { _id: ID }, project, {}, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(200).json(result);
        }
    });
});


Router.post('/updateUser/:id', verifyToken, upload.single('avatar'), async function (req, res) {
    const formData = {
        firstname: helperFunction.Capitalize(req.body.firstname),
        lastname: helperFunction.Capitalize(req.body.lastname),
    }
    if (req.file) {
        formData.avatar = '/uploads/' + req.file.filename; // Save the path to the avatar
    }
    DB.FindUpdateDocument('users', { _id: req.params.id }, formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Updated successfully";
            return res.status(200).json(result);
        }
    });
});


module.exports = Router;