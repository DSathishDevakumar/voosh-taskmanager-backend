const jwt = require('jsonwebtoken');
const DB = require('./db');

function verifyToken(req, res, next) {
	const bearerToken = req.headers['authorization'];
	jwt.verify(bearerToken, 'voosh', (err, data) => {
		if (err) res.sendStatus(403);
		else {
			const project = {
				createdAt: 0,
				updatedAt: 0,
			}
			if (data.type == 'admin') {
				DB.GetOneDocument('settings', { email: data.email }, project, {}, async function (err, result) {
					if (err) res.sendStatus(400);
					else {
						if (result) {
							req.ID = result._id;
							req.email = data.email;
							req.accountDetails = result;
							next();
						}
					}
				})
			} else if (data.type == 'user') {
				DB.GetOneDocument('users', { _id: data.userId }, project, {}, async function (err, result) {
					if (err) res.sendStatus(400);
					else {
						if (result) {
							req.role = 'user';
							req.ID = result._id;
							req.email = data.email;
							req.userInfo = result;
							next();
						} else {
							res.sendStatus(403);
						}
					}
				})
			} else res.sendStatus(403);
		}
	});
}

module.exports = verifyToken;