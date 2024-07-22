const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


Router.post('/login', async function (req, res) {
    const { password } = req.body;
    const email = req.body.email.toLowerCase()

    if (email == "info@voosh.com") {
        DB.GetOneDocument('settings', { email: email }, {}, {}, function (err, userResult) {
            if (err) {
                res.status(400).end();
            } else {
                const passswordCheck = userResult.password ? bcrypt.compareSync(password, userResult.password, null) : false;
                if (passswordCheck) {
                    jwt.sign({ email: email, type: 'admin', userId: userResult._id, password: userResult.password, device: 'web' }, 'voosh', {}, (err, token) => {
                        if (token) {
                            res.statusMessage = "Logged in successfully";
                            DB.FindUpdateDocument('settings', { email: email }, formData, function (err, Result) {
                                if (err) {
                                    res.status(501).end();
                                }
                            });
                            return res.status(200).json({ status: 1, userResult, token, role: 'admin' });
                        }
                    });
                } else {
                    let resultData = { status: 0, message: "Invalid password for Admin" };
                    return res.status(200).json(resultData);
                }
            }
        })
    } else {
        DB.GetOneDocument('users', { email: email }, {}, {}, async function (err, result) {
            if (err) {
                res.statusMessage = "Contact your admin";
                res.status(400).end();
            } else {
                if (result) {
                    if (result && result.status === true) {
                        const passswordCheck = result.password ? bcrypt.compareSync(password, result.password, null) : false;
                        if (passswordCheck) {
                            jwt.sign({ email: email, type: 'user', userId: result._id, password: result.password, adminpassword: result.adminpassword, device: 'web' }, 'voosh', {}, async (err, token) => {
                                if (token) {
                                    res.statusMessage = "Logged in successfully";
                                    return res.status(200).json({ status: 1, data: result, token: token });
                                }
                            });
                        } else {
                            let resultData = { status: 0, message: "Invalid password" };
                            return res.status(200).json(resultData);
                        }
                    } else {
                        let resultData = { status: 0, message: "Your account has been blocked" };
                        return res.status(200).json(resultData);
                    }
                } else {
                    let resultData = { status: 0, message: "Invalid Email" };
                    return res.status(200).json(resultData);
                }
            }
        })
    }
});

module.exports = Router;