var fs = require("fs");
var Router = require("express").Router;

module.exports = function () {
    var router = new Router();
    router.route("/satelliteview/api/operating")
        .get(getOperating)
        .put(updateOperating);
    return router;
}

function getOperating(req, res, next) {
    try {
        var obj = JSON.parse(readText("./config/operating.json"));
        res.status(200).json(obj);
    } catch(err) {
        next(err);
    }
}

function updateOperating(req, res, next) {
    var orgOper = JSON.parse(readText("./config/operating.json"));
    var newOper = req.body;
    for (var p in newOper) {
        orgOper[p] = newOper[p];
    }
    fs.writeFile("./config/operating.json", JSON.stringify(orgOper), function (err) {
        if (err) {
            return next(err);
        }
        return res.status(200).end();
    });
}

function readText(pathname) {
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}