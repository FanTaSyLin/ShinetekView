var Router = require("express").Router;

module.exports = function () {
    var router = new Router();
    router.route("/satelliteview").get(sendSVHTML);
    router.route("/worldview").get(send404HTML);
    router.route("/shinetekview").get(send404HTML);
    return router;
}

function sendSVHTML(req, res) {
    res.status(200).sendfile("./app/satelliteview.html");
}

function send404HTML(req, res) {
    res.status(200).sendfile("./app/website-migration.html");
}