var fs = require("fs");
var Router = require("express").Router;

module.exports = function () {
    var router = new Router();
    router.route("/satelliteview/api/resource")
        .get(getResource)
        .post(insertResource)
        .delete(delResource);
    return router;
}

function getResource(req, res, next) {
    // var list = require("./../config/resources.json").list;
    var obj = JSON.parse(readText("./config/resources.json"));
    var list = obj.list;
    var o = [];
    if (list) {
        list.forEach(element => {
            var existFlg = false;
            o.forEach(oi => {
                if (oi.name === element.name || oi.url === element.url) {
                    existFlg = true;
                }
            });
            if (!existFlg) {
                o.push(element);
            }
        });
    }
    res.status(200).json(o);
}

function insertResource(req, res, next) { 
    var resources = JSON.parse(readText("./config/resources.json"));
    var resource = req.body;
    if (resource && resource.name && resource.url) {
        var o = {
            name: resource.name,
            url: resource.url
        }
        if (!resources.list) {
            resources.list = [];
        }
        resources.list.push(o);
        fs.writeFile("./config/resources.json", JSON.stringify(resources), function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).end();
        });
    } else {
        return next(new Error("Invaild body"));
    }
}

function delResource(req, res, next) {
    var resources = JSON.parse(readText("./config/resources.json"));
    var name = req.query["name"];
    if (name) {
        var tmp = [];
        if (!resources.list) {
            return res.status(200).end();
        }
        resources.list.forEach(item => {
            tmp.push(item);
        });
        resources.list.splice(0, resources.list.length);
        tmp.forEach(o => {
            if (o.name !== name) {
                resources.list.push(o);
            }
        });
        fs.writeFile("./config/resources.json", JSON.stringify(resources), function (err) {
            if (err) {
                return next(err);
            }
            res.status(200).end();
        });
    } else {
        return next(new Error("Invaild query"));
    }

}

function readText(pathname) {
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}