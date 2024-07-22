const BaseUrl = '/api/v1/';
module.exports = function (app) {
    app.use(BaseUrl + "account", require("../controllers/admin/account"));
    app.use(BaseUrl + "user", require("../controllers/admin/user"));
    app.use(BaseUrl + "task", require("../controllers/admin/task"));
    app.use(BaseUrl + "auth", require("../controllers/admin/auth"));
}